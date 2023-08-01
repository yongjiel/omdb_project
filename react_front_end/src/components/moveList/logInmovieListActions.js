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
                            search_movies: newPosts,
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

export const FETCH_USER_BEGIN   = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_SUCCESS_EMPTY_RESULT = 'FETCH_USER_SUCCESS_EMPTY_RESULT';
export const FETCH_USER_MOVIE_SUCCESS = 'FETCH_USER_MOVIE_SUCCESS';
export const LOG_OUT = 'LOG_OUT';

export const fetccUserBegin = () => ({
  type: FETCH_USER_BEGIN
});

export const fetccUserSuccess = (username) => ({
  type: FETCH_USER_SUCCESS,
  payload: {username}
});

export const fetccUserMovieSuccess = (movies) =>({
  type: FETCH_USER_MOVIE_SUCCESS,
  payload: {movies}
});


export const fetccUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: { error }
});

export const logOut = () => ({
  type: LOG_OUT
});

export function logout(){
  return dispatch => {
    dispatch(logOut())};
}

export function fetchUser(value) {
  return dispatch => {
    dispatch(fetccUserBegin(value));
    const url = `http://127.0.0.1:8000/api/users/?format=json`;
    return fetch(url
            ,{
              headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic ' + btoa(value.username + ":" + value.password),
              },
              credentials: 'same-origin'
            })
      .then(res => {
        if (res.status === 200) {
            dispatch(fetccUserSuccess(value.username));
            //dispatch(fetccUserMovieCount(value.username, value.password));
            return {username: value.username};
        } else {
          dispatch(fetccUserFailure("User credential not correct!"))
        }
        
      })
      .catch(
        error => {
          console.log(error);
          dispatch(fetccUserFailure(error))
        }
      );
  };
}

export function fetccUserMovieCount(username, password) {
  return dispatch => {
    const url = `http://127.0.0.1:8000/usermovie/`;
    return fetch(url
            ,{
              headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ":" + password),
              },
              credentials: 'same-origin'
            })
      .then(res => {
        return res.json()
      })
      .then(json => {
        dispatch(fetccUserMovieSuccess(json));
        return json.data;
      })
      .catch(
        error => {
          console.log(error);
          dispatch(fetccUserFailure(error))
        }
      );
  };
}
