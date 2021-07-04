import React, { Component } from 'react'
import UsersList from '../Users/UsersList'
import ReactPaginate from 'react-paginate';
import axios from 'axios';

export default class UsersView extends Component {
    constructor(props){
        super(props)
        this.state = {
            pageCount: 0,
            itemsOnPage: 10,
            page: 0,
            users: []
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
        axios.get(`${this.props.apiUrl}/users/count/all`, { cancelToken: this.source.token }).then(response => {
            this.setState({ pageCount: Math.ceil(response.data / this.state.itemsOnPage), page: page && page > 1 && page ? page : 1 }, () => {
                this.loadData()
            })
        }).catch(error => {
            if (axios.isCancel(error))
                return;
        })

    }
    async loadData() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(`${this.props.apiUrl}/users?offset=${(this.state.page - 1) * this.state.itemsOnPage}&limit=${this.state.itemsOnPage}`, { cancelToken: this.source.token }).then(response => {
            this.setState({ users: response.data })
        }).catch(error => {
            if (axios.isCancel(error))
                return;
        })
    }
    handlePageClick = (data) => {
        let selected = data.selected;
        this.props.history.push(`/admin?page=${selected + 1}`)
        this.setState({ page: selected + 1 }, () => this.loadData())
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
            forcePage={this.state.page - 1}
            onPageChange={(e) => this.handlePageClick(e)}
            containerClassName={'relative z-0 inline-flex rounded-md shadow-sm -space-x-px h-8 mb-6'}
            activeLinkClassName={'bg-blue-500'}
            pageLinkClassName={'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'}
            previousLinkClassName={'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'}
            nextLinkClassName={'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'}
        />
        return (
            <section className={`${this.props.className} flex mt-2 flex-col`}>
                <h2 className="text-2xl mr-2 mb-2">Users list: </h2>
                {paginate}
                <UsersList users={this.state.users}></UsersList>
                {paginate}
            </section>
        )
    }
}
