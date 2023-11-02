import React from "react";
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";


const Export = ( { currentUser }) => {
    const history = useHistory()

    const handleCompareRouteClick = () => {
        history.push('/finance')
    }

    return <><Link to='/logout'>Logout</Link><h1>Hello from export</h1><button onClick={() => handleCompareRouteClick()}>Financial Summary</button></>
}


export default Export
