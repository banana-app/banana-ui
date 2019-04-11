/* eslint-disable no-unused-expressions */
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb';
import axios from 'axios';
import {Pagination} from 'semantic-ui-react';
import {QualityLabel, ResolutionLabel} from '../common/MediaFile'
import moment from 'moment'

export class UnmatchedItem extends Component {
    render() {
        return (<tr>
            <td>
                <div className="ui list">
                    <div className="item">
                        <div className="header"><i className="file video outline icon"></i>
                            <NavLink to={`/unmatched/${this.props.id}/${this.props.name}`}>{this.props.name}</NavLink>
                            <span/>
                            <ResolutionLabel resolution={this.props.resolution}/>
                            <QualityLabel quality={this.props.quality}/>
                        </div>
                        <div className="description"><i className="folder icon"></i>{this.props.directory}</div>
                    </div>
                </div>
            </td>
            <td className="right aligned">
                {moment(this.props.created_datetime).fromNow()}
            </td>
        </tr>);
    }
}

class Unmatched extends Component {

    state = {items: [], page: 1, pages: 1, total_items: 0}


    handlePageChange = (e, {activePage}) => {
        axios.get(`/api/unmatched?page=${activePage}`)
            .then((result) => {
                this.setState({
                    items: result.data.items,
                    page: activePage,
                    pages: result.data.pages,
                    total_items: result.data.total_items
                })
            })
    }

    componentDidMount = () => {
        axios.get(`/api/unmatched?page=${this.state.page}`)
            .then((result) => {
                this.setState({
                    items: result.data.items,
                    pages: result.data.pages,
                    total_items: result.data.total_items
                })
            })
    }

    render() {

        return (


            <div className="ui container">
                <div className="top breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem to="/unmatched" name="Unmatched" final/>
                    </Breadcrumb>
                </div>
                <table className="ui celled striped table">
                    <thead>
                    <tr>
                        <th colSpan="2">Files</th>
                    </tr>
                    </thead>
                    <tbody>

                    {this.state.items.map(i =>
                        <UnmatchedItem
                            key={i.id}
                            name={i.parsed_media_item.filename}
                            id={i.id}
                            directory={i.parsed_media_item.path}
                            quality={i.parsed_media_item.quality}
                            resolution={i.parsed_media_item.resolution}
                            created_datetime={i.created_datetime}/>
                    )}

                    </tbody>

                    {/* pagination */}
                    {this.state.pages > 1 &&
                    <tfoot>
                    <tr>
                        <th colSpan="5">

                            <div className="ui right floated pagination menu">
                                <Pagination
                                    firstItem={{content: <i className='angle double left icon'></i>, icon: true}}
                                    lastItem={{content: <i className='angle double right icon'></i>, icon: true}}
                                    prevItem={{content: <i className='angle left icon'></i>, icon: true}}
                                    nextItem={{content: <i className='angle right icon'></i>, icon: true}}
                                    defaultActivePage={this.state.page}
                                    totalPages={this.state.pages}
                                    boundaryRange="0"
                                    onPageChange={this.handlePageChange}/>
                            </div>
                        </th>
                    </tr>
                    </tfoot>
                    }
                    {/* pagination */}

                </table>
            </div>
        )


    }
}

export default Unmatched;