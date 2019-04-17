/* eslint-disable no-unused-expressions */
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Breadcrumb, {BreadcrumbItem} from '../Breadcrumb';
import axios from 'axios';
import {Checkbox, Dropdown, Pagination, Table} from 'semantic-ui-react';
import {IgnoredLabel, QualityLabel, ResolutionLabel} from '../common/MediaFile'
import moment from 'moment'
import _ from 'lodash'
import Toasts from "../common/Toasts";
import update from 'immutability-helper'

export class UnmatchedItem extends Component {
    render() {
        return (<Table.Row>
            <Table.Cell collapsing textAlign={'center'}>
                <Checkbox checked={this.props.selected} onClick={() => this.props.onSelectItem(this.props.id)} />
            </Table.Cell>
            <Table.Cell selectable>
                <NavLink to={`/unmatched/${this.props.id}/${this.props.name}`}>
                <div className="ui list">
                    <div className="item">
                        <div className="header"><i className="file video outline icon"></i>
                            {this.props.name}
                            &nbsp;
                            <ResolutionLabel resolution={this.props.resolution}/>
                            <QualityLabel quality={this.props.quality}/>
                            <IgnoredLabel ignored={this.props.ignored}/>
                        </div>
                        <div className="description"><i className="folder icon"></i>{this.props.directory}</div>
                    </div>
                </div>
                </NavLink>
            </Table.Cell>
            <Table.Cell className={"right aligned"}>
                {moment(this.props.created_datetime).fromNow()}
            </Table.Cell>
        </Table.Row>);
    }
}

const order_map = {
    'descending': 'desc',
    'ascending': 'asc'
};

class Unmatched extends Component {

    static PAGE_SIZE = 10;

    state = {
        items: [],
        page: 1,
        pages: 1,
        total_items: 0,
        order_by: 'created_datetime',
        order_direction: 'ascending',
        include_ignored: false
    };

    refreshState = (page) => {
        let activePage = _.isUndefined(page) ? this.state.page : page;
        let { order_by, order_direction } = this.state;
        axios.get(`/api/unmatched?page=${activePage}&order_by=${order_by}&order_direction=${order_map[order_direction]}&${this.state.include_ignored?'include_ignored':''}`)
            .then((result) => {
                let media = result.data.items.map(i =>
                    ({
                        ...i,
                        selected: false
                    })
                );
                this.setState({
                    items: media,
                    page: activePage,
                    pages: result.data.pages,
                    total_items: result.data.total_items,
                })
            }).catch((cause) => Toasts.error(cause.toString())) ;
    };

    handlePageChange = (e, {activePage}) => {
        this.refreshState(activePage)
    };

    componentDidMount = () => {
        this.refreshState()
    };

    handleSort = (sortColumn) => {
        const {order_by, order_direction} = this.state;

        if (order_by !== sortColumn) {
            this.setState({
                order_by: sortColumn,
                order_direction: 'ascending',
            }, () => this.refreshState());
        } else {
            this.setState({
                order_direction: order_direction === 'ascending' ? 'descending' : 'ascending',
            }, () => this.refreshState())
        }
    };

    handleSelectAll = () => {
        let items = _.merge({}, this.state).items;
        _.forEach(items, i => i.selected = true);
        this.setState({items: items})
    };

    handleToggleSelect = (id) => {
        let items = _.merge({}, this.state).items;
        let item = _.find(items, i => i.id === id);
        console.log(item);
        item.selected = !item.selected;
        this.setState({items: items})
    };

    updateMedia = (data) => {
        axios.put("/api/media", data)
            .then((result) => {
                this.refreshState()
            }).catch((reason) => {
            Toasts.error(reason.toString())
        })
    };

    handleIgnoreSelected = (ignore) => {
        let ignoredMedia = _.filter(this.state.items, {selected: true} ).map(
            (i) => update(i.parsed_media_item, { ignored: { $set: ignore} })
        );
        this.updateMedia(ignoredMedia)
    };

    handleShowIgnored = () => {
        this.setState({include_ignored: !this.state.include_ignored},
            () => this.refreshState())
    };

    render() {

        let {order_by, order_direction, include_ignored } = this.state;

        return (

            <div className="ui container">
                <div className="top breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem to="/unmatched" name="Unmatched" final/>
                    </Breadcrumb>
                </div>
                <Table sortable celled fixed>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell selectable={false} className="dropdown header cell">
                            <Dropdown trigger={<><i className={"icon cog"}></i></>} >
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => this.handleSelectAll()}>
                                        <i className={"icon check square outline"}></i>Select all
                                    </Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item onClick={() => this.handleIgnoreSelected(true)}>
                                        <i className={"icon eye slash"}></i>Ignore selected
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.handleIgnoreSelected(false)}>
                                        <i className={"icon eye"}></i>Un-ignore selected
                                    </Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item onClick={() => this.handleShowIgnored()}>
                                        {include_ignored && <><i className={"icon filter"}></i>Hide ignored</>}
                                        {!include_ignored && <><i className={"icon filter"}></i>Show ignored</>}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        </Table.HeaderCell>

                        <Table.HeaderCell
                            sorted={order_by  === 'filename'? order_direction : null}
                            onClick={() => this.handleSort('filename')}
                            className={"twelve wide"}
                        >
                            Media
                        </Table.HeaderCell>

                        <Table.HeaderCell
                            sorted={order_by  === 'created_datetime'? order_direction : null}
                            onClick={() => this.handleSort('created_datetime')}
                        >
                            Time added
                        </Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>

                    {this.state.items.map(i =>
                        <UnmatchedItem
                            key={i.id}
                            name={i.parsed_media_item.filename}
                            id={i.id}
                            directory={i.parsed_media_item.path}
                            quality={i.parsed_media_item.quality}
                            resolution={i.parsed_media_item.resolution}
                            created_datetime={i.created_datetime}
                            selected={i.selected}
                            ignored={i.parsed_media_item.ignored}
                            onSelectItem={(id) => this.handleToggleSelect(id)}
                        />
                    )}

                    </Table.Body>

                    {/* pagination */}
                    {this.state.pages > 1 &&
                    <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan="3">

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
                        </Table.HeaderCell>
                    </Table.Row>
                    </Table.Footer>
                    }
                    {/* pagination */}

                </Table>
            </div>
        )


    }

}

export default Unmatched;