import React, { Component } from 'react';
import { Button, ButtonToolbar, Navbar, Nav, FormControl, Panel } from 'react-bootstrap';
import cheerio from 'cheerio'

import request from './request';
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
      isInGame: false
    };

    this.challenge = this.challenge.bind(this);
  }

  challenge(username) {

  }


  render() {

    return (
      <div>
        <Chat username={this.state.username} isInGame={this.state.isInGame} challenge={this.challenge}/>
        <Game />
      </div>
      )
  }
}

export default App;
