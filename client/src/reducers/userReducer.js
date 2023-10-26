import { UPDATE_CURRENT_USER } from "../actions/actionTypes";



const initialState = {
    currentUser: null
}

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_CURRENT_USER:
            return {...state, currentUser: action.payload};
        case 'SET_USER':
            return { ...state, currentUser: action.payload };
        case 'LOGOUT_USER':
            return { ...state, currentUser: null };
        default:
            return state;
    }
};

export default userReducer;
