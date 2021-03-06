import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
import Breadcrumb, { BreadcrumbItem } from '../Breadcrumb'
import _ from 'lodash'
import {formatTitle, Poster} from '../common/MediaItem'
import axios from 'axios'
import {Transition} from 'semantic-ui-react'
import jobsStore from '../common/JobsStore'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import {JobProgress} from "../jobs/Jobs";


class DashboardMediaItem extends Component {

    render() {
        return (
            <div className="column">

                <NavLink to={this.props.link_to}>
                    <div className="ui fluid small rounded image">
                        <Poster poster={this.props.poster} />

                        <Transition
                            transitionOnMount={true}
                            unmountOnHide={true}
                            animation="fade"
                            duration="500"
                        >

                            <div className="ui compact list">
                                <div className="ui item">
                                    <div className="content">
                                        <div className="header">{this.props.title}</div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </NavLink>
            </div>
        )
    }
}

DashboardMediaItem.propTypes = {
    poster: PropTypes.string,
    link_to: PropTypes.string
};

const Dashboard = observer(

    class Dashboard extends Component {

        recentlyAddedItems = 6;

        fetchMostRecentlyAdded = () => {
            axios.get(`/api/movies?page=1&page_size=${this.recentlyAddedItems}&order_by=created_datetime&order_direction=desc`)
                .then(result =>
                    this.setState({
                        movies: _.take(result.data.items, 6),
                        total_items: result.data.total_items,
                    })
                )
        };

        refreshReaction = null

        state = { movies: [], total_items: 0 }

        componentDidMount = () => {
            this.refereshRecentlyAdded = reaction(
                () => jobsStore.activeJobs.map((j) => j.timestamp),
                (data, reaction) => {
                    this.fetchMostRecentlyAdded()
                    this.refreshReaction = reaction
                }
            );
            this.fetchMostRecentlyAdded()
        };

        componentWillUnmount() {
            if (this.refreshReaction !== null)
                this.refreshReaction.dispose()
        }

        render() {

            return (
                <div className="ui container">

                    <div className="top breadcrumb">
                        <Breadcrumb>
                            <BreadcrumbItem to="/dashboard" name="Dashboard" final />
                        </Breadcrumb>
                    </div>

                    <div className="ui basic segment">
                       <h3 className="ui header"> <NavLink to="/movies">Recently added movies</NavLink></h3>
                        <div className="ui six column grid">
                            {this.state.movies.map((m) =>
                                <DashboardMediaItem key={m.id} poster={m.poster}
                                    title={formatTitle(m.title, m.release_year)}
                                    link_to={`/movies/${m.id}/${encodeURI(formatTitle(m.title, m.release_year))}`} />
                            )}
                        </div>
                    </div>
                    {/* Recently added movies */}

                    <div className="ui basic segment">
                        <h3 className="ui header"><NavLink to="/dashboard/jobs">Active tasks</NavLink></h3>
                        <Transition.Group
                            animation={"fade down"}
                        >
                            {jobsStore.activeJobs.map((j) =>
                                <JobProgress value={j.current_item} total={j.total_items} type={j.job_type}/>
                            )}

                        </Transition.Group>
                    </div>
                    {/* Recently added movies */}

                </div>
            )
        }
    }
);

export default Dashboard