import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
import Breadcrumb, { BreadcrumbItem } from '../Breadcrumb'
import _ from 'lodash'
import { formatTitle } from '../common/MediaItem'
import axios from 'axios'
import { Transition } from 'semantic-ui-react'
import Img from 'react-image'
import placeholder from '../img/poster_placeholder.png'
import jobsStore from '../common/JobsStore'
import { NavLink } from 'react-router-dom'


class CompactMediaItem extends Component {


    state = { paceholderVisible: true, placeholderClass: "ui hidden image hidden", posterClass: "ui hidden image" }

    handlePosterLoad = (e) => {
        this.setState(
            {
                paceholderVisible: false
            }
        )
    }

    render() {
        return (
            <div className="column">

                <NavLink to={this.props.link_to}>
                    <div className="ui fluid small image">

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
                            loader={<img src={placeholder} className="faded placeholder" />}
                            unloader={<img src={placeholder} className="faded placeholder" />}
                        />
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

const Dashboard = observer(

    class Dashboard extends Component {

        fetchRecentyAdded = () => {
            axios.get(`/api/movies?page=1&order_by=created_datetime&order_direction=desc`)
                .then(result =>
                    this.setState({
                        movies: _.take(result.data.items, 6),
                        total_items: result.data.total_items,
                    })
                )
        }

        refereshRecentyAdded = reaction(
            () => jobsStore.activeJobs.map((j) => j.timestamp),
            (data) => {
                console.log("Reaction!!!!!!")
                console.log(data)
                this.fetchRecentyAdded()
            }
        )

        state = { movies: [], total_items: 0 }

        componentDidMount = () => {
            this.fetchRecentyAdded()
        }


        render() {

            return (
                <div className="ui container">

                    <div className="top breadcrumb">
                        <Breadcrumb>
                            <BreadcrumbItem to="/movies" name="Dashboard" final />
                        </Breadcrumb>
                    </div>

                    <div class="ui basic segment">
                        <h3 class="ui header">Recently added movies</h3>

                        <div className="ui six column grid">

                            {this.state.movies.map((m) =>
                                <CompactMediaItem poster={m.poster}
                                    title={formatTitle(m.title, m.release_year)}
                                    link_to={`/movies/${m.id}/${encodeURI(formatTitle(m.title, m.release_year))}`} />
                            )}
                        </div>

                    </div>
                    {/* Grid */}

                </div>
            )

        }

    }

)

export default Dashboard