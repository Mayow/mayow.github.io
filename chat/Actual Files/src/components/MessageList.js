import React from 'react';
import Message from './Message';
import ReactDom from 'react-dom';

class MessageList extends React.Component {

    componentWillUpdate(){
        const node = ReactDom.findDOMNode(this);
        this.shouldScrollBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight;
    }
    componentDidUpdate(){
        if(this.shouldScrollBottom){
            const node = ReactDom.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    }
   render() {
    if(this.props.roomId === null) {
        return(
            <div className="message-list">
                <div className="select-room">
                    <div className="main">
                        <p>Please select room or create one!</p>
                    </div>
                </div>
            </div>
        )
    }
    const ComponentMeseges = this.props.messages.map((message, index) => {
        return(
            <Message
                key={index}
                username={message.senderId}
                text={message.text}
            />
        )
    });

    if(ComponentMeseges.length === 0){
        return(
            <div className="message-list">
                <div className="select-room">
                    <div className="main">
                        <span role="img" aria-label="write-emoji">✏️</span>
                        <p>Write first message!</p>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="message-list">
            {ComponentMeseges}
        </div>
    );
   }
   
}

export default MessageList;