
import {
    FETCH_MOVIE_LIST_BEGIN,
    FETCH_MOVIE_LIST_SUCCESS,
    FETCH_MOVIE_LIST_FAILURE,
    FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT
  } from './movieListActions';
  
  const initialState = {
        search_text: null,
        movies: [],
        page: 0,
        totalPages: 0,
        totalResults: 0,
        error: null,
        // TODO, move to userReducer.
        userMovieList: ["tt1285016", "tt1285016","tt0186508", "tt0186508", "tt0186508"],
        user: 'fakeUser',
        
  };
  
  export default function movieListReducer(state = initialState, action) {
    console.log('movieListReducer', state, action);
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
          ...initialState,
          ...action.payload,
        };

      case FETCH_MOVIE_LIST_FAILURE:
        return {
          ...initialState,
          error: "Could not fetch movie list ",
        };
  
      default:
        return state;
    }
  }