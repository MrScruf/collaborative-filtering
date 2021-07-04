import React, { Component } from 'react'
import CalculateSimilarities from './CalculateSimilarities'
import MovieEditation from './MovieEditation'
import NormalizerSetter from './NormalizerSetter'
import SimilaritiView from './SimilaritiView'
import UsersView from './UsersView'

export default class AdminView extends Component {
    render() {
        return (
            <main className="px-52 my-8 pb-10">
                <h1 className="text-4xl mb-10">Administration:</h1>
                { false && <MovieEditation apiUrl={this.props.apiUrl}></MovieEditation>}
                <CalculateSimilarities className="mt-2 " apiUrl={this.props.apiUrl}></CalculateSimilarities>
                <NormalizerSetter apiUrl={this.props.apiUrl}></NormalizerSetter>
                <UsersView apiUrl={this.props.apiUrl} location={this.props.location} history={this.props.history}></UsersView>
                <SimilaritiView apiUrl={this.props.apiUrl}></SimilaritiView>
            </main>
        )
    }
}
