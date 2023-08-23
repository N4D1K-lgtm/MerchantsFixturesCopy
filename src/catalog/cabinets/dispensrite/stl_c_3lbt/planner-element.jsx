import obj from './stl_c_3lbt.obj';
//import {loadObj} from '../../../utils/load-obj';
import { render2D, render3D } from "../../planner-elements-render-functions";

//import React from 'react';
//import * as THREE from 'three';

import {properties} from '@catalog/cabinets/Cabinet_Textures/mtl/textures_obj';

const HEIGHT = 24.25;
const WIDTH = 13;
const DEPTH = 23;
const ALTITUDE = 33.75;

const userFacingName = 'stl_c_3lbt L 3-Cup Multi-Dispenser';
const userFacingTitle = 'L (3) Cup, Lid, & Straw Dispenser';
const userFacingDimensions = '13" x 23"';

export default {
  name: userFacingName,
  prototype: "items",

  info: {
    title: userFacingTitle,
    tag: ['furnishing'],
    description: userFacingDimensions,
    image: new URL('./stl_c_3lbt.png', import.meta.url),
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
