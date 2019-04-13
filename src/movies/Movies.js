import React, {Component} from 'react'
import MediaItem, {formatTitle, GenreLabel, MediaItemPlaceholder} from '../common/MediaItem';
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb'
import {Dropdown, Pagination} from 'semantic-ui-react'
import axios from 'axios'
import _ from 'lodash'
import PropTypes from "prop-types";

const sortOptions = [
    {text: 'Time added', value: 'created_datetime.desc', icon: 'sort amount up'},
    {text: 'Time added', value: 'created_datetime.asc', icon: 'sort amount down'},
    {text: 'Title', value: 'title.desc', icon: 'sort alphabet up'},
    {text: 'Title', value: 'title.asc', icon: 'sort alphabet down'},
];

const sortIcon = {
    'created_datetime.desc' : 'icon sort amount up',
    'created_datetime.asc' : 'icon sort amount down',
    'title.desc' : 'icon sort alphabet up',
    'title.asc' : 'icon sort alphabet down'
};

const DropdownTrigger = (props) => {
    return (<><i className={props.icon}></i>{props.name}</>)
};

DropdownTrigger.propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string
};

const sortTextFromValue = (value) => _.find(sortOptions, (o) => o.value === value).text;

const sortSpec = (value) => {
    let [ order_by, order_direction ] = value.split('.');
    return `order_by=${order_by}&order_direction=${order_direction}`;
};

class Movies extends Component {

    moviesPerPage = 5;

    state = {
        movies: [],
        total_items: 0,
        page: 1,
        pages: 1,
        sortOrder: sortOptions[0].value
    };

    initComponentWithPlaceholders = () => {
        let placeholderMovies = [];
        for (let i = 1; i <= this.moviesPerPage; i++)
            placeholderMovies.push({placeholder: true})
        this.setState({movies: placeholderMovies})
    };

    refereshState = () => {
        let qp = new URLSearchParams(this.props.location.search);
        let searchURL = `/api/movies?page=${this.state.page}`;
        let job_id = qp.get('job_id');
        if (!_.isNull(job_id))
            searchURL += `&job_id=${job_id}`;
        searchURL += `&${sortSpec(this.state.sortOrder)}`;
        axios.get(searchURL)
            .then(result =>
                this.setState({
                    movies: result.data.items,
                    total_items: result.data.total_items,
                    pages: result.data.pages
                })
            )
    };

    componentDidMount = () => {
        this.initComponentWithPlaceholders();
        this.refereshState()
    };

    handlePageChange = (e, {activePage}) => {
        this.initComponentWithPlaceholders()
        axios.get(`/api/movies?page=${activePage}&${sortSpec(this.state.sortOrder)}`)
            .then(result =>
                this.setState({
                    movies: result.data.items,
                    total_items: result.data.total_items,
                    page: activePage,
                    pages: result.data.pages
                })
            )
    };

    handleSortOrderChange = (e, { value }) => {
        this.setState({ sortOrder: value }, () => {
            this.refereshState()
        });
    };

    movieMediaItem = (m) => {
        return (

            <React.Fragment>
                {_.isUndefined(m.placeholder) &&
                <MediaItem
                    key={m.id}
                    poster={m.poster}
                    plot={m.plot}
                    title={m.title}
                    year={m.release_year}
                    media_items={m.media_items.length}
                    link_to={encodeURI(`/movies/${m.id}/${encodeURI(formatTitle(m.title, m.release_year))}`)}>
                    {m.genres.map(g =>
                        <GenreLabel key={g.id} genre={g.name}/>
                    )}
                </MediaItem>
                }
                {!_.isUndefined(m.placeholder) &&
                <MediaItemPlaceholder key={m.id}/>
                }
            </React.Fragment>

        )
    };

    render() {
        return (
            <div className="ui container">
                <div className="top breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem to="/movies" name="Movies" final/>
                    </Breadcrumb>
                    <div className="ui right floated text menu">
                        <Dropdown defaultValue={sortOptions[0].value}
                                  options={sortOptions}
                                  trigger={<DropdownTrigger name={sortTextFromValue(this.state.sortOrder)} icon={sortIcon[this.state.sortOrder]} />}
                                  onChange={this.handleSortOrderChange}
                        />

                    </div>
                </div>
                {this.state.movies.map(m =>
                    this.movieMediaItem(m)
                )}
                <div className="ui right floated pagination menu">

                    {this.state.pages > 1 &&
                    <Pagination
                        firstItem={{content: <i className='angle double left icon'></i>, icon: true}}
                        lastItem={{content: <i className='angle double right icon'></i>, icon: true}}
                        prevItem={{content: <i className='angle left icon'></i>, icon: true}}
                        nextItem={{content: <i className='angle right icon'></i>, icon: true}}
                        defaultActivePage={this.state.page}
                        totalPages={this.state.pages}
                        onPageChange={this.handlePageChange}
                        boundaryRange="0"
                    />
                    }

                </div>
            </div>
        )
    }
}

export default Movies;