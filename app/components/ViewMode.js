import React from 'react';
import CardMenu from './CardMenu';
//import { Remarkable } from 'remarkable';
//import ReactDom from 'react-dom'
import unified from 'unified'
import parse from 'remark-parse'
import remark2react from 'remark-react'

// additional for math
//import remarkmath from 'remark-math';
//import rehypeKatex from 'rehype-katex';

//for syntax highlighting
//import highlight from 'remark-highlight.js';

export default class ViewMode extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    show: this.props.show,
    flip: this.props.flip,
    studyShow: this.props.studyShow,
    studyFlip: this.props.studyFlip,
    };
  this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  };

  onToggleShow = () => {
    this.setState({
      show: !this.state.show
    });
  };

  onToggleFlip = () => {
    this.setState({
      flip: !this.state.flip
    });
  };

  render() {
      // get next card
      const { front, back, notes } = this.props.entry;
      const { id, onEdit, onRemove } = this.props;
      //{unified().use(parse).use(remark2react).processSync(this.state.text).result}
      /*••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••<br></br>
        ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••<br></br>
        ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••<br></br>*/
    return (
      <div className="sk-notification sk-base">
      <div className="card-entry">
        <div className="card-details">
          <div className="card-info" onClick={this.onToggleShow}>
            
            { this.state.flip && ([
              <div className="card-back">
                {unified().use(parse).use(remark2react).processSync(back).result}</div>,
            ])}
            { !this.state.flip && ([
              <div className="card-back">
                {unified().use(parse).use(remark2react).processSync(front).result}</div>
            ])}

            <hr></hr>

            { this.state.flip && this.state.show && ([
            <div className="card-back">
              {unified().use(parse).use(remark2react).processSync(front).result}</div>
            ])}
            { !this.state.flip && this.state.show && ([
            <div className="card-back">
              {unified().use(parse).use(remark2react).processSync(back).result}</div>
              ])}

            {!this.state.show && {back} && {front} && {notes} && ([
              <div className="hidden-text">
                <hr></hr>
              </div>
            ])}
            {this.state.show && notes && (
              <div className="card-notes-row">
                <div className="card-section-title">Notes </div>
                <div className="card-back card-notes">
                {unified().use(parse).use(remark2react).processSync(notes).result}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="card-options">
          <CardMenu
              onFlip={this.onToggleFlip}
              onEdit={onEdit.bind(this, id)}
              onRemove={onRemove.bind(this, id)}
            />
        </div>
      </div>
    </div>
  );
  }
}
