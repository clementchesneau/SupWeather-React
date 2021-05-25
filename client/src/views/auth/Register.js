import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            confirmpassword: "",
            checked: false,
            passMessage: false,
            checkboxMessage: false,
            showError: false,
            error: "",
            logged: false
        }
    }

    handleChange() {
        if (!this.state.checked) {
            this.setState({ checked: true });
        }
        else {
            this.setState({ checked: false });
        }
    }

    termsOfServive() {
        alert("1 : Les céréales avant le lait.\n"
         + "2 : On dit \"paint au chocolat\" et non \"chocolatine\".");
    }

    register = e => {
        e.preventDefault();
        this.setState({ showError: false });

        // check terms
        if (!this.state.checked) { this.setState({ checkboxMessage: true }); return; }
        this.setState({ checkboxMessage: false });

        // check that all fields contains values
        if (this.state.name === "" || this.state.email === "" || this.state.password === "") {
            this.setState({ error: "All fields are required!" });
            this.setState({ showError: true });
            return;
        }

        // check if passwords are the same
        if (this.state.password !== this.state.confirmpassword) {
            this.setState({ passMessage: true });
            return;
        }
        this.setState({ passMessage: false });

        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        };

        axios.post('api/user/register', data)
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
    }

    render() {
        if (this.state.logged) {
            return <Redirect to="/" />;
        }
        else {
            return(
                <div className="login-wrapper container">
                    <h1 className="py-4 text-center">Please Register</h1>
                    <div className="row justify-content-center">
                        <form className="col-5" onSubmit={this.register.bind(this)}>
                            { this.state.showError ? <Error error={this.state.error} /> : null }
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input className="form-control" id="username" type="text" placeholder="Enter username" required
                                    onChange={e => { this.setState({ name: e.target.value }) }} />
                            </div>
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
                            { this.state.passMessage ? <PassMessage /> : null }
                            <div className="form-group">
                                <label htmlFor="confirmpassword">Confirm Password</label>
                                <input type="password" className="form-control" id="confirmpassword" placeholder="Password" required
                                    onChange={e => { this.setState({ confirmpassword: e.target.value }) }} />
                            </div>
                            { this.state.checkboxMessage ? <CheckboxMessage /> : null }
                            <div className="form-check my-3">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={this.state.checked}
                                    onChange={this.handleChange.bind(this)} />
                                <label className="form-check-label" htmlFor="exampleCheck1">Accept <button onClick={this.termsOfServive.bind(this)} type="button" className="btn btn-link p-0">Terms of Service</button></label>
                            </div>
                            <p className="my-3">Already registered ? <a href="Login">Log in now</a></p>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            );
        }
    }
}

class PassMessage extends React.Component {
    render() {
        return (
            <div className="mb-2">
                <span className="p-2 border border-danger text-danger">Passwords doesn't match!</span>
            </div>
        );
    }
}

class CheckboxMessage extends React.Component {
    render() {
        return (
            <div className="">
                <span className="p-2 border border-danger text-danger">You must accept "Terms of Service"!</span>
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