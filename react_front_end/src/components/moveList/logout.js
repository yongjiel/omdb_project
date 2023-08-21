import React from "react";
import { connect } from "react-redux";
import { logout, cookies} from "./logInmovieListActions";


class LogOut extends React.Component {
    constructor(props) {
      super(props);
      this.logout = this.logout.bind(this);
    }


    logout(){
      cookies.remove("token")
      this.props.dispatch(logout());
      window.location.replace("/");
    }

    render() {
        return <button onClick={this.logout} style={{border: "0px", backgroundColor: "#DAFCF7"}}>Log Out</button>;  
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(LogOut);


