import React from 'react'
import {Button, ListGroup, OverlayTrigger, Popover} from "react-bootstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {BsArrowsAngleExpand, BsFillDropletFill, BsFillBrightnessAltLowFill} from "react-icons/bs/index"; // scale, blur
import {ImEnlarge, ImLoop2, ImDroplet, ImContrast, ImBrightnessContrast} from "react-icons/im/index";
import {CgDropInvert} from "react-icons/cg/index"
import {MdTransform, MdBlurOn} from "react-icons/md/index"
import {GoSettings} from "react-icons/go/index"
import {VscSymbolColor} from "react-icons/vsc/index"
import {Dropdown} from "react-bootstrap";
import {IoIosContrast} from "react-icons/io/index";
import {BsArrowsFullscreen, BsArrowRepeat} from "react-icons/bs/index";
import '../style/toolbar.css'
import {AiOutlineQuestionCircle} from "react-icons/ai/index";
import {RiContrastDropLine} from "react-icons/ri/index";
import {FaPencilAlt, FaRegHandPaper} from "react-icons/fa/index";

const Toolbar = ({clearCanvas, changeColor, changeLineWidth, setFilter, selectBrush, selectMoveTool, scaleImage, rotateImage, isguest, saveImage, downloadImage}) => {


    const [brushColor, setBrushColor] = React.useState("#000000")
    const [brushSize, setBrushSize] = React.useState(10)
    const [blur, setBlur] = React.useState(0)
    const [contrast, setContrast] = React.useState(100)
    const [brightness, setBrightness] = React.useState(100)
    const [saturation, setSaturation] = React.useState(100)
    const [sepia, setSepia] = React.useState(0)
    const [grey, setGrey] = React.useState(0)
    const [scale, setScale] = React.useState(100)
    const [rotation, setRotation] = React.useState(0)

    const [brushSelected, setBrushSelected] = React.useState(true)
    const [moveToolSelected, setMoveToolSelected] = React.useState(false)


    const [showImageOptions, setShowImageOptions] = React.useState(false)

    let apply_filter = function () {
        let blur_string = "blur(" + blur + "px) "
        let contrast_string = "contrast(" + contrast + "%) "
        let brightness_string = "brightness(" + brightness + "%) "
        let saturation_string = "saturate(" + saturation + "%) "
        let sepia_string = "sepia(" + sepia + "%) "
        let grey_string = "grayscale(" + grey + "%) "

        let final_string = blur_string + contrast_string + brightness_string + saturation_string + sepia_string + grey_string

        setFilter(final_string)

        setBlur(0)
        setContrast(100)
        setBrightness(100)
        setSaturation(100)
        setSepia(0)
        setGrey(0)
    }

    const apply_scale = () => {
        scaleImage(scale)
        setScale(100)
    }

    const apply_rotate = () => {
        rotateImage(rotation)
        setRotation(0)
    }

    const brushOnClick = () => {
        setBrushSelected(true)
        setMoveToolSelected(false)
        selectBrush()
    }

    const moveToolOnClick = () => {
        setMoveToolSelected(true)
        setBrushSelected(false)
        selectMoveTool()
    }

    const popover_scale = (
        <Popover>
            <Popover.Title as="h3">Scale {scale}%</Popover.Title>
            <Popover.Content>
                <input type="range" onChange={(e) => setScale(parseInt(e.target.value))} defaultValue="100"
                       className="custom-range" min="0" max="200" step="1"
                       value={scale} name="scale"/>
                <button className=" btn-sm " onClick={apply_scale}> Apply</button>
            </Popover.Content>
        </Popover>
    );

    const popover_rotation = (
        <Popover>
            <Popover.Title as="h3">Rotation: {rotation}°</Popover.Title>
            <Popover.Content>
                <input type="range" onChange={(e) => setRotation(parseInt(e.target.value))} defaultValue="0"
                       className="custom-range" min="-180" max="180" step="10"
                       value={rotation} name="rotation"/>
                <button className=" btn-sm " onClick={apply_rotate}> Apply</button>
            </Popover.Content>
        </Popover>
    );

    const popover_blur = (
        <Popover>
            <Popover.Title as="h3">Blur: {blur}px</Popover.Title>
            <Popover.Content>
                <input type="range" onChange={(e) => setBlur(parseInt(e.target.value))} defaultValue="0"
                       className="custom-range" min="0" max="40"
                       value={blur} id="blur"/>
                <button className=" btn-sm " onClick={apply_filter}> Apply</button>

            </Popover.Content>
        </Popover>
    );

    const popover_contrast = (
        <Popover>
            <Popover.Title as="h3">Contrast: {contrast}%</Popover.Title>
            <Popover.Content>
                <input type="range" onChange={(e) => setContrast(parseInt(e.target.value))}
                       defaultValue="100"
                       className="custom-range" min="0" max="1200"
                       value={contrast} step="50" id="contrast"/>
                <button className=" btn-sm " onClick={apply_filter}> Apply</button>
            </Popover.Content>
        </Popover>
    );


    const popover_brightness = (
        <Popover>
            <Popover.Title as="h3">Brightness: {brightness}%</Popover.Title>
            <Popover.Content>
                <input type="range" onChange={(e) => setBrightness(parseInt(e.target.value))}
                       defaultValue="100"
                       className="custom-range" min="0" max="500"
                       value={brightness} step="50" id="brightness"/>
                <button className=" btn-sm " onClick={apply_filter}> Apply</button>
            </Popover.Content>
        </Popover>
    );

    const popover_saturation = (
        <Popover>
            <Popover.Title as="h3">Saturation: {saturation}%</Popover.Title>
            <Popover.Content>
                <input type="range" onChange={(e) => setSaturation(parseInt(e.target.value))}
                       defaultValue="100"
                       className="custom-range" min="100" max="1000"
                       value={saturation} step="100" id="saturation"/>
                <button className=" btn-sm " onClick={apply_filter}> Apply</button>

            </Popover.Content>
        </Popover>
    );

    const popover_sepia = (
        <Popover>
            <Popover.Title as="h3">Sepia: {sepia}%</Popover.Title>
            <Popover.Content>
                <input type="range" onChange={(e) => setSepia(parseInt(e.target.value))}
                       defaultValue="0"
                       className="custom-range" min="0" max="100"
                       value={sepia} step="10" id="sepia"/>
                <button className=" btn-sm " onClick={apply_filter}> Apply
                </button>
            </Popover.Content>
        </Popover>
    );

    const popover_grey = (
        <Popover>
            <Popover.Title as="h3"> Grey: {grey}%</Popover.Title>
            <Popover.Content>
                <input type="range" onChange={(e) => setGrey(parseInt(e.target.value))} defaultValue="0"
                       className="custom-range" min="0" max="100" step="10"
                       value={grey} name="grey"/>
                <button className=" btn-sm " onClick={apply_filter}> Apply</button>
            </Popover.Content>
        </Popover>
    );

    // NOTE: for some reason, even though it shouldn't, onChange is firing constantly;
    // hinders performance a lot
    // the other div for if it is guest should be a button that lets the user save the image to their computer
    return (
        <div className="toolbar">
            <div className="tool_category">File</div>
            {!isguest ? (<Button onClick={saveImage} variant="success">Save Image</Button>) : (<div/>)}
            <Button onClick={downloadImage} variant="warning">Download Image</Button>

            <div className="tool_category">Tools</div>
            <button className={moveToolSelected ? "btn btn-primary" : "btn btn-outline-primary"}
                    onClick={moveToolOnClick}><FaRegHandPaper size={30}/>
            </button>

            <button className={brushSelected ? "btn btn-primary" : "btn btn-outline-primary"}
                    onClick={brushOnClick}><FaPencilAlt size={30}/>
            </button>

            <div className="tool_category">Brush Settings</div>
            <div className="tool_subcategory">Color: {brushColor}</div>
            <input className="color_picker" type="color" onChange={changeColor}
                   onInput={(e) => setBrushColor(e.target.value)}/>

            <div className="tool_subcategory">Size: {brushSize}</div>
            <input type="range" className="custom-range" min="1" max="100" defaultValue="10"
                   onChange={changeLineWidth}
                   onInput={(e) => setBrushSize(parseInt(e.target.value))}/>

            <button className="image_filters" onClick={() => {
                setShowImageOptions(!showImageOptions)
            }}>Image Options
            </button>
            {showImageOptions ? (
                <div>
                    <p className="tool_category"> Transformations</p>
                    <div className="toolbar_icon_row">
                        <OverlayTrigger trigger="click" placement="right" overlay={popover_scale}>
                            <button className="icon_button"><BsArrowsFullscreen size={35}/></button>
                        </OverlayTrigger>

                        <OverlayTrigger trigger="click" placement="right" overlay={popover_rotation}>
                            <button className="icon_button"><BsArrowRepeat size={35}/></button>
                        </OverlayTrigger>
                    </div>


                    <p className="tool_category">Adjustments</p>

                    <div className="toolbar_icon_row">
                        <OverlayTrigger trigger="click" placement="right" overlay={popover_blur}>
                            <button className="icon_button"><MdBlurOn size={35}/></button>
                        </OverlayTrigger>

                        <OverlayTrigger trigger="click" placement="right" overlay={popover_contrast}>
                            <button className="icon_button"><IoIosContrast size={35}/></button>
                        </OverlayTrigger>
                    </div>



                    <div className="toolbar_icon_row">
                        <OverlayTrigger trigger="click" placement="right" overlay={popover_brightness}>
                            <button className="icon_button"><BsFillBrightnessAltLowFill size={35}/></button>
                        </OverlayTrigger>

                        <OverlayTrigger trigger="click" placement="right" overlay={popover_saturation}>
                            <button className="icon_button"><RiContrastDropLine size={35}/></button>
                        </OverlayTrigger>
                    </div>


                    <div className="toolbar_text_options" >
                        <OverlayTrigger trigger="click" placement="top" overlay={popover_sepia}>
                            <Button className="btn-primary sepia-button">Sepia </Button>
                        </OverlayTrigger>

                        <OverlayTrigger trigger="click" placement="top" overlay={popover_grey}>
                            <Button className="btn-primary grey-button">Grey </Button>
                        </OverlayTrigger>
                    </div>

                </div>
            ) : (<div/>)}

            <button type="button" className="btn btn-danger" onClick={clearCanvas}>Clear</button>
        </div>
    )
}

export default Toolbar
