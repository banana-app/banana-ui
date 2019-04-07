import React, {Component} from 'react'
import MediaItem, {formatTitle, GenreLabel, MediaItemPlaceholder} from '../common/MediaItem';
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb'
import {Dropdown, Pagination} from 'semantic-ui-react'
import axios from 'axios'
import _ from 'lodash'

const sortOptions = [
    { "text" : 'Date added', "value" : 'dateAddedDesc', icon : 'long arrow alternate up' },
    { "text" : 'Date added', "value" : 'dateAddedAsc', icon: 'arrow down' },
    { "text" : 'By title', "value" : 'titleDesc', icon: 'arrow down' },
    { "text" : 'By title', "value" : 'titleAsc', icon: 'arrow up'  },
];

export const MoviesContext = React.createContext("movies")

class Movies extends Component {

    state = { movies : [], total_items: 0, page: 1, pages: 1 }

    moviesPerPage = 5

    initComponentWithPlaceholders = () => {
        let placeholderMovies = []
        for (let i = 1; i <= this.moviesPerPage; i++)
            placeholderMovies.push({ placeholder : true})
        this.setState({ movies: placeholderMovies })
    }

    componentDidMount = () => {
        this.initComponentWithPlaceholders()
        axios.get(`/api/movies?page=${this.state.page}`)
        .then(result => 
            this.setState({movies : result.data.items, 
                total_items: result.data.total_items, 
                pages: result.data.pages }) 
        )
    }


    handlePageChange = (e, {activePage}) => {
        this.initComponentWithPlaceholders()
        axios.get(`/api/movies?page=${activePage}`)
        .then(result => 
            this.setState({movies : result.data.items, 
                    total_items: result.data.total_items, 
                    page: activePage, 
                    pages: result.data.pages }) 
        )
    }

    movieMediaItem = (m) => {
        return (

            <React.Fragment key={m.id}>
            {_.isUndefined(m.placeholder) && 
                <MediaItem 
                    poster={m.poster} 
                    plot={m.plot} 
                    title={m.title} 
                    year={m.release_year} 
                    media_items={m.media_items.length}
                    link_to={encodeURI(`/movies/${m.id}/${encodeURI(formatTitle(m.title, m.release_year))}`)} >
                {m.genres.map(g =>
                    <GenreLabel genre={g.name} />
                )}
                </MediaItem>
            }
            {!_.isUndefined(m.placeholder) &&
                <MediaItemPlaceholder/>
            }
            </React.Fragment>
        
        )
    } 

    render() {
        return (
            <div className="ui container">
                <div className="top breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem to="/movies" name="Movies" final />
                    </Breadcrumb>
                    <div className="ui right floated text menu">
                        <Dropdown  defaultValue={sortOptions[0].value} options={sortOptions} />
                    </div>
                </div>
                {this.state.movies.map(m =>
                        this.movieMediaItem(m)
                 )}
                <div class="ui right floated pagination menu">
                    <Pagination
                     firstItem={{ content: <i className='angle double left icon' ></i>, icon: true }} 
                     lastItem={{content: <i className='angle double right icon' ></i>, icon: true}}
                     prevItem={{content: <i className='angle left icon' ></i>, icon: true}}
                     nextItem={{content: <i className='angle right icon' ></i>, icon: true}}
                     defaultActivePage={this.state.page} 
                     totalPages={this.state.pages} 
                     onPageChange={this.handlePageChange}
                     boundaryRange="0" 
                     />
                     <MoviesContext.Provider value={this.state.total_items} />
                </div>
            </div>
        )
    }

}

export default Movies;