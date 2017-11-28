import {Socket} from "phoenix";


class SocketWrapper {

  constructor() {

    this.handlers = []

    let wsProtocol;

    if (window.location.protocol === 'http:') {
      wsProtocol = 'ws'
    }
    else {
      wsProtocol = 'wss'
    }
    
    // Set up a channel connection
    this.socket = new Socket(wsProtocol + "://" + window.location.hostname + ":4000/socket")

    this.socket.connect();

    // Now that you are connected, you can join channels with a topic:
    this.channel = this.socket.channel("updates:lobby", {});
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) });

    this.channel.on('ping', this.receive.bind(this));
  }

  register(func) {
    this.handlers.push(func)
  }

  send(body) {
    if (!body.type) {
      console.error("No type!", body)
      return;
    }

    this.channel.push("ping", body);
  }

  receive (data) {
    console.log('got data! ', data)
    for (const func of this.handlers) {
      func(data)
    }
  }
}


export default new SocketWrapper();