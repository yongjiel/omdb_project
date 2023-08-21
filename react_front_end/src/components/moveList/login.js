import React from "react";
import { connect } from "react-redux";
import { fetchUser} from "./logInmovieListActions";
import { Formik, Field, Form } from "formik";


class LogIn extends React.Component {
    constructor(props) {
      super(props);
      this.handleLogInSubmit = this.handleLogInSubmit.bind(this);
      this.get_login_part = this.get_login_part.bind(this);
    }

    login(){
      window.location.replace("/");
    }

    get_user(values){
      this.props.dispatch(fetchUser(values));
    }

    handleLogInSubmit(values){
      this.get_user(values);
    }
  
    get_login_content(){
        let text = "";
          text = (<Formik
                      initialValues={{ username: "example", password: "sample_12" }}
                      onSubmit={async (values) => {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      this.handleLogInSubmit(values);
                      }}
                  >
                      <Form>
                          <table key="login_table">
                              <tbody key="login_tbody">
                          <tr key="user_row"><td><label htmlFor="username">Username:</label></td>
                              <td><Field name="username" label='Userame' type="text" /></td></tr>
                          <tr key='password_row'><td><label htmlFor="password">Password:</label></td>
                              <td><Field name="password" label='password' type="password" /></td></tr>
                              </tbody>
                          </table>
                      <button type="submit">Submit</button>
                      </Form>
                  </Formik>
                  );
  
        return text;
    }

    checkError(){
        if (!!this.props.error){
            const text = (<p style={{backgroundColor: "#F9D1C9"}}>{this.props.error}</p>);
            return text;
        }
        return '';
      }

    get_login_part(){
      return (
        <div>
          <h1>Log in</h1>
          { this.checkError() }
          { this.get_login_content() }
        </div>
      );
    }

    

    render() {
          return this.get_login_part();
      }
}


const mapStateToProps = state => {
  return {
    error: state.logInmovieListReducer.error,
  };
};

export default connect(mapStateToProps)(LogIn);


