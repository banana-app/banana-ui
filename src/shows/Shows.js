import React, { Component } from 'react'
import Breadcrumb, { BreadcrumbItem } from '../Breadcrumb'
import { MediaItemPlaceholder2 } from '../match/MatchItem'

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
            <MediaItemPlaceholder2/>
            <MediaItemPlaceholder2/>
            <MediaItemPlaceholder2/>
            <MediaItemPlaceholder2/>
            <MediaItemPlaceholder2/>
            <MediaItemPlaceholder2/>
            </div>
        )
    }

}

export default Shows;