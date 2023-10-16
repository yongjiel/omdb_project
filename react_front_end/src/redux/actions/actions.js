import {
  fetchMoviesByPageNumber

} from "../api/todo-api";

import axios from "axios";
import Cookies from 'universal-cookie';
export const cookies = new Cookies();



export const FETCH_MOVIE_LIST_BEGIN   = 'FETCH_MOVIE_LIST_BEGIN';
export const FETCH_MOVIE_IN_PROGRESS = 'FETCH_MOVIE_IN_PROGRESS';
export const FETCH_MOVIE_LIST_SUCCESS = 'FETCH_MOVIE_LIST_SUCCESS';
export const FETCH_MOVIE_LIST_FAILURE = 'FETCH_MOVIE_LIST_FAILURE';
export const FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT = 'FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT';
export const BACK_TO_SEARCH_PART = "BACK_TO_SEARCH_PART";

export const fetchMovieListBegin = (text, page) => ({
  type: FETCH_MOVIE_LIST_BEGIN,
  payload: {search_text: text,
            page: page}
});

export const fetchMovieListInProgress = (payload) => ({
  type: FETCH_MOVIE_IN_PROGRESS,
  payload: payload
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

export const backToSearchPart  = () => ({
  type: BACK_TO_SEARCH_PART
});

export function backtoSearchPart() {
  return dispatch => {
    dispatch(backToSearchPart());
  }
}

function fetchMoviesByPage(moviePartialText, page) {
  
  return async(dispatch) => {
    
    try{
      const st = await fetchMoviesByPageNumber(moviePartialText, page)
      dispatch(fetchMovieListSuccess(st));
      if (st.page !== st.totalPages){
        dispatch(fetchMovieListInProgress({page: st.page}));
      }
    }catch(error){
        dispatch(fetchMovieListFailure({error: error.message}));
    };

  }
}

export function fetchMovieList(text, page) {
  return dispatch => {
    if (! text){
      dispatch(fetchMovieListSuccessEmptyResult("Error: Search Box could not be empty"));
      return;
    }
    dispatch(fetchMovieListBegin(text, page));
    dispatch(fetchMoviesByPage(text, page));
  };
}

export const FETCH_USER_BEGIN   = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_SUCCESS_EMPTY_RESULT = 'FETCH_USER_SUCCESS_EMPTY_RESULT';
export const FETCH_USER_MOVIE_SUCCESS = 'FETCH_USER_MOVIE_SUCCESS';
export const LOG_OUT = 'LOG_OUT';
export const ADD_MOVIE = 'ADD_MOVIE';
export const SHOW_USER_MOVIES = "SHOW_USER_MOVIES";
export const DELETE_MOVIE = "DELETE_MOVIE";
export const ADD_MOVIE_SUCCESS = 'ADD_MOVIE_SUCCESS';
export const ADD_MOVIE_FAILURE = 'ADD_MOVIE_FAILURE';
export const DELETE_MOIVIE_FAILURE = 'DELETE_MOIVIE_FAILURE';
export const DELETE_MOIVIE_SUCCESS = 'DELETE_MOIVIE_SUCCESS';
export const ADD_MOVIE_ENTIRE_RECORD = 'ADD_MOVIE_ENTIRE_RECORD';
export const CLOSE_MODAL = "CLOSE_MODAL";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLEAR_SEARCH_MOVIES = "CLEAR_SEARCH_MOVIES";

export const closeModal = () => ({
  type: CLOSE_MODAL
});

export const openModal = (imdbID)  => ({
  type: OPEN_MODAL,
  payload: {imdbID}
});

export const fetccUserBegin = () => ({
  type: FETCH_USER_BEGIN
});

export const fetccUserSuccess = () => ({
  type: FETCH_USER_SUCCESS
});

export const fetchUserMovieSuccess = (movies) =>({
  type: FETCH_USER_MOVIE_SUCCESS,
  payload: {movies}
});

export const addMovieToUserMovies = (post) =>({
  type: ADD_MOVIE,
  payload: {post}
});

export const addMovieSuccess = () =>({
  type: ADD_MOVIE_SUCCESS
});

export const addMovieFailure = () => ({
  type: ADD_MOVIE_FAILURE
});

export const showUserMovies = ()=> ({
  type: SHOW_USER_MOVIES
});

export const clearSearchMovies = ()=>({
  type: CLEAR_SEARCH_MOVIES
});

export const fetccUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: { error }
});

export const logOut = () => ({
  type: LOG_OUT
});

export const deleteMovie = (i) => ({
  type: DELETE_MOVIE,
  payload: {i}
});

export const deleteMovieSuccess =()=>({
  type: DELETE_MOIVIE_SUCCESS
});

