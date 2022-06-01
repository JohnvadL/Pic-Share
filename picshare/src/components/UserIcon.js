import React from 'react'

const UserIcon = ({id, me}) => {

    // citation for user icon:
    //<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    return (
        <div className={me ? "user_container user_self" : "user_container user_other"}>
            <div className="image_button user_icon"/>
            {id !== "" ? (<p className="message_id">ID: {id}</p>) : (<p className="message_id">generating ID...</p>)}
        </div>
    )
}

export default UserIcon
