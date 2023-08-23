import { loadObj } from "../utils/load-obj";
import React from 'react';
import * as THREE from "three";
import { dynamicMaterial } from "@catalog/cabinets/Cabinet_Textures/mtl/textures_obj";

export function render2D(element, WIDTH, DEPTH, userFacingName, userFacingDimensions) {
  let angle = element.rotation + 90;

  let textRotation = 0;
  if (Math.sin(angle * Math.PI / 180) < 0) {
    textRotation = 180;
  }

  const charWidth = 1.5; // Adjust this value based on the font size and font-family used
  const maxCharsPerLine = Math.floor( (WIDTH-2) / charWidth);
  const breakText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return [text];
    }

    const words = text.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      // Check if the word is empty or contains only spaces
      if (!word.trim()) return;
      // Check if the word matches this regex pattern for any of the cabinet model numbers
      const regex = /^[bs].*[0-9t]$/;
      if (regex.test(word)) return;

      if (currentLine.length + word.length <= maxLength) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const wrappedUserFacingName = breakText(userFacingName, maxCharsPerLine);
  const wrappedUserFacingDimensions = breakText(userFacingDimensions, maxCharsPerLine);
  const totalLines = wrappedUserFacingName.length + wrappedUserFacingDimensions.length;
  const lineHeight = 1.2; // Line height in em
  const rectHeight = DEPTH; // Rect height
  const fontSize = 3;
  const textHeight = totalLines * lineHeight;
  const yOffset = (((rectHeight - textHeight) / 2) / (10))*( totalLines) * -1;

  //console.log('rectHeight', rectHeight);
  //console.log('totalLines', totalLines);
  //console.log('textHeight', textHeight);
  //console.log('yOffset', yOffset);

  return (
    <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
      <rect
        key="1"
        x="0"
        y="0"
        width={WIDTH}
        height={DEPTH}
        style={{
          outline: element.selected ? "1px solid #db3f28" : "1px solid #bb7128",
          outlineOffset: "-1px",
          fill: "#d1a52c",
        }}
      />
      <line
        x1="0"
        y1=".5"
        x2={WIDTH}
        y2=".5"
        stroke="#a02921"
        strokeWidth="1"
      />
      <text
        key="2"
        x="0"
        y="0"
        transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
        style={{ textAnchor: "middle", fontSize: `${fontSize}px` }}
      >
        {wrappedUserFacingName.map((line, index) => (
          <tspan key={index} x="0" dy={`${index === 0 ? yOffset : fontSize}`}>
            {line}
          </tspan>
        ))}
        {wrappedUserFacingDimensions.map((line, index) => (
          <tspan
            key={index}
            x="0"
            dy={fontSize}
            style={{ fontSize: "2.5px" }}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );

}

export function render3D(element, obj, WIDTH, HEIGHT, DEPTH) {
  let onLoadItem = (object) => {
    let boundingBox = new THREE.Box3().setFromObject(object);
    let initialWidth = boundingBox.max.x - boundingBox.min.x;
    let initialHeight = boundingBox.max.y - boundingBox.min.y;
    let initialThickness = boundingBox.max.z - boundingBox.min.z;
    if (element.selected) {
      let box = new THREE.BoxHelper(object, 0x99c3fb);
      box.material.linewidth = 2;
      box.material.depthTest = false;
      box.renderOrder = 1000;
      object.add(box);
    }

    //Check if the object needs to have an "altitude" higher than "0" (i.e. Dispenserite objects that sit on top of countertops.)
    object.position.y = element.properties.has('altitude') ? element.properties.get('altitude').get('length') : 0;

    object.scale.set(WIDTH / initialWidth, HEIGHT / initialHeight, DEPTH / initialThickness);

    // Set the pivot point to the center of the object
    const box = new THREE.Box3().setFromObject(object);

    //set the center point for the object
    const center = new THREE.Vector3();
    box.getCenter(center);
    center.y = 0;
    object.position.sub(center);

    dynamicMaterial(element, object);

    return object;
  };


  return loadObj(obj).then(object => {
    return onLoadItem(object.clone());
  });
}