import React, { Component } from 'react';
import $ from 'jquery';

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

  renderToken(token, idx) {
    return (
      <span key={idx}>{token.text.content}({token.dependencyEdge.label})</span>
    );
  }

  render() {
    const tokens = this.state.data.tokens || [];
    return (
      <div>
        <textarea ref="textarea"></textarea>
        <button onClick={this.requestData.bind(this)}>Reuqest</button>
        <p>{tokens.map((token, idx) => this.renderToken(token, idx))}</p>
      </div>
    );
  }
};
