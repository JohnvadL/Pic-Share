import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../style/profile.css'
import anime from "animejs";
import {Button} from "react-bootstrap";
import api from "../api/api";
import Canvas from "./Canvas";

/**
 * credits: https://codepen.io/creativetim/pen/mzVQrP Creative Tim @ CodePen.io
 * @returns {JSX.Element}
 * @constructor
 */

const ProfilePage = ({logout, initUsername}) => {

    const animationRef = React.useRef(null)
    const [images, setImages] = React.useState([])
    const [update, setUpdate] = React.useState(true)
    const [currentImage, setcurrentImage] = React.useState("")

    const [canvasDims, setCanvasDims] = React.useState({
        width: '1280',
        height: '800'
    })


    React.useEffect(async () => {
        api.send("GET", "/images/", undefined, function (err, res) {
            // No Error expected
            setImages(res)
        });
    }, [update])

    // animate logo in the workspace header
    React.useEffect(() => {
        animationRef.current = anime.timeline({
            targets: '.workspace_header #logo path',
            strokeDashoffset: [anime.setDashoffset, 500],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: function (el, i) {
                return i * 150
            },
            direction: 'alternate',
            loop: false
        }).add({
            targets: '.workspace_header #logo path',
            easing: 'easeInBack',
            delay: 200,
            duration: 800,
            fill: '#FFFFFF'
        })
    }, [currentImage])

    // animate profile menu so its pretty
    React.useEffect(() => {
        animationRef.current = anime({
            targets: '.profile-content .gallery_view',
            translateY: [window.innerHeight - 650, anime.get('button_menu', 'y', 'px')],
            delay: anime.stagger(40),
        })
    }, [images])


    let signOut = function () {
        api.send("GET", "/signout/", undefined, function (err, res) {
            // No Error expected
            logout()
        });
    }

    function goHome() {
        setcurrentImage("")
        setUpdate(!update)
    }

    function asGuest() {
        setcurrentImage("guest")
        setUpdate(!update)
    }

    return (
        <div>
            {currentImage === ""
                ? (
                    <div>
                        <div className="page-header header-filter" data-parallax="true">
                            <svg id="logo" width="45%" height="45%" viewBox="133.547 74.063 146.547 49.969"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill="white" stroke="#FFFFFF" strokeWidth="0.8"
                                      d="M 152.318 83.66 L 154.918 86.26 L 154.918 93.66 L 152.038 96.54 L 143.638 96.54 L 143.638 104.94 L 145.878 104.94 L 145.878 106.06 L 134.958 106.06 L 134.958 104.94 L 137.198 104.94 L 137.198 84.78 L 134.958 84.78 L 134.958 83.66 L 152.318 83.66 Z M 143.638 84.78 L 143.638 95.42 L 148.478 95.42 L 148.478 84.78 L 143.638 84.78 ZM 166.254 82.76 L 161.974 87.02 L 157.714 82.74 L 161.994 78.48 L 166.254 82.76 Z M 165.554 104.94 L 167.794 104.94 L 167.794 106.06 L 161.714 106.06 L 159.114 103.46 L 159.114 90.38 L 156.874 90.38 L 156.874 89.26 L 162.954 89.26 L 165.554 91.86 L 165.554 104.94 ZM 184.45 94.86 L 178.85 94.86 L 178.85 90.38 L 175.91 90.38 L 175.91 104.94 L 181.23 104.94 L 183.44 102.73 L 184.31 103.6 L 181.85 106.06 L 172.07 106.06 L 169.47 103.46 L 169.47 91.86 L 172.07 89.26 L 182.41 89.26 L 184.45 91.3 L 184.45 94.86 ZM 186.964 106.34 L 188.224 106.34 L 188.224 104.16 L 190.124 106.06 L 198.944 106.06 L 201.274 103.74 L 201.274 100.35 L 191.864 90.38 L 197.214 90.38 L 199.734 92.9 L 199.734 95 L 200.994 95 L 200.994 88.98 L 199.734 88.98 L 199.734 91.16 L 197.824 89.26 L 189.564 89.26 L 187.244 91.58 L 187.244 94.97 L 196.654 104.94 L 190.744 104.94 L 188.224 102.42 L 188.224 100.32 L 186.964 100.32 L 186.964 106.34 ZM 222.405 104.94 L 224.645 104.94 L 224.645 106.06 L 218.565 106.06 L 215.965 103.46 L 215.965 90.38 L 213.725 90.38 L 211.905 92.2 L 211.905 104.94 L 213.585 104.94 L 213.585 106.06 L 208.065 106.06 L 205.465 103.46 L 205.465 82.54 L 203.225 82.54 L 203.225 81.42 L 209.305 81.42 L 211.905 84.02 L 211.905 90.46 L 213.105 89.26 L 219.805 89.26 L 222.405 91.86 L 222.405 104.94 ZM 226.598 103.74 L 228.918 106.06 L 235.058 106.06 L 236.758 104.35 L 238.438 106.06 L 244.798 106.06 L 244.798 104.94 L 242.558 104.94 L 242.558 91.58 L 240.238 89.26 L 229.618 89.26 L 227.298 91.58 L 227.298 94.86 L 233.178 94.86 L 233.178 90.38 L 236.118 90.38 L 236.118 97.1 L 228.918 97.1 L 226.598 99.42 L 226.598 103.74 Z M 233.178 104.94 L 233.178 98.22 L 236.118 98.22 L 236.118 103.26 L 234.438 104.94 L 233.178 104.94 ZM 259.551 89.26 L 261.591 91.3 L 260.721 92.17 L 258.931 90.38 L 256.551 90.38 L 254.591 92.34 L 254.591 104.94 L 256.831 104.94 L 256.831 106.06 L 250.751 106.06 L 248.151 103.46 L 248.151 90.38 L 245.911 90.38 L 245.911 89.26 L 251.991 89.26 L 253.971 91.22 L 255.931 89.26 L 259.551 89.26 ZM 262.985 103.46 L 265.585 106.06 L 276.485 106.06 L 279.085 103.46 L 278.215 102.59 L 275.865 104.94 L 269.425 104.94 L 269.425 99.06 L 276.345 99.06 L 278.945 96.46 L 278.945 91.86 L 276.345 89.26 L 265.585 89.26 L 262.985 91.86 L 262.985 103.46 Z M 269.425 97.94 L 269.425 90.38 L 272.505 90.38 L 272.505 97.94 L 269.425 97.94 Z"
                                      transform="matrix(1, 0, 0, 1, 0, 0)"/>
                            </svg>
                        </div>

                        <div className="main main-raised">
                            <div className="profile-content">
                                <div className="end_buttons">
                                    <Button onClick={asGuest} variant="outline-dark" >
                                        Guest Canvas</Button>
                                    <Button onClick={signOut} variant="outline-primary" className="sign-out_button">Sign
                                        Out</Button>
                                </div>

                                <div className="profile-title">
                                    <div className="title">
                                        Welcome back, {initUsername}!
                                    </div>
                                </div>

                                <div className="profile-subtitle">Get started with a</div>
                                <Button onClick={(() => {
                                    setcurrentImage("new")
                                })}> New Canvas</Button>

                                {images.length > 0 ? (
                                    <div className="profile-subtitle">Or pick up where you left off:</div>) : (
                                    <div></div>)}


                                {images.map((image, index) => (
                                    <div className="gallery_view">
                                        <img id="image_view"
                                             className="image_show"
                                             alt="Image show"
                                             src={"/image/" + image._id}/>
                                        <div className="image_button_container">
                                            <Button onClick={(() => {
                                                setcurrentImage(image._id)
                                            })}> Open Canvas </Button>
                                            <Button onClick={(() => {
                                                api.send("DELETE", "/images/" + image._id, undefined, function (err, res) {
                                                    setUpdate(!update)
                                                });
                                            })}
                                                    variant="danger"
                                                    className="delete_button">Delete</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                        <footer className="footer text-center ">
                        </footer>
                    </div>
                ) : (
                    currentImage !== "new" ? (
                        < div>
                            <div className="workspace_header">
                                <svg id="logo" width="15%" height="15%" viewBox="133.547 74.063 146.547 49.969"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#007bff" stroke="#FFFFFF" strokeWidth="0.8"
                                          d="M 152.318 83.66 L 154.918 86.26 L 154.918 93.66 L 152.038 96.54 L 143.638 96.54 L 143.638 104.94 L 145.878 104.94 L 145.878 106.06 L 134.958 106.06 L 134.958 104.94 L 137.198 104.94 L 137.198 84.78 L 134.958 84.78 L 134.958 83.66 L 152.318 83.66 Z M 143.638 84.78 L 143.638 95.42 L 148.478 95.42 L 148.478 84.78 L 143.638 84.78 ZM 166.254 82.76 L 161.974 87.02 L 157.714 82.74 L 161.994 78.48 L 166.254 82.76 Z M 165.554 104.94 L 167.794 104.94 L 167.794 106.06 L 161.714 106.06 L 159.114 103.46 L 159.114 90.38 L 156.874 90.38 L 156.874 89.26 L 162.954 89.26 L 165.554 91.86 L 165.554 104.94 ZM 184.45 94.86 L 178.85 94.86 L 178.85 90.38 L 175.91 90.38 L 175.91 104.94 L 181.23 104.94 L 183.44 102.73 L 184.31 103.6 L 181.85 106.06 L 172.07 106.06 L 169.47 103.46 L 169.47 91.86 L 172.07 89.26 L 182.41 89.26 L 184.45 91.3 L 184.45 94.86 ZM 186.964 106.34 L 188.224 106.34 L 188.224 104.16 L 190.124 106.06 L 198.944 106.06 L 201.274 103.74 L 201.274 100.35 L 191.864 90.38 L 197.214 90.38 L 199.734 92.9 L 199.734 95 L 200.994 95 L 200.994 88.98 L 199.734 88.98 L 199.734 91.16 L 197.824 89.26 L 189.564 89.26 L 187.244 91.58 L 187.244 94.97 L 196.654 104.94 L 190.744 104.94 L 188.224 102.42 L 188.224 100.32 L 186.964 100.32 L 186.964 106.34 ZM 222.405 104.94 L 224.645 104.94 L 224.645 106.06 L 218.565 106.06 L 215.965 103.46 L 215.965 90.38 L 213.725 90.38 L 211.905 92.2 L 211.905 104.94 L 213.585 104.94 L 213.585 106.06 L 208.065 106.06 L 205.465 103.46 L 205.465 82.54 L 203.225 82.54 L 203.225 81.42 L 209.305 81.42 L 211.905 84.02 L 211.905 90.46 L 213.105 89.26 L 219.805 89.26 L 222.405 91.86 L 222.405 104.94 ZM 226.598 103.74 L 228.918 106.06 L 235.058 106.06 L 236.758 104.35 L 238.438 106.06 L 244.798 106.06 L 244.798 104.94 L 242.558 104.94 L 242.558 91.58 L 240.238 89.26 L 229.618 89.26 L 227.298 91.58 L 227.298 94.86 L 233.178 94.86 L 233.178 90.38 L 236.118 90.38 L 236.118 97.1 L 228.918 97.1 L 226.598 99.42 L 226.598 103.74 Z M 233.178 104.94 L 233.178 98.22 L 236.118 98.22 L 236.118 103.26 L 234.438 104.94 L 233.178 104.94 ZM 259.551 89.26 L 261.591 91.3 L 260.721 92.17 L 258.931 90.38 L 256.551 90.38 L 254.591 92.34 L 254.591 104.94 L 256.831 104.94 L 256.831 106.06 L 250.751 106.06 L 248.151 103.46 L 248.151 90.38 L 245.911 90.38 L 245.911 89.26 L 251.991 89.26 L 253.971 91.22 L 255.931 89.26 L 259.551 89.26 ZM 262.985 103.46 L 265.585 106.06 L 276.485 106.06 L 279.085 103.46 L 278.215 102.59 L 275.865 104.94 L 269.425 104.94 L 269.425 99.06 L 276.345 99.06 L 278.945 96.46 L 278.945 91.86 L 276.345 89.26 L 265.585 89.26 L 262.985 91.86 L 262.985 103.46 Z M 269.425 97.94 L 269.425 90.38 L 272.505 90.38 L 272.505 97.94 L 269.425 97.94 Z"
                                          transform="matrix(1, 0, 0, 1, 0, 0)"/>
                                </svg>
                                <Button onClick={goHome} variant="light">Leave</Button>
                            </div>
                            <Canvas width={canvasDims.width} height={canvasDims.height} initId={currentImage}/>
                        </div>
                    ) : (
                        < div>
                            <div className="workspace_header">
                                <svg id="logo" width="15%" height="15%" viewBox="133.547 74.063 146.547 49.969"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#007bff" stroke="#FFFFFF" strokeWidth="0.8"
                                          d="M 152.318 83.66 L 154.918 86.26 L 154.918 93.66 L 152.038 96.54 L 143.638 96.54 L 143.638 104.94 L 145.878 104.94 L 145.878 106.06 L 134.958 106.06 L 134.958 104.94 L 137.198 104.94 L 137.198 84.78 L 134.958 84.78 L 134.958 83.66 L 152.318 83.66 Z M 143.638 84.78 L 143.638 95.42 L 148.478 95.42 L 148.478 84.78 L 143.638 84.78 ZM 166.254 82.76 L 161.974 87.02 L 157.714 82.74 L 161.994 78.48 L 166.254 82.76 Z M 165.554 104.94 L 167.794 104.94 L 167.794 106.06 L 161.714 106.06 L 159.114 103.46 L 159.114 90.38 L 156.874 90.38 L 156.874 89.26 L 162.954 89.26 L 165.554 91.86 L 165.554 104.94 ZM 184.45 94.86 L 178.85 94.86 L 178.85 90.38 L 175.91 90.38 L 175.91 104.94 L 181.23 104.94 L 183.44 102.73 L 184.31 103.6 L 181.85 106.06 L 172.07 106.06 L 169.47 103.46 L 169.47 91.86 L 172.07 89.26 L 182.41 89.26 L 184.45 91.3 L 184.45 94.86 ZM 186.964 106.34 L 188.224 106.34 L 188.224 104.16 L 190.124 106.06 L 198.944 106.06 L 201.274 103.74 L 201.274 100.35 L 191.864 90.38 L 197.214 90.38 L 199.734 92.9 L 199.734 95 L 200.994 95 L 200.994 88.98 L 199.734 88.98 L 199.734 91.16 L 197.824 89.26 L 189.564 89.26 L 187.244 91.58 L 187.244 94.97 L 196.654 104.94 L 190.744 104.94 L 188.224 102.42 L 188.224 100.32 L 186.964 100.32 L 186.964 106.34 ZM 222.405 104.94 L 224.645 104.94 L 224.645 106.06 L 218.565 106.06 L 215.965 103.46 L 215.965 90.38 L 213.725 90.38 L 211.905 92.2 L 211.905 104.94 L 213.585 104.94 L 213.585 106.06 L 208.065 106.06 L 205.465 103.46 L 205.465 82.54 L 203.225 82.54 L 203.225 81.42 L 209.305 81.42 L 211.905 84.02 L 211.905 90.46 L 213.105 89.26 L 219.805 89.26 L 222.405 91.86 L 222.405 104.94 ZM 226.598 103.74 L 228.918 106.06 L 235.058 106.06 L 236.758 104.35 L 238.438 106.06 L 244.798 106.06 L 244.798 104.94 L 242.558 104.94 L 242.558 91.58 L 240.238 89.26 L 229.618 89.26 L 227.298 91.58 L 227.298 94.86 L 233.178 94.86 L 233.178 90.38 L 236.118 90.38 L 236.118 97.1 L 228.918 97.1 L 226.598 99.42 L 226.598 103.74 Z M 233.178 104.94 L 233.178 98.22 L 236.118 98.22 L 236.118 103.26 L 234.438 104.94 L 233.178 104.94 ZM 259.551 89.26 L 261.591 91.3 L 260.721 92.17 L 258.931 90.38 L 256.551 90.38 L 254.591 92.34 L 254.591 104.94 L 256.831 104.94 L 256.831 106.06 L 250.751 106.06 L 248.151 103.46 L 248.151 90.38 L 245.911 90.38 L 245.911 89.26 L 251.991 89.26 L 253.971 91.22 L 255.931 89.26 L 259.551 89.26 ZM 262.985 103.46 L 265.585 106.06 L 276.485 106.06 L 279.085 103.46 L 278.215 102.59 L 275.865 104.94 L 269.425 104.94 L 269.425 99.06 L 276.345 99.06 L 278.945 96.46 L 278.945 91.86 L 276.345 89.26 L 265.585 89.26 L 262.985 91.86 L 262.985 103.46 Z M 269.425 97.94 L 269.425 90.38 L 272.505 90.38 L 272.505 97.94 L 269.425 97.94 Z"
                                          transform="matrix(1, 0, 0, 1, 0, 0)"/>
                                </svg>
                                <Button onClick={goHome} variant="light">Leave</Button>
                            </div>
                            <Canvas width={canvasDims.width} height={canvasDims.height} initId=""/>
                        </div>
                    )
                )
            }
        </div>

    )
}

export default ProfilePage




