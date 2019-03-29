import React from 'react';

function Account(props){
    return(
        <div className="account">
            <div className="user">
                
                <h1>{props.user.name}</h1>
            </div>
        </div>
    );
}

export default Account;