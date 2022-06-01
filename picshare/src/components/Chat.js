import React from 'react'
import Message from './Message'
import '../style/chatroom.css'
import anime from 'animejs'

const Chat = ({sendMessage, messageList}) => {

    const [viewChat, setViewChat] = React.useState(false)
    const messageBoardRef = React.useRef(null)
    const animationRef = React.useRef(null)

    const toggleViewChat = () => {
        setViewChat(!viewChat)
    }

    React.useEffect(() => {
        if (viewChat) messageBoardRef.current.scrollTop = messageBoardRef.current.scrollHeight
    }, [messageList, viewChat])

    // do a fun animation each time a message comes in
    // React.useEffect(() => {

    // }, [messageList])

    // citation for icons:
    //<div>Icons made by <a href="https://www.flaticon.com/authors/smartline" title="Smartline">Smartline</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    //<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

    return (
        <div className="chatroom">
            <div className={viewChat ? 'image_button hide_icon' : 'image_button chat_icon'} onClick={toggleViewChat}/>
            {viewChat ? (
                <div>
                    <div className="chat_window" >
                        <div className="message_board" ref={messageBoardRef}>
                            {messageList.length > 0 ? (
                                messageList.map((message, index) => <Message className="menu_el" key={index} sender={message.sender} content={message.content} me={message.me}/>)
                            ) : (
                                <div className="chat_placeholder">
                                    <p className="message_content">*cricket noises*</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <input type="text" className="input_field" placeholder="Say something!" onKeyDown={sendMessage}/>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default Chat
