import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Toasts from './common/Toasts'
import Movies from './movies/Movies'
import Movie from './movies/Movie'
import Shows from './shows/Shows'
import Tabs from './Tabs.js'
import Ribbon from './Ribbon.js'
import Unmatched from './unmatched/Unmatched'
import UnmatchedItem from './unmatched/UnmatchedItem'
import MatchItem from './match/MatchItem'
import Jobs from './jobs/Jobs'
import Dashboard from './dashboard/Dashboard';
import MovieMediaFile from "./movies/MovieMediaFile";
import FixMatchItem from "./match/FixMatchItem";


const Show = ({match}) => (<h1>Show {match.params.show}</h1>)
const Series = ({match}) => (<h1>Series {match.params.series}</h1>)
const Episode = ({match}) => (
    <h1>Show {match.params.show} Series: {match.params.series} Episode: {match.params.episode}</h1>)

class Banana extends Component {
    render() {
        return (
            <div>
                <Router>

                    <Route
                        render={({history}) => (
                            <React.Fragment>


                                <Route path={"*"} component={Ribbon}/>

                                <Route path={['/dashboard', '/movies', '/shows', '/unmatched']} component={Tabs}/>

                                <Toasts/>

                                <Route exact path='/dashboard' component={Dashboard}/>
                                <Route exact path='/jobs' component={Jobs}/>
                                <Route exact path="/unmatched" component={Unmatched}/>
                                <Route exact path="/unmatched/:id/:item/match/:source/:match_candidate_id"
                                       component={MatchItem}/>

                                <Route exact path="/unmatched/:id/:item" component={UnmatchedItem}/>
                                <Route exact path="/movies/:movie_id/media/:media_id" component={MovieMediaFile}/>
                                <Route exact path="/movies/:movie_id/media/:media_id/fixmatch/:source/:match_candidate_id"
                                       component={FixMatchItem}/>

                                <Route exact path="/movies/:movie_id/:title" component={Movie}/>
                                <Route exact path="/movies" component={Movies}/>
                                <Route exact path="/shows" component={Shows}/>
                                <Route exact path="/shows/:show" component={Show}/>
                                <Route exact path="/shows/:show/:series" component={Series}/>
                                <Route exact path="/shows/:show/:series/episodes/:episode" component={Episode}/>

                            </React.Fragment>
                        )}/>
                </Router>
            </div>
        );
    }
}

export default Banana;
