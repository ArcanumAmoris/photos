import React from 'react';
import ReactDOM from 'react-dom';
import store from './Redux/Store/Store';
import {saveState} from './Redux/Store/Store'
import { Provider } from 'react-redux';
import App from './App';
import throttle from 'lodash/throttle';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe("pk_test_51JVsKqK2z7ieb0unBb67BidrC2IrlDM8eL5ShImpgLSClr6JRkEkSNbtYvcYC8PDwXWYwDibE7DUcWxG4RZRtRga00JCiCHS8u")

function render() {
  saveState(store.getState())
    ReactDOM.render( 
      <Provider store={store}>
        {/* <Elements stripe={stripePromise}> */}
          <App />
        {/* </Elements> */}
      </Provider>,
    document.getElementById('root')
    )};

render()

store.subscribe(throttle(() => {
  render()
}, 1000))
