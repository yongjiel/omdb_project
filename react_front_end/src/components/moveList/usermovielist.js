import React from "react";
import { connect } from "react-redux";
import { 
    showUsermovies, deletmovie, closemodal, openmodal} 
    from "./logInmovieListActions";
import Modal from "react-modal";
import LogOut from "./logout";
import ToSearchList from "./tosearch";
import { cookies, get_movie_list, fetccUserFailure } from "./logInmovieListActions";

class UserMovieList extends React.Component {
    constructor(props) {
      super(props);
      this.show_user_movies = this.show_user_movies.bind(this);
      this.delete = this.delete.bind(this);
      this.close_modal = this.close_modal.bind(this);
      this.open_modal = this.open_modal.bind(this);
      this.show_modal = this.show_modal.bind(this);
      this.first_time= true;
    }

    delete(post){
      if(window.confirm('Are you sure to delete this record?')){ 
        let index = this.props.user_movies.indexOf(post);
        this.props.dispatch(deletmovie(index, post.imdbID, this.props.navigate));
      }
    }

    show_user_movies(){
      this.props.dispatch(showUsermovies());
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
   
    show_logout_button(){
        return <LogOut navigate={this.props.navigate}/>;            
    }

    open_modal(imdbID){
      this.props.dispatch(openmodal(imdbID));
    }

    get_user_movies_part(){
      let text = "";
        text = (<div>
                {this.show_logout_button()}&nbsp;
                <ToSearchList navigate={this.props.navigate}/>
                <h1>Hi, User, your Movie List. </h1>
                <table key='table'>
                <tbody key='tbody'>
                <tr key='head_row'><th style={{textAlign: 'left'}}>Title</th><th style={{textAlign: 'left'}}>Year</th><th>Delete?</th></tr>
                  {this.props.user_movies.map((post, i) => (
                    <tr key={'row'+i}>
                    <td key={post.imdbID} style={{width: '600px'}}>
                      <a onClick={()=>{this.open_modal(post.imdbID)}} style={{color: "#2F020C"}}>
                        <u>{post.Title}</u></a>
                    </td>
                    <td style={{width: '150px'}}>{post.Year}</td>
                    <td><button onClick={ () => {this.delete(post)} } >
                        Delete</button></td>
                    </tr>
                  ))}
                </tbody>
                </table>
                {this.props.isOpenModal && this.show_modal()}
                </div>);

      return text;
    }

    close_modal(){
      this.props.dispatch(closemodal());
    }

    show_modal(){
      let movies = [];
      let imdbID = this.props.modalImdbID;
      if (!!this.props.user_movies_entire_records){
        movies = this.props.user_movies_entire_records.filter( movie =>{
                    if (movie.imdbID === imdbID){
                      return true;
                    }
                });
      }
      let movie = movies[0];
      let keys = Object.keys(movie);
      let table_content = keys.map((k, i) => (
          <tr key={'modal_row' + i}><td>{k}</td><td>{JSON.stringify(movie[k], null, 2)}</td></tr>
      ))
      const modalStyle = {
        overlay: {
            position: 'absolute',
            top: '95px',
            bottom: '70px',
            left: '50%',
            width: '650px',
            marginLeft: '35px',
            marginRight: 'auto',
            transform: 'translate(-50%, -0%)',
            backgroundColor: 'white',
            border: '1px',
            borderStyle: 'solid',
            borderColor: 'blue',
            borderRadius: '3px'
        },
        content: {
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#dddddd',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '10px',
            border: '5px',
            borderStyle: 'solid',
            borderColor: 'white'
        }
    };
      return (
        <div>
          <Modal
          isOpen={this.props.isOpenModal}
          onRequestClose={this.close_modal}
          style={modalStyle}
        >
         <button type="button" className="close"
                 onClick={()=>this.close_modal()}>&times;</button>
          <table  key={'modal_table'}>
            <tbody key={'modal_tbody'}>
          {table_content}
          </tbody>
          </table>
        </Modal> 
          
        </div>
       
      );
    }
    
    refetch_user_movie_list(token){
        if (token === null){
            this.props.dispatch(fetccUserFailure("Could not get user's movies"));
          }
        this.props.dispatch(get_movie_list(token, this.props.user_movies, null,null));
      }

    render() {
        
        if (this.props.user_movies.length === 0 && !! this.first_time){
            let token = null;
            if (!!cookies.get('token')){
              token = cookies.get('token');
              
              if (!this.props.loading){
                // do not need to refetch user movies again. in /search did it. 
                // after log in, it goes to /search automatically. user_movies is filled up.
                // if refectch again, the last one in user_movies will trigger the django
                // /userlist again to get the non-deleted record back. the refetch and 
                // /movies/<id> (HTTP DELETE ) competing.
                //this.refetch_user_movie_list(token);
              }
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
        return this.get_user_movies_part();
        
    }

}


const mapStateToProps = state => {
  return {
    error: state.logInmovieListReducer.error,
    user_movies: state.logInmovieListReducer.user_movies,
    isOpenModal: state.logInmovieListReducer.isOpenModal,
    user_movies_entire_records: state.logInmovieListReducer.user_movies_entire_records,
    modalImdbID: state.logInmovieListReducer.modalImdbID,
    loading: state.logInmovieListReducer.loading,
    loggedIn: state.logInmovieListReducer.loggedIn
  };
};

export default connect(mapStateToProps)(UserMovieList);


