import React, {useState, useEffect} from 'react';
import * as Locations from './locations'
import { FlyToInterpolator } from 'react-map-gl'
import Map from './Map'
import {neighbors} from './neighbors'
// import {csv} from 'd3'


function App() {
    const [viewState, setViewState] = useState(Locations.ssa);
    const [libraries, setLibraries] = useState([])

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
          setLibraries(neighbors)
        }

        fetchData()

      }, [])

    const [radius, setRadius] = useState(15);
    const handleToggleRadius = () =>
    setRadius(radius > 0 ? 0 : Math.random() * 35 + 5);

    const [arcsEnabled, setArcsEnabled] = useState(true);
    const handleToggleArcs = () => setArcsEnabled(!arcsEnabled);

    return (
      <div>
        <Map 
          width="100vw"
          height="100vh" 
          onViewStateChange={handleChangeViewState}
          viewState={viewState} 
          libraries={libraries} 
          radius={radius}  
          arcsEnabled={arcsEnabled}/> 
      <div>
        <button onClick={handleToggleRadius}> Radius </button>
        <button onClick={handleToggleArcs}>Arcs</button>
        {Object.keys(Locations).map(key => (
          <button key={key} onClick={() => handleFlyTo(Locations[key])} >{key}</button>
        ) )}
      </div>

      </div>
    );
}

export default App;