import React from "react";
import { connect } from "react-redux";
import SearchBox from "../searchBox";
import { 
    fetchMovieList,
    addmovie,
    backtoSearchPart,
    clearSearchMovies
} from "../../redux/actions/actions";
import LogOut from "./logout";
import ToUserMovieList from "./touserlist";
import { cookies, get_movie_list, fetccUserFailure } from "../../redux/actions/actions";

class MovieList extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
      this.save = this.save.bind(this);
      this.get_search_part = this.get_search_part.bind(this);
      this.checkUserList = this.checkUserList.bind(this);
      this.first_time= true;
    }

    checkUserList(){
      if (!!this.props.user_movies && this.props.user_movies.length >= 5){
        const text = (<p style={{backgroundColor: "#F9D1C9"}}> User has 5 or more records! Please check <ToUserMovieList navigate={this.props.navigate}/></p>);

        return text;
      }
      return '';
    }


    get_list(text, page){
      this.props.dispatch(fetchMovieList(text, page));
    }

    handleSearchSubmit(e){
      e.preventDefault();
      const form = e.target;
      this.props.dispatch(clearSearchMovies());
      this.get_list(form.search.value, 1);
    }

    save(post){
      if ( this.props.user_movies.filter(m => m.imdbID === post.imdbID).length === 0 ){
        this.props.dispatch(addmovie(post, this.props.navigate));
      }
      
    }


    show_logout_button(){
        return <LogOut navigate={this.props.navigate}/>;            
    }

    show_search_part(){
        this.props.dispatch(backtoSearchPart());
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


    get_search_part(){
      return (
        <div>
          {this.show_logout_button()}&nbsp;
          <ToUserMovieList navigate={this.props.navigate}/>
          {this.checkUserList()}
          <h1>Search Movie List. </h1>
          <SearchBox handleSearchSubmit={this.handleSearchSubmit}/>
          {!!this.props.page && !!this.props.totalPages &&
            (<div>Totally {this.props.totalResults} records. Show from 1 - 
                {(this.props.totalResults < this.props.page * 10)? this.props.totalResults : this.props.page * 10} </div>)}
          <br/>
          { this.get_content() }
          

        </div>
      );
    }
/*
          {this.props.totalPages >1 &&
            (<div><span><button onClick={()=>this.get_list(this.props.search_text, 1)}> 1 </button></span>
                  <span><button onClick={()=>this.get_list(this.props.search_text, this.props.page-1)}
                          disabled={(this.props.page === 1)? true: false}> &lt; </button></span>
                  <span><button onClick={()=>this.get_list(this.props.search_text, this.props.page+1)}
                          disabled={(this.props.page === this.props.totalPages)? true: false}> &gt; </button></span>
                  <span><button onClick={()=>this.get_list(this.props.search_text, this.props.totalPages)}> {this.props.totalPages} </button></span>
                  </div>)}*/
    refetch_user_movie_list(token){
      if (token === null){
        this.props.dispatch(fetccUserFailure("Could not get user's movies"));
      }
      this.props.dispatch(get_movie_list(token, this.props.user_movies, null, null));
    }
    
    render() {
          if (this.props.user_movies.length === 0 && !! this.first_time){
            let token = null;
            if (!!cookies.get('token')){
              token = cookies.get('token');
              this.refetch_user_movie_list(token);
            } else{
              if (this.props.loading){
                this.refetch_user_movie_list(token);
                return <><p>Loading......</p></>;
              }
              else if (!this.props.loggedIn){
                return <><p>Please <a href="/login">login</a> first.</p></>;
              }
            }
            
            //alert("loading " + this.props.loading)
            //alert("error " + this.props.error )
            
            
            this.first_time = false;
          }
          //alert("2222error " + this.props.error )
          return this.get_search_part();
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
    user_movies: state.logInmovieListReducer.user_movies,
    userMovieListFromDB: state.logInmovieListReducer.userMovieListFromDB,
    loading: state.logInmovieListReducer.loading
  };
};

export default connect(mapStateToProps)(MovieList);


