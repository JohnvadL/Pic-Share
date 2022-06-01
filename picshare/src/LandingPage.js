import React, {useState} from 'react'
import './style/landing_page.css';
import anime from "animejs";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from "./App";
import SignInSignUpHome from "./components/SignInSignUpHome";
import ProfilePage from './components/ProfilePage'
import {Button} from "react-bootstrap";
import api from "./api/api";

function LandingPage() {


    const [username, setUsername] = useState("")
    const [guest, setGuest] = useState("")

    function goHome() {
        setGuest("")
    }

    function goGuest(){
        setGuest("guest")
    }

    function signIn(username){
        setUsername(username)
    }

    // on reload query the username exactly once
    // if the user is signed in, the server should return a username
    React.useEffect( async () => {
        api.send("GET", "/username/", undefined, function (err, res) {
            // No Error expected
            setUsername(res)
        });
    }, [])

    function signOut() {
        setUsername("")
    }


    return (
        <div>
            {(!username || username === "") && (!guest || guest === "") ? (
                <SignInSignUpHome goGuest={goGuest} onLogin={signIn} />
            ) : (
                (!guest || guest === "") ? <ProfilePage logout={signOut} initUsername={username}/> :
                <div>
                    <App goHome={goHome}/>
                </div>
            )
            }
        </div>
    );
}

export default LandingPage;