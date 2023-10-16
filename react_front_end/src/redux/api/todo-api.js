import axios from "axios";

// this function must be async, it is used by to-saga.js generator. must 
// await for the result out.
export const fetchMoviesByPageNumber = async (moviePartialText, pageNumber)=>{
    try {
      const url = `https://www.omdbapi.com/?apikey=6ca48b3b&type=movie&s=`+moviePartialText+`&page=`+ pageNumber;
      console.log(url);
      const res = await axios.get(url);
    
        if (res.data.hasOwnProperty('Error') && !!res.data.Error){
            return res.data;
        }else{
            const newPosts = res.data.Search;
            const totalPages = Math.ceil(res.data.totalResults/10.0);
            const state = {search_text: moviePartialText,
                            search_movies: newPosts,
                            page: pageNumber,
                            totalPages: totalPages,
                            totalResults: res.data.totalResults,
                            error: null}
            
            return state;
        };
              
    } catch(error) {
        console.log({error: error.message});
    };

  }

export function fetchNewUser(){

};
export function deleteExistingMovie(){

}