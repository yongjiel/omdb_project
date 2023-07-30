import React, { useState } from "react";
import MovieList from "./components/movie_list";
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
// import Form from "./uncontrolledForm";
import NoPage from "./components/nopage";
import reportWebVitals from './reportWebVitals';

import { createRoot } from 'react-dom/client';

const initialState = [];

const App = () =>{
  return(
  <BrowserRouter basename='/'>
   <Routes>
     <Route index path='/' element={ <MovieList />} />
     <Route path="/*"  element={ <NoPage url={window.location.href} status={404} />} />
   </Routes>
  </BrowserRouter>
);
};

export default initialState;
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

reportWebVitals();