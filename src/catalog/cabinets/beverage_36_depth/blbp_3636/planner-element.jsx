import obj from './blbp_3636.obj';
//import {loadObj} from '../../../utils/load-obj';
import { render2D, render3D } from "../../planner-elements-render-functions";

//import React from 'react';
//import * as THREE from 'three';

import {properties} from '@catalog/cabinets/Cabinet_Textures/mtl/textures_obj';

const HEIGHT = 37.75;
const WIDTH = 36;
const DEPTH = 36;

const userFacingName = 'blbp_3636 (2) Door Cabinet';
const userFacingTitle = '36" (2) Door Cabinet w/ Shelf';
const userFacingDimensions = '36" x 36"';

export default {
  name: userFacingName,
  prototype: "items",

  info: {
    title: userFacingTitle,
    tag: ['furnishing'],
    description: userFacingDimensions,
    image: new URL('./blbp_3636.png', import.meta.url),
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
