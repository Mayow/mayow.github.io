import React from 'react';

class SendMessageForm extends React.Component {
    constructor() {
        super();

        this.state = {
            message: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            message: event.target.value
        });
    }

    handleSubmit(event){
        event.preventDefault();
        this.props.sendMessage(this.state.message);
        this.setState({
            message: ''
        });
    }

    render() {
        return(
            <div className="send-message-form">
                <form onSubmit={this.handleSubmit}>
                    <input 
                        onChange={this.handleChange}
                        value={this.state.message}
                        type="text" 
                        placeholder={this.props.disable ? "Select room" : "Start typing..." }
                        disabled={this.props.disable}
                    />
                </form>
            </div>
        );
    }
}

export default SendMessageForm;