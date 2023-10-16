import React from "react";
import { connect } from "react-redux";
import MovieList from "./movielist";
import { cookies} from "../../redux/actions/actions";


class LogInMovieList extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return <MovieList navigate={this.props.navigate}/>;
    }

}


const mapStateToProps = state => {
  return {
    show_user_movies_flag: state.logInmovieListReducer.show_user_movies_flag,
    loggedIn: state.logInmovieListReducer.loggedIn,
    user_movies: state.logInmovieListReducer.user_movies,
    error: state.logInmovieListReducer.error
  };
};

export default connect(mapStateToProps)(LogInMovieList);


