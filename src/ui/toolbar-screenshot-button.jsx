import React from "react";
import PropTypes from "prop-types";
import {
  ReactPlannerComponents,
  ReactPlannerConstants,
} from "../react-planner";
import {toPng, findPlannerElement } from "../utils/ScreenshotUtils";
const {
  MODE_IDLE,
  MODE_2D_ZOOM_IN,
  MODE_2D_ZOOM_OUT,
  MODE_2D_PAN,
  MODE_WAITING_DRAWING_LINE,
  MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX,
  MODE_DRAGGING_ITEM,
  MODE_DRAWING_LINE,
  MODE_DRAWING_HOLE,
  MODE_DRAWING_ITEM,
  MODE_DRAGGING_HOLE,
  MODE_ROTATING_ITEM,
  MODE_3D_FIRST_PERSON,
  MODE_3D_VIEW,
} = ReactPlannerConstants;

const { ToolbarButton } = ReactPlannerComponents.ToolbarComponents;

function download(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export default function ToolbarScreenshotButton({ mode }, { translator }) {
  const handleClick = async () => {
    try {
      // Use the findPlannerElement function to get the SVG element
      const plannerViewer = await findPlannerElement();

      let pngDataUrl;
      if (plannerViewer instanceof HTMLCanvasElement) {
        pngDataUrl = plannerViewer.toDataURL("image/png");
      } else if (plannerViewer instanceof SVGElement) {
        pngDataUrl = await toPng(
          plannerViewer,
          plannerViewer.width.baseVal.value,
          plannerViewer.height.baseVal.value
        );
      } else {
        console.log("Invalid object type");
        return null;
      }

      download(pngDataUrl, window.prompt("What would you like to name this file?"));
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  if ([MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode)) {
    return (
      <ToolbarButton
        active={false}
        extraClass="toolbar_camera order3"
        icon="FaCamera"
        tooltip="&nbsp;&nbsp;Get Screenshot"
        onClick={handleClick}
      ></ToolbarButton>
    );
  }

  if (
    [
      MODE_IDLE,
      MODE_2D_ZOOM_IN,
      MODE_2D_ZOOM_OUT,
      MODE_2D_PAN,
      MODE_WAITING_DRAWING_LINE,
      MODE_DRAGGING_LINE,
      MODE_DRAGGING_VERTEX,
      MODE_DRAGGING_ITEM,
      MODE_DRAWING_LINE,
      MODE_DRAWING_HOLE,
      MODE_DRAWING_ITEM,
      MODE_DRAGGING_HOLE,
      MODE_ROTATING_ITEM,
    ].includes(mode)
  ) {
    return (
      <ToolbarButton
        active={false}
        extraClass="toolbar_camera order3"
        icon="FaCamera"
        tooltip="&nbsp;&nbsp;Get Screenshot"
        onClick={handleClick}
      ></ToolbarButton>
    );
  }

  return null;
}

ToolbarScreenshotButton.propTypes = {
  mode: PropTypes.string.isRequired,
};

ToolbarScreenshotButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
