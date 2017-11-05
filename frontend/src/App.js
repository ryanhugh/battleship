import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import elasticlunr from 'elasticlunr';
import { Button, Navbar, MenuItem, Nav, NavItem, NavDropdown, FormControl } from 'react-bootstrap';

import termDump from './smallClasses.json'
import searchIndex from './smallSearchIndex.json'

import './bootstrap.css'
import './bootstrap-theme.css'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      classes: []
    }

    this.textBox = null;
    console.log('Loading search index...')
    this.index = elasticlunr.Index.load(searchIndex);
    console.log('Done loading search index')

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {

    let results = this.index.search(this.textBox.value)

    let classes = []

    for (let result of results.slice(0, 10)) {
      classes.push(termDump.classMap[result.ref])
    }

    this.setState({
      classes: classes
    })
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
        {this.state.classes.length}
        <br/>
        {this.state.classes.map((aClass) => {
          console.log(aClass.name)
          return aClass.name
        })}
      </div>
    );
  }
}

export default App;
