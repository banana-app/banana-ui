import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import axios from 'axios'
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb'
import MediaFile from '../common/MediaFile'
import MediaItem, {formatTitle, MediaItemPlaceholder} from '../common/MediaItem'

class MatchItem extends Component {

    state = {
        parsed_media_item: {},
        match_candidate: {},
        loading: true,
        ready: false
    };

    componentDidMount = () => {

        axios.get(`/api/unmatched/${this.props.match.params.id}/${this.props.match.params.item}`)
            .then((result) => {
                this.setState({ parsed_media_item: result.data.parsed_media_item })
            });

        axios.get(`/api/movies/sources/${this.props.match.params.source}/${this.props.match.params.match_candidate_id}`)
            .then((result) => {
                console.log(result.data)
                this.setState({ match_candidate: result.data, loading: false, ready: true })
            })
    };

    handleMatch = (e) => {
        this.setState({loading: true});
        let p = this.props.match.params;

        axios.post("/api/movies", {
            match_type: p.source,
            unmatched_item_id: p.id,
            match_type_id: p.match_candidate_id
        })
            .then((result) => {
                let movie = result.data;
                this.props.history.push(`/movies/${movie.id}/${formatTitle(movie.title, movie.release_year)}`)
            })
    };

    handleCancel = (e) => {
        this.props.history.push(`/unmatched/${this.props.match.params.id}/${this.state.parsed_media_item.filename}`)
    };

    render() {

        let pc = this.state.match_candidate

        return (

            <Route render={({ history }) => (

                <div className="ui container">

                    <div className="top breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem to="/unmatched" name="Unmatched" />
                        <BreadcrumbItem to={`/unmatched/${this.props.match.params.id}/${this.state.parsed_media_item.filename}`} 
                            name={`${this.state.parsed_media_item.filename}`} />
                        <BreadcrumbItem to={this.props.match.url} name={formatTitle(this.state.match_candidate.title, 
                            this.state.match_candidate.release_year)} final />
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


                            {this.state.ready &&

                                <MediaItem

                                    title={pc.title}
                                    plot={pc.plot}
                                    poster={pc.poster}
                                    year={pc.release_year}

                                >
                                </MediaItem>
                            }
                            {!this.state.ready &&
                                <MediaItemPlaceholder />
                            }



                            <div className="ui large right floated buttons">
                                <button
                                    className="ui right floated button"
                                    onClick={this.handleCancel}
                                >Cancel</button>
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

export default MatchItem;