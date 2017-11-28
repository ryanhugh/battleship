import React from 'react';

import socket from './socket'


class Chat extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      
    }

    socket.register(this.receive.bind(this));


  }

  receive(data) {
    if (data.type !== 'game') {
      return;
    }


  }


  render() {
    return (
      <div>
        <div className="game-container">

        </div>
      </div>
    );
  }
}

export default Chat;