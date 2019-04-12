import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
import jobsStore from './common/JobsStore'

const Tabs = observer(
    
    class Tabs extends Component {

        fetchCounts = () => {

        axios.get('/api/movies/count')
        .then( (result) => {
            this.setState({ movies_total_items: result.data.total_items })
        })
    
        axios.get('/api/unmatched/count')
        .then( (result) => {
            this.setState({ unmatched_total_items: result.data.total_items })
        })

        };

    state = { movies_total_items: undefined, unmatched_total_items: undefined };

    componentDidMount = () => {
        this.fetchCounts()
    };

    refreshCounts = reaction(
        () => jobsStore.activeJobs.map((j) => j.timestamp),
            (data) => {
                this.fetchCounts()
            }
    );



    render() {
        
        return (
            <React.Fragment>
           
            <div className="repo ribbon">
                <div className="ui tabular menu">
                    <div className="ui container">
                        <NavLink to="/dashboard" activeClassName="item active" className="item">
                            <i className="bullhorn icon"></i>Dashboard
                        </NavLink>
                        
                        <NavLink to="/movies" activeClassName="item active" className="item">
                        <i className="film icon"></i>Movies
                        
                            <div className="ui mini label">{this.state.movies_total_items}</div>
                        
                        </NavLink>
                        <NavLink to="/shows" activeClassName="item active" className="item"><i className="tv icon"></i>TV Shows</NavLink>
                        <NavLink to="/unmatched" activeClassName="item active" className="item">
                            <i className="bell icon"></i>Unmatched<div className="ui mini orange label">{this.state.unmatched_total_items}</div>
                        </NavLink>
                    </div>
                </div>
            </div>
            </React.Fragment>
            
        );
    }

}

);

export default Tabs;