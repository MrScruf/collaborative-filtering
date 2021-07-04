import React, { Component } from 'react'
import GenreList from './GenreList'

export default class MovieGenreView extends Component {
    render() {
        return (
            <section className="mx-auto min-w-max max-w-min lg:text-lg font-semibold">
                <GenreList genres={this.props.genres}/>
            </section>
        )
    }
}
