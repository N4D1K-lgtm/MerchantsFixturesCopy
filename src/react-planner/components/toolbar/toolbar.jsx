import React, { Component, useEffect } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { MdSettings, MdUndo, MdDirectionsRun } from "react-icons/lib/md";
import {
  FaFileO,
  FaMousePointer,
  FaPlus,
  FaTimesCircle,
} from "react-icons/lib/fa";
import ToolbarButton from "./toolbar-button";
import ToolbarSaveButton from "./toolbar-save-button";
import ToolbarLoadButton from "./toolbar-load-button";
import ToolbarCatalogButton from "./toolbar-catalog-button";
import CatalogItem from "../catalog-view/catalog-item";
import catalog from "@catalog/mycatalog.js";
import $ from "jquery";
import { defaultPlan, calculatePosition } from "./toolbar-edit-floorplan";
import { hideItemContainer } from "./toolbar-utils";
import { toPng, findPlannerElement } from "/src/utils/ScreenshotUtils";

import If from "../../utils/react-if";
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT,
} from "../../constants";
import * as SharedStyle from "../../shared-style";
import { Project } from "../../class/export";
import { browserDownload } from "../../utils/browser";

const iconTextStyle = {
  fontSize: "19px",
  textDecoration: "none",
  fontWeight: "bold",
  margin: "0px",
  userSelect: "none",
};

// const Icon2D = ({ style }) => <p style={{ ...iconTextStyle, ...style }}>2D</p>;
// const Icon3D = ({ style }) => <p style={{ ...iconTextStyle, ...style }}>3D</p>;

const ASIDE_STYLE = {
  backgroundColor: "#fff",
  color: "black",
  padding: "10px 0",
  width: "230px",
  maxWidth: "230px",
  overflowY: "auto",
};

const sortButtonsCb = (a, b) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapButtonsCb = (el, ind) => {
  return (
    <If key={ind} condition={el.condition} style={{ position: "relative" }}>
      {el.dom}
    </If>
  );
};

