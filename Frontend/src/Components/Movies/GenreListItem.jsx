import React, { Component } from 'react'

export default class GenreListItem extends Component {
    render() {
        return (
            <li className="pr-1">
                <p>{this.props.genre.name} {this.props.delimiter ? "-" : ""}</p>
            </li>
        )
    }
}
