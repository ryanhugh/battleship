import React from 'react';

import socket from './socket'
import './Grid.css'


class Grid extends React.Component {

  constructor(props) {
    super(props);

  }

  onBoxClick(x, y) {
    console.log('You clicked', x, y)
    this.props.board[x][y] = !this.props.board[x][y];
    
    this.props.onChange(this.props.board);
  }


  render() {
    console.log(this.props.board[0][0], 'is this ture???/')


    let boxes = []

    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {


        let className = 'grid-box'
        if (this.props.board[i][j]) {
          debugger
          className += ' checked'
        }

        boxes.push(<div className={className} onClick={this.onBoxClick.bind(this, i, j)}></div>)
      }
    }


    return (
      <div className="grid-container">
          {boxes}
      </div>
    );
  }
}

export default Grid;