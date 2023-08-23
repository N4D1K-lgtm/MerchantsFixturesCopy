import React from "react";
import PropTypes from "prop-types";
import { List } from "immutable";

// GridHorizontalStreak component as a function that takes three props - width, height, and grid.
export default function GridVerticalStreak({ width, height, grid}) {
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

  // iterates over the height of the grid with a step size of stepSize. For each iteration,
  // it sets the color variable to the color value at index i % colors.size.
  // It then increments i and pushes a new SVG line element to the rendered array with the appropriate y coordinate and stroke color.
  for (let x = 0; x <= width; x += step) {
    let color = colors.get(i % colors.size);
    i++;

    /*
  key: A unique identifier for the grid line element, used by React to optimize rendering.
  x1: The x-coordinate of the starting point of the line. This is calculated as i * stepSize, where i is the index of the current line being rendered and stepSize is the distance between each line.
  x2: The x-coordinate of the ending point of the line. This is also calculated as i * stepSize.
  y1: The y-coordinate of the starting point of the line. In this case, it's always 0, because the horizontal grid lines span the entire width of the scene.
  y2: The y-coordinate of the ending point of the line. In this case, it's always height, which is the height of the scene.
  strokeWidth: The width of the stroke used to draw the line.
  stroke: The color of the stroke used to draw the line.
  */
    rendered.push(
      <line
        className='vert_line'
        key={x}
        x1={x}
        y1="0"
        x2={x}
        y2={height}
        strokeWidth=".5"
        stroke={color}
      />
    );
  }

  // returns a group element (<g>) containing all of the rendered SVG lines.
  return <g>{rendered}</g>;
}

GridVerticalStreak.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  grid: PropTypes.object.isRequired,
};
