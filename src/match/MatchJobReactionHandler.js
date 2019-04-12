import _ from "lodash";
import {reaction} from "mobx";
import {JobContext} from "../common/JobsStore";

export class MatchJobReactionHandler {

    isCompleted = (data, job) => _.some(data, ({job_id: job.job_id, event_type: JobContext.EventType.COMPLETED}));
    hasError = (data, job) => _.some(data, ({job_id: job.job_id, event_type: JobContext.EventType.ERROR}));

    constructor(jobStore, job, onCompleted = (data) => {}, onError = (data) => {}) {

        reaction(

            () => jobStore.jobs.map(e => {
                return {job_id: e.job_id, event_type: e.event_type}
            }),
            (data, reaction) => {
                if (this.isCompleted(data, job)) {
                    reaction.dispose();
                    onCompleted(data)
                } else if (this.hasError(data, job)) {
                    // this task finished with error; we no longer need observe completed event;
                    // this should be safely disposed
                    reaction.dispose()
                }
            }
        );
        reaction(
            () => jobStore.jobs.map(e => ({job_id: e.job_id, event_type: e.event_type, context: e.context})),
            (data, reaction) => {
                if (this.hasError(data, job)) {
                    reaction.dispose();
                    onError(data);
                } else if (this.isCompleted(data, job)) {
                    // Again, this task is successfully finished; we should dispose error observer
                    reaction.dispose()
                }
            }
        );
    }
}