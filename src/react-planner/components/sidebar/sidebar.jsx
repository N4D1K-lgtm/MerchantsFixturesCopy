import React from "react";
import PropTypes from "prop-types";
import PanelElementEditor from "./panel-element-editor/panel-element-editor";
import PanelGroupEditor from "./panel-group-editor";
import PanelMultiElementsEditor from "./panel-element-editor/panel-multi-elements-editor";
import PanelLayers from "./panel-layers";
import PanelGuides from "./panel-guides";
import PanelGroups from "./panel-groups";
import PanelLayerElements from "./panel-layer-elements";
import * as SharedStyle from "../../shared-style";
import If from "../../utils/react-if";
import GlobalTexturesEditor from "./global-texture-editor";
import { FaTimesCircle } from "react-icons/lib/fa";
import CatalogItem from "../catalog-view/catalog-item";
import catalog from "@catalog/mycatalog.js";
import $ from "jquery";

const STYLE = {
  backgroundColor: "#fff",
  display: "block",
  overflowY: "auto",
  overflowX: "hidden",
  paddingBottom: "20px",
  width: "250px",
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

const mapButtonsCb = (el, ind) => (
  <If key={ind} condition={el.condition} style={{ position: "relative" }}>
    {el.dom}
  </If>
);

export default function Sidebar({ state, width, height, sidebarComponents, }) {
  let selectedLayer = state.getIn(["scene", "selectedLayer"]);

  //TODO change in multi-layer check
  let selected = state.getIn(["scene", "layers", selectedLayer, "selected"]);

  let multiselected =
    selected.lines.size > 1 ||
    selected.items.size > 1 ||
    selected.holes.size > 1 ||
    selected.areas.size > 1 ||
    selected.lines.size +
      selected.items.size +
      selected.holes.size +
      selected.areas.size >
      1;

  let selectedGroup = state
    .getIn(["scene", "groups"])
    .findEntry((g) => g.get("selected"));

  let sorter = [
    // { index: 0, condition: true, dom: <PanelGuides state={state}/> },
    // { index: 1, condition: true, dom: <PanelLayers state={state} /> },
    {
      index: 2,
      condition: true,
      dom: (
        <PanelLayerElements
          key={"panel_elements"}
          mode={state.mode}
          layers={state.scene.layers}
          selectedLayer={state.scene.selectedLayer}
        />
      ),
    },
    // { index: 3, condition: true, dom: <PanelGroups mode={state.mode} groups={state.scene.groups} layers={state.scene.layers} /> },
    {
      index: 4,
      condition: !multiselected,
      dom: <PanelElementEditor key={"panel_edit"} state={state} />,
    },
    //{ index: 5, condition: multiselected, dom: <PanelMultiElementsEditor state={state} /> },
    // { index: 6, condition: !!selectedGroup, dom: <PanelGroupEditor state={state} groupID={selectedGroup ? selectedGroup[0] : null} /> }
  ];

  sorter = sorter.concat(
    sidebarComponents.map((Component, key) => {
      return Component.prototype //if is a react component
        ? {
            condition: true,
            dom: React.createElement(Component, { state, key }),
          }
        : {
            //else is a sortable toolbar button
            index: Component.index,
            condition: Component.condition,
            dom: React.createElement(Component.dom, { state, key }),
          };
    })
  );

  const generateKey = (prefix, index) => `${prefix}-${index}`;

  if (
    catalog.categories.root.categories &&
    typeof catalog.categories.root.categories !== "undefined"
  ) {
    const mainCategories = catalog.categories.root.categories;
    let categorieButtons = [];
    for (let i in mainCategories) {
      let name = mainCategories[i].name;
      let label = mainCategories[i].label;
      let tag = mainCategories[i].type;
      let parent = mainCategories[i].parent;
      let description = mainCategories[i].description;
      let elements = [];
      //console.log('mainCategories[i]', mainCategories[i]);
      if (tag === "no-sub") {
        for (let key in mainCategories[i].children) {
          //console.log('elemenrs', mainCategories[i].children[key]);
          elements.push(
            <CatalogItem
              key={generateKey(`${name}-element`, key)}
              element={mainCategories[i].children[key]}
            />
          );
        }
        //console.log('key', "item-container-"+ name +"_"+ Date.now() + "-" + i)
        categorieButtons.push(
          <div
            id={`${name}-items`}
            key={generateKey(`${name}`, i)}
            style={{ display: "none", position: "relative", marginTop: "15px" }}
          >
            <h3 style={{ textTransform: "capitalize", textAlign: "center" }}>
              {label}
              <br />
              <span className="items-close-button">
                <FaTimesCircle
                  style={{
                    color: "#db3f29",
                    position: "absolute",
                    top: "-15px",
                    right: "4px",
                    cursor: "pointer",
                  }}
                  onClick={(event) => {
                    $("#catalog-container>div").hide();
                  }}
                />
              </span>
            </h3>
            <div className="description">{description}</div>
            {elements}
          </div>
        );
      } else if (tag === "child") {
        // console.log('parent', mainCategories[i])
        for (let ii in mainCategories[i].children) {
          if (
            mainCategories &&
            mainCategories[i] &&
            mainCategories[i].children &&
            mainCategories[i].children[ii] &&
            typeof mainCategories[i].children[ii].name !== "undefined"
          ) {
            //console.log('mainCategories[i].children[ii]', mainCategories[i].children[ii])
            let sub_name = mainCategories[i].children[ii].name;
            //let sub_desc = mainCategories[i].children[ii].info.description;
            let sub_tag = mainCategories[i].children[ii].info.tag;
            //console.log(sub_name,mainCategories[i].children[ii] );
            //for (let sub_key in mainCategories[i].children[ii]){
            //console.log(sub_name,mainCategories[i].children[ii][sub_key] );
            //if (typeof mainCategories[i].children[ii] !== 'undefined') {
            elements.push(
              <CatalogItem
              key={generateKey(`${sub_name}-element`, ii)}
              element={mainCategories[i].children[ii]}
              />
            );
            //}
            //}
          }
        }

        categorieButtons.push(
          <div
            id={`${name}-items`}
            key={generateKey('item-container', i)}
            style={{ display: "none", position: "relative", marginTop: "15px" }}
          >
            <h3 style={{ textTransform: "capitalize", textAlign: "center" }}>
              {parent} {label}
              <br />
              <span className="items-close-button">
                <FaTimesCircle
                  style={{
                    color: "#a02921",
                    position: "absolute",
                    top: "-15px",
                    right: "4px",
                    cursor: "pointer",
                  }}
                  onClick={(event) => {
                    $("#catalog-container>div").hide();
                  }}
                />
              </span>
            </h3>
            <div className="description">{description}</div>
            {elements}
          </div>
        );
        }
    }

    return (
      <aside
        style={{ width, height, ...STYLE, borderLeft: "1px solid black" }}
        onKeyDown={(event) => event.stopPropagation()}
        onKeyUp={(event) => event.stopPropagation()}
        className="sidebar"
      > 
      <GlobalTexturesEditor state={state}/>
        {sorter.sort(sortButtonsCb).map(mapButtonsCb)}

        <div
          id="catalog-container"
          className="order6"
          style={{ paddingTop: "15px" }}
        >
          {categorieButtons}
        </div>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
