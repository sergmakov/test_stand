import React, { Component } from 'react';
import $ from 'jquery';
import classnames from 'classnames';
import Legend from './legend';

const example = `
— Cross-browser HTML, CSS/LESS, OOP JavaScript — 2+ years of experience.
— Skills in JavaScript and JQuery.
— Object Oriented Programming Basics.
— Web Programming Fundamentals.
— Comfortable with LAMP stack (Linux, Apache, MySQL, PHP).
— Well versed with Javascript, CSS, HTML.
— Experience with web APIs.

Appreciation for good design.
Application development for a marketplace .
Facebook Development experience .
Understanding of online advertising.

-A professional environment with great people to work with.
-Opportunities to make a difference and grow professionally .
-Work in distributed agile teams with the right processes in place.
-Your opinion matters. You are encouraged to contribute to the processes in the team and the end-product architecture.
-Direct cooperation with the customer.
-Regular business trips to work on-site.
-Dedicated HR/Client Manager.
-Various tech trainings, conferences participation and English classes;.
-Regular corporate events, team pizza lunches and Friday company breakfasts;.
-Competitive salary and benefits package that includes wide medical insurance, 20 vacation days, 10 sick leaves.

Build bug free applications.
Connect applications with various social media and data monitoring platforms.
Design and create modular code that has the potential to be re-used and improved upon.
Good level of analytical skills to understand user flow and suggest optimization opportunities.
Maximize performance and user experience of applications.
Express your views and opinions about the development life cycle.
Create precise documentation for all deliverables.

Daxx is a leading Dutch IT company that offers dedicated team IT services to international IT companies working with the latest technologies. Founded in 1999 and headquartered in the Netherlands, Daxx has offices in Kiev, Kharkov, and Dnepropetrovsk. Daxx offers an exciting and comfortable environment to work in with interesting clients and interesting projects. We are currently looking for Front-End Developer to work in our office in Dnipropetrovsk.
About the project:
The Client is a creative-technical social media agency based out of Amsterdam. They work with premium brands to design their social media strategies, and build campaigns and social apps to support these strategies.
The main focus of Client’s technology team is Soda, a homegrown, beautiful suite of social media tools to help media agencies measure and manage the social presence of brands. Soda currently consists of an advertising app — that helps you advertise on Facebook and Twitter, a survey tool, and a finance tool.
`;

export default class Blog extends Component{

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      highlightPartsOfSpeech: false,
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
          activeToken: null,
          activeLegendItem: null,
        });
      });
  }

  onTokenClick(idx) {
    this.setState({
      activeToken: idx,
    });
  }

  onHighlightPartsOfSpeechChange() {
    this.setState({
      highlightPartsOfSpeech: !this.state.highlightPartsOfSpeech,
    });
  }

  renderToken(token, idx) {
    const { activeToken, highlightPartsOfSpeech } = this.state;
    const partOfSpeechClass = highlightPartsOfSpeech ? `part-${token.partOfSpeech.tag}` : '';

    const classNames = classnames('token', partOfSpeechClass, {
      'active-token': activeToken === idx,
      'dependent-on-active': token.dependencyEdge.headTokenIndex === activeToken && activeToken !== idx,
    });

    const newLine = token.text.content === '.' ? <br /> : null;
    return (
      <span key={idx} className={classNames} onClick={() => {this.onTokenClick(idx)} }>
        {token.text.content}
        {newLine}
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
        <Legend
          data={this.state.data}
          highlightPartsOfSpeech={this.state.highlightPartsOfSpeech}
          onHighlightPartsOfSpeechChange={this.onHighlightPartsOfSpeechChange.bind(this)}
          onTokenClick={this.onTokenClick.bind(this)}
        />
      </div>
    );
  }
};
