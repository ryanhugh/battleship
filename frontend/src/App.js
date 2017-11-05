import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Navbar, MenuItem, Nav, NavItem, NavDropdown, FormControl } from 'react-bootstrap';

import './bootstrap.css'
import './bootstrap-theme.css'

class App extends Component {

  constructor(props) {
    super(props);

    this.textBox = null;

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    alert(this.textBox.value)
  }

  render() {
    return (
      <div className="App">
       <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Rate a Class</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            
          </Nav>
          <Nav pullRight>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container">
 

          <form className="form">
            <FormControl
              className="input"
              type='text'
              placeholder='Enter text'
              inputRef = {(textBox) => {this.textBox = textBox}}
              onChange = { this.onSubmit } 
            />
          </form>

      </div>
      </div>
    );
  }
}

export default App;
