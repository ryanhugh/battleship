import React from 'react';

import socket from './socket'
import './Chat.css'



class Chat extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      messages: [],
      username: this.props.username
    }

    socket.register(this.receive.bind(this));

    this.inputEle = null;

    this.onSendButtonClick = this.onSendButtonClick.bind(this);
  }

  onSendButtonClick() {
    if (!this.inputEle.value) {
      return;
    }

    socket.send({
      type: 'chat',
      value: this.inputEle.value,
      username: this.props.username
    })
    this.inputEle.value = '';
  }

  receive(data) {
    if (data.type !== 'chat' && data.type !== 'join') {
      return;
    }
    
    let messages = this.state.messages;

    messages.push(data)

    this.setState({
      messages: messages
    })
  }


  challengeAUser(username) {
    console.log(username)
    this.props.challenge(username);
  }


  render() {

    return (
        <div className="chat-container">
          <div className="messages-container">
            {this.state.messages.map((message, index) => {

              let challengeButton = null;
              if (!this.props.isInGame) {
                challengeButton = <button onClick={this.challengeAUser.bind(this, message.username)}>Challenge </button>
              }


              return (
                <div key={message + String(index)} >
                  <span>{message.username}</span>
                  {challengeButton}
                   : 
                   <span>{message.value}</span>
                </div>
                )
            })}
          </div>
          <div className="username-container">
            <div className="username-label">Name: {this.props.username}</div>
          </div>
          <div className="input-container">
            <input className="chat-input" ref={(element) => {this.inputEle = element}}/>
            <button className="chat-send-button" onClick={this.onSendButtonClick}>Send</button>
          </div>
        </div>
    );
  }
}

export default Chat;