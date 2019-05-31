import React, { Component } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AssetPreloader from 'components/AssetPreloader';
import NotFoundPage from 'pages/NotFoundPage';
import DashboardPage from 'pages/DashboardPage';

import Store from 'store/Store';

// // Import font css
import 'assets/fonts/material-design/css/material-design-iconic-font.css';
import 'assets/fonts/worksans/stylesheet.css';
import 'assets/css/animate.css';
import 'assets/css/app.css';
import 'assets/css/grid.css';
import './App.css';
import 'assets/css/gh-markdown.css';

// Abort polyfill
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'whatwg-fetch';

// kick off the polyfill!
smoothscroll.polyfill();

// const socket = io.connect('http://0.0.0.0:8763/kernels');
// socket.on('connect', () => {
//   console.log('Connected to kernels socket');
//   socket.emit('kernel_create', {
//     image: 'python',
//     version: '3.5',
//     name: 'py3'
//   });
// });
// socket.on('kernel_log', console.log);

class App extends Component {
  render () {
    return (
      <Router basename='/app'>
        <Switch>
          <Route path='/' exact component={DashboardPage} />
          <Route path='*' component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

export default class AppWrapper extends React.Component {
  // *********************************************************
  // React methods
  // *********************************************************
  // componentDidMount() {
  //   this.mounted = true;
  //   // ProfileStore.fetchProfile().then(() => {
  //   //   this.mounted && this.forceUpdate();
  //   // })
  // }

  // componentWillUnmount() {
  //   this.mounted = false;
  // }

  render () {
    return (
      <Provider store={Store}>
        <div>
          <App />
          <AssetPreloader />
        </div>
      </Provider>
    );
  }
}
