import React, { Component } from 'react'

export default class MovieDescription extends Component {
    render() {
        return (
            <section>
                <h3 className="text-xl font-semibold">Description</h3>
                <p>{this.props.text}</p>
            </section>
        )
    }
}
