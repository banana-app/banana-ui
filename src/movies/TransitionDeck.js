import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Transition} from "semantic-ui-react";
import _ from 'lodash'

class Card extends Component {

    render() {
        return (
            <Transition
                animation={"fade"}
                transitionOnMount={true}
                unmountOnHide={true}
                duration={200}
                visible={this.props.visible && this.props.othersHidden}
                onHide={() => this.props.onCardHidden(this.props.name)}
                onShow={() => this.props.onCardShown(this.props.name)}
            >
                    {this.props.children}
            </Transition>
        )
    }
}

Card.propTypes = {
    name: PropTypes.string
};

export default class TransitionDeck extends Component {

    static Card = Card;

    state = {};

    handleCardHidden = (name) => {
        this.setState({ [name]: { alreadyHidden: true } })
    };

    handleCardShown = (name) => {
        this.setState({ [name]: { alreadyHidden: false } })
    };

    wrappedChildren = () => React.Children.map(this.props.children, c => {
        return React.cloneElement(c, {
            visible: c.props.name === this.props.activeCard,
            onCardHidden: (d) => this.handleCardHidden(d),
            onCardShown: (d) => this.handleCardShown(d),
            othersHidden: _.every(
                    _.keys(this.state)
                        .filter((k) => k !== this.props.activeCard)
                        .map((k) => this.state[k].alreadyHidden),
                    (e) => e === true)
        });
    });

    componentWillMount() {
        let childrenVisibility = {};
        React.Children.forEach(this.props.children, (c) => {
            childrenVisibility[c.props.name] = {
                alreadyHidden: this.props.activeCard !== c.props.name
            }});
        this.setState(childrenVisibility)
    }

    render() {
        return <React.Fragment>{this.wrappedChildren()}</React.Fragment>
    }
}

TransitionDeck.propTypes = {
    activeCard: PropTypes.string
};
