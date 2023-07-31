import React from "react";
import { connect } from "react-redux";
import SearchBox from "../searchBox";
import { fetchMovieList } from "./movieListActions";


class MovieList extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    get_list(text, page){
      this.props.dispatch(fetchMovieList(text, page));
    }

    handleSearchSubmit(e){
      e.preventDefault();
      const form = e.target;
      this.get_list(form.search.value, 1);
    }

    save(imdbID){
      alert(imdbID);
    }

    checkUserList(){
        if (!!this.props.userMovieList && this.props.userMovieList.length === 5){
          const text = (<p style={{backgroundColor: "#F9D1C9"}}> User {this.props.user} has 5 or more records! Please check <a href="">link</a></p>);

          return text;
        }
        return '';
    }

    get_content(){
      let text = "";
      if (!this.props.error && this.props.movies.length > 0){
        text = (<table key='table'>
                <tbody key='tbody'>
                <tr key='head_row'><th style={{textAlign: 'left'}}>Title</th><th style={{textAlign: 'left'}}>Year</th><th>Save?</th></tr>
                  {this.props.movies.map((post, i) => (
                    <tr key={'row'+i}>
                    <td key={post.imdbID} style={{width: '600px'}}>
                      {post.Title}
                    </td>
                    <td style={{width: '150px'}}>{post.Year}</td>
                    <td><button onClick={()=>this.save(post.imdbID)}
                              disabled={ 
                                (this.props.userMovieList.includes(post.imdbID) || this.props.userMovieList.length >=5)? true: false}>
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
  
    render() {
      return (
        <div>
          {this.checkUserList()}
          <h1>Search Movie List</h1>
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

}


const mapStateToProps = state => {
  return {
    search_text: state.movieListReducer.search_text,
    movies: state.movieListReducer.movies,
    page: state.movieListReducer.page,
    totalPages: state.movieListReducer.totalPages,
    totalResults: state.movieListReducer.totalResults,
    error: state.movieListReducer.error,
    userMovieList: state.movieListReducer.userMovieList,
    user: state.movieListReducer.user,
  };
};

export default connect(mapStateToProps)(MovieList);


