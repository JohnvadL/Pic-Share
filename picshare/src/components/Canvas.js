import React, {useEffect, useState} from 'react'
import Toolbar from './Toolbar'
import anime from 'animejs'
import Peer from 'peerjs'
import Immutable, {update} from 'immutable'
import {useCallback} from 'react'
import {Modal, Button, ListGroup, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import GuestModal from "./GuestModal";
import Chat from './Chat'
import '../style/canvas.css'
import '../style/chatroom.css'
import encode from '../api/FileEncoder'
import Concrete, {viewports} from 'concretejs'
import {AiFillEyeInvisible, AiFillEye, AiOutlinePlusSquare, AiOutlineQuestionCircle} from 'react-icons/ai';
import {BiPlus} from 'react-icons/bi';
import {Popover, OverlayTrigger} from "react-bootstrap";

import api from "../api/api";
import {initMetric} from "web-vitals/dist/modules/lib/initMetric";
import UserIcon from './UserIcon'

// explanation of critical dependency warning: https://github.com/peers/peerjs/issues/784

/*
 * ===================================================================================
 *                                     CREDITS
 * ===================================================================================
 * 
 * - credits & huge thanks to kfwong's peerjs-chatroom example for how to structure a host/client setup:
 *      https://github.com/kfwong/peerjs-chatroom
 * - help with fundamental canvas drawing code: https://www.youtube.com/watch?v=FLESHMJ-bI0
 * - help with getting mouse position relative to canvas: https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
 * 
 */
const Canvas = ({width, height, initId}) => {

    // Starting logic for multiple layers
    const concreteContainer = React.useRef(null)
    const [concreteViewport, setConcreteViewport] = React.useState(null)
    const [currentLayer, setCurrentLayer] = React.useState(null)
    const [layerVisibilities, setLayerVisibilities] = React.useState([])
    const [updateVis, setUpdateVis] = React.useState(false)
    const [layers, setLayers] = React.useState({})

    const animationRef = React.useRef(null)

    // canvas-related states
    const [isDrawing, setIsDrawing] = React.useState(false)
    const [points, setPoints] = React.useState([])
    const [brush, setBrush] = React.useState(
        {
            lineCap: 'round',
            lineJoin: 'round',
            lineWidth: '10',
            color: '#000000'
        }
    )
    const [brushSelected, setBrushSelected] = React.useState(true)

    const [isMoving, setIsMoving] = React.useState(false)
    const [moveToolSelected, setMoveToolSelected] = React.useState(false)
    const [moveLayerImage, setMoveLayerImage] = React.useState(null)
    const [moveNewPos, setMoveNewPos] = React.useState(null)

    // list of messages for chatroom
    const [messageList, setMessageList] = React.useState([])
    const [myId, setMyId] = React.useState("")

    // For sending data
    const [clientConnections, setClientConnections] = React.useState(Immutable.Map())
    // for receiving data
    let connectionsArray = []

    const [hostConnection, setHostConnection] = React.useState(null)
    const [peerList, setPeerList] = React.useState([])
    const [connectionsUpdater, setConnectionsUpdater] = React.useState(0)


    // everyone gets a peer on draw
    const [peer, setPeer] = React.useState(new Peer(undefined, {
        host: window.location.hostname,
        port: window.location.port || (window.location.protocol === 'https:' ? 443 : 80),
        path: '/peerjs'
    }))

    // Modal for creating host and signing in as guest
    const [showGuest, setShowGuest] = useState(initId === "guest");
    const [guestError, setGuestError] = useState("");
    const [loading, setLoading] = useState(false)

    const handleCloseGuest = () => setShowGuest(false);

    // ================================================================
    //                 P2P Sending/Receiving methods
    // ================================================================
    // broadcasts data to all connected users
    const broadcastData = useCallback((data) => {
        if (hostConnection) {
            hostConnection.send(data)
        } else {
            if (data.owner) {
                for (const [id, connection] of Object.entries(connectionsArray)) {
                    if (id !== data.owner) {
                        connection.send(data)
                    }
                }
            } else {
                clientConnections.forEach((connection) => {
                    connection.send(data)
                })
            }
        }
    }, [clientConnections, hostConnection])

    // error handling for host peer connection
    React.useEffect(() => {

        peer.on('error', (err) => {
            switch (err.type) {
                case 'peer-unavailable':
                    console.log("peer unavailable")
                    break;
                default:
                    console.log("Error:", err)
                    break;
            }
        })
    }, [])


    React.useEffect(() => {
        setConcreteViewport(new Concrete.Viewport({
            container: concreteContainer.current,
            width: width,
            height: height
        }))
    }, [])


    React.useEffect(() => {
        if (concreteViewport) {
            // Add a single layer for now
            let mainLayer = new Concrete.Layer();
            concreteViewport.add(mainLayer);

            let mainSceneContext = mainLayer.scene.context;
            mainSceneContext.lineCap = brush.lineCap
            mainSceneContext.lineJoin = brush.lineCap
            mainSceneContext.lineWidth = brush.lineWidth
            mainSceneContext.strokeStyle = brush.color

            let layer1 = {
                name: "main",
                layerContext: mainSceneContext,
                layerObject: mainLayer,
            }

            // Add new layer for comments
            let commentsLayer = new Concrete.Layer();
            concreteViewport.add(commentsLayer);
            let commentsContext = commentsLayer.scene.context;
            commentsContext.lineCap = brush.lineCap;
            commentsContext.lineJoin = brush.lineCap;
            commentsContext.lineWidth = brush.lineWidth;
            commentsContext.strokeStyle = brush.color;

            let commentLayer = {
                name: "comments",
                layerContext: commentsContext,
                layerObject: commentsLayer,
            }

            layers.main = layer1;
            layers.comments = commentLayer;

            setLayers(layers)

            setLayerVisibilities({
                "main": true,
                "comments": true
            });
            setCurrentLayer(layer1);

            if (initId && (initId !== "" && initId !== "guest")) {
                let base_image = new Image();
                base_image.src = "/image/" + initId;
                base_image.onload = function () {
                    mainSceneContext.drawImage(base_image, 0, 0);
                    concreteViewport.render();
                }
            }

        }
    }, [concreteViewport])

    React.useEffect(() => {
        if (concreteViewport) {
            concreteViewport.layers.forEach(layer => {
                layer.scene.context.lineCap = brush.lineCap
                layer.scene.context.lineJoin = brush.lineJoin
                layer.scene.context.lineWidth = brush.lineWidth
                layer.scene.context.strokeStyle = brush.color
            })
        }

    }, [brush])


    // once canvas is mounted, set hosting to true & initialize connection
    // handles people connecting to (this) host
    React.useEffect(() => {
        peer.on('open', (id) => {
            console.log('Connection to server established.')
            console.log('Your id is:', id)
            setMyId(id)
        })

        peer.on('connection', (connection) => {
            console.log(connection.peer, "connecting...")
            connection.on('open', () => {
                console.log(connection.peer, "connected.")
                setConnectionsUpdater(connectionsUpdater + 1)
                // Needed for when broadcast is called by Peerjs
                connectionsArray[connection.peer] = connection
                // Needed for when broadcast is called by the host react component
                setClientConnections((prevClientConnections) => {
                    return prevClientConnections.set(connection.peer, connection)
                })
                sendInitPackage(connection)
            })

            connection.on('data', (data) => {
                // when host gets the data, every other connected peer should also receive
                data.owner = connection.peer;
                switch (data.action) {
                    case "DRAW":
                        setDrawData(data)
                        break
                    case "CLEAR":
                        setClearLayerName(data.layer)
                        break;
                    case "CLIENTS":
                        setPeerList(data.clients)
                        break;
                    case "FILTER":
                        setReceiveFilter(data)
                        setUpdateFilter(!updateFilter)
                        break;
                    case "LAYER_NEW":
                        setCreateName(data.layer)
                        break;
                    case "MESSAGE":
                        let newData = {sender: data.sender, content: data.content}
                        setMessageList((prevMessageList) => {
                            let newMessageList = [...prevMessageList, newData]
                            return newMessageList
                        })
                        break;
                    case "SAVE":
                        receiveInitPackage(data)
                        break;
                    case "TRANSFORM":
                        setIncomingLayerUpdate(data)
                        break;
                    case "COMMENT":
                        setReceiveCommentData(data);
                        setReceiveComment(true);
                        break;
                    default:
                        console.log(data.action, "is not a recognizable action")
                }
                // should send list of clientConnections as well
                broadcastData({...data})
            })

            connection.on('close', () => {
                console.log('Connection to', connection.peer, "closed.")
                setConnectionsUpdater(connectionsUpdater - 1)
                // As mentioned earlier for when peerjs calls
                delete connectionsArray[connection.peer]
                // Tracked for when react components call push
                setClientConnections((prevClientConnections) => {
                    return prevClientConnections.delete(connection.peer.toString(),)
                })
            })
        })

        peer.on('disconnected', () => {
            console.log('Disconnected from signaller.')
        })

        peer.on('error', (error) => {
            switch (error.type) {
                case 'peer-unavailable':
                    setGuestError("Peer Server Currently Unavailable")
                    break;
                default:
                    setGuestError("The host ID you entered is not currently available")
                    break;
            }
        })
    }, [])

    // whenever clientConnections changes, broadcast list of clients to all connected users
    // so they can update their user list
    React.useEffect(() => {
        if (clientConnections.size > 0) {
            let clients = [...clientConnections.map(connection => connection.peer).toList()]
            // push host Id to list
            clients.push(myId)
            let data = {
                action: "CLIENTS",
                peers: clients
            }
            broadcastData(data)
        }
    }, [clientConnections])

    // handling when a user is connecting to a host
    React.useEffect(() => {

        if (hostConnection) {
            hostConnection.on('open', () => {
                console.log('Host Connection to', hostConnection.peer, "established.")
                handleCloseGuest()
            })

            hostConnection.on('data', (data) => {
                console.log("Client Receives Data")
                switch (data.action) {
                    case "DRAW":
                        setDrawData(data)
                        break
                    case "CLEAR":
                        setClearCanvasNoBroadCast(data.layer)
                        break;
                    case "FILTER":
                        setReceiveFilter(data)
                        setUpdateFilter(!updateFilter)
                        break;
                    case "CLIENTS":
                        setPeerList(data.peers.filter(id => id !== myId))
                        break;
                    case "LAYER_NEW":
                        setCreateName(data.layer)
                        break;
                    case "MESSAGE":
                        let newData = {sender: data.sender, content: data.content}
                        setMessageList((prevMessageList) => {
                            let newMessageList = [...prevMessageList, newData]
                            return newMessageList
                        })
                        break;
                    case "SAVE":
                        receiveInitPackage(data)
                        break;
                    case "TRANSFORM":
                        setIncomingLayerUpdate(data)
                        break;
                    case "COMMENT":
                        setReceiveCommentData(data);
                        setReceiveComment(true);
                        break;
                    default:
                        console.log(data.action, "is not a recognizable action")
                }
            })

            hostConnection.on('close', () => {
                console.log('Connection to', hostConnection.peer, 'is closed.')
                setPeer(peer.destroy())
                setHostConnection(null)
            })
        }
    }, [hostConnection, peer])


    // draws a line in order of the points in data with the brush style as well
    // used for when a client receives drawing data

    const [drawData, setDrawData] = useState("")
    React.useEffect(() => {
        let data = drawData
        if (drawData !== "") {
            if (data.points[0] && data.points[0] && data.layer) {
                let layer = layers[data.layer]

                if (layer) {
                    setCanvasBrush(data.brush)
                    // start drawing the points
                    layer.layerContext.beginPath()
                    layer.layerContext.moveTo(data.points[0].x, data.points[0].y)
                    data.points.forEach((point) => {
                        layer.layerContext.lineTo(point.x, point.y)
                        layer.layerContext.stroke()
                        layer.layerContext.moveTo(point.x, point.y)
                    })
                    concreteViewport.render()
                    // set brush back to local brush
                    setCanvasBrush(brush)
                }
            }
            setDrawData("")
        }
    }, [drawData])


    const [incomingLayerUpdate, setIncomingLayerUpdate] = React.useState(null)
    React.useEffect(() => {
        if (incomingLayerUpdate) {
            // apply the layer update
            let layer = layers[incomingLayerUpdate.layer]
            if (layer) {
                switch (incomingLayerUpdate.type) {
                    case "MOVE":
                        layer.layerObject.scene.toImage(function (image) {
                            layer.layerObject.scene.clear()
                            layer.layerContext.drawImage(image, incomingLayerUpdate.newPos.x, incomingLayerUpdate.newPos.y)
                            concreteViewport.render()
                        })
                        break;
                    case "ROTATE":
                        // perform the rotate similar to the rotateImage method
                        layer.layerObject.scene.toImage(function (image) {
                            layer.layerContext.save()
                            layer.layerObject.scene.clear()
                            // translate canvas origin to image center point
                            layer.layerContext.translate(image.width / 2, image.height / 2)

                            if (incomingLayerUpdate.degrees < 0) layer.layerContext.rotate((360 + incomingLayerUpdate.degrees) * Math.PI / 180)
                            else layer.layerContext.rotate(incomingLayerUpdate.degrees * Math.PI / 180)

                            layer.layerContext.drawImage(image, -image.width / 4, -image.height / 4, image.width, image.height)
                            concreteViewport.render()
                            layer.layerContext.restore()
                        })
                        break;
                    case "SCALE":
                        // perform the scale similar to the scaleImage method
                        layer.layerObject.scene.toImage(function (image) {
                            layer.layerContext.save()
                            layer.layerObject.scene.clear()
                            layer.layerContext.scale(incomingLayerUpdate.value / 100, incomingLayerUpdate.value / 100)
                            layer.layerContext.drawImage(image, 0, 0)
                            concreteViewport.render()
                            layer.layerContext.restore()
                        })
                        break;
                    default:
                        console.log(incomingLayerUpdate.type, "is not a recognizable type of transform")
                }
            }
        }
    }, [incomingLayerUpdate])

    // set up a connection to the host
    const connectToHost = (host) => {
        let a = peer.connect(host)
        setHostConnection(a)
    }

    // ================================================================
    //                 Drawing & Canvas-related methods
    // ================================================================
    // this runs right after Canvas is available in the DOM
    // (having parameters in 2nd arg will only run the useEffect if those parameters changed between updates)
    // initialize canvas context, runs every time user changes brush

    const [currentImage, setCurrentImage] = React.useState(initId)

    // begins the drawing process when mouse is clicked down
    // should be renamed to handleMouseDown
    const startDrawing = ({nativeEvent}) => {

        if (commentText === "") {
            const {offsetX, offsetY} = nativeEvent
            if (brushSelected) {
                setPoints([...points, {x: offsetX, y: offsetY}])
                currentLayer.layerContext.beginPath()
                currentLayer.layerContext.moveTo(offsetX, offsetY)
                currentLayer.layerContext.lineTo(offsetX, offsetY)
                currentLayer.layerContext.stroke()
                concreteViewport.render()
                setIsDrawing(true)
            } else if (moveToolSelected) {
                // get image as it is so we can keep redrawing it for moving
                currentLayer.layerObject.scene.toImage(function (image) {
                    setMoveLayerImage(image)
                    setIsMoving(true)
                })
            }
        } else {
            // code to add comment
            let draw_context = layers.comments.layerContext
            const {offsetX, offsetY} = nativeEvent
            draw_context.fillStyle = brush.color
            draw_context.font = brush.lineWidth + "px Arial"
            draw_context.fillText(commentText, offsetX, offsetY)
            concreteViewport.render()
            broadcastData({action: "COMMENT", X: offsetX, Y: offsetY, text:commentText, brush:brush})
            setCommentText("")
        }
    }

    // ends the drawing process when mouse is no longer clicked
    // should be renamed to handleMouseUp
    const finishDrawing = () => {
        if (isDrawing) {
            broadcastData({action: "DRAW", points: points, brush: brush, layer: currentLayer.name})
            setPoints([])
            setIsDrawing(false)
        } else if (isMoving) {
            // broadcast the new layer
            broadcastData({action: "TRANSFORM", type: "MOVE", newPos: moveNewPos, layer: currentLayer.name})
            setIsMoving(false)
            setMoveLayerImage(null)
            setMoveNewPos(null)
        }
    }

    // handles drawing while mouse is held down
    // should be renamed to 'handleMouseMove'
    const draw = ({nativeEvent}) => {
        if (!isDrawing && !isMoving) {
            return
        }
        const {offsetX, offsetY} = nativeEvent
        if (brushSelected) {
            if (isDrawing) {
                setPoints([...points, {x: offsetX, y: offsetY}])
                currentLayer.layerContext.lineTo(offsetX, offsetY)
                currentLayer.layerContext.stroke()
                concreteViewport.render()
            }
        } else if (moveToolSelected) {
            if (isMoving) {
                // essentially we clear the layer and redraw over and over
                currentLayer.layerContext.save()
                currentLayer.layerObject.scene.clear()
                // the position of the mouse is really janky, for now this somewhat works
                let newX = (offsetX - (moveLayerImage.width / 2))
                let newY = (offsetY - (moveLayerImage.height / 2))
                currentLayer.layerContext.drawImage(moveLayerImage, newX, newY)
                setMoveNewPos({x: newX, y: newY})
                concreteViewport.render()
                // restore context to how it was before all of the transformations
                currentLayer.layerContext.restore()
            }
        }
    }

    // clears the canvas for all users
    const clearCanvas = () => {
        currentLayer.layerObject.scene.clear()
        concreteViewport.render()
        broadcastData({action: "CLEAR", layer: currentLayer.name})
    }

    const [clearLayerName, setClearLayerName] = useState("")
    useEffect(() => {
        if (clearLayerName !== "") {
            layers[clearLayerName].layerObject.scene.clear()
            concreteViewport.render()
            broadcastData({action: "CLEAR", layer: currentLayer.name})
            setClearLayerName("")
        }
    }, [clearLayerName])

    const [clearCanvasNoBroadCast, setClearCanvasNoBroadCast] = useState("")
    useEffect(() => {
        if (clearCanvasNoBroadCast !== "") {
            layers[clearCanvasNoBroadCast].layerObject.scene.clear()
            concreteViewport.render()
            setClearCanvasNoBroadCast("")
        }
    })

    // change color of local user's brush
    const changeColor = (e) => {
        let newBrush = Object.assign({}, brush);
        newBrush.color = e.target.value
        setBrush(newBrush)
    }

    // change line width of local user's brush
    const changeLineWidth = (e) => {
        let newBrush = Object.assign({}, brush);
        newBrush.lineWidth = e.target.value
        setBrush(newBrush)
    }

    // configures local user's brush to be the brush described by
    // newBrush
    const setCanvasBrush = (newBrush) => {
        concreteViewport.layers.forEach(layer => {
            layer.scene.context.lineCap = newBrush.lineCap
            layer.scene.context.lineJoin = newBrush.lineJoin
            layer.scene.context.lineWidth = newBrush.lineWidth
            layer.scene.context.strokeStyle = newBrush.color
        })
    }

    let onHost = function () {
        handleCloseGuest()
    }

    // sets the currently selected tool to the brush
    const selectBrush = () => {
        setBrushSelected(true)
        setMoveToolSelected(false)
        console.log("brush selected")
    }

    // sets the currently selected tool to the moving tool
    const selectMoveTool = () => {
        setBrushSelected(false)
        setMoveToolSelected(true)
        console.log("move tool selected")
    }

    // ================================================================
    //                     Image-editing methods
    // ================================================================
    // code to handle pasting images from clipboard
    const handlePaste = (e) => {
        if (e.clipboardData == false) return false
        let imgs = (e.clipboardData || e.originalEvent.clipboardData).items
        if (imgs == undefined) return false
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs[i]
            if (img.kind === 'file') {
                let blob = img.getAsFile()
                loadImage(blob)
            }
        }
    }

    // loads pasted image into canvas context
    const loadImage = (blob) => {
        let reader = new FileReader()
        let img = new Image()
        img.onload = () => {
            // make new layer, draw image on its canvas
            currentLayer.layerContext.drawImage(img, 0, 0)
            concreteViewport.render()
            setSendLayer(currentLayer.name)
        }
        reader.onloadend = () => {
            img.src = reader.result
        }
        reader.readAsDataURL(blob)
    }

    // sets image rotation to the given value and redraws canvas
    // NEEDS THE ORIGIN TO BE FIXED, ROTATION CAUSES IMAGES TO FLY OFF THE SCREEN DUE TO THE MISPLACED ORIGIN
    const rotateImage = (degrees) => {
        if (currentLayer) {
            console.log("rotate")
            currentLayer.layerObject.scene.toImage(function (image) {
                currentLayer.layerContext.save()
                currentLayer.layerObject.scene.clear()

                // translate canvas origin to image center point
                currentLayer.layerContext.translate(image.width / 2, image.height / 2)

                if (degrees < 0) currentLayer.layerContext.rotate((360 + degrees) * Math.PI / 180)
                else currentLayer.layerContext.rotate(degrees * Math.PI / 180)

                currentLayer.layerContext.drawImage(image, -image.width / 4, -image.height / 4, image.width, image.height)
                concreteViewport.render()
                currentLayer.layerContext.restore()
                broadcastData({action: "TRANSFORM", type: "ROTATE", degrees: degrees, layer: currentLayer.name})
            })
        }
    }

    const scaleImage = (value) => {
        if (currentLayer) {
            console.log("scale")
            currentLayer.layerObject.scene.toImage(function (image) {
                currentLayer.layerContext.save()
                currentLayer.layerObject.scene.clear()
                currentLayer.layerContext.scale(value / 100, value / 100)
                currentLayer.layerContext.drawImage(image, 0, 0)
                concreteViewport.render()
                currentLayer.layerContext.restore()
                broadcastData({action: "TRANSFORM", type: "SCALE", value: value, layer: currentLayer.name})
            })
        }
    }

    // ================================================================
    //                         Chatroom methods
    // ================================================================
    // sends a chatroom message to all users
    const sendMessage = (e) => {
        if (e.key === 'Enter') {
            // do not allow sending blank messages
            if (e.target.value.length > 0) {
                let localData = {
                    sender: myId,
                    content: e.target.value,
                    me: true
                }
                // queue your message into the messageList
                setMessageList((prevMessageList) => {
                    let newMessageList = [...prevMessageList, localData]
                    return newMessageList
                })
                // now add relevant information for other peers to understand how to handle message
                let data = {
                    action: "MESSAGE",
                    sender: myId,
                    content: e.target.value,
                    me: false
                }
                broadcastData(data)
                e.target.value = ""
            }
        }
    }

    // ================================================================
    //                         Saving canvas methods
    // ================================================================
    const downloadImage = () => {
        concreteViewport.scene.download({
            fileName: 'picshare-canvas.png'
        })
    }

    function saveImage() {
        concreteViewport.scene.canvas.toBlob(function (blob) {
            const formData = new FormData();
            formData.append('picture', blob, 'filename.png');
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/images/" + currentImage);
            xhr.onload = function () {
                setCurrentImage(xhr.responseText)
            }
            xhr.send(formData)
        });
    }

    const [initPeer, setInitPeer] = useState("")
    let sendInitPackage = function (newPeer) {
        setInitPeer(newPeer)
    }

    useEffect(() => {
        if (initPeer === "") return;
        if (concreteViewport) {
            Promise.all(
                Object.values(layers).map((layer) => {
                    return new Promise((resolve) => {
                        layer.layerObject.scene.canvas.toBlob((file) => {
                            resolve({file, layer: layer.name});
                        });
                    });
                })
            ).then((file) => {
                initPeer.send({
                    action: "SAVE",
                    file
                });
            });
        }
        setInitPeer("")
    }, [initPeer, concreteViewport, layers])


    function receiveInitPackage(data) {
        setInitPackage(data)
    }

    const [initPackage, setInitPackage] = useState("")
    useEffect(() => {

        let layersList = layers
        let visibilities = layerVisibilities

        if (initPackage !== "") {
            initPackage.file.forEach((data) => {
                let newLayer = new Concrete.Layer();
                concreteViewport.add(newLayer);

                let mainSceneContext

                if (layersList[data.layer]) {
                    mainSceneContext = layersList[data.layer].layerContext;
                } else {
                    mainSceneContext = newLayer.scene.context;
                    mainSceneContext.lineCap = brush.lineCap
                    mainSceneContext.lineJoin = brush.lineCap
                    mainSceneContext.lineWidth = brush.lineWidth
                    mainSceneContext.strokeStyle = brush.color

                    layersList[data.layer] = {
                        name: data.layer,
                        layerContext: mainSceneContext,
                        layerObject: newLayer,
                    }
                    setLayerVisibilities(layerVisibilities)
                }

                visibilities[data.layer] = true
                let file = data.file
                let base_image = new Image();
                const bytes = new Uint8Array(file)
                base_image.src = 'data:image/png;base64,' + encode.encode(bytes);
                base_image.onload = function () {
                    mainSceneContext.drawImage(base_image, 0, 0)
                    concreteViewport.render();
                }
            })

            setLayerVisibilities(visibilities)
            setLayers(layersList)
            setInitPackage("")
            setInitPeer("")
        }
    }, [initPackage])


    const [sendLayer, setSendLayer] = useState("")
    React.useEffect(() => {

        if (sendLayer === "") return
        layers[sendLayer].layerObject.scene.canvas.toBlob((data) => {
            let file = [{
                layer: sendLayer,
                file: data
            }]

            broadcastData({
                action: "SAVE",
                file
            })
        })
        setSendLayer("")
    }, [sendLayer])

    // ================================================================
    //                         Image Filtering methods
    // ================================================================


    const [filter, setFilter] = React.useState({})

    React.useEffect(() => {
        if (currentLayer) {
            currentLayer.layerContext.filter = filter
            currentLayer.layerContext.drawImage(currentLayer.layerObject.scene.canvas, 0, 0);
            currentLayer.layerContext.filter = "none"
            broadcastData({action: "FILTER", filter: filter, layer: currentLayer.name})
            concreteViewport.render()
        }
    }, [filter])


    const [updateFilter, setUpdateFilter] = React.useState(true)
    const [receiveFilter, setReceiveFilter] = React.useState("")

    React.useEffect(() => {
        if (receiveFilter !== "") {
            let layer = layers[receiveFilter.layer]
            layer.layerContext.filter = receiveFilter.filter
            layer.layerContext.drawImage(layer.layerObject.scene.canvas, 0, 0);
            layer.layerContext.filter = "none"
            concreteViewport.render()
            setReceiveFilter("")
        }
    }, [updateFilter, receiveFilter])

    // ================================================================
    //                       Anime.js Effect hooks
    // ================================================================
    // animate when new peer list updates
    React.useEffect(() => {
        animationRef.current = anime({
            targets: '.user_list .user_container',
            translateY: [anime.get('user_container', 'y', 'px') + 50, anime.get('user_container', 'y', 'px')],
            delay: anime.stagger(40),
        })
    }, [peerList, clientConnections])

    // ================================================================
    //                       Layer Related Code
    // ================================================================
    function updateCurrentLayer(name) {
        setCurrentLayer(
            {
                name: name,
                layerContext: layers[name].layerContext,
                layerObject: layers[name].layerObject
            }
        )
    }

    function flipVisible(name) {
        layerVisibilities[name] = !layerVisibilities[name]
        setLayerVisibilities(layerVisibilities)
        setUpdateVis(!updateVis)
    }

    React.useEffect(() => {
        if (concreteViewport) {
            Object.keys(layers).map(function (key) {
                layers[key].layerObject.visible = layerVisibilities[layers[key].name]
            })
            concreteViewport.render()
        }
    }, [updateVis])

    const [newLayerName, setNewLayerName] = React.useState("")


    const createLayerBroadcast = function () {
        broadcastData({action: "LAYER_NEW", layer: newLayerName})
        setCreateName(newLayerName)
    }

    const [createName, setCreateName] = useState("")

    React.useEffect(() => {
        if (createName === "") return

        let layer = new Concrete.Layer();
        concreteViewport.add(layer);

        let mainSceneContext2 = layer.scene.context;
        mainSceneContext2.lineCap = brush.lineCap
        mainSceneContext2.lineJoin = brush.lineCap
        mainSceneContext2.lineWidth = brush.lineWidth
        mainSceneContext2.strokeStyle = brush.color

        let a = {...layers}
        a[createName] = {
            name: createName,
            layerContext: mainSceneContext2,
            layerObject: layer,
        }
        setLayers(a)
        layerVisibilities[createName] = true
        setLayerVisibilities(layerVisibilities)
        setUpdateVis(!updateVis)
        layers.comments.layerObject.moveToTop();
        setNewLayerName("")
        setCreateName("")
    }, [createName])


    // ================================================================
    //                       In Picture Comment Related Code
    // ================================================================
    const [receiveCommentData, setReceiveCommentData] = React.useState("")
    const [receiveComment, setReceiveComment] = React.useState(false)

    React.useEffect(() => {

        if (receiveComment) {
            let draw_context = layers.comments.layerContext
            let incomingBrush = receiveCommentData.brush
            draw_context.fillStyle = incomingBrush.color
            draw_context.font = incomingBrush.lineWidth + "px Arial"
            draw_context.fillText(receiveCommentData.text, receiveCommentData.X, receiveCommentData.Y)
            concreteViewport.render()
            setReceiveComment(false)
            setReceiveCommentData("")
        }
    }, [receiveComment, receiveCommentData])


    const [commentText, setCommentText] = React.useState("")
    const popover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">In-Picture Comments</Popover.Title>
            <Popover.Content>
                Type your comment here and click on the canvas to add an in-picture comment. Use the Toolbar to change
                the size and color of your comments.
            </Popover.Content>
        </Popover>
    );

    return (
        <div>
            <div id="workspace" onPaste={handlePaste}>
                <Toolbar clearCanvas={clearCanvas} changeColor={changeColor} changeLineWidth={changeLineWidth}
                         setFilter={(e) => {
                             setFilter(e)
                         }}
                         filter={filter}
                         layer={currentLayer ? (currentLayer.name) : ("")}
                         selectBrush={selectBrush}
                         selectMoveTool={selectMoveTool}
                         scaleImage={scaleImage}
                         rotateImage={rotateImage}
                         isguest={initId === "guest"}
                         saveImage={saveImage}
                         downloadImage={downloadImage}
                />

                <ListGroup className="all_layers">
                    <ListGroup.Item className="new_layer">
                        <input type="text"
                               value={newLayerName}
                               className="new_layer_name"
                               onChange={(e) => setNewLayerName(e.target.value)}
                               placeholder="layer name"/>
                        <BiPlus size={30} onClick={createLayerBroadcast}/>
                    </ListGroup.Item>

                    {Object.keys(layers).reverse().filter(function (key, value) {
                        return key !== "comments"
                    }).map((key, index) => (
                        <ListGroup.Item
                            onClick={() => {
                                updateCurrentLayer(layers[key].name)
                            }}

                            className={currentLayer.name === layers[key].name ? ("layer-primary") : ("")}
                            key={index}
                            value={layers[key].name}> {layers[key].name}
                            <br/>
                            {layerVisibilities[layers[key].name] ?
                                (
                                    <AiFillEye onClick={() => flipVisible(layers[key].name)}/>) : (
                                    (<AiFillEyeInvisible onClick={() => flipVisible(layers[key].name)}/>)
                                )
                            }
                        </ListGroup.Item>
                    ))}


                    {Object.keys(layers).reverse().filter(function (key, value) {
                        return key === "comments"
                    }).map((key, index) => (
                        <ListGroup.Item

                            className={currentLayer.name === layers[key].name ? ("layer-primary") : ("")}
                            key={index}
                            value={layers[key].name}> {layers[key].name}
                            <br/>
                            {layerVisibilities[layers[key].name] ?
                                (
                                    <AiFillEye onClick={() => flipVisible(layers[key].name)}/>) : (
                                    (<AiFillEyeInvisible onClick={() => flipVisible(layers[key].name)}/>)
                                )
                            }

                            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                                <button className="help_button"><AiOutlineQuestionCircle/></button>
                            </OverlayTrigger>

                            <textarea
                                rows="6"
                                value={commentText}
                                className="comment_text_input"
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Your comment here "/>
                        </ListGroup.Item>
                    ))}

                </ListGroup>

                <div
                    id="concreteContainer"
                    ref={concreteContainer}
                    className="canvas"
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                />

                <Modal
                    show={showGuest}
                    onHide={handleCloseGuest}
                    backdrop="static"
                    keyboard={false}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title> Join a room or host one
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <GuestModal onHost={onHost}
                                    onJoin={connectToHost}
                                    handleClose={handleCloseGuest}
                                    guestError={guestError}
                                    setGuestError={setGuestError}
                                    loading={loading}
                                    setLoading={setLoading}
                        />
                    </Modal.Body>
                </Modal>
                <div className="user_panel">
                    <p className="user_panel_header">Users</p>
                    <p className="user_panel_subheader">Share your ID so people can join!</p>
                    {hostConnection ? (
                        <div className="user_list">
                            <UserIcon id={myId} me={true}/>
                            {peerList.map((peer, index) => <UserIcon key={index} id={peer} me={false}/>)}
                        </div>
                    ) : (
                        <div className="user_list">
                            <UserIcon id={myId} me={true}/>
                            {clientConnections.keySeq().toArray().map((peer, index) => <UserIcon key={index} id={peer}
                                                                                                 me={false}/>)}
                        </div>
                    )}
                    <Chat sendMessage={sendMessage} messageList={messageList}/>
                </div>
            </div>
        </div>
    )
}
export default Canvas
