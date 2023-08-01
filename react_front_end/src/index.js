import React from "react";
import LogInMovieList from "./components/moveList";
import { BrowserRouter, HashRouter, Route, Routes, Navigate} from 'react-router-dom';
import NoPage from "./components/nopage";
import reportWebVitals from './reportWebVitals';
import rootReducers from "./rootReducer";
import { createRoot } from 'react-dom/client';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';


const store = createStore(rootReducers, applyMiddleware(thunk));

const App = () =>{
  return(
    <Provider store={store}>
      <BrowserRouter basename='/'>
      <Routes>
        <Route index path='/' element={ <LogInMovieList />} />
        <Route path="/*"  element={ <NoPage url={window.location.href} status={404} />} />
      </Routes>
      </BrowserRouter>
      </Provider>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

reportWebVitals();