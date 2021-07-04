import React, { Component } from 'react'
import ActorsList from './ActorsList'

export default class MovieActorsView
 extends Component {
    render() {
        return (
            <section className="mt-4">
                <h3 className="text-xl font-semibold">Actors</h3>
                <ActorsList actors={this.props.actors} />
            </section>
        )
    }
}
