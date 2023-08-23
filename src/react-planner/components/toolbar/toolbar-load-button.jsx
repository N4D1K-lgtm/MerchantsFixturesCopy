import React from "react";
import PropTypes from "prop-types";
import IconLoad from "react-icons/lib/fa/folder-open-o";
import ToolbarButton from "./toolbar-button";
import { browserUpload } from "../../utils/browser";
import { hideItemContainer } from "./toolbar-utils";

export default function ToolbarLoadButton(
  { state },
  { translator, projectActions }
) {
  let loadProjectFromFile = (event) => {
    event.preventDefault();
    event.persist(); // Add this line to prevent the event from being released

    const message = "Have you saved your current project?\n\nClick CANCEL to stop and save your current project.\n\nClick OK to load a saved project file and remove the current design.";
    const shouldContinue = window.confirm(message);

    if (shouldContinue) {
      hideItemContainer(event);
      browserUpload().then((data) => {
        projectActions.loadProject(JSON.parse(data));

        // Dispatch the toolbar-load-event
        const toolbarLoadEvent = new CustomEvent("toolbar-load-event", {
          bubbles: true,
        });
        document
          .getElementById("toolbar-load-button")
          .dispatchEvent(toolbarLoadEvent);
      });
    }
  };


  return (
    <ToolbarButton
      id="toolbar-load-button"
      active={false}
      class="toolbar_load order4"
      icon="FaFolderOpen"
      tooltip="&nbsp;&nbsp;Load project"
      onClick={loadProjectFromFile}
    ></ToolbarButton>
  );
}

ToolbarLoadButton.propTypes = {
  state: PropTypes.object.isRequired,
};

ToolbarLoadButton.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
