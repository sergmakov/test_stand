import React, { Component } from 'react';
import classnames from 'classnames';
import constants from '../constants/nlp';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import utils from '../utils/utils';

const { getReferenceType } = utils;
const { REFERENCES } = constants;


export default class Token extends Component{
  render() {
    const { activeToken, highlightPartsOfSpeech, onTokenClick, idx, data } = this.props;
    const partOfSpeechClass = highlightPartsOfSpeech ? `part-${info.partOfSpeech.tag}` : '';
    const info = data.tokens[idx];
    const isChildOfActive = activeToken && info.dependencyEdge.headTokenIndex === activeToken && activeToken !== idx;
    const isParentOfActive = activeToken && idx === data.tokens[activeToken].dependencyEdge.headTokenIndex && activeToken !== idx;
    const referenceDescr = REFERENCES[getReferenceType(info)];

    const classNames = classnames('token', partOfSpeechClass, {
      'active-token': activeToken === idx,
      'child-of-active': isChildOfActive,
      'parent-of-active': isParentOfActive,
    });

    const newLine = info.text.content === '.' ? <br /> : null;
    const tooltip = (
      <Tooltip id={`tooltip-${idx}`}>{referenceDescr}</Tooltip>
    );
    return (
      <OverlayTrigger placement="top" overlay={tooltip} key={idx}>
        <span className={classNames} onClick={() => {onTokenClick(idx)} }>
          {info.text.content}
          {newLine}
        </span>
      </OverlayTrigger>
    );
  }
};

Token.propTypes = {
  idx: React.PropTypes.number,
  data: React.PropTypes.object,
  activeToken: React.PropTypes.number,
  onTokenClick: React.PropTypes.func,
  highlightPartsOfSpeech: React.PropTypes.bool,
}
