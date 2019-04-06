import {computed, decorate, observable} from 'mobx'
import io from 'socket.io-client'
import _ from 'lodash'

const socket = io(`http://localhost:3000/jobs`)

socket.on("media_scanner", (data) => {
    let event = JSON.parse(data)
    jobStore.events[event.job_id] = new JobContext(event.job_type, event.event_type, event.current_item, event.total_items)
})

socket.on("manual_match", (data) => {
    let event = JSON.parse(data)
    jobStore.events[event.job_id] = new JobContext(event.job_type, event.event_type, event.current_item, event.total_items)
})

export class JobContext {
    job_type = ""
    event_type = ""
    current_item = 0
    total_items = 0
    timestamp = _.now()

    constructor(job_type, event_type, current_item, total_items) {
        this.job_type = job_type
        this.event_type = event_type
        this.current_item = current_item
        this.total_items = total_items
        this.timestamp = _.now()
    }

}

decorate(JobContext, {
    job_type: observable,
    event_type: observable,
    current_item: observable,
    total_items: observable,
    timestamp: observable
})

class JobStore { 
    
    events = {}

    get hasActiveJobs() {
        return _.keys(this.events).length > 0 && _.some(_.values(this.events), (e) => e.event_type === 'progress')
    }

    get activeJobs() {
        if (_.keys(this.events).length === 0)
            return []
        else
            return _.values(this.events).filter((e) => e.event_type === 'progress')
    }
}

decorate(JobStore, {
    events: observable,
    hasActiveJobs: computed,
    activeJobs: computed
})

const jobStore = window.jobStore = new JobStore()

export default jobStore;
