
import {
    FETCH_MOVIE_LIST_BEGIN,
    FETCH_MOVIE_LIST_SUCCESS,
    FETCH_MOVIE_LIST_FAILURE,
    FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT,
    FETCH_USER_BEGIN,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    FETCH_USER_MOVIE_SUCCESS,
    LOG_OUT
  } from './logInmovieListActions';
  
  const initialState = {
        search_text: null,
        search_movies: [],
        page: 0,
        totalPages: 0,
        totalResults: 0,
        username: null,
        loggedIn: false,
        user_movies: ["tt1285016", "tt1285016","tt0186508", "tt0186508"],
        error: null,
  };
  
  export default function logInmovieListReducer(state = initialState, action) {
    console.log('logInmovieListReducer', state, action);
    switch(action.type) {
      case FETCH_MOVIE_LIST_BEGIN:
        return state;

      case FETCH_MOVIE_LIST_SUCCESS:
        return {
          ...state,
          ...action.payload,
        };
      
      case FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT:
        return {
          ...state,
          search_movies: [],
          page: 0,
          totalPages: 0,
          totalResults: 0,
          error: "No movie found."
        };

      case FETCH_MOVIE_LIST_FAILURE:
        return {
          ...initialState,
          error: "Could not fetch movie list ",
        };

        case FETCH_USER_BEGIN:
          return {
            ...state,
            error: null
          };
    
        case FETCH_USER_SUCCESS:
          return {
            ...state,
            username: action.payload.username,
            loggedIn: true,
            error: null
          };
    
      case FETCH_USER_MOVIE_SUCCESS:
        return {
          ...state,
          user_movies: action.payload.movies
        };
  
      case FETCH_USER_FAILURE:
        return {
          ...state,
          loggedIn: false,
          error: action.payload.error,
        };

        case LOG_OUT:
          return {
            ...initialState
          };
      default:
        return state;
    }
  }