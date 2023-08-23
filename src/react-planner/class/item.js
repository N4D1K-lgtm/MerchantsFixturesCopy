import { Layer, Group } from "./export";
import { IDBroker, NameGenerator } from "../utils/export";
import { List, Map, fromJS } from "immutable";

import {
  MODE_IDLE,
  MODE_DRAWING_ITEM,
  MODE_DRAGGING_ITEM,
  MODE_ROTATING_ITEM,
} from "../constants";

import { SnapUtils, SnapSceneUtils } from "../utils/export";
class Item {
  //  Creates a new item with the specified properties and adds it to the scene.
  static create(state, layerID, type, x, y, width, height, rotation) {
    let itemID = IDBroker.acquireID();

    // Get the item_width and item_depth values from the catalog
    const itemWidth = state.catalog.getIn([
      "elements",
      type,
      "info",
      "item_width",
    ]);
    const itemDepth = state.catalog.getIn([
      "elements",
      type,
      "info",
      "item_depth",
    ]);

    let properties = {
      texture: state.scene.topTexture,
      texture1: state.scene.bodyTexture,
    };

    // Create the new item
    let item = state.catalog.factoryElement(type, {
      id: itemID,
      name: NameGenerator.generateName(
        "items",
        state.catalog.getIn(["elements", type, "info", "title"])
      ),
      type,
      height,
      width,
      x,
      y,
      rotation,
      item_width: itemWidth, // add the item_width value to the item
      item_depth: itemDepth, // add the item_depth value to the item
    });

    // Add the new item to the state
    state = state.setIn(["scene", "layers", layerID, "items", itemID], item);

    // Set the item's properties and update the state
    let { updatedState } = Item.setProperties(
      state,
      layerID,
      item.id,
      properties
    );
    state = updatedState;

    return { updatedState: state, item };
  }

  // Selects an item in a specific layer.
  static select(state, layerID, itemID) {
    state = Layer.select(state, layerID).updatedState;
    state = Layer.selectElement(state, layerID, "items", itemID).updatedState;

    return { updatedState: state };
  }

  // Removes an item from a layer and unselects it.
  static remove(state, layerID, itemID) {
    state = this.unselect(state, layerID, itemID).updatedState;
    state = Layer.removeElement(state, layerID, "items", itemID).updatedState;

    state
      .getIn(["scene", "groups"])
      .forEach(
        (group) =>
          (state = Group.removeElement(
            state,
            group.id,
            layerID,
            "items",
            itemID
          ).updatedState)
      );

    return { updatedState: state };
  }

  // Unselects an item in a specific layer.
  static unselect(state, layerID, itemID) {
    state = Layer.unselect(state, layerID, "items", itemID).updatedState;

    return { updatedState: state };
  }

  // Sets the state's mode to drawing an item and initializes the drawing support.
  static selectToolDrawingItem(state, sceneComponentType) {
    state = state.merge({
      mode: MODE_DRAWING_ITEM,
      drawingSupport: new Map({
        type: sceneComponentType,
      }),
    });

    return { updatedState: state };
  }

  // Updates the position of the item being drawn.
  static updateDrawingItem(state, layerID, x, y) {
    if (state.hasIn(["drawingSupport", "currentID"])) {
      state = state.updateIn(
        [
          "scene",
          "layers",
          layerID,
          "items",
          state.getIn(["drawingSupport", "currentID"]),
        ],
        (item) => item.merge({ x, y })
      );
    } else {
      let { updatedState: stateI, item } = this.create(
        state,
        layerID,
        state.getIn(["drawingSupport", "type"]),
        x,
        y,
        200,
        100,
        0
      );
      state = Item.select(stateI, layerID, item.id).updatedState;
      state = state.setIn(["drawingSupport", "currentID"], item.id);
    }

    return { updatedState: state };
  }

  // Finalizes the drawing of the item and sets the state's mode back to idle.
  static endDrawingItem(state, layerID, x, y) {
    let catalog = state.catalog;
    state = this.updateDrawingItem(state, layerID, x, y, catalog).updatedState;
    state = Layer.unselectAll(state, layerID).updatedState;
    console.log("ended drawing");
    state = state.merge({
      drawingSupport: Map({
        type: state.drawingSupport.get("type"),
      }),
    });

    return { updatedState: state };
  }

  // Sets the state's mode to dragging an item and initializes the dragging support.
  static beginDraggingItem(state, layerID, itemID, x, y) {
    let item = state.getIn(["scene", "layers", layerID, "items", itemID]);
    state = state.merge({
      mode: MODE_DRAGGING_ITEM,
      draggingSupport: Map({
        layerID,
        itemID,
        startPointX: x, //
        startPointY: y, //
        originalX: item.x,
        originalY: item.y,
        cursorOffsetX: x - item.x,
        cursorOffsetY: y - item.y,
      }),
    });

    return { updatedState: state };
  }

