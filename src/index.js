import React from 'react';
import ReactDOM from 'react-dom';
import { Search } from './Search';
import { Header } from './Header';
import { Footer } from './Footer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Download } from './Download';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Search.css'


ReactDOM.render(
<React.StrictMode>
  <BrowserRouter>
  <Header />
    <Switch>
      <Route  exact path='/' component={Search}/>
      <Route  exact path='/download' component={Download}/>
    </Switch>
    <Footer />
  </BrowserRouter>
</React.StrictMode>, 
  document.getElementById('root')
);