import { Canvg, presets } from "canvg";

const preset = presets.offscreen();

export async function toPng(svgElement, width, height) {
  if (!svgElement) {
    console.error("No SVG element found");
    return;
  }

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const v = await Canvg.from(ctx, svgString, preset);

  // Render only first frame, ignoring animations and mouse.
  await v.render();

  const blob = await canvas.convertToBlob();
  const pngUrl = URL.createObjectURL(blob);

  return pngUrl;
}

const VIEWER_ID = "planner-viewer";

export async function findPlannerElement() {
  return new Promise((resolve, reject) => {
    try {
      let canvas = document.getElementsByTagName("canvas")[0];
      if (canvas) {
        resolve(canvas);
      } else {
        // First of all, I need the SVG content of the viewer
        let svgElements = document.getElementsByTagName("svg");

        // I get the element with max width (which is the viewer)
        let maxWidthSVGElement = svgElements[0];
        for (let i = 1; i < svgElements.length; i++) {
          if (
            svgElements[i].width.baseVal.value >
            maxWidthSVGElement.width.baseVal.value
          ) {
            maxWidthSVGElement = svgElements[i];
          }
        }

        if (!maxWidthSVGElement) {
          reject(new Error("No SVG or Canvas elements found"));
        } else {
          resolve(maxWidthSVGElement);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}
