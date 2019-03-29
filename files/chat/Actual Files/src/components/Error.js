import React from 'react';

function Error(props){
    return(
        <div className="error-box">
            <p>{props.error.code}</p>
            <p>{props.error.description}</p>
        </div>
    );
}

export default Error;



