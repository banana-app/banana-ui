import React, {Component} from 'react'
import {toast, ToastContainer} from "react-toastify";

export const ErrorToast = (props) => {
    return <><i className={'icon exclamation'}></i>{props.children}</>
};

export const InfoToast = (props) => {
    return <><i className={'icon info'}></i>{props.children}</>
};

export const WarnToast = (props) => {
    return <><i className={'icon bell'}></i>{props.children}</>
};

class Toasts extends Component {

    static info(message) {
        toast.info(<InfoToast>{message}</InfoToast>)
    }

    static warning(message) {
        toast.warn(<WarnToast>{message}</WarnToast>)
    }

    static error(message) {
        toast.error(<ErrorToast>{message}</ErrorToast>)
    }

    render() {
        return (
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
                pauseOnHover
                style={{width: 'auto', 'minWidth': '20%', 'maxWidth': '60%'}}
            />
        )
    }
}

export default Toasts;

