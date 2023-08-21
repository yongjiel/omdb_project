import React from "react";
import { connect } from "react-redux";
import LogIn from "./login";
import MovieList from "./movielist";
import UserMovieList from "./usermovielist";

class LogInMovieList extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      if (this.props.show_user_movies_flag){
        return <UserMovieList />;
      }else if (this.props.loggedIn ){
          return <MovieList />;
      }else{
          return <LogIn />;
      }

    }

}


const mapStateToProps = state => {
  return {
    show_user_movies_flag: state.logInmovieListReducer.show_user_movies_flag,
    loggedIn: state.logInmovieListReducer.loggedIn,
  };
};

export default connect(mapStateToProps)(LogInMovieList);


