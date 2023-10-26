import React, { useState, useEffect } from "react";

const CatBudgets = ( { currentUser } ) => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch('/categories')
        .then(resp => resp.json())
        .then(data => {
            setCategories(data)
        })
        .catch(e => console.error(e))
    }, [])

console.log(currentUser.income)



    return <h1>Hello from cat budgets</h1>
}

export default CatBudgets
