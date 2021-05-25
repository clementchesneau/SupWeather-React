import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            showError: false,
            error: "",
            logged: false
        }
    }

    forgotPassword() {
        alert("It's very unfortunate because there is no way to reset it :(");
    };

    login = e => {
        e.preventDefault();

         // check that all fields contains values
         if (this.state.email === "" || this.state.password === "") {
            this.setState({ error: "All fields are required!" });
            this.setState({ showError: true });
            return;
        }

        const data = {
            email: this.state.email,
            password: this.state.password
        }

        axios.post('api/user/login', data)
        .then(response => { 
            if (response.data && response.data.token && response.data.user) {
                localStorage.setItem('token', response.data.token);
                this.setState({ logged: true });
                this.props.setUser(response.data.user);
            }
        })
        .catch(err => { 
            console.log(err);
            if (err.response && err.response.data) {
                this.setState({ error: err.response.data });
                this.setState({ showError: true });
            }
        })
    };

    render() {
        if (this.state.logged) {
            return <Redirect to="/" />;
        }
        return(
            <div className="login-wrapper container">
                <h1 className="py-4 text-center">Please Log In</h1>
                <div className="row justify-content-center">
                    <form className="col-5" onSubmit={this.login.bind(this)}>
                        { this.state.showError ? <Error error={this.state.error} /> : null }
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required
                                onChange={e => { this.setState({ email: e.target.value }) }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" required
                                onChange={e => { this.setState({ password: e.target.value }) }} />
                        </div>
                        <button onClick={this.forgotPassword.bind(this)} type="button" className="btn btn-link p-0">Forgot your password ?</button>
                        <p className="my-3">No Account ? <a href="Register">Create one now</a></p>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

class Error extends React.Component {
    render() {
        return (
            <div className="mb-2">
                <span className="p-2 border border-danger text-danger">{this.props.error}</span>
            </div>
        );
    }
}