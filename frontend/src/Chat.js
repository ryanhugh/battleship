import React from 'react';

import socket from './socket'
import './Chat.css'



class Chat extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      messages: []
    }

    socket.register(this.receive.bind(this));

    this.inputEle = null;
    this.usernameEle = null;

    this.onSendButtonClick = this.onSendButtonClick.bind(this);
  }

  onSendButtonClick() {
    if (!this.inputEle.value) {
      return;
    }

    socket.send({
      type: 'chat',
      value: this.inputEle.value,
      username: this.usernameEle.value
    })
    this.inputEle.value = '';
  }

  receive(data) {
    if (data.type !== 'chat') {
      return;
    }

    let messages = this.state.messages;

    messages.push(data)

    this.setState({
      messages: messages
    })
  }


  render() {

    return (
      <div>
        <div className="chat-container">
          <div className="messages-container">
            {this.state.messages.map((message, index) => {
              return (
                <div key={message + String(index)}>
                  {message.username} : {message.value}
                </div>
                )
            })}
          </div>
          <div className="username-container">
            <div className="username-label">Name:</div>
            <input defaultValue={"User" + String(Math.random()).slice(5, 10)} className="chat-username" ref={(element) => {this.usernameEle = element}}/>
          </div>
          <div className="input-container">
            <input className="chat-input" ref={(element) => {this.inputEle = element}}/>
            <button className="chat-send-button" onClick={this.onSendButtonClick}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;