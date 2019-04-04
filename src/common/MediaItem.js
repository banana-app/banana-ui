import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Popup } from 'semantic-ui-react'
import moment from 'moment'
import _ from 'lodash'
import { Transition } from 'semantic-ui-react'
import placeholder from '../img/poster_placeholder.png'
import Img from 'react-image'

export const formatTitle = (title, year) => {
    if (!_.isUndefined(year) && !_.isNull(year))
        return `${title} (${year})`
    else
        return title
}

export const yearFromTmdbDate = (date) => {
    if (typeof date !== typeof undefined) {
        return moment(date, "YYYY-MM-DD").toDate().getFullYear()
    }
    return undefined
}

export const RatingLabel = (props) => {
    return (
        <React.Fragment>
            {typeof props.rating !== typeof undefined && props.rating !== null &&
                <div className="yellow ui mini label">
                    <i className="star icon"></i>
                    <div className="detail">{props.rating}/10</div>
                </div>
            }
        </React.Fragment>
    )
}

export const GenreLabel = (props) => {
    return (<React.Fragment>
        {typeof props.genre !== typeof undefined && props.genre !== null &&
            <div className="ui mini label">
                <i className="tag icon"></i>
                <div className="detail">{props.genre}</div>
            </div>
        }
    </React.Fragment>)
}

export const SourceLabel = (props) => {
    return (<React.Fragment>
        {typeof props.source !== typeof undefined && props.source !== null &&
            <div className="ui mini label">
                <i className="map pin icon"></i>
                <div className="detail">{props.source}</div>
            </div>
        }
    </React.Fragment>)
}

export class HighQualityMoviePoster extends Component {

    state = { posterClass: "ui hidden image", placeholderClass: "ui image", placeholderReval: true }

    handlePosterLoadingError = (e) => {
        //this.setState({ posterClass: "ui hidden image", placeholderClass: "ui image", placeholderReval: true })
    }

    handlePosterLoadingSuccess = (e) => {
        this.setState({ posterClass: "ui image", placeholderClass: "ui hidden image", placeholderReval: false })
    }

    render() {
        return (

            <React.Fragment>

                        <Img
                            src={`${this.props.poster}`} 
                            container={children => {
                                return (
                                    <Transition
                                    transitionOnMount={true}
                                    unmountOnHide={true}
                                    animation="fade"
                                    duration="500"
                                >
                                    {children}
                                  </Transition>
                                )
                              }}
                            loader={ <img src={placeholder} className="faded placeholder" /> }
                            unloader={ <img src={placeholder} /> }
                        />

            {/*

                <div className={this.state.posterClass} >
                    <Transition
                        transitionOnMount={true}
                        animation="fade"
                        duration="500"
                    >
                        <img src={`${this.props.poster}`}
                            onError={this.handlePosterLoadingError}
                            onLoad={this.handlePosterLoadingSuccess} />
                    </Transition>
                </div>



                <div className={this.state.placeholderClass}>
                    <Transition
                        transitionOnMount={true}
                        animation="fade"
                        duration="0"
                        visible={this.state.placeholderReval}
                    >

                        <img src="/img/poster_placeholder.png" />
                    </Transition>
                </div>
            */}


            </React.Fragment>

        )
    }
}


class MediaItem extends Component {
    render() {
        return (



            <div className="ui relaxed divided items">


                <div className="item">

                    {!this.props.link_to &&
                        <Transition
                            transitionOnMount={true}
                            animation="fade"
                            duration="500"
                        >
                            <NavLink to={`/movies/${encodeURI(formatTitle(this.props.title, this.props.year))}`} className="ui tiny image fluid">
                                <div className="ui small image">
                                    <HighQualityMoviePoster poster={this.props.poster} />
                                </div>
                                {this.props.media_items && this.props.media_items > 1 &&
                                    <div class="ui red label top right attached mini">
                                        {this.props.media_items}
                                    </div>
                                }
                            </NavLink>
                        </Transition>
                    }
                    {this.props.link_to &&
                        <Transition
                            transitionOnMount={true}
                            animation="fade"
                            duration="500"
                        >
                            <NavLink to={this.props.link_to} className="ui tiny image fluid">
                                <div className="ui small image">
                                    <HighQualityMoviePoster poster={this.props.poster} />
                                </div>
                                {this.props.media_items && this.props.media_items > 1 &&
                                    <div class="ui red label top right attached mini">
                                        {this.props.media_items}
                                    </div>
                                }
                            </NavLink>
                        </Transition>
                    }


                    <Transition
                        transitionOnMount={true}
                        animation="fade"
                        duration="500"
                    >
                        <div className="content">

                            {!this.props.link_to &&
                                <NavLink className="header" to={`/movies/${encodeURI(formatTitle(this.props.title, this.props.year))}`}>{formatTitle(this.props.title, this.props.year)}</NavLink>
                            }

                            {this.props.link_to &&
                                <NavLink className="header" to={this.props.link_to}>{formatTitle(this.props.title, this.props.year)}</NavLink>
                            }

                            <div className="meta">
                                <RatingLabel rating={this.props.rating} />

                                {this.props.children}

                            </div>

                            <div className="description" >
                                <Popup trigger={<div>{_(this.props.plot).truncate({ length: 200 })}</div>}
                                    content={this.props.plot}
                                />
                            </div>

                            {typeof this.props.match != 'undefined' &&
                                <div className="extra">
                                    <div className="ui label green">Match<div class="detail">{this.props.match}%</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </Transition>
                </div>


            </div>


        );
    }
}

export default MediaItem;