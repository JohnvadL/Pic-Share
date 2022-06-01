import React from 'react'

const Message = ({sender, content, me}) => {
    return (
        <div className={me ? "message message_self" : "message message_other"}>
            <p className="message_id">{sender}</p>
            <p className="message_content">{content}</p>
        </div>
    )
}

export default Message
