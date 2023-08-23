import React from "react";
import PropTypes from "prop-types";
import GridHorizontalStreak from "./grid-horizontal-streak";
import GridVerticalStreak from "./grid-vertical-streak";

export default function Grids({ scene }) {
  // destructuring the scene prop object to extract the width, height, and grids properties and assigning them to individual variables.
  let { width, height, grids } = scene;

  /*
   creating an array of rendered grid components using the entrySeq() method to convert the grids object to a sequence of [key, value] pairs, 
   which are then passed to the map() function. For each grid, 
   we switch on its type property and return the appropriate grid component with the width, height, and grid props. 
   If the type is not recognized, we issue a warning message using console.warn(). Finally, we convert the sequence to a List using the toList() method.
  */ 
  
  let renderedGrids = grids
    .entrySeq()
    .map(([gridID, grid]) => {
      switch (grid.type) {
        case "horizontal-streak":
          return (
            <GridHorizontalStreak
              className="horz_line"
              key={gridID}
              width={width}
              height={height}
              grid={grid}
            />
          );

        case "vertical-streak":
          return (
            <GridVerticalStreak
              className="vert_line"
              key={gridID}
              width={width}
              height={height}
              grid={grid} 
            />
          );

        default:
          console.warn(`grid ${grid.type} not allowed`);
      }
    })
    .toList();

  return <g>{renderedGrids}</g>;
}

Grids.propTypes = {
  scene: PropTypes.object.isRequired,
};
