import axios from 'axios'
import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';

export default class NormalizerSetter extends Component {
    constructor(props) {
        super(props)
        this.state = { normalizer: -1 }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    componentDidMount() {
        this.getNormalizer()
    }
    getNormalizer() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(this.props.apiUrl + "/admin/normalizer", { cancelToken: this.source.token }).then(response => {
            this.setState({ normalizer: parseFloat(response.data) })
        }).catch(error => {
            if (axios.isCancel(error))
                return;
            toast.error("Error")
        })
    }
    setNormalizer() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.put(this.props.apiUrl + "/admin/normalizer", {normalizer: this.state.normalizer},{ cancelToken: this.source.token }).then(response => {
            toast.success("Done")
        }).catch(error => {
            if (axios.isCancel(error))
                return;
            toast.error("Error")
        })
    }
    render() {
        return (
            <section className={`${this.props.className} flex flex-row mt-2`}>
                <h2 className="text-2xl mr-2">Set algorithm normalizer: </h2>
                <input className="border-black border-2 mr-2 p-1 px-2 w-24" value={this.state.normalizer} onChange={(e)=>this.setState({normalizer: e.target.value})}></input>
                <button type="button" className="bg-red-600 rounded-md w-auto text-xl p-1" onClick={(e) => this.setNormalizer(e)}>Set normalizer</button>
                <ToastContainer hideProgressBar={true} closeOnClick={true} autoClose={1800} />
            </section>
        )
    }
}
