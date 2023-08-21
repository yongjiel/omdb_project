import React from "react";
import { connect } from "react-redux";
import { 
    showUsermovies, backtoSearchPart,
    deletmovie, closemodal, openmodal} from "./logInmovieListActions";
import Modal from "react-modal";
import LogOut from "./logout";


class ToSearchList extends React.Component {
    constructor(props) {
      super(props);
      this.show_search_part = this.show_search_part.bind(this);
    }

    show_search_part(){
        this.props.dispatch(backtoSearchPart());
    }
    
    render() {
        return <button onClick={this.show_search_part}  style={{border: "0px", backgroundColor: "#DAFCF7"}}> Back to search </button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToSearchList);


