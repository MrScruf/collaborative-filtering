import axios from 'axios'
import React, { Component } from 'react'
import AdminRatedMovies from './AdminRatedMovies'
import { ToastContainer, toast } from 'react-toastify';

export default class AdminProfileView extends Component {
    constructor(props) {
        super(props)
        this.state = { username: "", mean_vote: 0 }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    componentDidMount() {
        this.loadUser()
    }
    loadUser() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(this.props.apiUrl + "/users/" + this.props.match.params.id, { cancelToken: this.source.token }).then(response => {
            this.setState({ username: response.data.username, mean_vote: response.data.mean_vote })
        }).catch(error => {
            if (axios.isCancel(error))
                return;
            toast.error("Error")
        })
    }
    render() {
        return (
            <main className="px-52 my-8">
                <h1 className="text-4xl">Profile - {this.state.username} : </h1>
                <p className="text-xl font-thin mb-10">Mean vote: {this.state.mean_vote}</p>
                <hr></hr>
                <AdminRatedMovies apiUrl={this.props.apiUrl} location={this.props.location} history={this.props.history} userId={this.props.match.params.id}></AdminRatedMovies>
                <ToastContainer hideProgressBar={true} closeOnClick={true} autoClose={1800} />
            </main>
        )
    }
}
