import React, { Component } from 'react';
import $ from 'jquery';
import classnames from 'classnames';


const example = 'Application development for a marketplace';

const partsOfSpeach = {
  'UNKNOWN':	'Unknown',
  'ADJ':	'Прилагательное',
  'ADP':	'Предлог',
  'ADV':	'Наречие',
  'CONJ':	'Союз',
  'DET':	'Determiner',
  'NOUN':	'Существительное',
  'NUM':	'Числительное',
  'PRON':	'Местоимение',
  'PRT':	'Particle or other function word',
  'PUNCT':	'Punctuation',
  'VERB':	'Глагол',
  'X':	'Other: foreign words, typos, abbreviations',
  'AFFIX':	'Affix',
}

export default class Blog extends Component{

  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  requestData() {
    fetch('http://localhost:3333/', {
      method: 'POST',
      body: JSON.stringify({
        text: this.refs.textarea.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        this.setState({
          data: json,
        });
        console.log(json);
      });
  }

  onTokenClick(idx) {
    this.setState({
      activeToken: idx,
    });
  }

  renderToken(token, idx) {
    const { activeToken } = this.state;
    const classNames = classnames('token', `part-${token.partOfSpeech.tag}`, {
      'active-token': activeToken === idx,
      'dependent-on-active': token.dependencyEdge.headTokenIndex === activeToken && activeToken !== idx,
    });
    return (
      <span key={idx} className={classNames} onClick={() => {this.onTokenClick(idx)} }>
        {token.text.content}
      </span>
    );
  }

  renderResults() {
    if(!this.state.data) {
      return null;
    }
    const tokens = this.state.data.tokens || [];

    return (
      <div className="row">
        <div className="col-sm-12">
          <h3>Results</h3>
          {tokens.map((token, idx) => this.renderToken(token, idx))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h1>CLOUD NATURAL LANGUAGE</h1>
        <div className="row">
          <div className="col-sm-12">
            <h3>Source text</h3>
          </div>
          <div className="col-sm-8">
            <textarea ref="textarea" className="form-control" defaultValue={example}></textarea>
          </div>
          <div className="col-sm-4">
            <button className="btn btn-primary" onClick={this.requestData.bind(this)}>Analyze</button>
          </div>
        </div>
        {this.renderResults()}
      </div>
    );
  }
};
