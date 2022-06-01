import {Link} from 'react-router-dom'

const ButtonLink = (props) => {
    return (
        <button className="btn"><Link to={props.link}> {props.text} </Link></button>
    )
}
export default ButtonLink