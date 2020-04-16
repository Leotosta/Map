import React, {useMemo, memo} from 'react';
import ReactMapGL, {SVGOverlay}  from 'react-map-gl'
import { DeckGL, GeoJsonLayer, ArcLayer } from 'deck.gl'
import {ScatterplotLayer} from '@deck.gl/layers'
import {lineString} from '@turf/helpers'
import { Spring } from 'react-spring/renderprops';
import {easeBackOut, pairs, shuffle} from 'd3'
import Goo from './goodies/Goo'
// import ArcBrushingLayer from './goodies/ArcBrushingLayer';


require('dotenv').config()

function SVGOverlayExample({libraries, radius}){
  
    const redraw = ({project}) => {
      return <g>
          <Goo>
          {libraries.map(lib => {
          const [x, y] = project(lib.position)
          return <circle key={lib.id} cx={x} cy={y} r={radius} fill="red" />
        })}
          </Goo>
      </g>
    }
    return <SVGOverlay redraw={redraw} />
}


function Map({ width, height, viewState, onViewStateChange, libraries, radius, arcsEnabled}){

    const massLibraries = useMemo(() => libraries.filter(d => d.state === 'SSA'), [libraries]) 
    // console.log(massLibraries)

    const librariesLine = useMemo(
      () =>
        libraries.length ? lineString(libraries.map(d => d.position)) : undefined,
      [libraries]
    );

    const libraryLinks = useMemo(() => {
      return pairs(shuffle(libraries.slice()).slice(0, 100));
    }, [libraries]);

    return (
      <ReactMapGL
        width={width}
        height={height}
        mapboxApiAccessToken={TOKEN}
        mapStyle={STYLE}
        onViewStateChange={onViewStateChange}
        viewState={viewState}
      >
      <Spring to={{ arcsEnabled: arcsEnabled ? 1 : 0 }}>
        {springProps => {
          const layers = [
            new ScatterplotLayer({
              id: 'scatterplot-layer',
              data: libraries,
              getRadius: 500 * radius,
              radiusMinPixels: 1,
              radiusMaxPixels: 100,
              radiusScale: 6,
              getFillColor: [250,52,52],
              transitions: {
                getRadius: {
                  duration: 1000,
                  easing: easeBackOut,
                },
              },
              pickable: true,
              onClick: info => console.log(info.object),
              autoHighlight: true,

            }),
           new GeoJsonLayer({
              id: 'geojson-layer',
              data: librariesLine,
              lineWidthMinPixels: 1,
              getLineColor: [0, 0, 0, 20],
            }),

            new ArcLayer({
              id: 'arc-layer',
              data: libraryLinks,
              getSourcePosition: d => d[0].position,
              getTargetPosition: d => d[1].position,
              getSourceColor: [0, 255, 0],
              getTargetColor: [0, 200, 200],
              getWidth: 3,
              visible: springProps.arcsEnabled > 0,
              coef: springProps.arcsEnabled,
            }),
          ];

          return <DeckGL layers={layers} viewState={viewState} />;
        }}
      </Spring>
       
      </ReactMapGL>
    );
}

export default memo(Map);