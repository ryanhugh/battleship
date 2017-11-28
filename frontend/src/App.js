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
     
    };


  }


  render() {

    return (
      <div>
        <Chat />
        <Game />
      </div>
      )
  }
}

export default App;
