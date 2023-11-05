import React from "react";
import { Link } from 'react-router-dom'
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBar = () => {
    return(
        <nav>
            <ul className="navbar">
                <h1 className='navbar_title'>Budge-It<FontAwesomeIcon icon={faHandHoldingDollar}/></h1>
                <li><Link to='/addincome'>Add Income</Link></li>
                <li><Link to='comparesavings'>Compare Savings</Link></li>
                <li><Link to='/update'>Update Budgets</Link></li>
                <li><Link to='/addtransactions'>See Transactions</Link></li>
                <li><Link to='/logout'>Logout</Link></li>

            </ul>
        </nav>
    )
}


export default NavBar
