import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'

export class BreadcrumbItem extends Component {

    finalItem = _.isUndefined(this.props.final);

    render() {

        let divider;
        let link = <NavLink to={this.props.to} className="section active">{this.props.name}</NavLink>;

        if (this.finalItem) {
            divider = <i className="right angle icon divider"></i>;
            link = <NavLink to={this.props.to} className="section" activeClassName="section">{this.props.name}</NavLink>
        }

        return (
        <React.Fragment>
            {link}
            {divider}
        </React.Fragment>
        );
    }
}

class Breadcrumb extends Component {

    render() {
        return (
            <div className="ui large breadcrumb">
                    {this.props.children}
            </div>
        );
    }
}

export default Breadcrumb;