import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export class BreadcrumbItem extends Component {

    finalItem = this.props.final === undefined

    render() {

        let divider 
        let link = <NavLink to={this.props.to} className="section active">{this.props.name}</NavLink>

        if (this.finalItem) {
            divider = <span className="divider">/</span>;
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
            <div className="ui breadcrumb">
                    {this.props.children}
            </div>
        );
    }
}

export default Breadcrumb;