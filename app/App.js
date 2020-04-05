import "regenerator-runtime/runtime";
import React from 'react';
import Flashcards from "./components/Flashcards";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Flashcards />
      </div>
    );
  }
}
