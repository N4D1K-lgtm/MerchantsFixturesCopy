import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import ToolbarButton from './toolbar-button';
import * as SharedStyle from '../../shared-style';
import catalog from '@catalog/mycatalog.js';
import CatalogItemButton from '../catalog-view/catalog-item-button';
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT
} from '../../constants';

const STYLE = {
  width: '100%',
  height: '30px',
  display: 'flex',
  alignItems: 'left',
  justifyContent: 'left',
  marginBottom: '5px',
  fontSize: '14px',
  position: 'relative',
  cursor: 'pointer',
  paddingLeft: '10px',
  paddingTop: '7px',
  // textTransform: 'capitalize',
};

const printHello = () => {
  console.log('Hello')
}


export default class ToolbarCatalogButton extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { active: false };
  }

  render() {
    let { state, props } = this;
    let color = props.active || state.active ? SharedStyle.COLORS.white : 'rgb(28, 166, 252)';
    const mainCategories = catalog.categories.root.categories;
    let categorieButtons = []
    //console.log('catalog', catalog)
    for (let i in mainCategories) {
      let name = mainCategories[i].name
      let label = mainCategories[i].label
      let tag = mainCategories[i].type
      //console.log(name, mainCategories[i])
      //console.log('tag', tag)
      if (tag === "no-sub"){ //has no sub-category so it needs onClick action
        categorieButtons.push(
          <ToolbarButton
            extraClass={'main_cat ' + name}
            active={false}
            tooltip={label}
            onClick={
              event => {
                $('#catalog-container>div').slideUp()
                $(`#catalog-container div#${name}-items`).slideDown()
              }
            }
            key={name + "_toolbar_" + i}/>
        )
      }else if (tag === "parent"){ //parent - no onClick action
        categorieButtons.push(
          <ToolbarButton
            extraClass={'main_cat ' + name}
            active={false}
            tooltip={label}
            onClick={() => {}}
            key={name + "_toolbar_" + i}/>
        )
        let subCatButtons = []
        for (let ii in mainCategories[i].children) {
          let sub_name = mainCategories[i].children[ii].name
          let sub_label = mainCategories[i].children[ii].label
          subCatButtons.push(
            <ToolbarButton
            extraClass={'sub_cat margintop_'+ii+' ' + name}
            parent={name}
            active={false}
            tooltip={sub_label}
            onClick={
              event => {
                $('#catalog-container>div').slideUp()
                $(`#catalog-container div#${sub_name}-items`).slideDown()
              }
            }
            key={sub_name + "_toolbar_" + ii}/>
          )
        }

        categorieButtons.push(
          <div key={'sub_cat_'+name+'_'+i} className={'sub_div ' + name}>
          {subCatButtons}
          </div>
          )
      }
    }
    return (
      <div id='categories-menu' className="order6">
        <ToolbarButton
          extraClass="toolbar_catalog"
          icon="FaPlus"
          onClick={() => {}}
          active={false}
          tooltip='&nbsp;&nbsp;Add Fixtures'
          isDropdown={false}
        />
        <div className="categories-list">
          {categorieButtons}
        </div>
      </div>
    )
  }
}

ToolbarCatalogButton.propTypes = {
  active: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  projectActions: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired
};
