import React from "react";
import LogInMovieList from "./components/moveList";
import LogIn from "./components/moveList/login";
//import LogOut from "./components/moveList/logout";
import UserMovieList from "./components/moveList/usermovielist";
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import NoPage from "./components/nopage";
import reportWebVitals from './reportWebVitals';
import rootReducers from "./rootReducer";
import { createRoot } from 'react-dom/client';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';

const store = createStore(rootReducers, applyMiddleware(thunk));

function AppRoutes() {
  const navigate = useNavigate();
  return (
      <div>
      <Routes>        
        <Route index path='/' element={ <Navigate to='/login' /> } />
        <Route index path='/login' element={ <LogIn navigate={navigate}/>} />
        <Route index path='/search' element={ <LogInMovieList  navigate={navigate}/>} />
        <Route index path='/userlist' element={ <UserMovieList navigate={navigate}/> } />
        <Route path="/*"  element={ <NoPage url={window.location.href} status={404} />} />
      </Routes>
      </div>
  );
}

const App = () =>{
  return(
    <Provider store={store}>
      <BrowserRouter basename='/'>
        <AppRoutes/>
      </BrowserRouter>
    </Provider>
    );
};

const container = document.getElementById('root');
Modal.setAppElement(container);
const root = createRoot(container);
root.render(<App />);

reportWebVitals();