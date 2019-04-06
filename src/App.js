import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { ErrorPopup } from './common/ErrorPopup'
import Movies from './movies/Movies.js'
import Movie from './movies/Movie.js'
import Shows from './shows/Shows.js'
import Tabs from './Tabs.js'
import Ribbon from './Ribbon.js'
import Breadcrumb from './Breadcrumb.js'
import Unmatched from './unmatched/Unmatched'
import UnmatchedItem from './unmatched/UnmatchedItem'
import MatchItem from './match/MatchItem'
import Jobs from './jobs/Jobs'
import Dashboard from './dashboard/Dashboard';


const Home = () => (<h1>Home</h1>)
//const Jobs = () => (<h1>Jobs</h1>)
//const Movies = () => (<h1>Movies</h1>)
//const Unmatched = () => (<h1>Unmatched</h1>)
//const Movie = ({ match }) => (<h1>Movie</h1>)
//const Shows = () => (<h1>Shows</h1>)
const Show = ({ match }) => (<h1>Show {match.params.show}</h1>)
const Series = ({ match }) => (<h1>Series {match.params.series}</h1>)
const Episode = ({ match }) => (<h1>Show {match.params.show} Series: {match.params.series} Episode: {match.params.episode}</h1>)

class Banana extends Component {
  render() {
    return (
      <div>
        <Router>
          <Route
            render={({ history }) => (
              <React.Fragment>
                <Redirect from='/' to='dashboard'/>
                  
                  <Route path={"*"} component={Ribbon}/>
                
                  <Route path={['/dashboard', '/movies', '/shows', '/unmatched' ]} component={Tabs} />
                  
                  <ErrorPopup />
                  <Route exact path='/dashboard' component={Dashboard} />
                  <Route exact path='/jobs' component={Jobs} />
                  <Route exact path="/foo/bar" component={Home} />
                  <Route exact path="/unmatched" component={Unmatched} />
                  <Route exact path="/unmatched/:id/:item/match/:source/:match_candidate_id" component={MatchItem} />

                  <Route exact path="/unmatched/:id/:item" component={UnmatchedItem} />
                  <Route exact path="/movies/:movie_id/:title" component={Movie} />
                  <Route exact path="/movies" component={Movies} />
                  <Route exact path="/shows" component={Shows} />
                  <Route exact path="/shows/:show" component={Show} />
                  <Route exact path="/shows/:show/:series" component={Series} />
                  <Route exact path="/shows/:show/:series/episodes/:episode" component={Episode} />

                </React.Fragment>
            )} />
        </Router>
      </div>
    );
  }
}

export default Banana;
