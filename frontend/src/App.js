import React, { Component } from 'react';
import logo from './logo.svg';
import elasticlunr from 'elasticlunr';
import { Button, ButtonToolbar, Navbar, MenuItem, Nav, NavItem, NavDropdown, FormControl, Panel } from 'react-bootstrap';
import cheerio from 'cheerio'

import termDump from './smallClasses.json';
import searchIndex from './smallSearchIndex.json';

import request from './request';
import Keys from './Keys';
import Register from './Register'

import './bootstrap.css';
import './bootstrap-theme.css';
import './App.css';
import {Socket} from "phoenix";

const classSearchConfig = {
  fields: {
    classId: {
      boost: 4,
    },
    acronym: {
      boost: 4,
    },
    subject: {
      boost: 2,
    },
    desc: {
      boost: 1,
    },
    name: {
      boost: 1.1,
    },
    profs: {
      boost: 1,
    },
    crns: {
      boost: 1,
    },
  },
  expand: true,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: [],


      // Filled in with the getReviews function
      reviews: [],

      showingClass: null,

      isLoggedIn: false,
      email: ''
    };

    this.textBox = null;

    this.usernameBox = null;
    this.passwordBox = null;
    this.reviewBody = null;
    
    // Set up a channel connection
    this.socket = new Socket("/socket");

    this.socket.connect();

    // Now that you are connected, you can join channels with a topic:
    this.channel = this.socket.channel("updates:lobby", {});
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) });

    this.channel.on('ping', this.receiveReview.bind(this));

    console.log('Loading search index...');
    this.index = elasticlunr.Index.load(searchIndex);
    console.log('Done loading search index');

    this.onSubmit = this.onSubmit.bind(this);
    this.showClass = this.showClass.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.submitReview = this.submitReview.bind(this);

    this.getReviews();
  }

  onSubmit() {
    const results = this.index.search(this.textBox.value, classSearchConfig);

    const classes = [];

    for (const result of results.slice(0, 10)) {
      classes.push(termDump.classMap[result.ref]);
    }

    this.setState({
      classes: classes,
    });
  }
 
  receiveReview(reviewData) {

    let reviews = this.state.review
    reviews.push(reviewData)
    
    console.log(reviews, reviewData)

    this.setState({
      review: reviews
    })


  }

  async getReviews() {

    let posts = await request({
      url: '/posts',
      method: 'GET'
    })

    const $ = cheerio.load(posts);

    let postid = $('.postid')
    let titles = $('.posttitle')
    let content = $('.content')
    let users = $('.postuserid')

    let output = []

    for (var i = 0; i < users.length; i++) {
      output.push({
        id: $(postid[i]).text(),
        classKey: $(titles[i]).text(),
        content: $(content[i]).text(),
        userId: $(users[i]).text()
      })
    }

    console.log('Fetched reviews')

    this.setState({
      reviews: output
    })
  }

  // Class key is a key to a class. This can be found by running Keys.create(aClass).getHash()
  // a key looks like this: lafayette.edu/201740/WAIT/001_1967790890
  async submitReview(aClass) {
    let classKey = Keys.create(aClass).getHash();
    let text = this.reviewBody.value;
    let userEmail = this.usernameBox;
    
    let response = await request({
      method: 'POST',
      form: true,
      body: {
        _utf8: '✓',
        'post[postid]': '4',
        'post[title]': classKey,
        'post[content]': text,
        'post[user_id]': userEmail
      },
      url: '/posts'
    })

    this.channel.push("ping", {
      content: text
    });

    return this.getReviews();
  }

  async verifyLogin() {
    // verify that information was input to the forms
    if(!this.usernameBox.value || !this.passwordBox.value) {
      alert('Please input a Username and Password!')
    }

    let resp = await request({
      method: 'POST',
      form: true,
      body: {
        password: this.passwordBox.value,
        email: this.usernameBox.value
      },
      url: '/session'
    })


    if (resp.includes('Bad email/password')) {
      this.setState({
        isLoggedIn: false,
        email: this.usernameBox.value
      });
      alert('Bad Username/Password!');
    }
    else {
      this.setState({
        isLoggedIn: true,
        email: this.usernameBox.value
      })
    }
  }

  showClass(aClass) {
    console.log(aClass);
    this.setState({
      showingClass: aClass
    })
  }

  getHomePage() {
    return (
      <span>
          <form className='form'>
            <FormControl
              className='input'
              type='text'
              placeholder='Enter text'
              inputRef={ (textBox) => { this.textBox = textBox; } }
              onChange={ this.onSubmit }
            />
          </form>
          <div className='class-counter'>
            {this.state.classes.length}
          </div>
          <div className='results'>
            {this.state.classes.map((aClass) => {
              return (
                <div>
                  <Panel header={ `${aClass.subject} ${aClass.classId}: ${aClass.name}` }>
                    {aClass.desc}
                    <br/>

                    <span>Add a review</span>

                    <br/>
                    <a href="#" onClick={this.showClass.bind(this, aClass)} > Write a review >> </a>

                  </Panel>
                </div>
              );
            })}
          </div>
          </span>
        
        )
  }

  getClassDetails() {
    console.log(this.state.showingClass);
    let thisClass = this.state.showingClass;
    let reviewForm = null;

    if (this.state.isLoggedIn) {
      reviewForm = this.getReviewForm(this.state.showingClass);
    } else {
      reviewForm = <div>You must be logged in to leave a review</div>;
    }
    
    return (
      <span>
        <div className='class-title'>
          { thisClass.name }
        </div>
        <a href={ thisClass.url } className='class-subject'>
          { `${thisClass.subject }${ thisClass.classId }` }
        </a>
        <div className='class-desc'>
          { thisClass.desc }
        </div>
        <div className='crn-container'>
          <span className='crn-title'><strong> CRN: </strong></span>
          <ul className='class-crns-list'>
            { this.state.showingClass.crns.map((crn) => {
              return(
                <li className='class-crn'>{ crn }</li>
              );
            })}
          </ul>
        </div>
        <a href="#" className='back-button' onClick={ this.showClass.bind(this, null) }>Back</a><br></br>
        <div>Current Reviews:</div>

        <ul className = 'review-container'>
          { this.state.reviews.map((review) => {
            if (Keys.create(this.state.showingClass).getHash() == review.classKey) {
              return(  
                <li className='class-review'>
                  { review.content }
                </li>
              )
            }
          })}
        </ul>

        {reviewForm}
      </span>
      )
  }

  getReviewForm(aClass) {
    return (
      <div className='review-form'>
        <div className='review-title'>Leave a Review!</div>
        <textarea 
          rows="4" 
          cols="50" 
          className='review-body'
          ref={(review) => { this.reviewBody = review }}></textarea>
        <Button onClick={ this.submitReview.bind(this, aClass) }>Add Review!</Button>
      </div>
      )
  }

  getLogInOForm() {
    return (

          <form className='login-form'>
            <FormControl
              className='login-input'
              type='text'
              placeholder='Username'
              inputRef={ (usernameBox) => { this.usernameBox = usernameBox; } }
            />
            <FormControl
              className='login-input'
              type='password'
              placeholder='Password'
              inputRef={ (passwordBox) => { this.passwordBox = passwordBox; } }
            />
            <ButtonToolbar>
              <Button 
                bsStyle="primary" 
                className='login-submit'
                onClick={this.verifyLogin}>
                  Login!
              </Button>
            </ButtonToolbar>
          </form>

      )
  }


  render() {

    if (window.location.hash == '#register') {
      return <Register />
    }

    let content;
    if (this.state.showingClass) {
      content = this.getClassDetails();
      console.log('details!', this.state.showingClass, !!this.state.showingClass)
    }
    else {
      content = this.getHomePage();
      console.log('homepage!')
    }


    let navBarRightSide = null;
    if (!this.state.isLoggedIn) {
      navBarRightSide = this.getLogInOForm()
    }
    else {
      navBarRightSide = <a href="#" className="navbar-brand" style={{float: "right"}}>Logged in as {this.state.email}</a>
    }


    return (
      <div className='App'>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='#' onClick={this.showClass.bind(this, null)}>Rate a Class</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          {navBarRightSide}
          <Navbar.Collapse>
            <Nav />
            <Nav pullRight />
          </Navbar.Collapse>
        </Navbar>

        <div className='container'>
          {content}
        </div>
          
      </div>
    );
  }
}

export default App;
