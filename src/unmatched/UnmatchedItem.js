import React, { Component } from 'react';
import _ from 'lodash'
import MediaItem, { Poster, formatTitle, SourceLabel, GenreLabel } from '../common/MediaItem';
import Breadcrumb, { BreadcrumbItem } from '../Breadcrumb';
import axios from 'axios';
import { Search, Dropdown } from 'semantic-ui-react'
import { PropTypes } from 'prop-types'
import { Route } from 'react-router'
import { throttleAdapterEnhancer, cacheAdapterEnhancer } from 'axios-extensions';
import MediaFile from './MediaFile'


const searchSourceOptions = [
    { "text": 'TMDb', "value": 'tmdb' },
    { "text": 'IMDb', "value": 'imdb' },
];
        
export const MovieResultRenderer = ({ plot, title, poster, release_year, original_title, source_id }) => {

    return (
            <div key={source_id} className="item">
                <div className="ui tiny image">
                    <Poster poster={poster} />
                </div>
                <div className="content">
                    <strong>{formatTitle(title, release_year)}</strong>
                    <div className="meta">
                        <span>{original_title && original_title}</span>
                    </div>
                    <div className="description">
                    </div>
                    <div className="extra">
                        <p>{_.truncate(plot, { length: 200 })}</p>
                    </div>
                </div>
            </div>
    )
};
 
MovieResultRenderer.propTypes = {
    title: PropTypes.string,
    poster: PropTypes.string,
    plot: PropTypes.string,
    release_year: PropTypes.string,
    original_title: PropTypes.string,
    source_id: PropTypes.string
};

class UnmatchedItem extends Component {

    state = {
        unmatched_item: { potential_matches: [], parsed_media_item: {} },
        isLoading: false,
        results: [],
        value: '',
        searchSource: searchSourceOptions[0].value
    };

    componentDidMount = () => {
        axios.get(`/api/unmatched/${this.props.match.params.id}/${this.props.match.params.item}`)
            .then((result) => {
                this.setState({ unmatched_item: result.data })
            })
    };

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });

    search = axios.create({
        baseURL: `/`,
        headers: { 'Cache-Control': 'no-cache' },
        adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter), { threshold: 5000 })
    });


    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value: value });
        this.search.get(`/api/movies/search?title=${value}&source=${this.state.searchSource}&for_item=${this.state.unmatched_item.id}`)
            .then((result) => {
                this.setState({ results: [] })
                // above clearing state is to fix strange bug with react semantic-ui search component
                this.setState({ isLoading: false, results: result.data })
            })
    };

    handleResultSelect = (e, { result }) => {
        let to = encodeURI(`/unmatched/${this.state.unmatched_item.id}/${formatTitle(result.title, result.release_year)}/match/${result.source}/${result.source_id}`)
        this.props.history.push(to)
    };

    handleSearchSourceChange = (e, { value }) => {
        this.setState({ searchSource: value })
    };

    render() {

        return (
            <Route render={({ history }) => (
                <div className="ui container">
                    <div className="top breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem to="/unmatched" name="Unmatched" />
                        <BreadcrumbItem to={this.props.match.url} name={this.props.match.params.item} final />
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

                                    <div className="ui basic segment">
                                        <div className="ui header"><i class="icon search"></i>
                                            Search  <Dropdown inline
                                                defaultValue={searchSourceOptions[0].value}
                                                options={searchSourceOptions}
                                                onChange={this.handleSearchSourceChange} />
                                        </div>
                                    </div>

                                    <div className="ui basic segment">
                                        <Search
                                            onSearchChange={this.handleSearchChange}
                                            onResultSelect={this.handleResultSelect}
                                            results={this.state.results.map(s => ({...s, key: s.source_id }))}
                                            loading={this.state.isLoading}
                                            placeholder={"Search..."}
                                            value={this.state.value}
                                            resultRenderer={MovieResultRenderer}
                                            fluid
                                            {...this.props}
                                        >

                                        </Search>
                                    </div>
                                </div>


                                <div className="column">
                                    <div className="ui relaxed divided items">
                                        <div className="ui basic segment">
                                            <div className="ui header"><i class="icon magic"></i>Help Us to choose, the right one, we
                                    think You may like</div>
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
                                                
                                                <SourceLabel source={m.source} />
                                                {m.genres.map(g => 
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