import React, {Component} from 'react';
import MediaItem, {formatTitle, GenreLabel, SourceLabel} from '../common/MediaItem';
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb';
import axios from 'axios';
import {Dropdown} from 'semantic-ui-react'
import {Route} from 'react-router'
import MediaFile from '../common/MediaFile'
import MovieSearch from "../movies/MovieSearch";


const searchSourceOptions = [
    { "text": 'TMDb ', "value": 'tmdb' },
    { "text": 'IMDb ', "value": 'imdb' },
];

class UnmatchedItem extends Component {

    state = {
        unmatched_item: { potential_matches: [], parsed_media_item: {} },
        searchSource: searchSourceOptions[0].value
    };

    componentDidMount = () => {
        axios.get(`/api/unmatched/${this.props.match.params.id}/${this.props.match.params.item}`)
            .then((result) => {
                this.setState({ unmatched_item: result.data })
            })
    };

    handleSearchSourceChange = (e, { value }) => {
        this.setState({ searchSource: value })
    };

    handleResultSelect = (e, {result}) => {
        let m = this.state.unmatched_item;
        let title = formatTitle(result.title, result.release_year);
        let to = encodeURI(`/unmatched/${m.id}/${encodeURI(title)}/match/${result.source}/${result.source_id}`);
        this.props.history.push(to)
    };

    render() {

        return (
            <Route render={({ history }) => (
                <div className="ui container">
                    <div className="top breadcrumb">
                        <Breadcrumb>
                            <BreadcrumbItem to="/unmatched" name="Unmatched"/>
                            <BreadcrumbItem to={this.props.match.url} name={this.props.match.params.item} final/>
                        </Breadcrumb>
                    </div>
                    <div className="ui basic segment">

                        <div className="ui items">

                            <MediaFile
                                title={this.state.unmatched_item.parsed_media_item.title}
                                filename={this.state.unmatched_item.parsed_media_item.filename}
                                year={this.state.unmatched_item.parsed_media_item.year}
                                resolution={this.state.unmatched_item.parsed_media_item.resolution}
                                quality={this.state.unmatched_item.parsed_media_item.quality}
                                season={this.state.unmatched_item.parsed_media_item.season}
                                episode={this.state.unmatched_item.parsed_media_item.episode}
                                path={this.state.unmatched_item.parsed_media_item.path}
                            />

                            <div className="ui icon dark grey message">
                                <i className="frown icon"></i>
                                <div className="content">
                                    <div className="header">
                                        OK, so what happened here?
                                    </div>
                                    <p>Well, we tried to find best match for Your new awesome movie, but we feel that we
                                        need Your help. We are not quite sure what we have found is totally okay.
                                        We rather don't want to mess with Your library. So please review, what we've
                                        found and help us get things fixed. Thanks! <i className="icon beer"></i></p>
                                </div>
                            </div>
                        </div>

                        <div className="ui horizontal divider">
                            Now, You can
                        </div>

                        <div className="ui basic segment">
                            <div className="ui two column very relaxed stackable grid">
                                <div className="column">

                                    <div className="ui center aligned basic segment">
                                        <div className="ui icon header"><i className="icon search"></i>
                                            Search <Dropdown inline
                                                             defaultValue={searchSourceOptions[0].value}
                                                             options={searchSourceOptions}
                                                             onChange={this.handleSearchSourceChange}/>
                                        </div>
                                        <MovieSearch
                                            source={this.state.searchSource}
                                            onResultSelect={this.handleResultSelect}
                                        />
                                    </div>
                                </div>


                                <div className="column">
                                    <div className="ui relaxed divided items">
                                        <div className="ui basic center aligned segment">
                                            <div className="ui icon header"><i className="icon magic"></i>Choose one,
                                                we think You may like
                                            </div>
                                        </div>

                                        {this.state.unmatched_item.potential_matches.map(m =>
                                            <MediaItem key={m.id}
                                                       poster={m.poster}
                                                       plot={m.plot}
                                                       title={m.title}
                                                       year={m.release_year}
                                                       match={m.match}
                                                       rating={m.rating}
                                                       link_to={`/unmatched/${this.state.unmatched_item.id}/${this.state.unmatched_item.parsed_media_item.filename}/match/local/${m.id}`}
                                            >

                                                <SourceLabel source={m.source}/>
                                                {m.genres.slice(0,3).map(g =>
                                                    <GenreLabel key={g.id} genre={g.name}/>
                                                )}
                                            </MediaItem>
                                        )}

                                    </div>


                                </div>
                            </div>
                            <div className="ui vertical divider">
                                Or
                            </div>
                        </div>
                    </div>
                </div>

            )} />
        )

    }

}

export default UnmatchedItem;