  // Updates the position of the item being dragged with snapping.
  static updateDraggingItem(state, x, y) {
    let { draggingSupport, scene } = state;

    let layerID = draggingSupport.get("layerID");
    let itemID = draggingSupport.get("itemID");
    let cursorOffsetX = draggingSupport.get("cursorOffsetX"); // Modify this line
    let cursorOffsetY = draggingSupport.get("cursorOffsetY"); // Modify this line
    console.log("updating");
    // Calculate the new position of the item considering the cursor offset
    let newX = x - cursorOffsetX;
    let newY = y - cursorOffsetY;

    console.log(
      "x: " +
        x +
        " " +
        "originalX: " +
        originalX +
        " " +
        "cursorOffsetX " +
        cursorOffsetX +
        " " +
        "newX: " +
        newX
    );

    // Add snapping logic
    let snapElements = SnapSceneUtils.sceneSnapElements(
      state.scene,
      new List(),
      state.snapMask,
      itemID
    );

    let snap = null;
    if (state.snapMask && !state.snapMask.isEmpty()) {
      snap = SnapUtils.nearestSnap(snapElements, newX, newY, state.snapMask);
      if (snap) ({ x: newX, y: newY } = snap.point);
    }

    let item = scene.getIn(["layers", layerID, "items", itemID]);
    item = item.merge({
      x: newX,
      y: newY,
    });

    state = state.merge({
      scene: scene.mergeIn(["layers", layerID, "items", itemID], item),
      activeSnapElement: snap ? snap.snap : null, // Update the activeSnapElement
    });

    return { updatedState: state };
  }
  // Finalizes the dragging of the item and sets the state's mode back to idle.
  static endDraggingItem(state, x, y) {
    state = this.updateDraggingItem(state, x, y).updatedState;
    state = state.merge({ mode: MODE_IDLE, activeSnapElement: null });

    return { updatedState: state };
  }

  // Sets the state's mode to rotating an item and initializes the rotating support.
  static beginRotatingItem(state, layerID, itemID, x, y) {
    state = state.merge({
      mode: MODE_ROTATING_ITEM,
      rotatingSupport: Map({
        layerID,
        itemID,
      }),
    });

    return { updatedState: state };
  }

  // Updates the rotation of the item being rotated.
  static updateRotatingItem(state, x, y) {
    let { rotatingSupport, scene } = state;

    let layerID = rotatingSupport.get("layerID");
    let itemID = rotatingSupport.get("itemID");
    let item = state.getIn(["scene", "layers", layerID, "items", itemID]);

    let deltaX = x - item.x;
    let deltaY = y - item.y;
    let rotation = (Math.atan2(deltaY, deltaX) * 180) / Math.PI - 90;

    if (-5 < rotation && rotation < 5) rotation = 0;
    if (-95 < rotation && rotation < -85) rotation = -90;
    if (-185 < rotation && rotation < -175) rotation = -180;
    if (85 < rotation && rotation < 90) rotation = 90;
    if (-270 < rotation && rotation < -265) rotation = 90;

    item = item.merge({
      rotation,
    });

    state = state.merge({
      scene: scene.mergeIn(["layers", layerID, "items", itemID], item),
    });

    return { updatedState: state };
  }

  // Finalizes the rotation of the item and sets the state's mode back to idle.
  static endRotatingItem(state, x, y) {
    state = this.updateRotatingItem(state, x, y).updatedState;
    state = state.merge({ mode: MODE_IDLE });

    return { updatedState: state };
  }

  // Sets item properties in a layer.
  static setProperties(state, layerID, itemID, properties) {
    // console.log("=== setProperties ===");
    // console.log("Input state:", state.toJS());
    // console.log("Layer ID:", layerID);
    // console.log("Item ID:", itemID);
    // console.log("Properties:", properties.toJS());

    // Check if the layer exists in the state
    if (!state.hasIn(["scene", "layers", layerID])) {
      console.error("Layer not found. Layer ID:", layerID);
      return { updatedState: state };
    }

    // Check if the item exists in the layer
    if (!state.hasIn(["scene", "layers", layerID, "items", itemID])) {
      console.error("Item not found. Item ID:", itemID);
      return { updatedState: state };
    }

    state = state.mergeIn(
      ["scene", "layers", layerID, "items", itemID, "properties"],
      properties
    );

    // console.log("Updated state:", state.toJS());
    // console.log("=== setProperties ===");

    return { updatedState: state };
  }

  // Sets item properties in a layer from a plain JavaScript object.
  static setJsProperties(state, layerID, itemID, properties) {
    return this.setProperties(state, layerID, itemID, fromJS(properties));
  }

  // Updates item properties in a layer.
  static updateProperties(state, layerID, itemID, properties) {
    properties.forEach((v, k) => {
      if (
        state.hasIn([
          "scene",
          "layers",
          layerID,
          "items",
          itemID,
          "properties",
          k,
        ])
      )
        state = state.mergeIn(
          ["scene", "layers", layerID, "items", itemID, "properties", k],
          v
        );
    });

    return { updatedState: state };
  }

  // Updates item properties in a layer from a plain JavaScript object.
  static updateJsProperties(state, layerID, itemID, properties) {
    return this.updateProperties(state, layerID, itemID, fromJS(properties));
  }

  // Sets item attributes in a layer.
  static setAttributes(state, layerID, itemID, itemAttributes) {
    state = state.mergeIn(
      ["scene", "layers", layerID, "items", itemID],
      itemAttributes
    );
    return { updatedState: state };
  }

  // Sets item attributes in a layer from a plain JavaScript object.
  static setJsAttributes(state, layerID, itemID, itemAttributes) {
    itemAttributes = fromJS(itemAttributes);
    return this.setAttributes(state, layerID, itemID, itemAttributes);
  }
}

export { Item as default };
