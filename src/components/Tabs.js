import React, { useState } from 'react';
import classnames from 'classnames';

import Button from './Button';
import CopyButton from './CopyButton';
import OpenInProcessingButton from './OpenInProcessingButton';

import { useHighlight } from '../hooks';
import { escapeHtml } from '../utils';

import * as css from './Tabs.module.css';

const Tabs = ({ pdes, className }) => {
  const [active, setActive] = useState(pdes[0].name);

  useHighlight();

  const onClick = (value) => {
    setActive(value);
  };

  return (
    <div className={classnames(css.root, className)}>
      <ul>
        {pdes.map((pde, key) => (
          <li key={key + 'tab'}>
            <Button
              className={classnames(css.tab, {
                [css.active]: pde.name === active
              })}
              onClick={() => onClick(pde.name)}
              onKeyDown={() => onClick(pde.name)}>
              {pde.name}
            </Button>
          </li>
        ))}
      </ul>
      {pdes.map((pde, key) => (
        <div
          className={classnames(css.code, {
            [css.activeCode]: pde.name === active
          })}
          key={key}>
          <CopyButton text={pde.code} />
          <OpenInProcessingButton text={pde.code} />
          <pre className={css.codeBlock}>
            <code
              dangerouslySetInnerHTML={{
                __html: escapeHtml(pde.code)
              }}
            />
          </pre>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
