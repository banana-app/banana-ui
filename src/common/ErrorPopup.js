import React, { Component } from 'react'
import { Transition } from 'semantic-ui-react'
import { observable, decorate } from 'mobx'
import { observer } from 'mobx-react'

class ErrorContext {
    message = ""
    raised = false

    constructor(message, raised) {
        this.message = message
        this.raised = raised
    }
}

decorate(ErrorContext, {
    message: observable,
    raised: observable
})

class ErrorStore {
    error = new ErrorContext("", false)
}

decorate(ErrorStore, {
    raised: observable
})

const store = window.store = new ErrorStore()

export default store;

export const ErrorPopup = observer(class ErrorPopup extends Component {

    handlePopupClose = () => {
        store.error.raised = false
    }

    render() {
        return (<Transition
            animation={"slide down"}
            transitionOnMount={true}
            visible={store.error.raised}
        >
            <div className="ui container">
                <div className="ui yellow bottom attached inverted segment">{store.error.message}

                    <div className="ui right floated text menu">
                        <a href="#" onClick={this.handlePopupClose}><i className="small icon close"></i></a>
                    </div>

                </div>
            </div>
        </Transition>
        )
    }
}
)

