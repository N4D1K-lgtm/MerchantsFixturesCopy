import obj from './stl_s_4bt.obj';
//import {loadObj} from '../../../utils/load-obj';
import { render2D, render3D } from "../../planner-elements-render-functions";

//import React from 'react';
//import * as THREE from 'three';

import {properties} from '@catalog/cabinets/Cabinet_Textures/mtl/textures_obj';

const HEIGHT = 32.25;
const WIDTH = 8;
const DEPTH = 23;
const ALTITUDE = 33.75;

const userFacingName = 'stl_s_4bt 4-Cup Dispenser';
const userFacingTitle = '(4) Cup Dispenser';
const userFacingDimensions = '8" x 23"';

export default {
  name: userFacingName,
  prototype: "items",

  info: {
    title: userFacingTitle,
    tag: ['furnishing'],
    description: userFacingDimensions,
    image: new URL('./stl_s_4bt.png', import.meta.url),
    item_width: WIDTH,
    item_depth: DEPTH
  },

  properties: {
    altitude: {
      label: 'Altitude',
      type: 'length-measure',
      defaultValue: {
        length: ALTITUDE,
        unit: 'in'
      }
    }
  },

  render2D: function (element) {
    return render2D(element, WIDTH, DEPTH, userFacingName, userFacingDimensions);
  },

  render3D: function (element) {
    return render3D(element, obj, WIDTH, HEIGHT, DEPTH);      
  },
}
