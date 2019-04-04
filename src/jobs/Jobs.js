import React, { Component } from 'react'
import { Progress, Transition } from 'semantic-ui-react'
import { observer } from 'mobx-react'
import jobStore from '../common/JobsStore'
import _ from 'lodash'

export default observer(class Jobs extends Component {

    render() {
        return (
            <div className="ui container">
                <Transition.Group
                        animation={"fade down"}
                    >
                {jobStore.activeJobs.map((j) =>
                    
                        <Progress value={j.current_item} total={j.total_items} progress='ratio' indicating />
                        )}
                </Transition.Group>
            </div>
            )
        }
    }
)