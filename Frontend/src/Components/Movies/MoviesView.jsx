import React, { Component } from 'react'
import MoviesList from "./MoviesList"
import ReactPaginate from 'react-paginate';
import axios from 'axios';
export default class MoviesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageCount: 0,
            itemsOnPage: 10,
            page: 1,
            data: [],
            moviesSearchResult: []
        }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    componentDidUpdate() {
        const params = new URLSearchParams(this.props.location.search);
        const page = parseInt(params.get('page'));
        if (page && page >= 1 && this.state.page !== page) this.setState({ page: page }, () => {
            this.loadData()
        })
    }
    async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        const page = parseInt(params.get('page'));
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(this.props.moviesApiUrl + "/count/all", { cancelToken: this.source.token }).then(response => {
            this.setState({ pageCount: Math.ceil(response.data / this.state.itemsOnPage), page: page && page > 1 && page ? page : 1 }, () => {
                this.handlePageClick({selected: this.state.page-1})
            })
        }).catch(error => {
            if (axios.isCancel(error))
                return;
        })

    }

    async loadData() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(`${this.props.moviesApiUrl}?offset=${(this.state.page - 1) * this.state.itemsOnPage}&limit=${this.state.itemsOnPage}`, { cancelToken: this.source.token }).then(response => {
            this.setState({ data: response.data })
        }).catch(error => {
            if (axios.isCancel(error))
                return;
        })
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.props.history.push(`/movies?page=${selected + 1}`)
        this.setState({ page: selected +1}, () => this.loadData())
    }
    searchMovie() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(`${this.props.moviesApiUrl}?name=${this.state.movieSearchQuery}`, { cancelToken: this.source.token })
            .then(response => response.data)
            .then(data => this.setState({ moviesSearchResult: data }))
            .catch(error => console.error(error))
    }
    callSearch(e) {
        this.setState({ movieSearchQuery: e.target.value }, () => {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => this.searchMovie(), 150);
        })
    }
    enterSearch() {
        this.setState({ focusMovieSearch: true }, () => this.searchMovie())
    }
    leaveSearch(e) {
        if (this.movieSearchResult !== e.relatedTarget)
            this.setState({ focusMovieSearch: false })
    }
    openSelectedMovie(movie) {
        this.props.history.push(`/movies/${movie.id_movie}`)
    }
    render() {
        const paginate = <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            forcePage={this.state.page-1}
            onPageChange={(e) => this.handlePageClick(e)}
            containerClassName={'relative z-0 inline-flex rounded-md shadow-sm -space-x-px h-8'}
            activeLinkClassName={'bg-blue-500'}
            pageLinkClassName={'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'}
            previousLinkClassName={'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'}
            nextLinkClassName={'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'}
        />
        let movieSearchResult = this.state.focusMovieSearch ?
            <div tabIndex="0" className="ml-auto w-72 block mt-2 bg-NavBar4 border-0 font-normal leading-normal text-sm text-left no-underline rounded-sm absolute z-50" ref={(ip) => this.movieSearchResult = ip}>
                <div>
                    <ul>
                        {this.state.moviesSearchResult.map((movie, index) => {
                            return <li className="hover:bg-yellow-400 cursor-pointer p-1 mt-1" key={movie.id_movie || index} onClick={() => this.openSelectedMovie(movie)}>{movie.name}</li>
                        })}
                    </ul>
                </div>
            </div> : null;
        return (
            <main className="px-52 my-8">
                <div className="flex flex-col">
                    <div className="flex flex-row"><h2 className="text-2xl mr-auto">Movies list:</h2><input className="border-indigo-400 border-2 rounded-md p-1 text-sm w-2/12" type="text" onFocus={() => this.enterSearch()} onBlur={(e) => this.leaveSearch(e)} onChange={(e) => this.callSearch(e)} ref={(ip) => this.movieSearch = ip}></input></div>
                    <div className="flex flex-row-reverse">
                        {movieSearchResult}
                    </div>
                </div>

                <hr className="mb-3"></hr>
                {paginate}
                <MoviesList className="mt-5" movies={this.state.data} />
                {paginate}
            </main>
        )
    }
}
