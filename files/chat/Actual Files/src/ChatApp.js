import React, { Component } from 'react';

import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import NewRoomForm from './components/NewRoomForm';
import Account from './components/Account';

class ChatApp extends Component {

  constructor(){
    super();
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: [],
      user: {
          id:'',
          name: ''
      }
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount(){
    this.getRooms();
    this.setState({
        user: { 
            id: this.props.currentUser.id,
            name: this.props.currentUser.name 
        }})
  }

  getRooms(){
      this.props.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.props.currentUser.rooms
        })
      })
      .catch(err => console.log(err));
  }

  subscribeToRoom(id){
    this.setState({messages:[]});
    this.props.currentUser.subscribeToRoom({
      roomId: id,
      hooks: {
          onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message]
              })
          }
        }
    })
    .then(room => {
      this.setState({ roomId: room.id });
      this.getRooms();
    })
    .catch(err => console.log(err));
    
  }

  sendMessage(text){
    this.props.currentUser.sendMessage({
      text: text,
      roomId: this.state.roomId
    })
    .catch(err => console.log(err));
  }

  createRoom(name){
    this.props.currentUser.createRoom({
      name
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="app">
          <RoomList 
            roomId={this.state.roomId}
            subscribeToRoom={this.subscribeToRoom}
            rooms={ [...this.state.joinableRooms, ...this.state.joinedRooms] }
          />
          <Account user={this.state.user} />
          <MessageList roomId={this.state.roomId} messages={this.state.messages} />
          <SendMessageForm disable={!this.state.roomId} sendMessage={this.sendMessage}/>
          <NewRoomForm createRoom={this.createRoom} />
      </div>
    );
  }
}

export default ChatApp;