import React from 'react';

class RoomList extends React.Component {
    render() {
        const orderedRooms = [...this.props.rooms].sort((a, b) => a.id > b.id);
        if(orderedRooms.length === 0) {
            return(
                <div className="rooms-list">
                    <i className="fas fa-sync"></i>
                </div>
            );
        }
        
        return(
            <div className="rooms-list">
                <ul>
                    {
                        orderedRooms.map(room => {
                            const active = this.props.roomId === room.id ? "active" : "";
                            return(
                                <li key={room.id} className={active}>
                                    
                                    <a 
                                        href={"#" + room.name}
                                        onClick={() => this.props.subscribeToRoom(room.id)} 
                                    >
                                        <span className={room.isPrivate ? "private" : "public"}/>
                                        {room.name}
                                    </a>
                                    
                                </li>
                            )}
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default RoomList;