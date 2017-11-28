import React from 'react';

import socket from './socket'
import './Game.css'
import Grid from './Grid'


class Chat extends React.Component {

  constructor(props) {
    super(props);

    let thisBoard = [[]];
    let otherBoard = [[]];

    for (var i = 0; i < 100; i++) {
      thisBoard[thisBoard.length - 1].push(0);
      otherBoard[otherBoard.length - 1].push(0);

      if ((i + 1) % 10 === 0 && i !== 99) {
        thisBoard.push([])
        otherBoard.push([])
      }
    }

    this.state = {
      thisBoard: thisBoard,
      otherBoard: otherBoard,
      phase: 'placing'
    }

    socket.register(this.receive.bind(this));


  }

  receive(data) {
    if (data.type !== 'game') {
      return;
    }


  }

  submitButton(){

  }

  onGridChange(whichOne, board) {
    if (whichOne === 'this') {
      this.setState({
        thisBoard: board,
      })
    }
    else {
      this.setState({
        otherBoard: board
      })
    }
  }


  render() {

    console.log(this.state.otherBoard[0][0], this.state.thisBoard[0][0])


    let instructions;
    if (this.state.phase === 'placing') {
      instructions = "Pick squares to place your ships! You should place one 5 tile ship, one four tile ship, two 3 tile ships, and one 2 tile ship."
    }


    let contents;
    if (!this.props.playerOne || !this.props.playerTwo) {
      contents =  <h1>No game is in progress</h1>
    }
    else {
      contents = (
        <span>
          <h1>Game between {this.props.playerOne} and {this.props.playerTwo}</h1>
          <div className="left-grid">
            Opponents area
            <Grid onChange={this.onGridChange.bind(this, 'other')} board={this.state.otherBoard}/>
          </div>

          <div className="right-grid">
            Your area
            <Grid onChange={this.onGridChange.bind(this, 'this')} board={this.state.thisBoard}/>
          </div>

          <div className="status-div">
            <h1>
              {instructions}
            </h1>
            <button onClick={this.submitButton.bind(this)}>Submit!</button>

          </div>


        </span>
        )
    }



    return (
        <div className="game-container">
          {contents}
        </div>
    );
  }
}

export default Chat;