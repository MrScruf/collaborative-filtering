import React, { Component } from 'react'

export default class MovieFileUpload extends Component {
    render() {
        return (
            <section className={this.props.className}>
                <h2>Nahrání souboru s filmy</h2>
                <input type="file" accept=".json"></input>
            </section>
        )
    }
}
