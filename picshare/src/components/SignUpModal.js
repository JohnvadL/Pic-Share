import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState} from "react";
import {Button} from "react-bootstrap";
import api from '../api/api'
import '../style/form.css'
import ReactDOM from "react-dom";


const SignUpModal = (props) => {

    const [name, setName] = useState('')
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [errorUsername, setUserNameError] = useState('')
    const [generalError, setGeneralError] = useState('')

    function onclick() {
        api.send("POST", "/signup/", {username, password, name}, function (err, res) {
            if (err) {
                if (err.includes("409")) {
                    setGeneralError("")
                    setUserNameError("Username " + username + " Already Exists")
                } else {
                    setUserNameError("")
                    setGeneralError("ERROR: Please Try Again")
                }
            } else {
                props.onLogin(username)
            }
        });
    }

    return (
        <form>
            <div className="form-group">
                <input type="text" className="form-control" id="name_field" onChange={(e) => setName(e.target.value)}
                       placeholder="Name"/>
            </div>

            <div className="form-group">
                <input type="text"
                       className={errorUsername === '' ? ("form-control") : ("form-control is-invalid")}
                       id="username_field"
                       onChange={(e) => setUserName(e.target.value)}
                       aria-describedby="emailHelp"
                       placeholder="Username"/>

                <small hidden={errorUsername === ''} id="passwordHelp" className="text-danger">
                    {errorUsername !== '' ? (errorUsername) : ("")}
                </small>

            </div>

            <div className="form-group">
                <input type="password"
                       className="form-control"
                       onChange={(e) => setPassword(e.target.value)}
                       id="password_field" placeholder="Password"/>
            </div>

            <Button className="wide wide_button" variant="primary" onClick={onclick}>Sign Up</Button>

            <small hidden={generalError === ''} id="passwordHelp" className="text-danger">
                {generalError !== '' ? (generalError) : ("")}
            </small>
        </form>
    );
};


export default SignUpModal