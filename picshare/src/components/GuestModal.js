import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState} from "react";
import {Button} from "react-bootstrap";
import '../style/guest_modal.css'
import '../style/profile.css'


const GuestModal = (props) => {

    const [hostID, setHostID] = useState('')

    let join = function () {

        if (hostID === "") {
            props.setGuestError("Please Enter a Host ID to join")
        } else {
            props.setGuestError("")
            props.onJoin(hostID)
            props.setLoading(true)
        }
    }

    return (
        <form>
            <div className="form-group">
                <div className="join_container">
                    <input type="text"
                        onChange={(e) => setHostID(e.target.value)}
                        className={props.guestError === '' ? ("form-control") : ("form-control is-invalid")}
                        id="exampleInputPassword1" placeholder="Host ID"/>
                    <Button className="wide" variant="primary" onClick={join}>Join Room </Button>
                </div>
                <small hidden={props.guestError === ''} id="passwordHelp" className="text-danger">
                    {props.guestError !== '' ? (props.guestError) : ("")}
                </small>

                {props.loading ? (
                <div className="spinner-grow text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                ) : (
                    <div className="join_container">
                        <Button className="wide" variant="secondary" onClick={props.onHost}>Host New Room</Button>
                    </div>
                )}
            </div>
        </form>
    );
};


export default GuestModal