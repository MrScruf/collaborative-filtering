import React, { Component } from 'react'
import ActorsListItem from './ActorsListItem'

export default class ActorsList extends Component {
    render() {
        return (
            <ul className="flex flex-wrap">
                {this.props.actors.map(
                    (element_actor, index) => {
                        return <ActorsListItem actor={element_actor} key={element_actor.id_actor} delimiter={index<this.props.actors.length-1}/>
                    }
                )}
            </ul>
        )
    }
}
