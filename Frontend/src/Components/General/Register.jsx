import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios';
import ReactLoading from 'react-loading'

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "", loggingIn: false, passwordAgain: "" };
    }
    keyDown = (event) => {
        if (event.keyCode === 13) {
            if (!this.state.loggingIn)
                this.signUp()
        }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    signUp() {
        window.localStorage.removeItem("roles")
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("username")
        if (this.state.password === this.state.passwordAgain) {
            if (this.state.password.length > 5) {
                const CancelToken = axios.CancelToken;
                this.source = CancelToken.source();
                this.setState({ loggingIn: true }, () => {
                    axios.post(`${this.props.apiUrl}/users/register`, {
                        username: this.state.username,
                        password: this.state.password,
                    }, { cancelToken: this.source.token }).then(response => {
                        if (this.props.loginCallback) this.props.loginCallback(JSON.stringify(response.data.roles), JSON.stringify(response.data.token), this.state.username)
                        this.props.history.push("/");
                    }).catch(error => {
                        if (axios.isCancel(error))
                            return;
                        toast.error("Username already exists")
                        this.setState({ loggingIn: false })
                    })
                })

            } else {
                toast.error("Password needs to be at least 6 characters long", { position: 'bottom-center' })
            }
        } else {
            toast.error("Given passwords don't match", { position: 'bottom-center' })
        }
    }
    render() {
        return (
            <div>
                <section className="bg-white shadow-md rounded lg:m-auto mt-16 px-8 pt-6 pb-8 mb-4 lg:max-w-xl">
                    <form className="">
                        <h1 className="text-2xl font-semibold mb-3">Sign up form:</h1>
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="exampleInputEmail1">Username:</label>
                        <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => { this.setState({ username: e.target.value }) }} value={this.state.username} placeholder="johndoe" />
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="exampleInputPassword1">Password:</label>
                        <input type="password" className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="exampleInputPassword1" placeholder="**********" onChange={(e) => { this.setState({ password: e.target.value }) }} />
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="exampleInputPassword2">Password again:</label>
                        <input type="password" className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="exampleInputPassword2" placeholder="**********" onChange={(e) => { this.setState({ passwordAgain: e.target.value }) }} onKeyDown={(e) => this.keyDown(e)} value={this.state.passwordAgain} />
                        <span className="flex flex-row"><button type="button" disabled={this.state.loggingIn} className="btn bg-blue-500 text-2xl rounded-lg p-1" onClick={(e) => { this.signUp() }}>Sign up</button>
                        {this.state.loggingIn && <ReactLoading type="spinningBubbles" color="#000000" className="ml-5" height="35px" width="35px" />}
                        </span>
                    </form>
                    
                </section>
                
                <ToastContainer hideProgressBar={true} closeOnClick={true} autoClose={2500} />
            </div>
        )
    }
}
