import React from "react";
import { connect } from "react-redux";
import {  showUsermovies} from "./logInmovieListActions";


class ToUserMovieList extends React.Component {
    constructor(props) {
      super(props);
      this.show_user_movies = this.show_user_movies.bind(this);
    }

    
    show_user_movies(){
        this.props.dispatch(showUsermovies());
     }
    
    render() {
          return <button
          onClick={this.show_user_movies} style={{border: "0px", backgroundColor: "#DAFCF7"}}>User&lsquo;s movies</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToUserMovieList);


