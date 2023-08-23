import * as Three from 'three';
import {loadObjWithMaterial} from '../../utils/load-obj';

import React from 'react';
import convert from '@ipguk/convert-units';
import mtl from "../cabinet-test/cab.mtl";
import obj from "../cabinet-test/color_2_asset_2.obj";
import path from "path";
import img from "../cabinet-test/k44_titan_grey.png";

let cachedObj = null;

let textures = {'Maple': 'Maple', 'Grey': 'Grey'};

export default {
  name: "cabinet",
  prototype: "items",

  info: {
    title: "cabinet",
    tag: ['furnishing', 'electronics'],
    description: "Cabinet 1",
    image: require('./color_1_asset_1.png')
  },

  properties: {
    texture: {
      label: 'texture',
      type: 'enum',
      defaultValue: textures.Maple,
      values: textures
    }
  },

  render2D: function (element, layer, scene) {
    let width = {length: 160, unit: 'ft'};
    let depth = {length: 59, unit: 'ft'};

    let newWidth = convert(width.length).from(width.unit).to(scene.unit);
    let newDepth = convert(depth.length).from(depth.unit).to(scene.unit);

    let angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    let style = {stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce"};
    let arrow_style = {stroke: element.selected ? '#0096fd' : null, strokeWidth: "2px", fill: "#84e1ce"};

    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect key="1" x="0" y="0" width={newWidth} height={newDepth} style={style}/>
        <line key="2" x1={newWidth / 2} x2={newWidth / 2} y1={newDepth} y2={1.5 * newDepth} style={arrow_style}/>
        <line key="3" x1={.35 * newWidth} x2={newWidth / 2} y1={1.2 * newDepth} y2={1.5 * newDepth} style={arrow_style}/>
        <line key="4" x1={newWidth / 2} x2={.65 * newWidth} y1={1.5 * newDepth} y2={1.2 * newDepth} style={arrow_style}/>
        <text key="5" x="0" y="0" transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
              style={{textAnchor: "middle", fontSize: "11px"}}>
          <tspan>{userFacingName}</tspan>
              <tspan x='0' dy='1.2em' style={{fontSize: '3px'}}>{userFacingDimensions}</tspan>
        </text>
      </g>
    );
  },

  render3D: function (element, layer, scene) {

    let onLoadItem = (object) => {
      object.scale.set(40, 40, 40);
      return object;
    };

    let te = element.properties.get('texture');
    console.log("element.properties ",te );

    let mtl, obj, img, img1;
    if (te === textures.Maple) {
      console.log('Assigned cab2 mtl maple');
      mtl = require('./color_1_asset_1.mtl');
      obj = require('./color_1_asset_1.obj');

      img = require('./290_classic_maple.png');
      img1 = require('./dm3012_silver_falls.png');
    } else {
      console.log('Assigned cab mtl grey');

      mtl = require('./color_2_asset_1.mtl');
      obj = require('./color_2_asset_1.obj');

      img = require('./k44_titan_grey.png');
      img1 = require('./dm3015_iceberg.png');

    }

    return loadObjWithMaterial(mtl, obj, path.dirname(img) + '/')
      .then(object => {
        cachedObj = object;
        return onLoadItem(cachedObj.clone())
      })
  }

};
