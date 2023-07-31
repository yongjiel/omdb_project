export const FETCH_USER_BEGIN   = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_SUCCESS_EMPTY_RESULT = 'FETCH_USER_SUCCESS_EMPTY_RESULT';

export const fetccUserBegin = (user) => ({
  type: FETCH_USER_BEGIN,
  payload: {user}
});

export const fetccUserSuccess = () => ({
  type: FETCH_USER_SUCCESS
});


export const fetccUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: { error }
});

export function fetccUser(username) {
  return dispatch => {
    dispatch(fetccUserBegin(username));
    const url = `https://localhost:8000/users?username=` + username;
    return fetch(url
            ,{
              headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
              },
              credentials: 'same-origin'
            })
      .then(res => {
        return res.json()
      })
      .then(json => {
        dispatch(fetccUserSuccess(json));
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

export function fetccUserMovieCount(username) {
  return dispatch => {
    dispatch(fetccUserBegin(username));
    const url = `https://localhost:8000/users/count?username=` + username;
    return fetch(url
            ,{
              headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
              },
              credentials: 'same-origin'
            })
      .then(res => {
        return res.json()
      })
      .then(json => {
        dispatch(fetccUserSuccess(json));
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