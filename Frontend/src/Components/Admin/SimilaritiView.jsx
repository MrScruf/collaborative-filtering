import axios from 'axios'
import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';

export default class SimilaritiView extends Component {
    constructor(props) {
        super(props)
        this.state = { users: [], similarity: "", firstId: -1, secondId: -1 }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    componentDidMount() {
        this.loadUsers()
    }
    loadUsers() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(`${this.props.apiUrl}/users`, { cancelToken: this.source.token }).then(response => {
            this.setState({ users: response.data })
        }).catch(error => {
            if (axios.isCancel(error))
                return;
        })
    }

    callSimil() {
        if (this.state.firstId !== -1 && this.state.secondId !== -1) {
            const CancelToken = axios.CancelToken;
            this.source = CancelToken.source();
            axios.post(`${this.props.apiUrl}/admin/similarity`, { first: this.state.firstId, second: this.state.secondId }, { cancelToken: this.source.token }).then(response => {
                this.setState({ similarity: response.data || 0 })
            }).catch(error => {
                if (axios.isCancel(error))
                    return;
                toast.error("Error")
            })
        }
    }

    setFirst(e) {
        this.setState({ firstId: e.target.value }, () => {
            this.callSimil()
        })
    }
    setSecond(e) {
        this.setState({ secondId: e.target.value }, () => {
            this.callSimil()
        })
    }

    render() {
        return (
            <section className={`${this.props.className} flex flex-col mt-2`}>
                <h2 className="text-2xl mb-3">Similarities view: </h2>
                <div className="text-xl flex flex-col mb-5">
                    <label htmlFor="Users1">Choose first user:</label>
                    <select name="Users" className="border border-black ml-3 max-w-xs mt-2" onChange={(e) => this.setFirst(e)} size="5" id="Users1">
                        {this.state.users.map(user => {
                            return <option key={user.id_user} value={user.id_user}>{user.username}</option>
                        })}
                    </select>
                </div>
                <div className="text-xl flex flex-col">
                    <label htmlFor="Users2">Choose second user:</label>
                    <select name="Users" className="border border-black ml-3 max-w-xs mt-2" onChange={(e) => this.setSecond(e)} size="5" id="Users2">
                        {this.state.users.map(user => {
                            return <option key={user.id_user} value={user.id_user}>{user.username}</option>
                        })}
                    </select>
                </div>
                <p className="text-3xl font-bold mt-5">Similarity: {this.state.similarity}</p>
                <ToastContainer hideProgressBar={true} closeOnClick={true} autoClose={1800} />
            </section>
        )
    }
}
