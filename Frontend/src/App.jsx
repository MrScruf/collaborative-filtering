import React, { Component } from 'react'
import MovieDetail from './Components/Movies/MovieDetail';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import MoviesView from './Components/Movies/MoviesView';
import Navbar from "./Components/General/Navbar"
import Login from "./Components/General/Login"
import config from "./Services/StartupConfiguration"
import AdminView from './Components/Admin/AdminView';
import axios from 'axios';
import Recommendations from './Components/Movies/Recomendations/Recommendations';
import ProfileView from './Components/Users/ProfileView';
import Register from './Components/General/Register';
import AdminProfileView from './Components/Users/AdminProfileView';


export default class App extends Component {
  constructor(props) {
    super(props)
    config();
    this.state = { loggedIn: false }
    this.url = "http://localhost:3001/api/v1"
    if(process.env.NODE_ENV && process.env.NODE_ENV === "production"){
      this.url = "/api/v1"
    }
  }

  componentWillUnmount() {
    if (this.source) this.source.cancel('User navigated to different page');
  }
  loginCallback = (roles, token, username) => {
    window.localStorage.setItem("roles", roles)
    window.localStorage.setItem("token", token)
    window.localStorage.setItem("username", username)
    this.setState({ loggedIn: true })
  }
  logoutCallback = () => {
    window.localStorage.removeItem("roles")
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("username")
    this.setState({ loggedIn: false })
  }
  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    if (window.localStorage.getItem("token") != null) {
      axios.post(this.url + "/users/renew", { cancelToken: this.source.token }).then(response => {
        this.loginCallback(JSON.stringify(response.data.roles), JSON.stringify(response.data.token), response.data.username)
      }).catch(error => {
        this.logoutCallback()
      })
    }
  }
  render() {
    return (
      <div className="w-full">
        <Router>
          <Navbar loggedIn={this.state.loggedIn} logoutCallback={this.logoutCallback} ></Navbar>
          <Route exact path="/recommendations" component={(props) => <Recommendations {...props} apiUrl={this.url} />} />
          <Route exact path="/movies/:id" component={(props) => <MovieDetail {...props} apiUrl={this.url} />} />
          <Route exact path="/profile" component={(props) => <ProfileView {...props} apiUrl={this.url} />} />
          <Route exact path="/profile/:id" component={(props) => <AdminProfileView {...props} apiUrl={this.url} />} />
          <Route exact path={["/movies", "/"]} component={(props) => <MoviesView {...props} apiUrl={this.url} moviesApiUrl={this.url + "/movies"} />} />
          <Route exact path="/login" component={(props) => <Login {...props} loginCallback={this.loginCallback} loginUrl={this.url + "/users/login"} />} />
          <Route exact path="/register" component={(props) => <Register {...props} loginCallback={this.loginCallback} apiUrl={this.url} />} />
          <Route exact path="/admin" component={(props) => <AdminView  {...props} apiUrl={this.url} />} />
        </Router>

      </div>
    );
  }
}
