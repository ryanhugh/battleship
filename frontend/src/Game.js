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
      phase: 'placing',
    }

    socket.register(this.receive.bind(this));


  }

  receive(data) {
    if (data.type === 'board') {

      this.setState({
        otherBoard: data.board
      })

      return;
    }


  }

  submitButton(){

    let thisCount = 0;
    let otherCount = 0;
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        if (this.state.otherBoard[i][j]) {
          otherCount ++ 
        }
        if (this.state.thisBoard[i][j]) {
          if (this.state.phase == 'guessing' && this.state.thisBoard[i][j] < 2) {
            continue;
          }
          thisCount ++ 
        }
      }
    }

    if (this.state.phase == 'placing') {
      if (thisCount !== 17) {
        alert("You don't have the correct number of tiles selected!");
        return;
      }



      socket.send({
        type: 'board',
        board: this.state.thisBoard
      })

      this.setState({
        phase: 'guessing'
      })
    }

    if (this.state.phase === 'guessing') {
      if (thisCount === otherCount) {
        alert('You win!')
      }
      else {
        alert('Incorrect!')
      }
    }

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
    else if (this.state.phase === 'guessing') {
      instructions = 'Now guess where your opponent has placed pieces!'
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
            <Grid phase={this.state.phase} onChange={this.onGridChange.bind(this, 'other')} board={this.state.otherBoard}/>
          </div>

          <div className="right-grid">
            Your area
            <Grid phase={this.state.phase} onChange={this.onGridChange.bind(this, 'this')} board={this.state.thisBoard}/>
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