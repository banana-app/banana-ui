import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import axios from 'axios'
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb'
import MediaFile from '../common/MediaFile'
import MediaItem, {formatTitle, MediaItemPlaceholder} from '../common/MediaItem'
import {Progress} from 'semantic-ui-react'
import {when} from "mobx";
import {observer} from 'mobx-react'
import jobStore from '../common/JobsStore'
import _ from 'lodash'

/*
 "/movies/:movie_id/media/:media_id/fixmatch/:source/:match_candidate_id"
 */

const FixMatchItem = observer(
    class FixMatchItem extends Component {

        state = {
            parsed_media_item: {},
            match_candidate: {},
            loading: true,
            ready: false,
            processing: false
        };


        componentDidMount = () => {

            let p = this.props.match.params;

            axios.get(`/api/media/${p.media_id}`)
                .then((result) => {
                    this.setState({parsed_media_item: result.data})
                });

            axios.get(`/api/movies/sources/${p.source}/${p.match_candidate_id}`)
                .then((result) => {
                    this.setState({match_candidate: result.data, loading: false, ready: true})
                })
        };

        handleMatch = (e) => {
            this.setState({loading: true, processing: true});
            let p = this.props.match.params;

            axios.post(`/api/media/${p.media_id}`, {
                match_type: p.source,
                unmatched_item_id: p.id,
                match_type_id: p.match_candidate_id
            })
                .then((result) => {

                    let job = result.data;
                    when(
                        () => _.some(jobStore.jobs, {event_type: "completed", job_id: job.job_id}),
                        () => {
                            this.props.history.push(`/movies?job_id=${job.job_id}`)
                        }
                    )
                })
        };

        handleCancel = (e) => {
            this.props.history.push(`/unmatched/${this.props.match.params.id}/${this.state.parsed_media_item.filename}`)
        };

        render() {

            let pc = this.state.match_candidate;

            return (

                <Route render={({history}) => (

                    <div className="ui container">

                        <div className="top breadcrumb">
                            <Breadcrumb>
                                <BreadcrumbItem to="/unmatched" name="Unmatched"/>
                                <BreadcrumbItem to={this.props.match.url}
                                                name={formatTitle(this.state.match_candidate.title,
                                                    this.state.match_candidate.release_year)} final/>
                            </Breadcrumb>
                        </div>
                        <div class="ui basic segment">
                            <div class="ui items">


                                <MediaFile
                                    title={this.state.parsed_media_item.title}
                                    filename={this.state.parsed_media_item.filename}
                                    year={this.state.parsed_media_item.year}
                                    resolution={this.state.parsed_media_item.resolution}
                                    quality={this.state.parsed_media_item.quality}
                                    season={this.state.parsed_media_item.season}
                                    episode={this.state.parsed_media_item.episode}
                                    path={this.state.parsed_media_item.path}
                                />

                                <div className="ui horizontal divider">
                                    <i className="linkify icon"></i>
                                    Will be linked to
                                </div>


                                <div className="basic segment">
                                {this.state.ready &&
                                    <React.Fragment>
                                    {this.state.processing &&
                                    <Progress percent={100} attached='top' active/>
                                    }
                                    <MediaItem

                                        title={pc.title}
                                        plot={pc.plot}
                                        poster={pc.poster}
                                        year={pc.release_year}/>
                                    </React.Fragment>
                                }
                                {!this.state.ready &&
                                    <MediaItemPlaceholder/>
                                }
                                </div>

                                <div className="ui large right floated buttons">
                                    <button
                                        className="ui right floated button"
                                        onClick={this.handleCancel}
                                    >Cancel
                                    </button>
                                    <div className="or"></div>
                                    <button
                                        className={`ui right green floated button ${this.state.loading && "active loading"}`}
                                        onClick={this.handleMatch}
                                    >
                                        Accept
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}>
                </Route>
            )
        }

    }
);

export default FixMatchItem;