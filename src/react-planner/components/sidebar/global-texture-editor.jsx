import React, { Component }  from "react";
import PropTypes from 'prop-types';
import Panel from './panel';
import { properties, textures } from "../../../catalog/cabinets/Cabinet_Textures/mtl/textures_obj";

const countertopTextures = [
  "Arctic White",
  "Coal",
  "Concrete",
  "Galaxy",
  "Iceberg",
  "Oahu",
  "Platinum Grey",
  "Royal Carrea",
  "Silver Falls",
  "Victoria Falls",
];

const cabinetTextures = [
  "Classic Maple",
  "Classic Black",
  "Classic Chocolate",
  "Equinox",
  "Lago",
  "Nova White",
  "Samba",
  "Titan Grey",
];

const contentArea = {
  height: 'auto',
  maxHeight: '15em',
  overflowY: 'auto',
  padding: '0.25em 1.15em',
  cursor: 'pointer',
  marginBottom: '1em',
  userSelect: 'none'
};

class GlobalTexturesEditor extends Component {
 
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      topTexture: this.formatTextureName(props.state.scene.topTexture),
      bodyTexture: this.formatTextureName(props.state.scene.bodyTexture),
    };
  }

  

  componentDidUpdate(prevProps) {
    if (prevProps.state.scene !== this.props.state.scene) {
      this.setState({
        topTexture: this.formatTextureName(this.props.state.scene.topTexture),
        bodyTexture: this.formatTextureName(this.props.state.scene.bodyTexture),
      });
    }
  }
  formatTextureName = (textureName) => {
    return textureName.replace(/([A-Z])/g, " $1").trim();
  };

  handleTextureChange = (textureType, textureValue) => {
    let {projectActions} = this.context;
    const formattedTextureValue = textureValue.replace(/ /g, "");
    let properties = {};
    if(textureType == "topTexture") {
       properties = {
        texture: formattedTextureValue,
      } }
      else {
        properties = {
          texture1: formattedTextureValue
        }
      }
    
    projectActions.setGlobalTexture(properties);
  };

  render() {
    const { topTexture, bodyTexture } = this.state;

    return (
      <Panel name='Global Materials' opened={true}>
        <div style={contentArea} onWheel={e => e.stopPropagation()}>
          <div className='global_materials_input'>
            <label>Countertop: </label>
            <select
              value={topTexture}
              onChange={(e) => this.handleTextureChange("topTexture", e.target.value)}
            >
              {countertopTextures.map((texture) => (
                <option key={texture}>{texture}</option>
              ))}
            </select>
          </div>
          <div className='global_materials_input'>
            <label>Cabinet: </label>
            <select
              value={bodyTexture}
              onChange={(e) => this.handleTextureChange("bodyTexture", e.target.value)}
            >
              {cabinetTextures.map((texture) => (
                <option key={texture}>{texture}</option>
              ))}
            </select>
          </div>
        </div>
      </Panel>
    );
  }
}

GlobalTexturesEditor.contextTypes = {
  projectActions: PropTypes.object.isRequired,
};


export default GlobalTexturesEditor;

