import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom';
import _ from 'lodash'
import {Transition} from 'semantic-ui-react'
import placeholder from '../img/poster_placeholder.png'
import Img from 'react-image'


export const isSet = (val) => {
    return !_.isUndefined(val) && !_.isNull(val)
};

export const formatTitle = (title, year) => {
    if (isSet(year))
        return `${title} (${year})`;
    else
        return title
};

export const RatingLabel = (props) => {
    return (
        <React.Fragment>
            {isSet(props.rating) &&
            <div className="yellow ui mini label">
                <i className="star icon"></i>
                <div className="detail">{props.rating}/10</div>
            </div>
            }
        </React.Fragment>
    )
};

RatingLabel.propTypes = {
    rating: PropTypes.string
};

export const GenreLabel = (props) => {
    return (<React.Fragment>
        {isSet(props.genre) &&
        <div className="ui mini label">
            <i className="tag icon"></i>
            <div className="detail">{props.genre}</div>
        </div>
        }
    </React.Fragment>)
};

GenreLabel.propTypes = {
    genre: PropTypes.string
};

export const SourceLabel = (props) => {
    return (<React.Fragment>
        {isSet(props.source) &&
        <div className="ui mini label">
            <i className="map marker alternate icon"></i>
            <div className="detail">{props.source}</div>
        </div>
        }
    </React.Fragment>)
};

SourceLabel.propTypes = {
    source: PropTypes.string
};


export class Poster extends Component {

    render() {

        return (
            <React.Fragment>
                <Img
                    src={`${this.props.poster}`}
                    alt=""
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
                    loader={<img alt="movie poster" src={placeholder} className="faded placeholder"/>}
                    unloader={<img alt="movie poster" src={placeholder} className="faded placeholder"/>}
                />
            </React.Fragment>
        )
    }
}

Poster.propTypes = {
    poster: PropTypes.string
};


const NumberOfMediaFiles = (props) => {
    return <React.Fragment>
        {props.media_items && props.media_items > 1 &&
        <div className="ui red label top right attached mini">
            {props.media_items}
        </div>
        }
    </React.Fragment>;
};

NumberOfMediaFiles.propTypes = {
    media_items: PropTypes.number
};

NumberOfMediaFiles.propTypes = {media_items: PropTypes.number};

class MediaItem extends Component {

    render() {

        return (
            <div className="ui relaxed divided items">

                <div className="item">
                    {!isSet(this.props.link_to) &&
                        <Transition
                            transitionOnMount={true}
                            animation="fade"
                            duration="500"
                        >
                            <React.Fragment>
                            <div className="ui tiny rounded image">
                                <Poster poster={this.props.poster}/>
                            </div>
                            <NumberOfMediaFiles media_items={this.props.media_items}/>
                            </React.Fragment>
                        </Transition>
                    }
                    {isSet(this.props.link_to) &&
                        <Transition
                            transitionOnMount={true}
                            animation="fade"
                            duration="500"
                        >
                            <NavLink to={this.props.link_to} className="ui tiny image fluid">
                                <div className="ui tiny rounded image">
                                    <Poster poster={this.props.poster}/>
                                </div>
                                <NumberOfMediaFiles media_items={this.props.media_items}/>
                            </NavLink>
                        </Transition>
                    }


                    <Transition
                        transitionOnMount={true}
                        animation="fade"
                        duration="500"
                    >
                        <div className="content">

                            {!isSet(this.props.link_to) &&
                            <div className="header">{formatTitle(this.props.title, this.props.year)}</div>
                            }

                            {isSet(this.props.link_to) &&
                            <NavLink className="header"
                                     to={this.props.link_to}>{formatTitle(this.props.title, this.props.year)}</NavLink>
                            }

                            <div className="meta">
                                <RatingLabel rating={this.props.rating}/>
                                {this.props.children}
                            </div>

                            <div className="description">
                                {_(this.props.plot).truncate({length: 200})}
                            </div>

                            {isSet(this.props.match) &&
                            <div className="extra">
                                <div className="ui label green">Match
                                    <div className="detail">{this.props.match}%</div>
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

export const MediaItemPlaceholder = ({props}) => {
    return (<div className="ui relaxed divided items">

        <div className="item placeholder">

            <div className="ui tiny image">
                <div className="ui tiny rounded image">
                    <Poster poster=""/>
                </div>
            </div>

            <div className="content">
                █████████████████████████████████

                <div className="meta">
                    <GenreLabel rating="     "/>
                    <GenreLabel rating="        "/>
                </div>

                <div className="description">
                    <h5>█████████████████████████████████████████████████████</h5>
                    <h5>█████████████████</h5>
                </div>
            </div>

        </div>

    </div>);
};

export default MediaItem;
