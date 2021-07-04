import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios';
import { Link } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "", loggingIn: false };
    }
    keyDown = (event) => {
        if (event.keyCode === 13) {
            if (!this.state.loggingIn)
                this.login()
        }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    login() {
        let parent = this;
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        this.setState({ loggingIn: true }, () => {
            window.localStorage.removeItem("roles")
            window.localStorage.removeItem("token")
            window.localStorage.removeItem("username")
            axios.post(parent.props.loginUrl, {
                username: parent.state.username,
                password: parent.state.password,
            }, { cancelToken: this.source.token }).then(response => {
                if (response.status === 200) {
                    parent.props.history.push("/");
                    if (parent.props.loginCallback) parent.props.loginCallback(JSON.stringify(response.data.roles), JSON.stringify(response.data.token), parent.state.username)
                } else {
                    toast.error("Wrong credentials", { position: toast.POSITION.BOTTOM_CENTER })
                    parent.setState({ username: "", password: "", loggingIn: false })
                }
            }).catch(error => {
                if (axios.isCancel(error))
                    return;
                if (!error.response)
                    toast.error("Can't reach server", { position: toast.POSITION.BOTTOM_CENTER })
                else if (error.response.status === 401) toast.error("Wrong credentials", { position: toast.POSITION.BOTTOM_CENTER })
                else toast.error("Server error", { position: toast.POSITION.BOTTOM_CENTER })
                parent.setState({ username: "", password: "", loggingIn: false })
            })
        })
    }
    render() {
        return (
            <div>
                <section className="bg-white shadow-md rounded lg:m-auto mt-16 px-8 pt-6 pb-8 mb-4 lg:max-w-xl">
                    <form className="">
                        <h1 className="text-2xl font-semibold mb-3">Login form:</h1>
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="exampleInputEmail1">Username</label>
                        <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-2" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => { this.setState({ username: e.target.value }) }} value={this.state.username} placeholder="johndoe" />
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="exampleInputPassword1" placeholder="**********" onChange={(e) => { this.setState({ password: e.target.value }) }} onKeyDown={(e) => this.keyDown(e)} value={this.state.password} />
                        <button type="button" className="btn bg-blue-500 text-2xl rounded-lg p-1" onClick={(e) => { this.login() }}>Login</button>{this.state.loggingIn ? null : null}
                    </form>
                    <p className="mt-3 text-lg">Are you new? <Link to="/register" className="underline">Sign up</Link></p>
                </section>
                <ToastContainer hideProgressBar={true} closeOnClick={true} autoClose={2500} />

            </div>
        )
    }
}
