import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {NavLink} from 'react-router-dom'
import {Route} from 'react-router'
import jobStore from './common/JobsStore'
import {Search} from 'semantic-ui-react'
import axios from 'axios'
import PropTypes from 'prop-types'
import {formatTitle, Poster} from './common/MediaItem'
import {ResolutionLabel} from './common/MediaFile'
import {throttleAdapterEnhancer, cacheAdapterEnhancer} from 'axios-extensions'
import _ from 'lodash'


export const MovieResultRenderer = ({plot, title, poster, release_year, original_title, source_id, category, resolution, summary}) => {

    return (
        <React.Fragment>
            {category.includes('movie') &&
            <React.Fragment>
                <div className="ui image">
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
            </React.Fragment>
            }
            {category.includes('media') &&
            <div><ResolutionLabel resolution={resolution}/>{title}</div>
            }

            {category.includes('summary') &&
            <div style={{textAlign: "center"}}><h4>{summary}</h4></div>
            }
        </React.Fragment>
    )
};

MovieResultRenderer.propTypes = {
    title: PropTypes.string,
    poster: PropTypes.string,
    plot: PropTypes.string,
    release_year: PropTypes.string,
    original_title: PropTypes.string,
    source_id: PropTypes.string,
    category: PropTypes.string,
    resolution: PropTypes.string
};

export const JobIndicator = observer(class JobIndicator extends Component {

    render() {
        const jobStore = this.props.jobStore
        return (
            <React.Fragment>
                {jobStore.hasActiveJobs &&
                <i className="sync loading icon"></i>
                }
                {!jobStore.hasActiveJobs &&
                <i className="sync icon"></i>
                }
            </React.Fragment>)
    }
});

class Ribbon extends Component {

    state = {
        isLoading: false,
        results: [],
        value: '',
    };

    search = axios.create({
        baseURL: `/`,
        headers: {'Cache-Control': 'no-cache'},
        adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter), {threshold: 5000})
    });


    handleSearchChange = (e, {value}) => {
        this.setState({isLoading: true, value: value, results: []})
        this.search.get(`/api/sources/local/search?title=${value}`)
            .then((movies) => {


                this.search.get(`/api/media/search?term=${value}`)
                    .then((media) => {
                        this.setState({results: []})

                        let aggregated = [...movies.data.results.map(s => ({
                            ...s,
                            key: s.source_id,
                            category: "movie"
                        })),
                            ...media.data.results.map(s => ({
                                title: s.filename,
                                key: s.id,
                                resolution: s.container,
                                category: "media"
                            }))];

                        if (movies.data.total_results > 3 || media.data.total_results > 3)
                            aggregated.push(
                                {
                                    summary: `View all ${movies.data.total_results + media.data.total_results} results`,
                                    category: 'summary'
                                }
                            );

                        this.setState({
                            isLoading: false, results: aggregated
                        })

                    })

            })


    };

    handleResultSelect = (e, {result}) => {
        let to = encodeURI(`/movies/${result.source_id}/${formatTitle(result.title, result.release_year)}`)
        this.props.history.push(to)
    };

    render() {
        return (

            <Route render={({history}) => (

                <div className="ribbon">
                    <div className="ui container">
                        <div className="ui right floated text menu">
                            <div className="icon item">
                                <i className="wrench icon"></i>
                            </div>
                        </div>

                        <div className="ui right floated text menu">
                            <NavLink to='/dashboard/jobs' className="icon item">
                                <JobIndicator jobStore={jobStore}/>

                                {/*<div class="floating ui circular mini yellow label">2</div>*/}
                            </NavLink>
                        </div>

                        <div className="ui text menu">
                            <NavLink to='/movies'>
                                <img src="/img/banana.png" alt="" className="ui right spaced image mini"/>
                            </NavLink>

                            <Search
                                resultRenderer={MovieResultRenderer}
                                onSearchChange={this.handleSearchChange}
                                onResultSelect={this.handleResultSelect}
                                results={this.state.results}
                                loading={this.state.isLoading}
                                placeholder={"Search..."}
                                value={this.state.value}

                                fluid
                                {...this.props}
                            />

                        </div>

                    </div>

                </div>
            )}/>
        )
    }

}

export default Ribbon;