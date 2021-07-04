import React, { Component } from 'react'
import MoviesListItem from "./MoviesListItem"
import MoviesListItemRated from './MoviesListItemRated'
import MoviesListItemRecomendations from './MoviesListItemRecomendations'
export default class MoviesList extends Component {
    render() {
        return (
            <ul className={this.props.className}>
                {this.props.movies.map((movieItem) => {
                    if (this.props.recommendations)
                        return (<MoviesListItemRecomendations key={movieItem.movie.id_movie} data={movieItem}></MoviesListItemRecomendations>)
                    else if (this.props.rated)
                        return (<MoviesListItemRated key={movieItem.movie.id_movie} data={movieItem}></MoviesListItemRated>)
                    return (<MoviesListItem key={movieItem.id_movie} movie={movieItem} ></MoviesListItem>)
                })}
            </ul>
        )
    }
}
