import React, {useState, useEffect} from 'react';
import * as Locations from './locations'
import { FlyToInterpolator } from 'react-map-gl'
import Map from './Map'
import {neighbors} from './neighbors'

function App() {
    const [viewState, setViewState] = useState(Locations.salvador);
    const [libraries, setLibrares] = useState([])

    const handleChangeViewState = ({viewState}) => setViewState(viewState) 
    const handleFlyTo = destination => setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 2000,
      transitionInterpolation: new FlyToInterpolator() 
    })
    
    useEffect(() => {
      async function fetchData(){
        await neighbors
        setLibrares(neighbors)
      }

      fetchData()

    }, [])

    return (
      <div>
        <Map 
          width="100vw"
          height="100vh" 
          onViewStateChange={handleChangeViewState}
          viewState={viewState} 
          libraries={libraries} /> 

      <div>
        {Object.keys(Locations).map(key => (
          <button key={key} onClick={() => handleFlyTo(Locations[key])} >{key}</button>
        ) )}
      </div>

      </div>
    );
}

export default App;