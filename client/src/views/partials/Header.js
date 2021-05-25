import React from 'react';

export default class Header extends React.Component {

    render() {
        return(
            <header className="fixed-top">
                <nav className="navbar navbar-light d-flex justify-content-between">
                    <div className="container">
                        <a className="navbar-brand" href="/">
                            <img src="/assets/logo.png" width="30" height="30" className="d-inline-block align-top mr-2" alt="" />
                            SupWeater
                        </a>
                        <Logins setUser={this.props.setUser} user={this.props.user} changeTheme={this.props.changeTheme} theme={this.props.theme} />
                    </div>
                </nav>
            </header>
        );
    }
}

class Logins extends React.Component {
    logout() {
        localStorage.removeItem('token');
        this.props.setUser(null);
    }

    render() {
        if (this.props.user) {
            console.log(this.props.theme);
            return (
                <ul className="navbar-nav d-flex flex-row">
                    <li className="nav-item mr-4">
                        <div className="nav-item custom-control custom-switch pl-5 nav-link">
                            {
                                this.props.theme === "theme-light" ?
                                <input type="checkbox" className="custom-control-input" id="darkSwitch" onChange={this.props.changeTheme} checked={false} />
                                :
                                <input type="checkbox" className="custom-control-input" id="darkSwitch" onChange={this.props.changeTheme} checked />
                            }
                            <label className="custom-control-label user-select-none" htmlFor="darkSwitch">Dark Mode</label>
                        </div>
                    </li>
                    <li className="nav-item mr-4">
                        <span className="nav-link">Hello <strong className="purple">{this.props.user.name}</strong></span>
                    </li>
                    <li className="nav-item">
                        <button onClick={this.logout.bind(this)} type="button" className="nav-link btn btn-link">Logout</button>
                    </li>
                </ul>
            );
        }
        else {
            return (
                <ul className="navbar-nav d-flex flex-row">
                    <li className="nav-item mr-4">
                        <div className="nav-item custom-control custom-switch pl-5 nav-link">
                            {
                                this.props.theme === "theme-light" ?
                                <input type="checkbox" className="custom-control-input" id="darkSwitch" onChange={this.props.changeTheme} checked={false} />
                                :
                                <input type="checkbox" className="custom-control-input" id="darkSwitch" onChange={this.props.changeTheme} checked />
                            }
                            <label className="custom-control-label user-select-none" htmlFor="darkSwitch">Dark Mode</label>
                        </div>
                    </li>
                    <li className="nav-item mr-4">
                        <a className="nav-link" href="/Login">Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/Register">Register</a>
                    </li>
                </ul>
            );
        }
        
    }
}