import React, { Component } from 'react';

import Chatkit from '@pusher/chatkit-client';
import {tokenUrl, instanceLocator} from './config.js';

import ChatApp from './ChatApp';
import Error from './components/Error';

class App extends Component {

  constructor(){
    super();

    this.state = {
      userId: 'Mayow',
      success: false,
      error: {
        code: 0,
        description: ""
      }
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e){
    this.setState({userId: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();

    const tokenProvider = new Chatkit.TokenProvider({
      url: tokenUrl
    });
    
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: this.state.userId,
      tokenProvider: tokenProvider
    });

    chatManager.connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.setState({success: true});
      })
      .catch(error => {
        this.setState({
          error: {
            code: error.statusCode,
            description: error.info.error_description
          }
        })
      })
  }

  render() {
    
    if(this.state.success) return <ChatApp currentUser={this.currentUser} />
    else return(
      <div className="login">

       {this.state.error.code !== 0 ? <Error error={this.state.error} /> : ""}

        <form className="login-form" onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            value={this.state.userId}
            onChange={this.handleChange}
            placeholder="Enter existing username"
          />
          <p>Type Mayow and enter</p>
        </form>
      </div>
    )
  }
}

export default App;