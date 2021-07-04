import axios from 'axios';
import React, { Component } from 'react'
import ReactLoading from 'react-loading';
import { ToastContainer, toast } from 'react-toastify';

export default class MovieEditation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            movieId: -1,
            name: "",
            year: 2017,
            description: "",
            image_url: "",
            loadedGenres: [],
            genres: [{ id: undefined, name: "Fantasy" }],
            actors: [{ id: undefined, name: "Karel", surname: "Briza" }],
            currentGenre: "",
            currentActor: "",
            movieSearchQuery: "",
            moviesSearchResult: ["Mortal combat"],
            loadedMovie: false
        }
        this.searchTimer = null;
    }
    componentWillUnmount() {
        if (this.source) this.source.cancel('User navigated to different page');
    }
    onChangeGenre(e) {
        if (e.key === 'Enter') {
            const genreToAdd = {
                id_genre: undefined,
                name: this.state.currentGenre
            }
            this.setState(old => { return { genres: [...old.genres, genreToAdd], currentGenre: "" } })
        }
        if (!this.state.currentGenre && e.key === 'Backspace') {
            let arr = [...this.state.genres]
            const genre = arr.pop()
            this.setState({ genres: arr, currentGenre: genre.name })
        }
    }
    deleteGenre(index) {
        let arr = [...this.state.genres]
        arr.splice(index, 1)
        this.setState({ genres: arr })
    }
    onChangeActor(e) {
        if (e.key === 'Enter') {
            const actorArr = this.state.currentActor.split(" ")
            const actorToAdd = {
                id_actor: undefined,
                name: actorArr.shift(),
                surname: actorArr.join(" ")
            }
            this.setState(old => { return { actors: [...old.actors, actorToAdd], currentActor: "" } })
        }
        if (!this.state.currentActor && e.key === 'Backspace') {
            let arr = [...this.state.actors]
            const actor = arr.pop()
            this.setState({ actors: arr, currentActor: `${actor.name} ${actor.surname}` })
        }
    }
    deleteActor(index) {
        let arr = [...this.state.actors]
        arr.splice(index, 1)
        this.setState({ actors: arr })
    }
    searchMovie() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get(`${this.props.apiUrl}/movies?name=${this.state.movieSearchQuery}`, { cancelToken: this.source.token })
            .then(response => response.data)
            .then(data => this.setState({ moviesSearchResult: data }))
            .catch(error => console.error(error))
    }
    callSearch(e) {
        this.setState({ movieSearchQuery: e.target.value }, () => {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => this.searchMovie(), 150);
        })
    }
    enterSearch() {
        this.setState({ focusMovieSearch: true }, () => this.searchMovie())
    }
    leaveSearch(e) {
        if (this.movieSearchResult !== e.relatedTarget)
            this.setState({ focusMovieSearch: false })
    }
    setEditedMovie(movie) {
        this.setState({ name: movie.name, description: movie.description, genres: movie.genres, actors: movie.actors, image_url: movie.img_url, year: movie.release_year, movieId: movie.id_movie, focusMovieSearch: false, loadedMovie: true })
    }
    clearMovieInfo() {
        this.setState({ movieId: -1, name: "", description: "", image_url: "", genres: [], actors: [], release_year: 2017, loadedMovie: false })
    }
    deleteEditedMovie() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        this.setState({ sendingMovieRequest: true }, () => {
            axios.delete(`${this.props.apiUrl}/movies/${this.state.movieId}`, { cancelToken: this.source.token }).then(response => {
                toast.success("Success")
                this.clearMovieInfo();
            }).catch(error => {
                error.response.data ? toast.error(error.response.data) : toast.error("Error")
            }).finally(() => {
                this.setState({ sendingMovieRequest: false })
            })
        })
    }
    updateEditedMovie() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        this.setState({ sendingMovieRequest: true }, () => {
            axios.put(`${this.props.apiUrl}/movies/${this.state.movieId}`,
                {
                    id_movie: this.state.movieId,
                    name: this.state.name,
                    description: this.state.description,
                    release_year: this.state.year,
                    img_url: this.state.image_url,
                    genres: this.state.genres,
                    actors: this.state.actors
                }, { cancelToken: this.source.token }).then(response => {
                    toast.success("Success")
                    this.clearMovieInfo();
                }).catch(error => {
                    error.response.data ? toast.error(error.response.data) : toast.error("Error")
                }).finally(() => {
                    this.setState({ sendingMovieRequest: false })
                })
        })
    }
    createNewMovie() {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        this.setState({ sendingMovieRequest: true }, () => {
            axios.post(`${this.props.apiUrl}/movies`,
                {
                    name: this.state.name,
                    description: this.state.description,
                    release_year: this.state.year,
                    img_url: this.state.image_url,
                    genres: this.state.genres,
                    actors: this.state.actors
                }, { cancelToken: this.source.token }).then(response => {
                    toast.success("Success")
                    this.clearMovieInfo();
                }).catch(error => {
                    error.response.data ? toast.error(error.response.data) : toast.error("Error")
                }).finally(() => {
                    this.setState({ sendingMovieRequest: false })
                })
        })
    }
    render() {
        let movieSearchResult = this.state.focusMovieSearch ? <div tabIndex="0" className="z-50 left-72 w-72 block bg-NavBar4 border-0 font-normal leading-normal text-sm text-left no-underline rounded-sm absolute" ref={(ip) => this.movieSearchResult = ip}>
            <div>
                <ul>
                    {this.state.moviesSearchResult.map((movie, index) => {
                        return <li className="hover:bg-yellow-400 cursor-pointer p-1 mt-1" key={movie.id_movie || index} onClick={() => this.setEditedMovie(movie)}>{movie.name}</li>
                    })}
                </ul>
            </div>
        </div> : null;

        let genresSearchResult = this.state.focusGenreSearch ? <div tabIndex="0" className="z-50 left-72 w-72 block bg-NavBar4 border-0 font-normal leading-normal text-sm text-left no-underline rounded-sm absolute" ref={(ip) => this.genreSearchResult = ip}>
            <div>
                <ul>
                    {this.state.moviesSearchResult.map((movie, index) => {
                        return <li className="hover:bg-yellow-400 cursor-pointer p-1 mt-1" key={movie.id_movie || index} onClick={() => this.setEditedMovie(movie)}>{movie.name}</li>
                    })}
                </ul>
            </div>
        </div> : null;
        let actorsSearchResult = this.state.focusActorSearch ? <div tabIndex="0" className="z-50 left-72 w-72 block bg-NavBar4 border-0 font-normal leading-normal text-sm text-left no-underline rounded-sm absolute" ref={(ip) => this.actorSearchResult = ip}>
            <div>
                <ul>
                    {this.state.moviesSearchResult.map((movie, index) => {
                        return <li className="hover:bg-yellow-400 cursor-pointer p-1 mt-1" key={movie.id_movie || index} onClick={() => this.setEditedMovie(movie)}>{movie.name}</li>
                    })}
                </ul>
            </div>
        </div> : null;
        return (
            <section className={this.props.className}>
                <span className="flex flex-row mb-1"><h2 className="text-2xl mr-3">Editace a vytvoření filmu</h2>
                    <input className="border-indigo-400 border-2 rounded-md p-1 text-sm w-2/12" type="text" onFocus={() => this.enterSearch()} onBlur={(e) => this.leaveSearch(e)} onChange={(e) => this.callSearch(e)} ref={(ip) => this.movieSearch = ip}></input></span>

                {movieSearchResult}
                <form className="flex flex-col bg-NavBar5 w-9/12">
                    <label htmlFor="movieNameText">Název</label>
                    <input className="border-black border-2" type="text" value={this.state.name} id="movieNameText" onChange={(e) => this.setState({ name: e.target.value })}></input>
                    <label htmlFor="movieYearText">Rok vydání</label>
                    <input className="border-black border-2" type="number" min="1900" max="2099" step="1" value={this.state.year} id="movieYearText" onChange={(e) => this.setState({ year: e.target.value })}></input>
                    <label htmlFor="movieDescriptionText">Popis</label>
                    <textarea className="border-black border-2" value={this.state.description} id="movieDescriptionText" onChange={(e) => this.setState({ description: e.target.value })} rows="10"></textarea >
                    <label htmlFor="movieImageUrl">Url obrázku</label>
                    <input className="border-black border-2" value={this.state.image_url} type="url" id="movieImageUrl" onChange={(e) => this.setState({ image_url: e.target.value })}></input>
                    <label htmlFor="genresList">Žánry</label>
                    <ul className="flex flex-wrap bg-white p-1 cursor-text border-black border-2" id="genresList" onClick={(e) => this.genresInput.focus()}>
                        {this.state.genres.map((genre, index) => {
                            return (<li key={index} className="pr-2 mr-1 bg-gray-100 border-gray-800 border rounded-xl"><button type="button" onClick={(e) => this.deleteGenre(index)}><svg className="w-4 h-4 mr-2" viewBox="0 0 15 15"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" /></svg></button><span>{genre.name}</span></li>)
                        })}
                        <li>
                            <input className="focus:outline-none clear-none"
                                value={this.state.currentGenre}
                                type="text"
                                tabIndex="0"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                role="searchbox"
                                aria-autocomplete="list"
                                placeholder={this.state.genres.length > 0 ? "" : "Add Genres"}
                                style={{ width: this.state.genres.length > 0 ? `${0.75 + this.state.currentGenre.length * 0.75}em` : "100%" }}
                                onChange={(e) => this.setState({ currentGenre: e.target.value })}
                                onKeyDown={(e) => this.onChangeGenre(e)}
                                ref={(ip) => this.genresInput = ip} />
                        </li>
                    </ul>
                    {genresSearchResult}
                    <label htmlFor="actorsList">Herci</label>
                    <ul className="flex flex-wrap bg-white p-1 cursor-text border-black border-2" id="actorsList" onClick={(e) => this.actorsInput.focus()}>
                        {this.state.actors.map((actor, index) => {
                            return (<li key={index} className="pr-2 mr-1 bg-gray-100 border-gray-800 border rounded-xl"><button type="button" onClick={(e) => this.deleteActor(index)}><svg className="w-4 h-4 mr-2" viewBox="0 0 15 15"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" /></svg></button><span>{`${actor.name} ${actor.surname || ""}`}</span></li>)
                        })}
                        <li>
                            <input className="focus:outline-none clear-none"
                                value={this.state.currentActor}
                                type="text"
                                tabIndex="0"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                role="searchbox"
                                aria-autocomplete="list"
                                placeholder={this.state.actors.length > 0 ? "" : "Add Actors"}
                                style={{ width: this.state.actors.length > 0 ? `${0.75 + this.state.currentActor.length * 0.75}em` : "100%" }}
                                onChange={(e) => this.setState({ currentActor: e.target.value })}
                                onKeyDown={(e) => this.onChangeActor(e)}
                                ref={(ip) => this.actorsInput = ip} />
                        </li>
                    </ul>
                    {actorsSearchResult}
                    <span className="mt-1 p-1 flex flex-row">
                        {this.state.loadedMovie && <button type="button" disabled={this.state.sendingMovieRequest} onClick={() => this.updateEditedMovie()} className="bg-red-600 rounded-md w-auto text-xl p-1 mr-3">Uložit editovaný film</button>}
                        {this.state.loadedMovie && <button type="button" disabled={this.state.sendingMovieRequest} onClick={() => this.deleteEditedMovie()} className="bg-red-600 rounded-md w-auto text-xl p-1 mr-3">Smazat editovaný film</button>}
                        <button type="button" disabled={this.state.sendingMovieRequest} onClick={() => this.createNewMovie()} className="bg-red-600 rounded-md w-auto text-xl p-1">Vytvořit nový film</button>
                        {this.state.sendingMovieRequest && <ReactLoading type="spinningBubbles" color="#000000" className="ml-5" height="35px" width="35px" />}
                    </span>

                </form>
                <ToastContainer hideProgressBar={true} closeOnClick={true} autoClose={1800} />

            </section>
        )
    }
}
