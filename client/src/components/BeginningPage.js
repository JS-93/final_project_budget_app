import React from "react";
import Login from "./Login";
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const BeginningPage = () => {

    return (
    
    <div className='background'><div className='background_wrapper'>
        <FontAwesomeIcon icon={faHandHoldingDollar} className='dollar'/>
        <h1 className='title'>Welcome to Budge_It!</h1>
        <h3 className='title_sub_heading'>Track your spending and help budge the uneccessary transactions right out of your life!</h3>
        <Login/>
    </div></div>)
}


export default BeginningPage
