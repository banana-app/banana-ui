import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import axios from 'axios'
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb'
import MediaFile from '../common/MediaFile'
import MediaItem, {formatTitle, MediaItemPlaceholder} from '../common/MediaItem'
import {Dropdown, Menu} from "semantic-ui-react";
import MovieSearch from "./MovieSearch";
import TransitionDeck from "./TransitionDeck";

/*

/movies/:movie_id/:title/media/:media_id/:filename

 */


const searchSourceOptions = [
    {"text": 'TMDb', "value": 'tmdb'},
    {"text": 'IMDb', "value": 'imdb'},
];

class MovieMediaFile extends Component {

    state = {
        media: {},
        movie: {},
        loading: true,
        ready: false,
        action: 'media_item',
        source: searchSourceOptions[0].value
    };

    componentDidMount = () => {

        let {media_id, movie_id} = this.props.match.params;

        axios.get(`/api/media/${media_id}`)
            .then((result) => {
                this.setState({media: result.data})
            });

        axios.get(`/api/movies/${movie_id}`)
            .then((result) => {
                this.setState({movie: result.data, loading: false, ready: true})
            })
    };

    handleMenuItemSelect = (action) => {
        this.setState({
            action: action
        })
    };

    handleResultSelect = (e, {result}) => {
        // "/movies/:movie_id/media/:media_id/fixmatch/:source/:match_candidate_id"
        let {media_id, movie_id} = this.props.match.params;
        let to = encodeURI(`/movies/${movie_id}/media/${media_id}/fixmatch/${result.source}/${result.source_id}`);
        this.props.history.push(to)
    };

    render() {

        let media = this.state.media;
        let movie = this.state.movie;
        let title = formatTitle(movie.title, movie.release_year);
        let filename = media.filename;
        let movie_id = movie.id;
        let media_id = media.id;

        return (

            <Route render={({history}) => (

                <div className="ui container">

                    <div className="top breadcrumb">
                        <Breadcrumb>
                            <BreadcrumbItem to="/movies" name="Movies"/>
                            <BreadcrumbItem to={`/movies/${movie_id}/${encodeURI(title)}`} name={title}/>
                            <BreadcrumbItem
                                to={`/movies/${movie_id}/${encodeURI(title)}/media/${media_id}/${encodeURI(filename)}`}
                                name="Media"/>
                            <BreadcrumbItem to={`/movies/${movie_id}/${encodeURI(title)}/media/${media_id}/${filename}`}
                                            name={filename} final/>

                        </Breadcrumb>

                    </div>

                    <div className="ui basic segment">
                        <div className="ui items">


                            <MediaFile
                                title={media.title}
                                filename={media.filename}
                                year={media.year}
                                resolution={media.resolution}
                                quality={media.quality}
                                season={media.season}
                                episode={media.episode}
                                path={media.path}
                            >

                                <div className="ui right floated text menu">
                                    <Menu borderless tabular className='top attached basic text'
                                    >

                                        <Dropdown icon='cog'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    onClick={(e, data) => this.handleMenuItemSelect('fix_match')}>
                                                    <i className={'icon clone'}></i>Fix match</Dropdown.Item>

                                                <Dropdown.Item
                                                    onClick={(e, data) => this.handleMenuItemSelect('unmatch')}>
                                                    <i className={'icon unlink'}></i> Unmatch</Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={(e, data) => this.handleMenuItemSelect('delete')}>
                                                    <i className={'icon delete'}></i>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                    </Menu>
                                </div>
                            </MediaFile>
                        </div>
                    </div>

                    <TransitionDeck activeCard={this.state.action}>

                        <TransitionDeck.Card name={"fix_match"}>
                            <div className="ui three column grid">
                                <div className="column"></div>

                                <div className="column">
                                    <div className="ui center aligned basic segment">
                                        <div className="ui icon header"><i className="icon search"></i>
                                            Find a movie or show on <Dropdown inline
                                                                              defaultValue={searchSourceOptions[0].value}
                                                                              options={searchSourceOptions}
                                                                              onChange={this.handleSearchSourceChange}
                                            /> to fix this match.
                                        </div>
                                        <MovieSearch
                                            source={this.state.source}
                                            onResultSelect={this.handleResultSelect}
                                        />
                                    </div>
                                    <div className="column"></div>
                                </div>
                            </div>
                        </TransitionDeck.Card>

                        <TransitionDeck.Card name={"media_item"}>
                            <div className="ui basic segment">
                                <div className="ui horizontal divider">
                                    <i className="linkify icon"></i>
                                    <span/>Linked to
                                </div>

                                {this.state.ready &&

                                <MediaItem
                                    title={movie.title}
                                    plot={movie.plot}
                                    poster={movie.poster}
                                    year={movie.release_year}

                                >
                                </MediaItem>
                                }
                                {!this.state.ready &&
                                <MediaItemPlaceholder/>
                                }
                            </div>
                        </TransitionDeck.Card>

                        <TransitionDeck.Card name={"unmatch"}>
                            <div><h1>unmatch</h1></div>
                        </TransitionDeck.Card>

                        <TransitionDeck.Card name={"delete"}>
                            <div><h1>delete</h1></div>
                        </TransitionDeck.Card>
                    </TransitionDeck>

                </div>
            )}>
            </Route>
        )
    }

}

export default MovieMediaFile;