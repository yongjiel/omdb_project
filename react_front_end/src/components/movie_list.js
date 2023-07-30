import React, { memo } from "react";
import axios from "axios";
import SearchBox from "./search_box";

class MovieList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        search_text: null,
        loading: true,
        posts: [],
        page: 0,
        totalPages: 0,
        totalResults: 0,
        error: null};
      this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }
    
    get_list(text, page){
      // TODO, update to var for 'Social' and env var for '6ca48b3b'
      axios.get(`https://www.omdbapi.com/?apikey=6ca48b3b&type=movie&s=`+text+`&page=`+ page)
          .then(res => {
            console.log(res);
            if (res.data.hasOwnProperty('Error') && !!res.data.Error){
              this.setState({search_text: text, loading: false, posts: [],
                            totalPages: 0, page: 0,
                            totalResults: 0, error: res.data.Error});
            }else{
              const newPosts = res.data.Search;
              const totalPages = Math.ceil(res.data.totalResults/10.0);
              this.setState({search_text: text, loading: false, posts: newPosts,
                        totalPages: totalPages, page: page,
                        totalResults: res.data.totalResults, error: null});
            }
            
          }).catch(error => {
            this.setState({search_text: text, loading: false, posts: [], error: error.message});
          });
    }

    handleSearchSubmit(e){
      e.preventDefault();
      const form = e.target;
      if (! form.search.value){
        alert("Search box could not be empty");
      }
      this.get_list(form.search.value, 1);
    }

    get_content(){
      let text = "";
      if (!this.state.loading) {
        if (!this.state.error && this.state.posts){
          text = (<table key='table'>
                  <tbody key='tbody'>
                  <tr key='head_row'><th style={{textAlign: 'left'}}>Title</th><th style={{textAlign: 'left'}}>Year</th><th>Save?</th></tr>
                    {this.state.posts.map((post, i) => (
                      <tr key={'row'+i}>
                      <td key={post.imdbID} style={{width: '600px'}}>
                        {post.Title}
                      </td>
                      <td style={{width: '150px'}}>{post.Year}</td>
                      <td><button>Save</button></td>
                      </tr>
                    ))}
                  </tbody>
                  </table>);
        } else {
          text = (<p> {this.state.error}</p>);
        }
      }
      return text;
    }
  
    render() {
      return (
        <div>
          <h1>Search Movie List</h1>
          <SearchBox handleSearchSubmit={this.handleSearchSubmit}/>
          {!!this.state.page && !!this.state.totalPages &&
            (<div>Totally {this.state.totalResults} records. Show from {this.state.page * 10 - 9} - 
                {(this.state.totalResults < this.state.page * 10)? this.state.totalResults : this.state.page * 10} </div>)}
          <br/>
          { this.get_content() }
          {this.state.totalPages >1 &&
            (<div><span><button onClick={()=>this.get_list(this.state.search_text, 1)}> 1 </button></span>
                  <span><button onClick={()=>this.get_list(this.state.search_text, this.state.page-1)}
                          disabled={(this.state.page === 1)? true: false}> &lt; </button></span>
                  <span><button onClick={()=>this.get_list(this.state.search_text, this.state.page+1)}
                          disabled={(this.state.page == this.state.totalPages)? true: false}> &gt; </button></span>
                  <span><button onClick={()=>this.get_list(this.state.search_text, this.state.totalPages)}> {this.state.totalPages} </button></span>
                  </div>)}

        </div>
      );
    }

}


export default memo(MovieList);
