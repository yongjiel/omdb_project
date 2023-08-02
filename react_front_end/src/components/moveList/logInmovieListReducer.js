
import {
    FETCH_MOVIE_LIST_BEGIN,
    FETCH_MOVIE_LIST_SUCCESS,
    FETCH_MOVIE_LIST_FAILURE,
    FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT,
    FETCH_USER_BEGIN,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    FETCH_USER_MOVIE_SUCCESS,
    LOG_OUT,
    ADD_MOVIE,
    SHOW_USER_MOVIES,
    BACK_TO_SEARCH_PART,
    DELETE_MOVIE,
    ADD_MOVIE_FAILURE,
    ADD_MOVIE_SUCCESS,
    DELETE_MOIVIE_FAILURE,
    DELETE_MOIVIE_SUCCESS
  } from './logInmovieListActions';
  
  const initialState = {
        search_text: null,
        search_movies: [],
        page: 0,
        totalPages: 0,
        totalResults: 0,
        username: null,
        password: null,
        loggedIn: false,
        user_movies: [],
        user_mvoives_save: [],
        error: null,
        show_user_movies_flag: false,
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
          username: state.username,
          show_user_movies_flag: false
        };
      
      case FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT:
        return {
          ...state,
          search_movies: [],
          page: 0,
          totalPages: 0,
          totalResults: 0,
          error: "No movie found.",
          show_user_movies_flag: false
        };

      case FETCH_MOVIE_LIST_FAILURE:
        return {
          ...initialState,
          error: "Could not fetch movie list ",
          show_user_movies_flag: false
        };

        case FETCH_USER_BEGIN:
          return {
            ...state,
            error: null,
            show_user_movies_flag: false
          };
    
        case FETCH_USER_SUCCESS:
          return {
            ...state,
            username: action.payload.username,
            password: action.payload.password,
            loggedIn: true,
            error: null,
            show_user_movies_flag: false
          };
    
      case FETCH_USER_MOVIE_SUCCESS:
        return {
          ...state,
          user_movies: action.payload.movies,
          show_user_movies_flag: false
        };
  
      case FETCH_USER_FAILURE:
        return {
          ...state,
          loggedIn: false,
          error: action.payload.error,
          show_user_movies_flag: false
        };

      case LOG_OUT:
          return {
            ...initialState
          };
      
      case ADD_MOVIE:
        return {
          ...state,
          user_movies: [...state.user_movies, action.payload.post],
          show_user_movies_flag: false
        }
      
      case ADD_MOVIE_SUCCESS:
        return {
          ...state,
          user_mvoives_save: [...state.user_mvoives_save, true],
          show_user_movies_flag: false
        }
      
      case ADD_MOVIE_FAILURE:
        return {
          ...state,
          user_mvoives_save: [...state.user_mvoives_save, false],
          show_user_movies_flag: false
        }

      case SHOW_USER_MOVIES:
        return {
          ...state,
          show_user_movies_flag: true
        }
      
      case BACK_TO_SEARCH_PART:
        return {
          ...state,
          show_user_movies_flag: false
        }
      
      case DELETE_MOVIE:
        return {
          ...state,
          user_movies: [...state.user_movies.slice(0, action.payload.i),
                        ...state.user_movies.slice(action.payload.i+1)],
          user_mvoives_save: [...state.user_mvoives_save.slice(0, action.payload.i),
                              ...state.user_mvoives_save.slice(action.payload.i+1)],
          show_user_movies_flag: true
        }
      case DELETE_MOIVIE_FAILURE:
        return {
          ...state,
          show_user_movies_flag: true
        }

      case DELETE_MOIVIE_SUCCESS:
          return {
            ...state,
            show_user_movies_flag: true
          }
      default:
        return state;
    }
  }