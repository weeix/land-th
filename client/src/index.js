import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import './common/i18n';
import './index.css';
import App from './App';
import Loading from './common/Loading';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Suspense fallback={<Loading />}><App /></Suspense>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
