import React, { Component } from 'react'
import RatedMovies from './RatedMovies'

export default class ProfileView extends Component {
    render() {
        return (
            <main className="px-52 my-8">
                <h1 className="text-4xl mb-10">My profile - {window.localStorage.getItem("username")}: </h1>
                <hr></hr>
                <RatedMovies apiUrl={this.props.apiUrl} location={this.props.location} history={this.props.history}></RatedMovies>
            </main>
        )
    }
}
