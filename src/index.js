import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Banana from './App';
import * as serviceWorker from './serviceWorker';

import './css/semantic.solar.min.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css'
import './css/banana.css'

ReactDOM.render(<Banana />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
