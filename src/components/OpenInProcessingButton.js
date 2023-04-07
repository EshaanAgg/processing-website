import React, { useState } from 'react';
import classnames from 'classnames';

import ExternalLinkIcon from '../images/external-link-icon.svg';

import * as css from './OpenInProcessingButton.module.css';

const OpenInProcessingButton = () => {
  return (
    <div className="openInProcessing">
      <button type="button" className={classnames(css.root)}>
        <ExternalLinkIcon /> Open in Processing
      </button>
    </div>
  );
};

export default OpenInProcessingButton;
