import React from "react";
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import { formatDate } from "../helpers/dateFormat";


const Export = ( { currentUser }) => {
    const history = useHistory()

    const handleCompareRouteClick = () => {
        history.push('/finance')
    }
    console.log(currentUser.budgets[0].start_date)
    return <><div className="export_background"><Link to='/logout'>Logout</Link><div className="export_description">
    <h1>Hey {currentUser.username}! Thanks for using Budge-It to help track your spending from {formatDate(currentUser.budgets[0].start_date)} to {formatDate(currentUser.budgets[0].end_date)}! Make sure to go to your financial summary to review your budgets and transactions of this timeframe!
    
    </h1></div><button onClick={() => handleCompareRouteClick()}>Financial Summary</button></div></>
}


export default Export
