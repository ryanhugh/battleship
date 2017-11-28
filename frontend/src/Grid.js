import React from 'react';

import socket from './socket'
import './Grid.css'


class Grid extends React.Component {

  constructor(props) {
    super(props);

  }

  onBoxClick(x, y) {
    console.log('You clicked', x, y)

    if (this.props.phase == 'placing') {
      this.props.board[x][y] = 1 - this.props.board[x][y];
      // toggles between 1 and 0
    }
    else if (this.props.phase == 'guessing') {
      this.props.board[x][y] = 3 - this.props.board[x][y];

      // if it started as 0, toggles between 0 and 3
      // if it started as 1, toggles between 1 and 2


       
    }


    
    this.props.onChange(this.props.board);
  }


  render() {
    console.log(this.props.board[0][0], 'is this true???/')


    let boxes = []

    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {


        let className = 'grid-box'
        if (this.props.board[i][j] === 1) {
          className += ' one'
        }
        else if (this.props.board[i][j] === 2) {
          className += ' two'
        }
        else if (this.props.board[i][j] === 3) {
          className += ' three'
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