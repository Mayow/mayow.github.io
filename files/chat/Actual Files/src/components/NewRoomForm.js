import React from 'react';

class NewRoomForm extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({message: event.target.value});
    }    
    handleSubmit(event){
        event.preventDefault();
        this.props.createRoom(this.state.message);
        this.setState({message: ''});
    }
    render(){
        return(
            <div className="new-room-form">
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Create New Room"
                        value={this.state.message}
                        onChange={this.handleChange}
                        required
                    />
                    <button type="submit">+</button>
                </form>
            </div>
        );
    }
}
  
export default NewRoomForm;