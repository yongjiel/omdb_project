import React from "react";
import { connect } from "react-redux";
import { 
    showUsermovies, backtoSearchPart,
    deletmovie, closemodal, openmodal} from "./logInmovieListActions";
import Modal from "react-modal";
import LogOut from "./logout";
import ToSearchList from "./tosearch";


class UserMovieList extends React.Component {
    constructor(props) {
      super(props);
      this.show_user_movies = this.show_user_movies.bind(this);
      this.delete = this.delete.bind(this);
      this.close_modal = this.close_modal.bind(this);
      this.open_modal = this.open_modal.bind(this);
      this.show_modal = this.show_modal.bind(this);
    }

    delete(post){
      if(window.confirm('Are you sure to delete this record?')){ 
        let index = this.props.user_movies.indexOf(post);
        this.props.dispatch(deletmovie(index, post.imdbID));
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
        return <LogOut />;            
    }

    open_modal(imdbID){
      this.props.dispatch(openmodal(imdbID));
    }

    get_user_movies_part(){
      let text = "";
        text = (<div>
                {this.show_logout_button()}&nbsp;
                <ToSearchList/>
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
    
    render() {
        return this.get_user_movies_part();
    }

}


const mapStateToProps = state => {
  return {
    error: state.logInmovieListReducer.error,
    user_movies: state.logInmovieListReducer.user_movies,
    isOpenModal: state.logInmovieListReducer.isOpenModal,
    user_movies_entire_records: state.logInmovieListReducer.user_movies_entire_records,
    modalImdbID: state.logInmovieListReducer.modalImdbID
  };
};

export default connect(mapStateToProps)(UserMovieList);


