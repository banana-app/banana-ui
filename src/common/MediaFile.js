import React, { Component } from 'react'
import * as PropTypes from "prop-types";
import classNames from 'classnames'

export const Folder = (props) => {
    return (
        <React.Fragment>
            {props.path &&
            <><i className="icon folder"></i>{props.path}</>
            }
        </React.Fragment>
    )
};

export const ResolutionLabel = (props) => {
    let classes = classNames('ui',
        'yellow',
        'small',
        'horizontal',
        'label',
        {'right': props.right,
        'floated': props.floated}
    );
    return (<React.Fragment >
        {props.resolution &&
            <div className={classes}>{props.resolution}</div>
        }
    </React.Fragment >)
};


export const QualityLabel = (props) => {

    let classes = classNames('ui',
        'green',
        'small',
        'horizontal',
        'label',
        {'right': props.right, 'floated': props.floated});

    return (<React.Fragment>
        {props.quality &&
            <div className={classes}>{props.quality}</div>
        }
    </React.Fragment>)
};


export const IgnoredLabel = (props) => {
    return (<React.Fragment >
        {props.ignored &&
            <div className="ui mini orange label">
                <i className="eye slash icon"></i>
                <div className="detail">Ignored</div>
            </div>
        }
    </React.Fragment>)
};

export const TitleLabel = (props) => {

    return (<React.Fragment>
        {props.title &&
            <div className="ui teal small horizontal label">
                Title
            <div className="detail">{props.title}</div>
            </div>
        }
    </React.Fragment>)
};

export const YearLabel = (props) => {
    return (<React.Fragment>
        {props.year &&
            <div className="ui blue small horizontal label">
                Year
        <div className="detail">{props.year}</div>
            </div>
        }
    </React.Fragment>)
};

export const SeasonLabel = (props) => {
    return (<React.Fragment>
        {props.season &&
            <div className="ui brown small horizontal label">
                Season
        <div className="detail">{props.season}</div>
            </div>
        }
    </React.Fragment>)
};

export const EpisodeLabel = (props) => {
    return (<React.Fragment>
        {props.episode &&
            <div className="ui brown small horizontal label">
                Episode
        <div className="detail">{props.episode}</div>
            </div>
        }
    </React.Fragment>)
};

EpisodeLabel.propTypes = {
    episode: PropTypes.string
};

const VideoFile = (props) => {
    return <div className="header"><i className="icon video"></i>{props.filename}
        {props.children}
    </div>;
};

VideoFile.propTypes = {
    filename: PropTypes.string
};

class MediaFile extends Component {

    render() {
        return (
            <div className="item">

                <div className="content">
                    {this.props.children}
                    <VideoFile filename={this.props.filename}></VideoFile>

                    <div className="meta">

                        <ResolutionLabel resolution={this.props.resolution}/>
                        <QualityLabel quality={this.props.quality}/>
                        <TitleLabel title={this.props.title}/>
                        <YearLabel year={this.props.year}/>
                        <SeasonLabel season={this.props.season}/>
                        <EpisodeLabel episode={this.props.episode}/>
                    </div>

                    <div className="description">
                        <p/>
                    </div>

                    <div className="extra">
                        <Folder path={this.props.path}/>
                    </div>

                </div>
            </div>
            )
    }
}

export default MediaFile