import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import Home from '../views/Home';
import Detail from '../views/Detail';
import Notfound from '../views/Notfound';

export default class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Auth user={this.props.user} setUser={this.props.setUser} />
            </BrowserRouter>
        );
    }
    
}


class Auth extends React.Component { 
    render() {
        if (this.props.user) { 
            return (
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/city/:id" component={Detail} />
                    <Route exact path="/*">
                        <Notfound />
                    </Route>
                </Switch>
            );
        }
        else {
            return (
                <Switch>
                    <Route exact path="/Register">
                        <Register setUser={this.props.setUser} />
                    </Route>
                    <Route exact path="/Login">
                        <Login setUser={this.props.setUser} />
                    </Route>
                    <Route exact path="/*">
                        <Login setUser={this.props.setUser} />
                    </Route>
                </Switch>
            );
        }
    }
}
/* 
<Route exact path="/">
    <Login setUser={this.props.setUser} />
</Route>
<Route  exact path="/city/:id">
    <Login setUser={this.props.setUser} />
</Route>
*/