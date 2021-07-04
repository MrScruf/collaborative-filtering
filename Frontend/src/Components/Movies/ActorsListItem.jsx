import React, { Component } from 'react'

export default class ActorsListItem extends Component {
    render() {
        return (
            <li className="min-w-max max-w-min pr-1">
                <p>{this.props.actor.name} {this.props.actor.surname}{this.props.delimiter ? " •" : ""}</p>               
            </li>
        )
    }
}
