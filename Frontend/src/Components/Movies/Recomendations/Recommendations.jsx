import axios from 'axios'
import React, { Component } from 'react'
import MoviesList from '../MoviesList'

export default class Recommendations extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], match: 0, loading: false }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    componentDidMount() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(`${this.props.apiUrl}/users/movies/recommendations`, { cancelToken: this.source.token })
            .then(response => {
                this.setState({ data: response.data, loading: false })
            }).catch(error => {
                if (axios.isCancel(error))
                    return;
                this.setState({ loading: false, data: [] })
            })
    }
    render() {
        return (
            <main className="px-52 my-8">
                <h2 className="text-2xl">You might like:</h2>
                <hr className="mb-3"></hr>
                { this.state.data.length !== 0 ? <MoviesList className="mt-5" recommendations={true} movies={this.state.data} /> : <h2 className="text-2xl">No data avaible</h2>}
            </main>
        )
    }
}
