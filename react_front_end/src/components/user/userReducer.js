
import {
    FETCH_USER_BEGIN,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE
  } from './userActions';
  
  const initialState = {
        username: null,
        loggedIn: false,
        movie_count: 0,
        error: null
  };
  
  export default function userReducer(state = initialState, action) {
    console.log('userReducer', state, action);
    switch(action.type) {
      case FETCH_USER_BEGIN:
        return {
          ...state,
          username: action.payload.username,
          error: null
        };
  
      case FETCH_USER_SUCCESS:
        return {
          ...state,
          loggedIn: true,
          error: null
        };
  
      case FETCH_USER_FAILURE:
        return {
          ...state,
          loggedIn: false,
          error: {"message" : "Could not login user " + this.state.username},
        };
  
      default:
        return state;
    }
  }