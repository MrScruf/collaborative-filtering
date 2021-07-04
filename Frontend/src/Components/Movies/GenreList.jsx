import React, { Component } from 'react'
import GenreListItem from './GenreListItem'

export default class GenreList extends Component {
    render() {
        return (
            <ul className="flex">
                 {this.props.genres.map(
                    (element_genre, index) => {
                        return (
                        <GenreListItem genre={element_genre} key={element_genre.id_genre} delimiter={index<this.props.genres.length-1} />
                        )
                    }
                )}
            </ul>
        )
    }
}
