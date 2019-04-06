import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Transition } from 'semantic-ui-react'
import {RatingLabel, formatTitle, GenreLabel, SourceLabel, Poster} from '../common/MediaItem'
import { QualityLabel, ResolutionLabel } from '../unmatched/MediaFile'
import { Popup } from 'semantic-ui-react'
import axios from 'axios'
import _ from 'lodash'
import store from '../common/ErrorPopup'
import moment from 'moment'
import PropTypes from "prop-types";
import Breadcrumb, {BreadcrumbItem} from "../Breadcrumb";

const truncate = (term) => {
    return _(term).truncate({ length: 60 })
};

const VideoFile = (props) => {
    return <Popup trigger={<NavLink to={props.link_to}><i className="file video outline icon"></i>{truncate(props.name)}</NavLink>} wide>
        <Popup.Header>
            <QualityLabel quality={props.quality}/>
            <ResolutionLabel resolution={props.resolution}/>
        </Popup.Header>
        <Popup.Content>
            {props.name}
        </Popup.Content>
    </Popup>;
};

const Folder = (props) => {
    return <Popup trigger={<div><i className="folder icon"></i>{truncate(props.name)}</div>} wide>
        <Popup.Content>
            {props.name}
        </Popup.Content>
    </Popup>;
};


VideoFile.propTypes = {
    link_to: PropTypes.string,
    quality: PropTypes.string,
    resolution: PropTypes.string,
    name: PropTypes.string
};

export class MatchedMedia extends Component {
    render() {
        return (<tr>
            <td>
                <div className="ui basic segment">

                    <div class="ui two column very relaxed grid">

                        <div className="column">
                            <div className="ui list">
                                <div className="item">
                                    <div className="header">

                                        <VideoFile link_to={`/movies`}
                                                   quality={this.props.quality} resolution={this.props.resolution}
                                                   name={this.props.target_name}/>
                                    </div>
                                    <div className="description">
                                        <Folder name={this.props.target_directory} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* column */}

                        <div className class="column">
                            <div className="ui list">
                                <div className="item">
                                    <div className="header">

                                        <VideoFile link_to={`movies`}
                                                   quality={this.props.quality} resolution={this.props.resolution}
                                                   name={this.props.name}/>

                                    </div>
                                    <div className="description">
                                        <Folder name={this.props.directory}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* column */}

                    </div>
                    { /* grid */}

                    <div className="ui vertical divider">
                        <i className="ui icon linkify"></i>
                    </div>
                </div>
            </td>
            <td className="right aligned">
                {moment(this.props.created_datetime).fromNow()}
            </td>
        </tr>);
    }
}

export const CastItem = (props) => {
    return (
        <div className="item">
            <img className="ui avatar image"
                src={props.profile_picture} />
            <div className="content">
                <div className="header">{props.character}</div>
                {props.name}
            </div>
        </div>
    )
}

class Movie extends Component {

    state = { movie: { genres: [{ name: "foo" }], media_items: [] }, cast: [] }

    componentDidMount = () => {
        axios.get(`/api/movies/${this.props.match.params.movie_id}`)
            .then(result => {
                this.setState({ movie: result.data })
                axios.get(`/api/movies/${result.data.external_id}/cast`)
                    .then(result => {
                        this.setState({ cast: result.data })
                    })
                    .catch(error => {
                        store.error.message = error.message
                        store.error.raised = true
                    })

            })
    };

    render() {
        return (

            <div className="ui container">
                <div className="top breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem to="/movies" name="Movies" />
                        <BreadcrumbItem
                            to={`/movies/${this.props.match.params.movie_id}/${encodeURI(formatTitle(this.state.movie.title,
                                this.state.movie.release_year))}`}
                            name={`${formatTitle(this.state.movie.title,this.state.movie.release_year)}`}
                        final />
                    </Breadcrumb>
                </div>
                <div className="ui relaxed divided items">
                    <div className="item">

                        <div className="ui fluid medium image">
                            <Poster poster={this.state.movie.poster} />
                        </div>


                        <Transition
                            transitionOnMount={true}
                            animation="fade"
                            duration="500"
                        >
                            <div className="ui content">

                                <div className="header">
                                    <div className="ui medium header">{formatTitle(this.state.movie.title, this.state.movie.release_year)}</div>
                                </div>

                                <div className="meta">
                                    {!_.eq(this.state.movie.title, this.state.movie.original_title) &&
                                        <div className="ui small header">
                                            {formatTitle(this.state.movie.original_title, this.state.movie.release_year)}
                                        </div>
                                    }
                                    <SourceLabel source={this.state.movie.source} />
                                    <RatingLabel rating={this.state.movie.rating} />
                                    {this.state.movie.genres.map(g =>
                                        <GenreLabel key={g.id} genre={g.name} />
                                    )}
                                </div>

                                <div className="ui basic vertical segment">
                                    <div className="description" >
                                        <div className="ui small header">{this.state.movie.plot}</div>
                                    </div>
                                </div>

                                {this.state.cast.length > 0 &&
                                    <div className="ui basic vertical segment">
                                        <h4>Cast</h4>
                                        <div class="ui horizontal list">
                                            {this.state.cast.map(c =>
                                                <CastItem name={c.name}
                                                    profile_picture={c.profile_picture}
                                                    character={c.character} />
                                            )}
                                        </div>
                                    </div>
                                }

                            </div>
                        </Transition>
                    </div> {/* item */}
                </div> {/* items */}

                { /* matched media items */}
                <table className="ui celled striped table">
                    <thead>
                        <tr>
                            <th colSpan="2">Files </th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.movie.media_items.map(i =>
                            <MatchedMedia
                                name={i.filename}
                                target_name={i.target_filename}
                                id={i.id}
                                directory={i.path}
                                target_directory={i.target_path}
                                quality={i.quality}
                                resolution={i.resolution}
                                created_datetime={i.created_datetime} />
                        )}

                    </tbody>
                </table>
                { /* matched media items */}

            </div>
        );
    }

}



export default Movie