import React, { Component } from 'react';
import constants from '../constants/nlp';
import classnames from 'classnames';

const { PARTS_OF_SPEECH, REFERENCES } = constants;

function getPartOfSpeech(token) {
  return  token && token.partOfSpeech && token.partOfSpeech.tag;
}

function getReferenceType(token) {
  return  token && token.dependencyEdge && token.dependencyEdge.label;
}

function getReferencedIdx(token) {
  return  token && token.dependencyEdge && token.dependencyEdge.headTokenIndex;
}

export default class Legend extends Component{
  constructor(props) {
    super(props);
    this.state = {
      activeLegendItem: null,
      hideUnused: true,
      sortByFrequency: true,
    };
  }

  onLegendItemClick(key, legendColumn) {
    this.setState({
      activeLegendItem: key,
      activeLegendColumn: legendColumn,
    });
  }

  renderLegendTags(allTags, getTagValueFunction) {
    const { data } = this.props;
    let tagsData = Object.keys(allTags).map((key) => {
      const entities = data.tokens.filter(token => getTagValueFunction(token) === key);
      return {
        key,
        entities,
        renderedItem: this.renderLegendItem(key, entities, allTags),
      }
    });
    if (this.state.sortByFrequency) {
      tagsData = tagsData.sort((tagData1, tagData2) => tagData2.entities.length - tagData1.entities.length);
    }
    return tagsData.map(tagData => tagData.renderedItem);
  }

  render() {
    const { data } = this.props;
    if (!data.tokens) {
      return null;
    }

    const columnClass = this.state.activeLegendItem ? 'col-sm-4' : 'col-sm-6';
    const legendTagExamples = this.renderLegendTagExamples();

    return (
      <div className="row legend">
        <div className="col-sm-12">
          <h3>Legend</h3>
        </div>
        {this.renderControls()}
        <div className="col-sm-12">
          <div className="col-sm-4">
            <h4>Parts of speach</h4>
            {this.renderLegendTags(PARTS_OF_SPEECH, getPartOfSpeech)}
          </div>
          <div className="col-sm-4">
            <h4>References</h4>
            {this.renderLegendTags(REFERENCES, getReferenceType)}
          </div>
          {legendTagExamples}
        </div>
      </div>
    );
  }

  renderControls() {
    return (
      <div className="col-sm-12">
        <form role="form">
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.hideUnused} onChange={this.hideUnusedChanged.bind(this)}/> Hide unused
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.sortByFrequency} onChange={this.sortByFrequencyChanged.bind(this)}/> Sort by frequency
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.props.highlightPartsOfSpeech} onChange={this.props.onHighlightPartsOfSpeechChange}/> Highlight parts of speech
            </label>
          </div>
        </form>
      </div>
    );
  }

  hideUnusedChanged(evt) {
    this.setState({
      hideUnused: evt.target.checked
    });
  }

  sortByFrequencyChanged(evt) {
    this.setState({
      sortByFrequency: evt.target.checked
    });
  }

  renderLegendItem (key, entities, all) {
    const { hideUnused, activeLegendItem, activeLegendColumn } = this.state;
    const enabled = entities.length;
    if (hideUnused && !enabled) {
      return null;
    }
    const props = {
      className: classnames(`part-${key}`, {
        'disabled': !enabled,
        'active': activeLegendItem === key && activeLegendColumn === all,
      }),
      onClick: enabled ? () => {this.onLegendItemClick(key, all)} : null,
      key: key,
    }
    return <p {...props} >{all[key]} ({entities.length})</p>;
  }

  renderLegendTagExamples() {
    const { activeLegendItem, activeLegendColumn } = this.state;
    const { data, onTokenClick } = this.props;
    if (!activeLegendItem || !data.tokens) {
      return null;
    }

    let rows;
    if (activeLegendColumn === PARTS_OF_SPEECH) {
      const tokens = data.tokens.filter(token => token.partOfSpeech.tag === activeLegendItem);
      rows = tokens.map(token => (
          <p onClick={() => {onTokenClick(data.tokens.indexOf(token))}}>
            {token.text.content}
          </p>
        )
      );
    } else if (activeLegendColumn === REFERENCES) {
      const tokens = data.tokens.filter(token => token.dependencyEdge.label === activeLegendItem);
      rows = tokens.map((token) => {
        const referenceTokentIdx = token.dependencyEdge.headTokenIndex;
        const referencedToken = data.tokens[referenceTokentIdx];
        return (
          <p>
            <span onClick={() => {onTokenClick(referenceTokentIdx)}}>{referencedToken.text.content}</span>
            &nbsp;->&nbsp;
            <span onClick={() => {onTokenClick(data.tokens.indexOf(token))}}>{token.text.content}</span>
          </p>
        )
      });
    }
    return (
      <div className="col-sm-4">
        <h4>Examples</h4>
        {rows}
      </div>
    );
  }


};

Legend.propTypes = {
  data: React.PropTypes.object,
  highlightPartsOfSpeech: React.PropTypes.bool,
  onHighlightPartsOfSpeechChange: React.PropTypes.func,
  onTokenClick: React.PropTypes.func,
}
