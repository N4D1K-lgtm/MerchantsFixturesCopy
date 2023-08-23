import React from 'react';
import PropTypes from 'prop-types';
import IconSave from 'react-icons/lib/fa/floppy-o';
import ToolbarButton from './toolbar-button';
import {browserDownload}  from '../../utils/browser';
import { Project } from '../../class/export';
import { hideItemContainer } from './toolbar-utils';

export default function ToolbarSaveButton({state}, {translator}) {

  let saveProjectToFile = e => {
    e.preventDefault();
    hideItemContainer(e);
    state = Project.unselectAll( state ).updatedState;
    browserDownload(state.get('scene').toJS());
  };

  return (
    <ToolbarButton
      active={false}
      class="toolbar_save order3"
      icon="FaFloppyO" 
      tooltip='&nbsp;&nbsp;Save project'
      onClick={saveProjectToFile}>
    </ToolbarButton>
  );
}

ToolbarSaveButton.propTypes = {
  state: PropTypes.object.isRequired,
};

ToolbarSaveButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
