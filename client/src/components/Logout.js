import { useEffect } from "react";
import { logoutUser } from "../actions/useractions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const Logout = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        fetch('/logout')
        .then(resp => {
            if(!resp.ok) {
                throw new Error(`HTTP error! Status ${resp.status}`)

            }
            return resp.json()
        })
        .then(() => {
            dispatch(logoutUser())
            history.push('/')
            
        })
        .catch(e => {console.error(e)})
    }, [dispatch, history])
}





export default Logout
