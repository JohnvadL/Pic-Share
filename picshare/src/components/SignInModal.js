import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState} from "react";
import {Button} from "react-bootstrap";
import api from '../api/api'
import '../style/form.css'

const SignInModal = (props) => {

    const [password, setPassword] = useState('')
    const [username, setUserName] = useState('')

    const [errorUsername, setUserNameError] = useState('')
    const [errorPassword, setPasswordError] = useState('')
    const [generalError, setGeneralError] = useState('')


    function onclick() {
        api.send("POST", "/signin/", {username, password}, function (err, res) {
                if (err) {
                    if (err.includes("username")) {
                        setUserNameError("Username " + username + " does not exist")
                        setPasswordError("")
                        setGeneralError("")

                    } else if (err.includes("password")) {
                        setPasswordError("Incorrect Password")
                        setUserNameError("")
                        setGeneralError("")

                    } else {
                        setUserNameError("")
                        setPasswordError("")
                        setGeneralError("Error: please Try again later")
                    }
                } else {
                    props.onLogin(username)
                }
            }
        );
    }

    return (
        <form>
            <div className="form-group">
                <input type="username"
                       onChange={(e) => setUserName(e.target.value)}
                       className={errorUsername === '' ? ("form-control") : ("form-control is-invalid")}
                       id="exampleInputEmail1" aria-describedby="emailHelp"
                       placeholder="Username"/>

                <small hidden={errorUsername === ''} id="passwordHelp" className="text-danger">
                    {errorUsername !== '' ? (errorUsername) : ("")}
                </small>
            </div>

            <div className="form-group">
                <input type="password"
                       onChange={(e) => setPassword(e.target.value)}
                       className={errorPassword === '' ? ("form-control") : ("form-control is-invalid")}
                       id="exampleInputPassword1" placeholder="Password"/>

                <small hidden={errorPassword === ''} id="passwordHelp" className="text-danger">
                    {errorPassword !== '' ? (errorPassword) : ("")}
                </small>
                <small hidden={generalError === ''} id="passwordHelp" className="text-danger">
                    {generalError !== '' ? (generalError) : ("")}
                </small>
            </div>

            <Button className="wide wide_button" variant="primary" onClick={onclick}>Sign In</Button>

        </form>
    );
};

export default SignInModal