export const deleteMovieFailure =()=>({
  type: DELETE_MOIVIE_FAILURE
});

export const addMovieEntireRecord =(data)=>({
  type: ADD_MOVIE_ENTIRE_RECORD,
  payload:  {data}
});

export function closemodal(){
  return dispatch => {
    dispatch(closeModal())};
}

export function openmodal(imdbID){
  return dispatch => {
    dispatch(openModal(imdbID))};
}

export function logout(){
  return dispatch => {
    dispatch(logOut())};
}

export function add_movie_entire_record(data){
  return dispatch => {
    dispatch(addMovieEntireRecord(data));
  }
}

export function addmovie(post, navigate){
  return dispatch => {
    dispatch(addMovieToUserMovies(post));
    const url = `https://www.omdbapi.com/?apikey=6ca48b3b&i=` + post.imdbID;
    axios.get(url)
          .then(res => {
              dispatch(add_movie_entire_record(res.data));
              const url = `http://127.0.0.1:8000/api/movies`;
              fetch(url
                      ,{
                        headers: {
                          'Content-type': 'application/json',
                          'Accept': 'application/json',
                          'Authorization': 'Bearer ' + cookies.get("token"),
                        },
                        method: "POST",
                        body: JSON.stringify(res.data)
                      })
              .then(res => {
                if ( [200, 201].includes(res.status) ) {
                    dispatch(addMovieSuccess());
                } else {
                    if ( [401].includes(res.status) ) {
                      alert("Token timeout! Back to login")
                      dispatch(logOut());
                      navigate("/login");
                    }else{
                      dispatch(addMovieFailure());
                    }
                   
                }
              })
              .catch(
                error => {
                  console.log(error);
                }
              );
    });
  }
}

export function deletmovie(i, imdbID, navigate){
  return dispatch => {
    dispatch(deleteMovie(i));
    const url = `http://127.0.0.1:8000/api/movies/`+imdbID;
              fetch(url
                ,{
                  headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + cookies.get("token"),
                  },
                  method: "DELETE"
                })
              .then(res => {
                if ( [204].includes(res.status) ) {
                    dispatch(deleteMovieSuccess());
                } else {
                    if ( [401].includes(res.status) ){
                      alert("Token timeout! Back to login");
                      dispatch(logOut());
                      navigate('/login');
                    }else{
                      dispatch(deleteMovieFailure());
                    }
                    
                }
              })
              .catch(
                error => {
                  console.log(error);
                }
              );
  }
}

export function showUsermovies(){
  return dispatch => {
    dispatch(showUserMovies());
  }
}


function getToken(value) {
  const url = `http://localhost:8000/api/token/?format=json`;
  return axios.post(url, {
    username: value.username,
    password: value.password
  }).then(res=>{
    console.log(res);
    return res.data;
  }).catch(
    error => {
      console.log(error);
      return "Could not get token";
    }
  );
}

 function getUserMovieList(token){
  const url = "http://127.0.0.1:8000/api/userlist/?format=json";
  const config = {
    headers: { 
      //Authorization: `Token ${token}` // for normal token
      Authorization: `Bearer ${token}`
    }  
  };
  return axios.get(url, config)
          .then(res=>{
            return res.data;
          })
          .catch(
            error => {
              console.log(error);
            }
          );
}

function is_not_in_user_movies(mvs, id){
  return mvs.filter(m => m.imdbID === id).length === 0;
}

export function get_movie_list(token, mvs, navigate, uri) {
  return dispatch => {
    if (token === null){
      dispatch(fetccUserFailure("Could not get user's movies"));
      return;
    }
    getUserMovieList(token)
    .then(movies=> {
      movies.map(m => {
        if ( is_not_in_user_movies(mvs, m.imdbID) ){
          dispatch(addmovie(m));
        }
      });
      cookies.set('token', token);
      dispatch(fetccUserSuccess());
      if (navigate !== null){
        navigate(uri);
      }
      return movies;
    }).catch(
      error => {
        console.log(error);
        dispatch(fetccUserFailure("Could not get user's movies"));
      }
    );
  };
}

export function fetchUser(value, mvs, navigate, uri) {
  return dispatch => {
    dispatch(fetccUserBegin(value));
    
    getToken(value)
        .then(data => {
          dispatch(get_movie_list(data.access, mvs, navigate, uri)); // for jwt token
          //    dispatch(get_movie_list(data.key, mvs, navigate, uri)); // for normal token
              //dispatch(fetchUserMovieSuccess(mvss)); //search_movies for loading 10 records from source site.
              return data.key;
          })
      .catch(
        error => {
          console.log(error);
          dispatch(fetccUserFailure(error));
        }
      );
  };

}