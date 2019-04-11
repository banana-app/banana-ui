import {formatTitle, Poster} from "../common/MediaItem";
import _ from "lodash";
import {PropTypes} from "prop-types";
import React, {Component} from "react";
import axios from "axios";
import {cacheAdapterEnhancer, throttleAdapterEnhancer} from "axios-extensions";
import {Search} from "semantic-ui-react";

export const MovieResultRenderer = ({plot, title, poster, release_year, original_title, source_id}) => {

    return (
        <div key={source_id} className="item">
            <div className="ui tiny image">
                <Poster poster={poster}/>
            </div>
            <div className="content">
                <strong>{formatTitle(title, release_year)}</strong>
                <div className="meta">
                    <span>{original_title && original_title}</span>
                </div>
                <div className="description">
                </div>
                <div className="extra">
                    <p>{_.truncate(plot, {length: 200})}</p>
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

class MovieSearch extends Component {

    state = {
        results: [],
        value: '',
        isLoading: false
    };

    search = axios.create({
        baseURL: `/`,
        headers: {'Cache-Control': 'no-cache'},
        adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter), {threshold: 5000})
    });

    handleSearchChange = (e, {value}) => {
        this.setState({isLoading: true, value: value});
        let source = this.props.source;
        this.search.get(`/api/sources/${source}/search?title=${value}`)
            .then((result) => {
                this.setState({results: []})
                // above clearing state is to fix strange bug with react semantic-ui search component
                this.setState({isLoading: false, results: result.data.results})
            })
    };

    handleResultSelect = (e, {result}) => {
        this.props.onResultSelect(e, {result})
    };

    render() {
        return <Search
            onSearchChange={this.handleSearchChange}
            onResultSelect={this.handleResultSelect}
            results={this.state.results.map(s => ({...s, key: s.source_id}))}
            loading={this.state.loading}
            placeholder={"Search..."}
            value={this.state.value}
            resultRenderer={MovieResultRenderer}
            fluid
            aligned={"left"}
        >

        </Search>;
    }
}

MovieSearch.propTypes = {
    source: PropTypes.string,
    onResultSelect: PropTypes.func
};

export default MovieSearch;

