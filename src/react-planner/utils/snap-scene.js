// Import snap utility functions and necessary dependencies
import {
  SNAP_POINT,
  SNAP_LINE,
  SNAP_SEGMENT,
  SNAP_GRID,
  SNAP_GUIDE,
  addPointSnap,
  addLineSnap,
  addLineSegmentSnap,
  addGridSnap,
} from "./snap";
import { GeometryUtils } from "./export";
import { Map, List, fromJS } from "immutable";
// sceneSnapElements: Builds a list of snap elements based on the scene's geometry and given snapMask
export function sceneSnapElements(
  scene,
  snapElements = new List(),
  snapMask = new Map(),
  excludeItemID = null
) {
  // Retrieve scene dimensions
  let { width: sceneWidth, height: sceneHeight } = scene;

  // Initialize variables for line equation coefficients
  let a, b, c;

  // Retrieve the current dragged item's properties
  const currentItem = scene
    .get("layers")
    .flatMap((layer) => layer.get("items"))
    .get(excludeItemID);



  const currentItemWidth = currentItem ? currentItem.get("item_width") : 0;
  const currentItemHeight = currentItem ? currentItem.get("item_depth") : 0;
  const currentItemRotation = currentItem ? currentItem.get("rotation") : 0;
  // Calculate the offset for the dragged item
  const isFlipped = (Math.abs(currentItemRotation) == 90 || currentItemRotation == -270 ? true : false);

  const currentOffsetX = (isFlipped ? currentItemHeight : currentItemWidth) / 2;
  const currentOffsetY = (isFlipped ? currentItemWidth : currentItemHeight) / 2;

  // Iterate through layers, vertices, and lines to add appropriate snap elements
  return snapElements.withMutations((snapElements) => {
    scene.layers.forEach((layer) => {
      if (currentItemRotation % 90 == 0) {
        // Add grid snaps if enabled in snapMask
        if (snapMask.get(SNAP_GRID)) {
        
          
          let divider = 4;

          let gridCellSizeX = 24 / divider;
          let gridCellSizeY = 24 / divider;
          let xCycle = sceneWidth / gridCellSizeX;
          let yCycle = sceneHeight / gridCellSizeY;

          for (let x = 0; x < xCycle; x++) {
            let xMul = x * gridCellSizeX;

            for (let y = 0; y < yCycle; y++) {
              let yMul = y * gridCellSizeY;

              let onXCross = !(x % divider) ? true : false;
              let onYCross = !(y % divider) ? true : false;

              // Adjust the x value to account for the item's width
              let adjustedX = xMul - currentOffsetX;

              // Adjust the y value to account for the item's height
              let adjustedY = yMul - currentOffsetY;
              
              
              addGridSnap(
                snapElements,
                adjustedX,
                adjustedY,
                10,
                10,
                null
              );
            }
          }
        }
      }

      if (layer.get("items")) {
        layer.get("items").forEach((item, itemID) => {
          if (itemID === excludeItemID) {
            return; // Skip the currently dragged item
          }

          // Extract item properties (e.g., x, y, width, height, etc.)
          const { x, y } = item.toJS();

          const itemWidth = item.getIn(["item_width"]);
          const itemHeight = item.getIn(["item_depth"]);
          

          // Assuming rotation is provided as a property
          const rotation = item.getIn(["rotation"]);
          const itemIsFlipped = (Math.abs(rotation) == 90 || rotation == -270 ? true : false);
          const targetOffsetX = (itemIsFlipped ? itemHeight : itemWidth) / 2;
          const targetOffsetY = (itemIsFlipped ? itemWidth : itemHeight) / 2;

          // Add point snaps for catalog item corners if enabled in snapMask
          if (snapMask.get(SNAP_POINT)) {
            // Calculate snapped positions for all sides of the element in the scene
            const snappedPositions = [
              {
                x: x - currentOffsetX - targetOffsetX,
                y: y + currentOffsetY + targetOffsetY,
              }, // Top-left
              {
                x: x + currentOffsetX + targetOffsetX,
                y: y + currentOffsetY + targetOffsetY,
              }, // Top-right
              {
                x: x - currentOffsetX - targetOffsetX,
                y: y - currentOffsetY - targetOffsetY,
              }, // Bottom-left
              {
                x: x + currentOffsetX + targetOffsetX,
                y: y - currentOffsetY - targetOffsetY,
              }, // Bottom-right
              { x: x, y: y + currentOffsetY + targetOffsetY }, // Top-center
              { x: x, y: y - currentOffsetY - targetOffsetY }, // Bottom-center
              { x: x - currentOffsetX - targetOffsetX, y: y }, // Left-center
              { x: x + currentOffsetX + targetOffsetX, y: y }, // Right-center
            ];

            // Add point snaps for each calculated position
            snappedPositions.forEach((pos) => {
              // console.log("x" + pos.x);
              // console.log("y" + pos.y);
              addPointSnap(snapElements, pos.x, pos.y, 10, 10, item.id);
            });
          }

          // Add line snaps for catalog item edges if enabled in snapMask
          if (snapMask.get(SNAP_LINE)) {
            // Top edge
            ({ a, b, c } = GeometryUtils.horizontalLine(y));
            addLineSnap(snapElements, a, b, c, 10, 1, item.id);
            // Bottom edge
            ({ a, b, c } = GeometryUtils.horizontalLine(y + itemHeight));
            addLineSnap(snapElements, a, b, c, 10, 1, item.id);
            // Left edge
            ({ a, b, c } = GeometryUtils.verticalLine(x));
            addLineSnap(snapElements, a, b, c, 10, 1, item.id);
            // Right edge
            ({ a, b, c } = GeometryUtils.verticalLine(x + itemWidth));
            addLineSnap(snapElements, a, b, c, 10, 1, item.id);
          }

          // Add line segment snaps for catalog item edges if enabled in snapMask
          if (snapMask.get(SNAP_SEGMENT)) {
            addLineSegmentSnap(
              snapElements,
              x,
              y,
              x + itemWidth,
              y,
              20,
              1,
              item.id
            ); // Top edge
            addLineSegmentSnap(
              snapElements,
              x,
              y + itemHeight,
              x + itemWidth,
              y + itemHeight,
              20,
              1,
              item.id
            ); // Bottom edge
            addLineSegmentSnap(
              snapElements,
              x,
              y,
              x,
              y + itemHeight,
              20,
              1,
              item.id
            ); // Left edge
            addLineSegmentSnap(
              snapElements,
              x + itemWidth,
              y,
              x + itemWidth,
              y + itemHeight,
              20,
              1,
              item.id
            ); // Right edge
          }
        });
      }
    });
  });
}
