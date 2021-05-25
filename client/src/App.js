import './App.css';
import React from 'react';
import axios from 'axios';
import Header from './views/partials/Header';
import Footer from './views/partials/Footer';
import Router from './components/Router';
import "bootstrap/dist/css/bootstrap.min.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      theme: "theme-light"
    }
  
  }

  setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
    this.setState({ theme: themeName });
  }

  changeTheme() {
    if (this.state.theme === "theme-light") {
      this.setTheme('theme-dark');
    }
    else {
      this.setTheme('theme-light');
    }
  }

  keepTheme() {
    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') === 'theme-dark') {
        this.setTheme('theme-dark');
      } else if (localStorage.getItem('theme') === 'theme-light') {
        this.setTheme('theme-light')
      }
    } else {
      this.setTheme('theme-light')
    }
  }

  componentDidMount() {
    this.keepTheme();

    axios.get('api/user', {
      headers: {
        'auth-token': localStorage.getItem('token')
      }
    })
    .then(response => { this.setUser(response.data); })
    .catch(err => { 
        console.log(err);
    })
  }

  setUser(user) {
    this.setState({user: user});
  }

  render() {
    return (
      <div className="app">
        <Header setUser={this.setUser.bind(this)} user={this.state.user} changeTheme={this.changeTheme.bind(this)} theme={this.state.theme} />
        <Router setUser={this.setUser.bind(this)} user={this.state.user} />
        <Footer />
      </div>
    );
  }
  
}