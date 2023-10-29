import React from "react";
import { Link } from 'react-router-dom'


const NavBar = ( { currentUser } ) => {
    return(
        <nav>
            <ul>
                <li><Link to='/piecharts'>Homepage</Link></li>
                <li><Link to='/addincome'>Add Income</Link></li>
                <li><Link to='/update'>Update Budgets</Link></li>
                <li><Link to='/addtransactions'>Add Transactions</Link></li>
                <li><Link to='/logout'>Logout</Link></li>

            </ul>
        </nav>
    )
}


export default NavBar