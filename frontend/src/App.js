import React, { Component } from 'react';

import socket from './socket'
import Chat from './Chat'
import Game from './Game'

import './bootstrap.css';
import './bootstrap-theme.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "User" + String(Math.random()).slice(5, 10),
      playerOne: null,
      playerTwo: null
    };

    this.challenge = this.challenge.bind(this);
    this.onMessage = this.onMessage.bind(this);
    
    socket.register(this.onMessage);
    socket.send({
      type: 'join',
      username: this.state.username,
      value: ' has joined the chat.'
    })
  }
  
  
  
  onMessage(data) {
    if (data.type === 'join') {
      
      if (this.state.playerOne  && this.state.playerTwo) {
        
        socket.send({
          type:'newGameResponse',
          playerOne: data.playerOne,
          playerTwo: data.playerTwo
        })
        
      }
      
      return;
    }
    
    
    
    
    
    if (data.type !== 'newGame' && data.type !== 'newGameResponse') {
      return;
    }
    
    if (data.playerOne === this.state.playerOne && data.playerTwo === this.state.playerTwo) {
      console.log('Player ')
      return;
    }
    
    this.setState({
      playerOne: data.playerOne,
      playerTwo: data.playerTwo
    })
    
  }
  
  
  
  

  challenge(username) {
    if (this.state.playerOne || this.state.playerTwo) {
      return;
    }
    
    
    // you are now player one and 
    
    socket.send({
      type:'newGame',
      playerOne: username,
      playerTwo: this.state.username
    })
    
  }


  render() {

    return (
      <div>
        <Chat username={this.state.username} isInGame={!!this.state.playerOne} challenge={this.challenge}/>
        <Game playerOne={this.state.playerOne} playerTwo={this.state.playerTwo}/>
      </div>
      )
  }
}

export default App;
