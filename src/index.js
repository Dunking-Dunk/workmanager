import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import App from './app'
import reducers from './components/storage/reducers'

const storage = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(<Provider store={storage}><App /></Provider>, document.querySelector('#root'))