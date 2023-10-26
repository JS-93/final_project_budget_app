import { UPDATE_CURRENT_USER } from "./actionTypes";

export const setUser = (user) => ({
    type: 'SET_USER',
    payload: user
});

export const logoutUser = () => ({
    type: 'LOGOUT_USER'
})

export const updateCurrentUser = (updatedUser) => ({
    type: UPDATE_CURRENT_USER,
    payload: updatedUser
})
