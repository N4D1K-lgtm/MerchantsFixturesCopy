import * as Three from "three";
import { List } from "immutable";
import { COLORS } from "../../../shared-style";
/**
 * Creates a Three.js object representing a grid with evenly spaced lines and labels.
 * @param {number} width - The width of the grid in pixels.
 * @param {number} height - The height of the grid in pixels.
 * @param {object} grid - An object representing the grid properties, including step and colors.
 * @param {object} font - The font to use for the labels.
 * @returns {object} A Three.js object representing the grid.
 */
export default function (width, height, grid, font) {
  // Get the step and colors properties from the grid object
  let step = grid.properties.get("step");
  let colors = grid.properties.has("color")
    ? new List([grid.properties.get("color")])
    : grid.properties.get("colors");

  // Create a new Three.js object to represent the grid
  let streak = new Three.Object3D();
  streak.name = "streak";

  // Loop through the height of the grid and create lines and labels
  let counter = 0;
  for (let i = 0; i <= width; i += step) {
    let geometry = new Three.Geometry();
    geometry.vertices.push(new Three.Vector3(i, 0, 0));
    geometry.vertices.push(new Three.Vector3(i, 0, -height));

    // Get the color for the line based on the current counter and colors list
    let color = colors.get(counter % colors.size);
    let material = new Three.LineBasicMaterial({ color });

    // Add a label every 4 lines
    if (counter % 4 == 0) {
      let shape = new Three.TextGeometry("" + (counter * step / 12) + "'", {
        size: 8,
        height: 1,
        font: font,
      });

      let wrapper = new Three.MeshBasicMaterial({ color: COLORS.black });
      let words = new Three.Mesh(shape, wrapper);

      // Rotate the label and position it
      words.rotation.x -= Math.PI / 2;
      words.position.set(i, 0, 20);
      // Add a small line at the start of the text guide
      let guideLineGeometry = new Three.Geometry();
      guideLineGeometry.vertices.push(new Three.Vector3(i, 0, 20));
      guideLineGeometry.vertices.push(new Three.Vector3(i, 0, 5));

      let guideLineMaterial = new Three.LineBasicMaterial({
        color: COLORS.black,
      });
      let guideLine = new Three.LineSegments(
        guideLineGeometry,
        guideLineMaterial
      );
      streak.add(guideLine);

      streak.add(words);
    }

    // Add the line and increment the counter
    streak.add(new Three.LineSegments(geometry, material));
    counter++;
  }
  // Return the completed Three.js object

  return streak;
}
