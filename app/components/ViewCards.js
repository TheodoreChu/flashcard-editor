import React from 'react';
import CardMenu from './CardMenu';
import unified from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'

// for LaTeX
const math = require('remark-math');
const rehypeKatex = require('rehype-katex')

//for syntax highlighting
//import attacher from 'rehype-highlight';
var highlight = require('rehype-highlight');
const emoji = require('remark-emoji');

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
}, true);
console.log("event listener added")

var processor = unified()
  .use(parse)
  .use(remark2rehype)
  .use(math)
  .use(rehypeKatex) // css doesn't load properly//.use(emoji) //.use(highlight) // doesn't work
  .use(emoji)
  .use(rehype2react, {createElement: React.createElement})

export default class ViewCards extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    show: this.props.show,
    flip: this.props.flip,
    studyShow: this.props.studyShow,
    studyFlip: this.props.studyFlip,
    viewMode: this.props.viewMode,
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
      const { id, onEdit, onRemove, onNextCard } = this.props;
      //{unified().use(parse).use(remark2react).processSync(this.state.text).result}
      /*••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••<br></br>
        ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••<br></br>
        ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••<br></br>*/
        /*        { this.state.studyFlip && (
				<div className="card-section-title">Study Flip Mode </div>
				)}
				{ this.state.studyShow && (
					<div className="card-section-title">Study Show Mode</div>
				)}*/
    return (
      <div className="card-edit sk-panel">
        <div className="sk-panel-content">
          <div className="sk-panel-section">      
            <div className="card-entry">
            <div className="card-details">
            <div className="card-info" onClick={this.onToggleShow}>
            <div className="card-content" onClick={this.onToggleShow}>
              { // View Mode
                this.state.flip && this.state.viewMode && ([ // flip on 
                <div className="card-back">
                  {processor.processSync(back).result}</div>,
                ])}
              { !this.state.flip && this.state.viewMode && ([ // flip off 
                <div className="card-back">
                  {processor.processSync(front).result}
                  </div>,
                ])}
              { this.state.viewMode && ([
                <div class="card-bar"><hr></hr></div>
                ])}
              { this.state.flip && this.state.show && this.state.viewMode && ([
                <div className="card-back">
                {processor.processSync(front).result}</div>,
                ])}
              { !this.state.flip && this.state.show && this.state.viewMode && ([ // if flip is off
                <div className="card-back">
                {processor.processSync(back).result}</div>,
                ])}
              
              { // Study Flip mode 
                this.state.flip && !this.state.show && this.state.studyFlip && ([ // if flip is on 
                //<div className="card-section-title" >Back: </div>,
                <div className="card-back study-mode">
                {processor.processSync(back).result}</div>,
                //<div className="card-section-title" >Front:</div>,
                ])}
              { !this.state.flip && !this.state.show && this.state.studyFlip && ([ // if flip is off
                //<div className="card-section-title">Front:</div>,
                <div className="card-back study-mode">
                  {processor.processSync(front).result}</div>,
                ])}

              { this.state.flip && this.state.show && this.state.studyFlip && ([ // if flip is on
                <div className="card-back study-mode">
                {processor.processSync(front).result}</div>,
                ])}
              { !this.state.flip && this.state.show && this.state.studyFlip && ([ // if flip is off
                //<div className="card-section-title" >Back: </div>,
                <div className="card-back study-mode">
                  {processor.processSync(back).result}</div>,
                ])}

              { // Study Show mode
                this.state.flip && this.state.studyShow && ([ // if flip is on 
                //<div className="card-section-title" >Back: </div>,
                <div className="card-back study-mode">
                  {processor.processSync(back).result}</div>,
                //<div className="card-section-title" >Front:</div>,
                ])}
              { !this.state.flip && this.state.studyShow && ([ // if flip is off
                //<div className="card-section-title">Front:</div>,
                <div className="card-back study-mode">
                {processor.processSync(front).result}</div>,
                //<div className="card-section-title" >Back: </div>,
                ])}  
              { this.state.studyShow && ([
                <div class="card-bar"><hr></hr></div>
                ])}  
              { this.state.flip && this.state.show && this.state.studyShow && ([ // if flip is on
                <div className="card-back study-mode">
                {processor.processSync(front).result}</div>,
                ])}
              { !this.state.flip && this.state.show && this.state.studyShow && ([ // if flip is off
              <div className="card-back study-mode">
              {processor.processSync(back).result}</div>,
              ])}

              {!this.state.show && ([
                <div className="card-bar">
                  <hr></hr>
                </div>
              ])}
              
              {this.state.show && notes && ([
                  <div className="card-bar">
                    <hr></hr>
                  </div>,
                  <div className="card-back" >
                    {processor.processSync(notes).result}
                  </div>,
              ])}
            </div>
              {(this.state.studyFlip || this.state.studyShow) && this.state.show && (
                <div className="card-info sk-button-group study-buttons" onClick={onNextCard} onClick={this.onToggleShow}>
                  <div class="sk-button info" onClick={onNextCard}>
                    <div class="sk-label"> Again </div>
                  </div>
                  <div class="sk-button info" onClick={onNextCard}>
                    <div class="sk-label"> Hard </div>
                  </div>
                  <div class="sk-button info" onClick={onNextCard}>
                    <div class="sk-label"> Good </div>
                  </div>
                  <div class="sk-button info" onClick={onNextCard}>
                    <div class="sk-label"> Easy </div>
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
    </div>
        </div>
  );
  }
}
