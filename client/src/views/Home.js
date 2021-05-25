import React from 'react';
import axios from 'axios';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
        }
    }

    componentDidMount() {
        axios.get('api/weather', {
            headers: {
              'auth-token': localStorage.getItem('token')
            }
        })
        .then(response => { 
            if (response.data) {
                this.setState({cities: response.data})
            }
        })
        .catch(err => { 
            console.log(err);
        })
    }

    showModal() {
        this.setState({ show: true });
    }

    hideModal() {
        this.setState({ show: false });
    }

    addCity(city) {
        let cities = []
        if (this.state.cities !== "no cities") {
            cities = this.state.cities;
        }
        cities.push(city);
        this.setState({ cities: cities });
    }

    delete = id => e => {
        e.preventDefault();

        let cities = this.state.cities;

        cities.forEach(city => {
            if (city.id === id) {
                const i = cities.indexOf(city);
                if (i > -1) {
                    cities.splice(i, 1);
                    this.setState({cities: cities});
                }
            }
        });

        axios.delete(`api/weather/city/${id}`, {
            headers: {
              'auth-token': localStorage.getItem('token')
            }
        })
        .catch(err => { 
            console.log(err);
        })
    }

    render() {
        if (this.state.cities && this.state.cities !== "no cities") {
            return(
                <div className="container d-flex justify-content-center flex-wrap">
                    {this.state.cities.map(city => (
                        <a key={city.id} className="city" href={`/city/${city.id}`}>
                            <div className="p-4 d-flex justify-content-between">
                                <div>
                                    <h2>{city.name}</h2>
                                    <p>{city.description}</p>
                                    <h1>{city.temp}°C</h1>
                                    <p>
                                        <strong>Feels like: {city.feels_like}°C</strong><br />
                                        Max: <span className="purple">{city.temp_max}°C</span><br />
                                        Min: <span className="ice">{city.temp_min}°C</span>
                                    </p>
                                </div>
                                <div className="d-flex flex-column justify-content-between">
                                    <img src={`http://openweathermap.org/img/wn/${city.icon}@2x.png`} alt="Weather icon"></img>
                                    <p className="text-right"><i className="fas fa-trash trash mr-3" onClick={this.delete(city.id)}></i></p>
                                </div>
                            </div>
                        </a>
                    ))}
                    <div className="b-addcity d-flex align-items-center">
                        <button type="button" className="addcity" onClick={this.showModal.bind(this)}><i className="fas fa-plus"></i> <strong>Add City</strong></button>
                    </div>
                    <AddCity show={this.state.show} hideModal={this.hideModal.bind(this)} addCity={this.addCity.bind(this)} />
                </div>
            );
        }
        else {
            return(
                <div className="container d-flex justify-content-center flex-wrap">
                    <div className="b-addcity d-flex align-items-center">
                        <button type="button" className="addcity" onClick={this.showModal.bind(this)}><i className="fas fa-plus"></i> <strong>Add City</strong></button>
                    </div>
                    <AddCity show={this.state.show} hideModal={this.hideModal.bind(this)} addCity={this.addCity.bind(this)} />
                </div>
            );
        }
    }
}

class AddCity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            city: "",
            error: ""
        }
    }

    addCity = e => {
        e.preventDefault();
        this.setState({error: ""});

        if (this.state.city === "") return;

        axios.post('api/weather/city', { city: this.state.city}, {
            headers: {
              'auth-token': localStorage.getItem('token')
            }
        })
        .then(response => { 
            if (response.data) {
                this.props.addCity(response.data);
                this.props.hideModal();
            }
        })
        .catch(err => { 
            if (err.response && err.response.data) {
                this.setState({error: err.response.data});
            }
        })
    }

    close() {
        this.setState({error: ""});
        this.props.hideModal();
    }

    render() {
        if (this.props.show) {
            return (
                <div id="modal">
                    <div id="modal-content">
                        <h1>Add a new city</h1>
                        <form className="col-5 pl-0" onSubmit={this.addCity.bind(this)}>
                            {this.state.error !== "" &&
                                <div className="mb-2">
                                    <span className="p-2 border border-danger text-danger">{this.state.error}</span>
                                </div>
                            }
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input type="text" className="form-control" id="city" aria-describedby="emailHelp" placeholder="Enter city name" required
                                    onChange={e => { this.setState({ city: e.target.value }) }} />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="submit" className="btn btn-secondary ml-2" onClick={this.close.bind(this)}>Close</button>
                        </form>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }
}