import React, {Component} from 'react'
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb'
import {MediaItemPlaceholder} from '../common/MediaItem'

class Shows extends Component {

    render() {
        return(
            <div className="ui container">
            <div className="top breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/shows" name="Shows" /> 
                <BreadcrumbItem to="/shows/Friends" name="Friends" final/>
            </Breadcrumb>
            </div>
            <MediaItemPlaceholder/>
            <MediaItemPlaceholder/>
            <MediaItemPlaceholder/>
            <MediaItemPlaceholder/>
            <MediaItemPlaceholder/>
            <MediaItemPlaceholder/>
            </div>
        )
    }

}

export default Shows;