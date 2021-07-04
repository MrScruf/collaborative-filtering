import axios from 'axios'
import React, { Component } from 'react'
import ReactLoading from 'react-loading';
import { ToastContainer, toast } from 'react-toastify';

export default class CalculateSimilarities extends Component {
    constructor(props) {
        super(props)
        this.state = { loading: false }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    sendCalculate() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        this.setState({ loading: true }, () => {
            axios.post(`${this.props.apiUrl}/admin/calculate`, { cancelToken: this.source.token }).then(response => {
                toast.success("Done")
                this.setState({ loading: false })
            }).catch(error => {
                if (axios.isCancel(error))
                    return;
                toast.error("Error")
                this.setState({ loading: false })
            })
        })
    }
    render() {
        return (
            <section className={`${this.props.className} flex flex-row`}>
                <h2 className="text-2xl mr-2">Re-calculate recommendations:</h2>
                <button type="button" disabled={this.state.loading} className="bg-red-600 rounded-md w-auto text-xl p-1" onClick={(e) => this.sendCalculate(e)}>Re-calculate</button>
                {this.state.loading && <ReactLoading type="spinningBubbles" color="#000000" className="ml-5" height="35px" width="35px" />}
                <ToastContainer hideProgressBar={true} closeOnClick={true} autoClose={1800} />
            </section>
        )
    }
}