export default class Toolbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.state.mode !== nextProps.state.mode ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.state.alterate !== nextProps.state.alterate
    );
  }

  componentDidMount() {
    let that = this;
    // $('#project-settings>div')
    // const settingsDropdownContainer = $('#settings-dropdown-container')
    const quoteModal = $("#quoteModal");
    const submitBtn = $("#submitBtn");
    const floorPlanModal = $("#floorplanModal");
    const howToModal = $("#howToModal");
    const quoteModalClose = $(".quote-modal-close");
    const floorplanModalClose = $(".floorplan-modal-close");
    const howToModalClose = $(".howto-modal-close");
    const categoriesContainer = $("#categories-container");

    const mainWindow = $(window);

    checkCookieAndShowModal();

    mainWindow.on("contextmenu", (event) => {
      event.preventDefault();
      this.context.projectActions.unselectAll();
    });

    // Hide Project Settings Initially
    // settingsDropdownContainer.hide()
    // $('#project-settings>div:first-child').on('click', () => {
    //   settingsDropdownContainer.slideToggle()
    // })

    // Modal Close Event Listeners
    howToModalClose.on("click", (e) => howToModal.removeClass("in").slideUp());
    quoteModalClose.on("click", (e) => quoteModal.removeClass("in").slideUp());
    floorplanModalClose.on("click", (e) =>
      floorPlanModal.removeClass("in").slideUp()
    );

    $("#quoteForm").submit((event) => {
      const submitBtn = document.getElementById("submitBtn");
      submitBtn.disabled = true;
      event.preventDefault();
      const firstName = $("#formFirstName").val();
      const lastName = $("#formLastName").val();
      const email = $("#formEmail").val();
      const phone = $("#phone").val();
      const address = $("#address").val();
      const formCity = $("#formCity").val();
      const formState = $("#formState").val();
      const ZIP = $("#ZIP").val();
      const formFillersQuantity = $("#formFillersQuantity").val();
      const formBackSplashLength = $("#formBackSplashLength").val();
      const formCoveBase = $("#formCoveBase").val();
      const formCountertopOverhang = $("#formCountertopOverhang").val();
      const comments = $("#comments").val();

      this.context.projectActions.setMode(MODE_IDLE);

      // Import the toPng function from the ScreenshotUtils module

      function saveSVGScreenshotToFile() {
        // First of all I need the svg content of the viewer
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

        let serializer = new XMLSerializer();
        let img = new Image();
        // I create the new canvas to draw
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // Set width and height for the new canvas
        let heightAtt = document.createAttribute("height");
        heightAtt.value = maxWidthSVGElement.height.baseVal.value;
        canvas.setAttributeNode(heightAtt);

        let widthAtt = document.createAttribute("width");
        widthAtt.value = maxWidthSVGElement.width.baseVal.value;
        canvas.setAttributeNode(widthAtt);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        img.crossOrigin = "anonymous";
        img.src = `data:image/svg+xml;base64,${window.btoa(
          serializer.serializeToString(maxWidthSVGElement)
        )}`;

        ctx.drawImage(
          img,
          0,
          0,
          maxWidthSVGElement.width.baseVal.value,
          maxWidthSVGElement.height.baseVal.value
        );
        return new Promise(function (resolve, reject) {
          img.onload = () => {
            ctx.drawImage(
              img,
              0,
              0,
              maxWidthSVGElement.width.baseVal.value,
              maxWidthSVGElement.height.baseVal.value
            );
            let dataURL = canvas.toDataURL();
            resolve(dataURL);
          };
        });
      }

      saveSVGScreenshotToFile().then((data) => {
        let scene = that.props.state.get("scene");
        let toJS = scene.toJS();
        let output = JSON.stringify(toJS);

        let now = new Date();
        let year = now.getFullYear();
        let month = (now.getMonth() + 1).toString().padStart(2, "0");
        let day = now.getDate().toString().padStart(2, "0");
        let hours = now.getHours().toString().padStart(2, "0");
        let minutes = now.getMinutes().toString().padStart(2, "0");
        let seconds = now.getSeconds().toString().padStart(2, "0");

        let formattedDate = `${year}-${month}-${day}--${hours}-${minutes}-${seconds}`;

        let formattedPattern =
          formattedDate + "--" + firstName + "-" + lastName + "--" + email;
        let apiJsonBody = {
          "api-key": "merch-fix-8326870927610180-5135247346394544",
          name: firstName + " " + lastName,
          email: email,
          phone: phone,
          address: address + ", " + formCity + ", " + formState + " " + ZIP,
          formFillersQuantity: formFillersQuantity,
          formBackSplashLength: formBackSplashLength,
          formCoveBase: formCoveBase,
          formCountertopOverhang: formCountertopOverhang,
          comments: comments,
          screenshot: {
            value: data,
            type: "base64",
            filename: formattedPattern + ".png",
          },
          json_file: {
            value: output,
            type: "json",
            filename: formattedPattern + ".json",
          },
        };

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic some-code");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(apiJsonBody);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const SEND_EMAIL_URL = import.meta.env.VITE_SEND_EMAIL_URL;

        fetch(SEND_EMAIL_URL, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const p = document.createElement("p"); // create a new p element
            p.className = "text-info"; // set the class name
            p.textContent =
              "Thank you for submitting your design. We will be in touch with you shortly"; // set the text content

            document.getElementById("quoteForm").appendChild(p);

            // hide the submit button
            submitBtn.style.display = "none";
            // quoteModal.removeClass("in").slideUp();
          })
          .catch((error) => {
            console.log("error", error);
            const p = document.createElement("p"); // create a new p element
            p.className = "text-warning"; // set the class name
            p.textContent =
              "Something went wrong, please try again<br>Error: " + error; // set the text content

            document.getElementById("quoteForm").appendChild(p);

            submitBtn.disabled = false;
          });
      });
    });

    //    quoteForm

    // Edit FloorPlan Form handling
    floorPlanModal.find("#floorplanForm").on("submit", (event) => {
      event.preventDefault();
      floorPlanModal.removeClass("in").slideUp();
      const floorWidth = parseInt($("#floorWidth").val());
      const floorHeight = parseInt($("#floorHeight").val());
      const wallHeight = parseInt($("#wallHeight").val());
      // calculatePosition(defaultPlan, floorWidth, floorHeight, wallHeight);
      //this.context.projectActions.loadProject(defaultPlan);
      /// Above two lines were noop so commented.
      if (floorWidth <= 100 || floorHeight <= 100) {
        alert("Size too small. Minimum 100");
      } else {
        // projectActions.setProjectProperties({width: dataWidth, height: dataHeight});
        this.context.projectActions.setProjectProperties({
          width: floorWidth,
          height: floorHeight,
        });
      }
      categoriesContainer.find(".categories-list").slideDown(350);
    });
  }

  selectWall() {
    const element = catalog.elements.wall;
    this.context.linesActions.selectToolDrawingLine(element.name);
    this.context.projectActions.pushLastSelectedCatalogElementToHistory(
      element
    );
  }

  render() {
    let {
      props: { state, width, height, toolbarButtons, allowProjectFileSupport },
      context: {
        projectActions,
        viewer3DActions,
        linesActions,
        viewer2DActions,
        translator,
      },
    } = this;

    let mode = state.get("mode");
    let alterate = state.get("alterate");
    let alterateColor = alterate ? SharedStyle.MATERIAL_COLORS[500].orange : "";

    let sorter = [
      {
        index: 0,
        condition: true,
        dom: (
          <ToolbarButton
            id="btn_how_to"
            extraClass="toolbar_help extra_margin_bottom order1"
            icon="FaQuestion"
            active={false}
            tooltip="&nbsp;&nbsp;How To"
            onClick={showHowToModal}
          />
        ),
      },
      {
        index: 1,
        condition: allowProjectFileSupport,
        dom: (
          <div id="project-settings" className="order2">
            <ToolbarButton
              extraClass="toolbar_new order2"
              icon="FaFile"
              active={false}
              tooltip="&nbsp;&nbsp;New project"
              onClick={(event) => {
                const message =
                  "Have you saved your current project?\n\nClick CANCEL to stop and save your current project.\n\nClick OK to start a new project and remove the current design.";
                const shouldContinue = window.confirm(message);

                if (shouldContinue) {
                  // Reload the entire page.
                  window.location.reload();
                }
              }}
            ></ToolbarButton>
            <ToolbarSaveButton
              className="toolbar_save order3"
              icon="FaFloppyO"
              state={state}
            />
            <ToolbarLoadButton
              className="toolbar_load order4"
              icon="FafFolderOpen"
              state={state}
            />
          </div>
        ),
      },
      {
        index: 2,
        condition: true,
        dom: (
          <ToolbarButton
            extraClass="toolbar_undo extra_margin_bottom order4"
            icon="FaRotateLeft"
            active={false}
            tooltip="&nbsp;&nbsp;Undo Action"
            onClick={(event) => {
              //hideItemContainer(event);
              return projectActions.undo();
            }}
          />
        ),
      },
      {
        index: 3,
        condition: true,
        dom: (
          <ToolbarButton
            extraClass="toolbar_2d order5"
            icon="FaTable"
            active={[MODE_IDLE].includes(mode)}
            tooltip="&nbsp;&nbsp;2D View"
            onClick={(event) => {
              //hideItemContainer(event);
              return projectActions.setMode(MODE_IDLE);
            }}
          />
        ),
      },
      {
        index: 4,
        condition: true,
        dom: (
          <ToolbarButton
            extraClass="toolbar_3d extra_margin_bottom order6"
            icon="FaCube"
            active={[MODE_3D_VIEW].includes(mode)}
            tooltip="&nbsp;&nbsp;3D View"
            onClick={(event) => {
              //hideItemContainer(event);
              return viewer3DActions.selectTool3DView();
            }}
          />
        ),
      },
      {
        index: 5,
        condition: true,
        dom: (
          <ToolbarCatalogButton
            className="toolbar_catalog order7"
            icon="FaPlus"
            active={false}
            tooltip="&nbsp;&nbsp;Add Fixtures"
            onClick={(event) => event.preventDefault()}
            projectActions={projectActions}
            mode={mode}
          />
        ),
      },
      {
        index: 6,
        condition: true,
        dom: (
          <ToolbarButton
            extraClass="toolbar_request_quote button order8"
            icon="FaPaperPlane"
            active={false}
            tooltip="&nbsp;&nbsp;Request a Quote"
            onClick={(event) => {
              projectActions.setMode(MODE_IDLE);
              //hideItemContainer(event);
              const modal = $("#quoteModal");
              modal.addClass("in");
              modal.show();
            }}
          />
        ),
      },

      /*,
       {
         index: 9, condition: true, dom: <ToolbarButton
           className="toolbar_configure"
           active={[MODE_CONFIGURING_PROJECT].includes(mode)}
           tooltip='Configure project'
           onClick={event => projectActions.openProjectConfigurator()}>
           <MdSettings />
         </ToolbarButton>
       },
       {
         index: 7, condition: true,
         dom: <ToolbarButton
           className="toolbar_open_catalog"
           active={[MODE_VIEWING_CATALOG].includes(mode)}
           tooltip={translator.t('Open catalog')}
           onClick={event => projectActions.openCatalog()}>
           <FaPlus />
         </ToolbarButton>
       }
      ,
      {
        index: 7,
        condition: true,
        dom: (
          <ToolbarButton
            extraClass="toolbar_3d_1st_person"
            active={[MODE_3D_FIRST_PERSON].includes(mode)}
            tooltip="3D First Person"
            onClick={event => {
              hideItemContainer(event);
              return viewer3DActions.selectTool3DFirstPerson();
            }}
          >
            <MdDirectionsRun />
          </ToolbarButton>
        )
      }
      ,
      {
        index: 2,
        condition: true,
        dom: (
          <ToolbarButton
            extraClass="toolbar_room_dim"
            active={false}
            tooltip="Room Dimensions"
            onClick={event => {
              hideItemContainer(event);
              $("#floorplanModal")
                .addClass("in")
                .show();
            }}
          />
        )
      },
      {
        index: 3,
        condition: true,
        dom: (
          <ToolbarButton
            extraClass="toolbar_wall"
            active={false}
            tooltip="Draw Wall"
            onClick={() => this.selectWall()}
          />
        )
      },
      */
    ];

    sorter = sorter.concat(
      toolbarButtons.map((Component, key) => {
        return Component.prototype //if is a react component
          ? {
              condition: true,
              dom: React.createElement(Component, { mode, state, key }),
            }
          : {
              //else is a sortable toolbar button
              index: Component.index,
              condition: Component.condition,
              dom: React.createElement(Component.dom, { mode, state, key }),
            };
      })
    );
    /*
    const mainCategories = catalog.categories.root.categories;
    let categorieButtons = [];
    for (let i in mainCategories) {
      let name = mainCategories[i].name;
      let label = mainCategories[i].label;
      let elements = [];
      for (let key in mainCategories[i].elements)
        elements.push(
          <CatalogItem
            key={name + " " + key}
            element={mainCategories[i].elements[key]}
          />
        );
      categorieButtons.push(
        <div
          id={name + "-items"}
          key={`item-container-${i}`}
          style={{display: "none", position: "relative", marginTop: "15px"}}
        >
          <h3 style={{textTransform: "capitalize", textAlign: "center"}}>
            {label}
            <span className="items-close-button">
              <FaTimesCircle
                style={{
                  color: "red",
                  position: "absolute",
                  top: "-15px",
                  right: "4px",
                  cursor: "pointer"
                }}
                onClick={event => {
                  $("#catalog-container>div").hide();
                }}
              />
            </span>
          </h3>
          {elements}
        </div>
      );
    }
*/
    return (
      <aside
        style={{ ...ASIDE_STYLE, maxHeight: height }}
        className="toolbar-container"
        id="toolbar-container"
      >
        <div id="logo" style={{ width: "100%", height: "250px" }}></div>
        {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
        {/* <hr/> 
        <div id="catalog-container" className="order6" style={{paddingTop: "15px"}}>
          {categorieButtons}
        </div>
        */}
      </aside>
    );
  }
}

Toolbar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  allowProjectFileSupport: PropTypes.bool.isRequired,
  toolbarButtons: PropTypes.array,
};

Toolbar.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};

function showHowToModal() {
  const modal = $("#howToModal");
  modal.addClass("in");
  modal.show();
}

function isOlderThan30Days(timestamp) {
  const savedDate = new Date(Number(timestamp));
  const currentDate = new Date();
  const timeDifference = currentDate - savedDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  return daysDifference > 30;
}

function checkCookieAndShowModal() {
  const cookieName = "merchants_fixture";

  // Get the cookie's saved timestamp
  const savedTimestamp = Cookies.get(cookieName);

  // If the cookie does not exist or is older than 30 days
  if (!savedTimestamp || isOlderThan30Days(savedTimestamp)) {
    // Call the showHowToModal function
    showHowToModal();

    // Set or reset the cookie with a new timestamp
    Cookies.set(cookieName, new Date().getTime(), { expires: 365 });
  }
}
