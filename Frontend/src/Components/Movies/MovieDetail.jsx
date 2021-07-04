import axios from 'axios'
import React, { Component } from 'react'
import Rating from 'react-rating'
import "../../assets/main.css"
import MovieActorsView from './MovieActorsView'
import MovieDescription from './MovieDescription'
import MovieGenreView from './MovieGenreView'
export default class MovieDetail extends Component {
    constructor(props) {
        super(props)
        this.state = { movie: undefined, loading: false, clickedRating: false, viewRating: 0, selectedRating: 0 }
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    componentDidMount() {
        const id = this.props.match.params.id
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(`${this.props.apiUrl}/movies/${id}`, { cancelToken: this.source.token }).then(response => {
            this.setState({ movie: response.data }, () => this.loadMovieRating())
        }).catch(error => {
            if (axios.isCancel(error))
                return;
            this.setState({ loading: false, movie: undefined })
        })
    }
    setRating(value) {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.put(`${this.props.apiUrl}/ratings/${this.state.movie.id_movie}`, { percentage_rating: value * 10, text_rating: "" }, { cancelToken: this.source.token })
            .then(response => {
                this.setState({ viewRating: value, selectedRating: value })
            }).catch(error => {
                if (axios.isCancel(error))
                    return;
            })
    }
    loadMovieRating() {
        if (!window.localStorage.getItem("token")) {
            this.setState({ loading: false });
            return;
        }
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(`${this.props.apiUrl}/ratings/${this.state.movie.id_movie}`, { cancelToken: this.source.token }).then(response => {
            this.setState({ viewRating: (response.data.percentage_rating || 0) / 10, selectedRating: (response.data.percentage_rating || 0) / 10, loading: false })
        }).catch(error => {
            if (axios.isCancel(error))
                return;
            this.setState({ loading: false })
        })
    }
    render() {
        return (
            <section className="w-10/12 mx-auto text-sm">
                {this.state.movie ?
                    <div>
                        <h2 className="font-bold text-2xl sm:text-3xl min-w-max max-w-min mx-auto my-2">{this.state.movie.name} <span className="font-normal">({this.state.movie.release_year})</span></h2>
                        <hr></hr>
                        <MovieGenreView genres={this.state.movie.genres} />
                        <hr></hr>
                        <section className="sm:flex mt-2 rounded-md bg-MovDet5 lg:text-sm">
                            <img className="sm:h-80 h-40 mr-5" src={this.state.movie.img_url || '/assets/img/imgFallback.jpg'} onError={()=>this.src='/assets/img/imgFallback.jpg'} alt={"Movie poster"}></img>
                            <div>
                                <MovieDescription text={this.state.movie.description} />
                                <MovieActorsView actors={this.state.movie.actors} />
                                {window.localStorage.getItem("roles") && <span className="flex flex-row mt-8">
                                    <Rating
                                        className="mt-1"
                                        stop={10}
                                        emptySymbol="fa fa-star-o fa-2x"
                                        fullSymbol="fa fa-star fa-2x"
                                        initialRating={this.state.viewRating}
                                        onHover={(value) => this.setState(old => { return { viewRating: value ? value : old.selectedRating } })}
                                        onClick={(value) => this.setRating(value)}
                                        fractions={10} /><p className="text-2xl ml-2">{this.state.viewRating}/10</p></span>}
                                <p className="text-2xl font-semibold mt-1">{Math.round((this.state.movie.avg_rating / 10) * 100)/100}/10</p>
                            </div>
                        </section>
                    </div> : <h2 className="text-4xl font-bold mt-10">Nenalezeno</h2>}

            </section>
        )
    }
}
