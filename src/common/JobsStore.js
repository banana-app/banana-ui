import {computed, decorate, observable} from 'mobx'
import io from 'socket.io-client'
import _ from 'lodash'

const socket = io(`http://localhost:3000/jobs`);


class JobType {
    static MEDIA_SCANNER = 'media_scanner'
    static MANUAL_MATCH = 'manual_match'
    static FIX_MATCH = 'fix_match'
}


socket.on(JobType.MEDIA_SCANNER, (data) => {
    let event = JSON.parse(data);
    jobStore.events[event.job_id] = new JobContext(event.job_id, event.job_type, event.event_type,
        event.current_item, event.total_items, event.context)
});

socket.on(JobType.MANUAL_MATCH, (data) => {
    let event = JSON.parse(data);
    console.log(event);
    jobStore.events[event.job_id] = new JobContext(event.job_id, event.job_type, event.event_type,
        event.current_item, event.total_items, event.context)
});

socket.on(JobType.FIX_MATCH, (data) => {
    let event = JSON.parse(data);
    console.log(event);
    jobStore.events[event.job_id] = new JobContext(event.job_id, event.job_type, event.event_type,
        event.current_item, event.total_items, event.context)
});



class EventType {
    static COMPLETED = 'completed';
    static ERROR = 'error';
    static PROGRESS = 'progress';
}

export class JobContext {

    static EventType = EventType;
    static JobType = JobType;

    get isInProgress() {
        return this.event_type === JobContext.EventType.PROGRESS
    }

    get isCompleted() {
        return this.event_type === JobContext.EventType.COMPLETED
    }

    get hasError() {
        return this.event_type === JobContext.EventType.ERROR
    }

    job_id = "";
    job_type = "";
    event_type = "";
    current_item = 0;
    total_items = 0;
    timestamp = _.now();
    context = "";

    constructor(job_id, job_type, event_type, current_item, total_items, context) {
        this.job_id = job_id;
        this.job_type = job_type;
        this.event_type = event_type;
        this.current_item = current_item;
        this.total_items = total_items;
        this.timestamp = _.now();
        this.context = context;
    }

}

decorate(JobContext, {
    job_id: observable,
    job_type: observable,
    event_type: observable,
    current_item: observable,
    total_items: observable,
    timestamp: observable,
    context: observable,
    isCompleted: computed,
    isInProgress: computed,
    hasError: computed
});

class JobStore { 
    
    events = {};

    get hasActiveJobs() {
        return _.keys(this.events).length > 0 && _.some(_.values(this.events), (e) => e.isInProgress)
    }

    get activeJobs() {
        if (_.keys(this.events).length === 0)
            return [];
        else
            return _.values(this.events).filter((e) => e.isInProgress)
    }

    get jobs() {
        return _.values(this.events)
    }
}

decorate(JobStore, {
    events: observable,
    hasActiveJobs: computed,
    activeJobs: computed,
    jobs: computed
});

const jobStore = window.jobStore = new JobStore();

export default jobStore;
