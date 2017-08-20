import React, { Component } from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { createLogger } from "redux-logger";

import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux';

import reducers from './reducers';

import Login from "./containers/login";
import AddInventory from "./containers/addInventory";

const history = createHistory();
const logger = createLogger();

const middleware = routerMiddleware(history)

const store = createStore(
    reducers,
    applyMiddleware(middleware, logger)
)

store.dispatch(push('/login'))

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                {/* <Route exact path="/" component={Home} /> */}
                <Route exact path="/login" component={Login} />
                <Route exact path="/inventory/add" component={AddInventory} />
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
)
