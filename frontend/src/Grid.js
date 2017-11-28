import React from 'react';

import socket from './socket'


class Grid extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      
    }

  }


  render() {
    return (
      <div>
        <div className="game-container">
        
        <div></div>
        <div></div>
          
        </div>
      </div>
    );
  }
}

export default Grid;