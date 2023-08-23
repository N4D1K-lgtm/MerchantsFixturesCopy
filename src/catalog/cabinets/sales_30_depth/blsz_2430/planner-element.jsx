import obj from './blsz_2430.obj';
//import {loadObj} from '../../../utils/load-obj';
import { render2D, render3D } from "../../planner-elements-render-functions";

//import React from 'react';
//import * as THREE from 'three';

import {properties} from '@catalog/cabinets/Cabinet_Textures/mtl/textures_obj';

const HEIGHT = 33.75;
const WIDTH = 24;
const DEPTH = 30;

const userFacingName = 'blsz_2430 Safe Cabinet';
const userFacingTitle = '24" Safe Cabinet';
const userFacingDimensions = '24" x 30"';

export default {
  name: userFacingName,
  prototype: "items",

  info: {
    title: userFacingTitle,
    tag: ['furnishing'],
    description: userFacingDimensions,
    image: new URL('./blsz_2430.png', import.meta.url),
    item_width: WIDTH,
    item_depth: DEPTH
  },

  ...properties,

  render2D: function (element) {
    return render2D(element, WIDTH, DEPTH, userFacingName, userFacingDimensions);
  },

  render3D: function (element) {
    return render3D(element, obj, WIDTH, HEIGHT, DEPTH);      
  },
}


