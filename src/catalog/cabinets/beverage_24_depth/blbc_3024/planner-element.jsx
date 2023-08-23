import obj from './blbc_3024.obj';
//import {loadObj} from '../../../utils/load-obj';
import { render2D, render3D } from "../../planner-elements-render-functions";

//import React from 'react';
//import * as THREE from 'three';

import {properties} from '@catalog/cabinets/Cabinet_Textures/mtl/textures_obj';

const HEIGHT = 37.75;
const WIDTH = 30;
const DEPTH = 24;

const userFacingName = 'blbc_3024 (3) Cup Cabinet';
const userFacingTitle = '30" (3) Cup Cabinet';
const userFacingDimensions = '30" x 24"';


export default {
  name: userFacingName,
  prototype: "items",

  info: {
    title: userFacingTitle,
    tag: ['furnishing'],
    description: userFacingDimensions,
    image: new URL('./blbc_3024.png', import.meta.url),
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
