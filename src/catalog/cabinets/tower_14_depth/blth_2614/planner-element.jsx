import obj from './blth_2614.obj';
//import {loadObj} from '../../../utils/load-obj';
import { render2D, render3D } from "../../planner-elements-render-functions";

//import React from 'react';
//import * as THREE from 'three';

import {properties} from '@catalog/cabinets/Cabinet_Textures/mtl/textures_obj';

const HEIGHT = 54;
const WIDTH = 26;
const DEPTH = 14;

const userFacingName = 'blth_2614 Sales Tower w/ Shelves';
const userFacingTitle = '26" Sales Tower w/ Shelves';
const userFacingDimensions = '26" x 14"';


export default {
  name: userFacingName,
  prototype: "items",

  info: {
    title: userFacingTitle,
    tag: ['furnishing'],
    description: userFacingDimensions,
    image: new URL('./blth_2614.png', import.meta.url),
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


