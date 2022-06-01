import {Button, Modal} from "react-bootstrap";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import React, {useState} from "react";
import GuestModal from "./GuestModal";
import anime from 'animejs';
import ReactDOM from "react-dom";

const SignInSignUpHome = ({goGuest, onLogin}) => {

    const [showSignIn, setShowSignIn] = useState(false);
    const handleCloseSignIn = () => setShowSignIn(false);
    const handleShowSignIn = () => setShowSignIn(true);

    const [showSignUp, setShowSignUp] = useState(false);
    const handleCloseSignUp = () => setShowSignUp(false);
    const handleShowSignUp = () => setShowSignUp(true);

    const [showCredits, setShowCredits] = useState(false);
    const handleCloseCredits = () => setShowCredits(false);
    const handleShowCredits = () => setShowCredits(true);

    const animationRef = React.useRef(null)

    // animate logo on the landing page
    React.useEffect(() => {
        animationRef.current = anime.timeline({
            targets: '.landing_page_logo #logo path',
            strokeDashoffset: [anime.setDashoffset, 500],
            easing: 'easeInOutSine',
            duration: 3500,
            direction: 'alternate',
            loop: false
        }).add({
            targets: '#logo path',
            easing: 'easeInBack',
            duration: 2400,
            fill: '#007bff'
        })
    }, [])

    // animate button menu so its pretty
    React.useEffect(() => {
        animationRef.current = anime({
            targets: '.button_menu .menu_el',
            translateY: [window.innerHeight-650, anime.get('button_menu', 'y', 'px')],
            delay: anime.stagger(40),
        })
    }, [])

    return (

        <div className="landing_page_main">
            <div className="landing_page_logo">
                <svg id="logo" width="100%" height="100%" viewBox="133.547 74.063 146.547 49.969"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFFFFF" stroke="#007bff" strokeWidth="0.5"
                          d="M 152.318 83.66 L 154.918 86.26 L 154.918 93.66 L 152.038 96.54 L 143.638 96.54 L 143.638 104.94 L 145.878 104.94 L 145.878 106.06 L 134.958 106.06 L 134.958 104.94 L 137.198 104.94 L 137.198 84.78 L 134.958 84.78 L 134.958 83.66 L 152.318 83.66 Z M 143.638 84.78 L 143.638 95.42 L 148.478 95.42 L 148.478 84.78 L 143.638 84.78 ZM 166.254 82.76 L 161.974 87.02 L 157.714 82.74 L 161.994 78.48 L 166.254 82.76 Z M 165.554 104.94 L 167.794 104.94 L 167.794 106.06 L 161.714 106.06 L 159.114 103.46 L 159.114 90.38 L 156.874 90.38 L 156.874 89.26 L 162.954 89.26 L 165.554 91.86 L 165.554 104.94 ZM 184.45 94.86 L 178.85 94.86 L 178.85 90.38 L 175.91 90.38 L 175.91 104.94 L 181.23 104.94 L 183.44 102.73 L 184.31 103.6 L 181.85 106.06 L 172.07 106.06 L 169.47 103.46 L 169.47 91.86 L 172.07 89.26 L 182.41 89.26 L 184.45 91.3 L 184.45 94.86 ZM 186.964 106.34 L 188.224 106.34 L 188.224 104.16 L 190.124 106.06 L 198.944 106.06 L 201.274 103.74 L 201.274 100.35 L 191.864 90.38 L 197.214 90.38 L 199.734 92.9 L 199.734 95 L 200.994 95 L 200.994 88.98 L 199.734 88.98 L 199.734 91.16 L 197.824 89.26 L 189.564 89.26 L 187.244 91.58 L 187.244 94.97 L 196.654 104.94 L 190.744 104.94 L 188.224 102.42 L 188.224 100.32 L 186.964 100.32 L 186.964 106.34 ZM 222.405 104.94 L 224.645 104.94 L 224.645 106.06 L 218.565 106.06 L 215.965 103.46 L 215.965 90.38 L 213.725 90.38 L 211.905 92.2 L 211.905 104.94 L 213.585 104.94 L 213.585 106.06 L 208.065 106.06 L 205.465 103.46 L 205.465 82.54 L 203.225 82.54 L 203.225 81.42 L 209.305 81.42 L 211.905 84.02 L 211.905 90.46 L 213.105 89.26 L 219.805 89.26 L 222.405 91.86 L 222.405 104.94 ZM 226.598 103.74 L 228.918 106.06 L 235.058 106.06 L 236.758 104.35 L 238.438 106.06 L 244.798 106.06 L 244.798 104.94 L 242.558 104.94 L 242.558 91.58 L 240.238 89.26 L 229.618 89.26 L 227.298 91.58 L 227.298 94.86 L 233.178 94.86 L 233.178 90.38 L 236.118 90.38 L 236.118 97.1 L 228.918 97.1 L 226.598 99.42 L 226.598 103.74 Z M 233.178 104.94 L 233.178 98.22 L 236.118 98.22 L 236.118 103.26 L 234.438 104.94 L 233.178 104.94 ZM 259.551 89.26 L 261.591 91.3 L 260.721 92.17 L 258.931 90.38 L 256.551 90.38 L 254.591 92.34 L 254.591 104.94 L 256.831 104.94 L 256.831 106.06 L 250.751 106.06 L 248.151 103.46 L 248.151 90.38 L 245.911 90.38 L 245.911 89.26 L 251.991 89.26 L 253.971 91.22 L 255.931 89.26 L 259.551 89.26 ZM 262.985 103.46 L 265.585 106.06 L 276.485 106.06 L 279.085 103.46 L 278.215 102.59 L 275.865 104.94 L 269.425 104.94 L 269.425 99.06 L 276.345 99.06 L 278.945 96.46 L 278.945 91.86 L 276.345 89.26 L 265.585 89.26 L 262.985 91.86 L 262.985 103.46 Z M 269.425 97.94 L 269.425 90.38 L 272.505 90.38 L 272.505 97.94 L 269.425 97.94 Z"
                          transform="matrix(1, 0, 0, 1, 0, 0)"/>
                </svg>
            </div>

            <div className="button_menu">
                <Button className="menu_el" variant="primary" onClick={handleShowSignIn}> Sign in </Button>
                <Button className="menu_el" variant="primary" onClick={handleShowSignUp}> Sign Up </Button>
                <p className="menu_text menu_el">Don't want an account?</p>
                <Button className="menu_el" variant="secondary" onClick={goGuest}> Proceed as Guest </Button>
                <Button className="menu_el" variant="dark" onClick={handleShowCredits}> Credits </Button>
            </div>

            <Modal
                show={showSignIn}
                onHide={handleCloseSignIn}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title> Please Sign in
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SignInModal handleClose={handleCloseSignIn} onLogin={onLogin}/>
                </Modal.Body>
            </Modal>

            <Modal
                show={showSignUp}
                onHide={handleCloseSignUp}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title> Please Enter Your Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SignUpModal handleClose={handleCloseSignUp} onLogin={onLogin}/>
                </Modal.Body>
            </Modal>

            <Modal
                show={showCredits}
                onHide={handleCloseCredits}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title> Credits </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Packages</p>
                    <ul>
                        <li><a href="https://animejs.com/">anime.js</a> for the pretty animations</li>
                        <li><a href="https://peerjs.com/">PeerJS</a> for WebRTC P2P connections</li>
                        <li><a href="https://react-bootstrap.github.io/">React Bootstrap</a> for key UI elements</li>
                        <li><a href="http://concretejs.com/">Concrete.js</a> for a flexible canvas wrapper</li>
                        <li><a href="https://www.mongodb.com/">MongoDB</a> for our database needs</li>
                    </ul>
                    <p>Code Debugging</p>
                    <ul>
                        <li><a href="https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA">Traversy Media</a>'s <a href="https://youtu.be/w7ejDZ8SWv8">React JS Crash Course</a> video</li>
                        <li>huge thanks to <a href="https://github.com/kfwong/peerjs-chatroom">kfwong's peerjs-chatroom example</a> for how to structure a host/client setup</li>
                        <li><a href="https://www.youtube.com/watch?v=FLESHMJ-bI0">Youtube help with fundamental canvas drawing code</a></li>
                        <li><a href="https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas">StackOverflow help with getting mouse position relative to canvas</a></li>
                        <li><a href="https://codepen.io/creativetim/pen/mzVQrP">Codepen Fundamental Bootstrap profile page example</a> by <a href="https://codepen.io/creativetim">Creative Tim @ CodePen.io</a></li>
                        <li><a href="https://www.settletom.com/blog/uploading-images-to-mongodb-with-multer"> Tom Settles</a>'s tutorial on cloud file storage  </li>

                    </ul>
                    <p>Images</p>
                    <ul>
                        <li><div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div></li>
                        <li><div>Icons made by <a href="https://www.flaticon.com/authors/smartline" title="Smartline">Smartline</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div></li>
                    </ul>
                    <p>Special thanks to Thierry Sans and the CSCC09 Teaching Assistant team for helping us get this far</p>
                    <p>Picshare was developed by <a href="https://github.com/JohnvadL">John Vadayattukunnel Lal</a> and <a href="https://github.com/ArdaTurkvan">Arda Turkvan</a>.</p>
                    <p>Deployed on Heroku</p>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default SignInSignUpHome