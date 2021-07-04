import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class MoviesListItem extends Component {

    render() {
        let description = this.props.movie.description.substr(0, 400)
        description = description.substr(0, Math.min(description.length, description.lastIndexOf(" "))) + "..."
        return (
            <li className="flex flex-row mb-5">
                <Link to={`/movies/${this.props.movie.id_movie}`} className=" mr-5 p-0 inline-block" >
                    <img className="max-w-xs w-24" src={this.props.movie.img_url ? this.props.movie.img_url : "/assets/img/imgFallback.jpg"} onError={(e) => this.src = '/assets/img/imgFallback.jpg'} alt="Movie"></img>
                </Link>
                <div className=" flex-col">
                    <Link to={`/movies/${this.props.movie.id_movie}`} className="hover:underline hover:text-gray-600" >
                        <h3 className="font-bold">{this.props.movie.name} ({this.props.movie.release_year})</h3>
                    </Link>
                    <p>{description}</p>
                    <p className="text-2xl font-semibold mt-1">{Math.round((this.props.movie.avg_rating / 10) * 100)/100}/10</p>
                </div>

            </li>
        )
    }
}
