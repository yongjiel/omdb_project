import React from "react";
import { connect } from "react-redux";
import SearchBox from "../searchBox";
import { 
    fetchMovieList, addmovie, backtoSearchPart} from "./logInmovieListActions";
    import LogOut from "./logout";
import ToUserMovieList from "./touserlist";

class MovieList extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
      this.save = this.save.bind(this);
      this.get_search_part = this.get_search_part.bind(this);
      this.checkUserList = this.checkUserList.bind(this);
    }

    checkUserList(){
      if (!!this.props.user_movies && this.props.user_movies.length >= 5){
        const text = (<p style={{backgroundColor: "#F9D1C9"}}> User has 5 or more records! Please check <ToUserMovieList/></p>);

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
      this.get_list(form.search.value, 1);
    }

    save(post){
      this.props.dispatch(addmovie(post));
    }


    show_logout_button(){
        return <LogOut />;            
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
          <ToUserMovieList/>
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
                          disabled={(this.props.page === this.props.totalPages)? true: false}> &gt; </button></span>
                  <span><button onClick={()=>this.get_list(this.props.search_text, this.props.totalPages)}> {this.props.totalPages} </button></span>
                  </div>)}

        </div>
      );
    }

    
    
    render() {
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
  };
};

export default connect(mapStateToProps)(MovieList);

