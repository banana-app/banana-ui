import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Transition } from 'semantic-ui-react'
import { RatingLabel, formatTitle, GenreLabel, SourceLabel } from '../common/MediaItem'
import { QualityLabel, ResolutionLabel } from '../unmatched/MediaFile'
import { Popup } from 'semantic-ui-react'
import axios from 'axios'
import _ from 'lodash'
import store from '../common/ErrorPopup'
import moment from 'moment'

const truncate = (term) => {
    return _(term).truncate({ length: 60 })
}

export class MatchedMedia extends Component {
    render() {
        return (<tr>
            <td>
                <div className="ui basic segment">
                    
                    <div class="ui two column very relaxed grid">
                        
                        <div className="column">
                            <div className="ui list">
                                <div className="item">
                                    <div className="header"><i className="file video outline icon"></i>
                                        <NavLink to={`/unmatched/${this.props.id}/${this.props.name}`}>{truncate(this.props.name)}</NavLink> <span />
                                    </div>
                                    <div className="description"><i className="folder icon"></i>{truncate(this.props.directory)}</div>
                                </div>
                            </div>
                        </div> {/* column */}

                        <div className class="column">
                            <div className="ui list">
                                <div className="item">
                                    <div className="header"><i className="file video outline icon"></i>
                                    <Popup 
                                        trigger={<NavLink to={`/unmatched/${this.props.id}/${this.props.target_name}`}>{truncate(this.props.target_name)}</NavLink>} 
                                    >
                                        <Popup.Content>
                                            <QualityLabel quality={this.props.quality} />
                                            <ResolutionLabel resolution={this.props.resolution} />
                                            {this.props.name}
                                        </Popup.Content>
                                    </Popup>
                                    </div>
                                    <div className="description"><i className="folder icon"></i>{truncate(this.props.target_directory)}</div>
                                </div>
                            </div>
                        </div> {/* column */}
                    
                    </div> { /* grid */}

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
    }

    render() {
        return (
            <div className="ui container">
                <div className="ui relaxed divided items">
                    <div className="item">

                        <Transition
                            transitionOnMount={true}
                            animation="fade"
                            duration="500"
                        >
                            <div className="ui fluid medium image">
                                <img className="medium image" src={this.state.movie.poster} />
                            </div>


                        </Transition>

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