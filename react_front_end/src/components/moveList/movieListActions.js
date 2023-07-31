import axios from "axios";

export const FETCH_MOVIE_LIST_BEGIN   = 'FETCH_MOVIE_LIST_BEGIN';
export const FETCH_MOVIE_LIST_SUCCESS = 'FETCH_MOVIE_LIST_SUCCESS';
export const FETCH_MOVIE_LIST_FAILURE = 'FETCH_MOVIE_LIST_FAILURE';
export const FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT = 'FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT';

export const fetchMovieListBegin = (text, page) => ({
  type: FETCH_MOVIE_LIST_BEGIN,
  payload: {search_text: text,
            page: page}
});

export const fetchMovieListSuccess = state => ({
  type: FETCH_MOVIE_LIST_SUCCESS,
  payload: { ...state }
});

export const fetchMovieListSuccessEmptyResult = error => ({
    type: FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT,
    payload: { error } 
});

export const fetchMovieListFailure = error => ({
  type: FETCH_MOVIE_LIST_FAILURE,
  payload: { error }
});

export function fetchMovieList(text, page) {
  return dispatch => {
    if (! text){
      dispatch(fetchMovieListSuccessEmptyResult("Error: Search Box could not be empty"));
      return;
    }
    dispatch(fetchMovieListBegin(text, page));
    const url = `https://www.omdbapi.com/?apikey=6ca48b3b&type=movie&s=`+text+`&page=`+ page;
    axios.get(url)
          .then(res => {
            if (res.data.hasOwnProperty('Error') && !!res.data.Error){
              dispatch(fetchMovieListSuccessEmptyResult(res.data.Error));
              return res.data;
            }else{
              const newPosts = res.data.Search;
              const totalPages = Math.ceil(res.data.totalResults/10.0);
              const state = {search_text: text,
                            movies: newPosts,
                            page: page,
                            totalPages: totalPages,
                            totalResults: res.data.totalResults,
                            error: null}
              dispatch(fetchMovieListSuccess(state));
              return state;
            }
            
          }).catch(error => {
            dispatch(fetchMovieListFailure({error: error.message}));
          });
  };
}
