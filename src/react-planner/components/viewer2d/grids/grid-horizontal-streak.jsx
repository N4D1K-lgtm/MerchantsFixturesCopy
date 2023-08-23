import React from "react";
import PropTypes from "prop-types";
import { List } from "immutable";

/**
 * Renders horizontal grid lines with a variable step size and stroke color.
 * @param {number} width - The width of the grid.
 * @param {number} height - The height of the grid.
 * @param {number} stepSize - The distance between each grid line.
 * @param {Map} colors - A map of stroke colors to cycle through.
 * @returns {JSX.Element} A group element containing all of the rendered SVG lines.
 */
export default function GridHorizontalStreak({
  width,
  height,
  grid,
}) {
  let step = grid.properties.get("step"); 
  let colors;

  //checks whether the grid prop has a property called color. If it does, then it sets the colors variable to an immutable list containing the color value. Otherwise, it sets the colors variable to the colors property of the grid object.
  if (grid.properties.has("color")) {
    colors = new List([grid.properties.get("color")]);
  } else {
    colors = grid.properties.get("colors");
  }

  let rendered = [];
  let i = 0;

  // Iterates over the height of the grid with a step size of stepSize. For each iteration,
  // it sets the color variable to the color value at index i % colors.size.
  // It then increments i and pushes a new SVG line element to the rendered array with the appropriate y coordinate and stroke color.
  for (let y = 0; y <= height; y += step) {
    let color = colors.get(i % colors.size);
    i++;

    /*
    key: A unique identifier for the grid line element, used by React to optimize rendering.
    x1: The x-coordinate of the starting point of the line. In this case, it's always 0, because the horizontal grid lines span the entire width of the scene.
    y1: The y-coordinate of the starting point of the line. This is calculated as y which is equal to i * stepSize.
    x2: The x-coordinate of the ending point of the line. In this case, it's always width, which is the width of the scene.
    y2: The y-coordinate of the ending point of the line. This is calculated as y which is equal to i * stepSize.
    strokeWidth: The width of the stroke used to draw the line.
    stroke: The color of the stroke used to draw the line.
    */

    rendered.push(
      <line
        className='horz_line'
        key={y}
        x1="0"
        y1={y}
        x2={width}
        y2={y}
        strokeWidth=".5"
        stroke={color}
      />
    );
  }

  // returns a group element (<g>) containing all of the rendered SVG lines.
  return <g>{rendered}</g>;
}

GridHorizontalStreak.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  grid: PropTypes.object.isRequired,
};
