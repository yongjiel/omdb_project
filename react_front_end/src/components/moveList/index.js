import React from "react";
import { connect } from "react-redux";
import SearchBox from "../searchBox";
import { 
    fetchMovieList, fetchUser, logout,
    addmovie, showUsermovies, backtoSearchPart,
    deletmovie} from "./logInmovieListActions";
import { Formik, Field, Form } from "formik";


class LogInMovieList extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
      this.logout = this.logout.bind(this);
      this.handleLogInSubmit = this.handleLogInSubmit.bind(this);
      this.checkUserList = this.checkUserList.bind(this);
      this.show_user_movies = this.show_user_movies.bind(this);
      this.show_search_part = this.show_search_part.bind(this);
      this.delete = this.delete.bind(this);
    }

    get_list(text, page){
      this.props.dispatch(fetchMovieList(text, page));
    }

    handleSearchSubmit(e){
      e.preventDefault();
      const form = e.target;
      this.get_list(form.search.value, 1);
    }

    save(post){
      //alert(JSON.stringify(post, null, 2));
      //console.log(JSON.stringify(post, null, 2))
      this.props.dispatch(addmovie(post, this.props.user, this.props.password));
    }

    delete(post){
      let index = this.props.user_movies.indexOf(post);
      this.props.dispatch(deletmovie(index, post.imdbID, this.props.user, this.props.password));
    }

    show_user_movies(){
      this.props.dispatch(showUsermovies());
    }

    checkUserList(){
        if (!!this.props.user_movies && this.props.user_movies.length >= 5){
          const text = (<p style={{backgroundColor: "#F9D1C9"}}> User {this.props.user} has 5 or more records! Please check <button
            onClick={this.show_user_movies} style={{border: "0px", backgroundColor: "#DAFCF7"}}>{this.props.user}&lsquo;s movies</button></p>);

          return text;
        }
        return '';
    }

    check_in_user_movies(imdbID){
      if (this.props.user_movies.length === 0){
        return false;
      }
      let tmp = this.props.user_movies.map((each)=> each.imdbID);
      if (tmp.includes(imdbID)){
        return true;
      }
      return false;
    }

    logout(){
      this.props.dispatch(logout());
      window.location.replace("/");
    }

    login(){
      window.location.replace("/");
    }

    show_logout_button(){
        return <button onClick={this.logout} style={{border: "0px", backgroundColor: "#DAFCF7"}}>Log Out</button>;            
    }

    show_search_part(){
        this.props.dispatch(backtoSearchPart());
    }

    get_content(){
      let text = "";
      if (!this.props.error && this.props.search_movies.length > 0){
        text = (<table key='table'>
                <tbody key='tbody'>
                <tr key='head_row'><th style={{textAlign: 'left'}}>Title</th><th style={{textAlign: 'left'}}>Year</th><th>Save?</th></tr>
                  {this.props.search_movies.map((post, i) => (
                    <tr key={'row'+i}>
                    <td key={post.imdbID} style={{width: '600px'}}>
                      {post.Title}
                    </td>
                    <td style={{width: '150px'}}>{post.Year}</td>
                    <td><button onClick={()=>this.save(post)}
                              disabled={ 
                                (this.check_in_user_movies(post.imdbID) || this.props.user_movies.length >=5)? true: false}>
                        Save</button></td>
                    </tr>
                  ))}
                </tbody>
                </table>);
      } else {
        text = (<p> {this.props.error}</p>);
      }

      return text;
    }

    checkError(){
      if (!!this.props.error){
          const text = (<p style={{backgroundColor: "#F9D1C9"}}>{this.props.error}</p>);
          return text;
      }
      return '';
    }
  
    get_user(values){
      this.props.dispatch(fetchUser(values));
    }

    handleLogInSubmit(values){
    //alert(JSON.stringify(values, null, 2))
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

    get_login_part(){
      return (
        <div>
          <h1>Log in</h1>
          { this.checkError() }
          { this.get_login_content() }
        </div>
      );
    }

    get_search_part(){
      return (
        <div>
          {this.show_logout_button()}&nbsp;
          <button
            onClick={this.show_user_movies} style={{border: "0px", backgroundColor: "#DAFCF7"}}>{this.props.user}&lsquo;s movies</button>
          {this.checkUserList()}
          <h1>Search Movie List. </h1>
          <SearchBox handleSearchSubmit={this.handleSearchSubmit}/>
          {!!this.props.page && !!this.props.totalPages &&
            (<div>Totally {this.props.totalResults} records. Show from {this.props.page * 10 - 9} - 
                {(this.props.totalResults < this.props.page * 10)? this.props.totalResults : this.props.page * 10} </div>)}
          <br/>
          { this.get_content() }
          {this.props.totalPages >1 &&
            (<div><span><button onClick={()=>this.get_list(this.props.search_text, 1)}> 1 </button></span>
                  <span><button onClick={()=>this.get_list(this.props.search_text, this.props.page-1)}
                          disabled={(this.props.page === 1)? true: false}> &lt; </button></span>
                  <span><button onClick={()=>this.get_list(this.props.search_text, this.props.page+1)}
                          disabled={(this.props.page == this.props.totalPages)? true: false}> &gt; </button></span>
                  <span><button onClick={()=>this.get_list(this.props.search_text, this.props.totalPages)}> {this.props.totalPages} </button></span>
                  </div>)}

        </div>
      );
    }

    get_user_movies_part(){
      let text = "";
        text = (<div>
                {this.show_logout_button()}&nbsp;
                <button onClick={this.show_search_part}  style={{border: "0px", backgroundColor: "#DAFCF7"}}> Back to search </button>
                <h1>Hi,{this.props.user}, your Movie List. </h1>
                <table key='table'>
                <tbody key='tbody'>
                <tr key='head_row'><th style={{textAlign: 'left'}}>Title</th><th style={{textAlign: 'left'}}>Year</th><th>Delete?</th></tr>
                  {this.props.user_movies.map((post, i) => (
                    <tr key={'row'+i}>
                    <td key={post.imdbID} style={{width: '600px'}}>
                      {post.Title}
                    </td>
                    <td style={{width: '150px'}}>{post.Year}</td>
                    <td><button onClick={()=>this.delete(post)}>
                        Delete</button></td>
                    </tr>
                  ))}
                </tbody>
                </table></div>);

      return text;
    }
    
    render() {
      if (this.props.show_user_movies_flag){
        return this.get_user_movies_part();
      }else if (!!this.props.user ){
          return this.get_search_part();
      }else{
          return this.get_login_part();
      }

    }

}


const mapStateToProps = state => {
  return {
    search_text: state.logInmovieListReducer.search_text,
    search_movies: state.logInmovieListReducer.search_movies,
    page: state.logInmovieListReducer.page,
    totalPages: state.logInmovieListReducer.totalPages,
    totalResults: state.logInmovieListReducer.totalResults,
    error: state.logInmovieListReducer.error,
    user: state.logInmovieListReducer.username,
    password: state.logInmovieListReducer.password,
    loggedIn: state.logInmovieListReducer.loggedIn,
    user_movies: state.logInmovieListReducer.user_movies,
    show_user_movies_flag: state.logInmovieListReducer.show_user_movies_flag
  };
};

export default connect(mapStateToProps)(LogInMovieList);


