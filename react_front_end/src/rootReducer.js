import { combineReducers } from "redux";
import movieListReducer from "./components/moveList/movieListReducer";
import userReducer from "./components/user/userReducer";

const rootReducers =  combineReducers({
    userReducer,
    movieListReducer
});

export default rootReducers;