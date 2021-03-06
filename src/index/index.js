import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import 'normalize.css/normalize.css';
import * as serviceWorker from '../serviceWorkerRegistration';

import './index.css';
import App from './App';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

if ('production' === process.env.NODE_ENV) {
    serviceWorker.register();
} else {
    serviceWorker.unregister();
}
