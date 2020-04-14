import React, {useMemo} from 'react';
import ReactMapGL, {SVGOverlay}  from 'react-map-gl'
import { DeckGL, ScatterplotLayer, GeoJsonLayer } from 'deck.gl'
import {lineString} from '@turf/helpers'
import {easeBackOut} from 'd3'

require('dotenv').config()

function SVGOverlayExample({libraries, radius}){
  
    const redraw = ({project}) => {
      return <g>
        {libraries.map(lib => {
          const [x, y] = project(lib.position)
          return <circle key={lib.id} cx={x} cy={y} r={radius} fill="tomato" />
    })}
      </g>
    }

    return <SVGOverlay redraw={redraw} />

}


function Map({ width, height, viewState, onViewStateChange, libraries}){

    const massLibraries = useMemo(() => libraries.filter(d => d.state === 'SSA'), [libraries]) 
    console.log(massLibraries)

    const librariesLine = React.useMemo(
      () =>
        libraries.length ? lineString(libraries.map(d => d.position)) : undefined,
      [libraries]
    );
    // loggic to link each other's line

    const layers = [
        new ScatterplotLayer({
          id: 'scatterplot-layer',
          data: libraries,
          getRadius: 500 * 2,
          radiusMaxPixels: 15,
          getFillColor: [255, 99, 71],
          transitions: {
            getRadius: {
              duration: 100 }
          },
          pickable: true,
          onClick: info => console.log(info.object),
          autoHighlight: true,
          transitions: {
            duration: 1000,
            easing: easeBackOut            
          }}),

          new GeoJsonLayer({
            id: 'geojson-layer',
            data: librariesLine,
            lineWidthMinPixels: 1,
            getLineColor: '#red',
          })
          //line configuration
    ]

    return (
      <ReactMapGL
        width={width}
        height={height}
        mapboxApiAccessToken={'pk.eyJ1IjoibGVvdG9zdGEiLCJhIjoiY2s4eGRocGQ5MTY1dDNpbnU5cGFrMHd6NCJ9.wfZfuXnW6R0RDQR3OnJfqg'}
        // mapStyle='mapbox://styles/leotosta/ck8xe29ev0s5r1ipclyrih4zv'
        onViewStateChange={onViewStateChange}
        viewState={viewState}
      >
        <SVGOverlayExample libraries={massLibraries} radius={5} />
        <DeckGL viewState={viewState} layers={layers} />

      </ReactMapGL>
    );
}

export default Map;
