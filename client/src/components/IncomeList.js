import React from "react";
import { formatDate } from "../helpers/dateFormat";


const IncomeList = ( { currentUser } ) => {


    return (<div className='income_table_container'>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {currentUser.income.map((i) => (
                    <tr key={i.id}>
                        <td>{formatDate(i.date)}</td>
                        <td>{i.description}</td>
                        <td>{i.amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>)
}


export default IncomeList
