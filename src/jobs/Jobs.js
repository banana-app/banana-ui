import React, {Component} from 'react'
import {Progress, Transition} from 'semantic-ui-react'
import {observer} from 'mobx-react'
import jobStore, {JobContext} from '../common/JobsStore'

export const JobProgress = (props) => {
    return (<>
        {props.type === JobContext.JobType.MEDIA_SCANNER &&
        <><i className={"icon sync"}></i><Progress value={props.value} total={props.total} progress='ratio' indicating/></>
        }
        {props.type === JobContext.JobType.MANUAL_MATCH &&
        <i className={"icon hand point right"}></i>
        }
        {props.type === JobContext.JobType.FIX_MATCH &&
        <i className={"icon unlink"}></i>
        }

    </>)
};

export default observer(class Jobs extends Component {

        render() {
            return (
                <div className="ui container">
                    <Transition.Group
                        animation={"fade down"}
                    >
                        {jobStore.activeJobs.map((j) =>
                            <JobProgress value={j.current_item} total={j.total_items} type={j.job_type}/>
                        )}
                    </Transition.Group>
                </div>
            )
        }
    }
)