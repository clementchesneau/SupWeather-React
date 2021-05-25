import React from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
        axios.get(`api/weather/city/${this.props.match.params.id}`, {
            headers: {
              'auth-token': localStorage.getItem('token')
            }
        })
        .then(response => { if(response.data) { this.setState({city: response.data}); } })
        .catch(err => { 
            console.log(err);
        })
    }



    render() {
        if (this.state.city) {
            return (
                <div>
                    <h1 className="text-center mb-5">{this.state.city.name}</h1>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={4}
                        navigation
                        className="p-4"
                    >
                        {this.state.city.days.map(day => (
                            <SwiperSlide className="day p-4" key={day.date}>
                                <h4 className="text-center mb-0">{day.date}</h4>
                                <div className="d-flex justify-content-center">
                                    <img src={`http://openweathermap.org/img/wn/${day.icon}@4x.png`} alt="Weather icon"></img>
                                </div>
                                <p className="text-center test mb-5">{day.description}</p>
                                
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p className="text-left">
                                            <strong>
                                                Day: {day.day_temp}°C <br />
                                                Max: <span className="purple">{day.temp_max}°C</span>
                                            </strong>
                                        </p>
                                        <p className="text-left">
                                            Sunrise: {day.sunrise} <br />
                                            Rain risk: {day.rain} % <br />
                                            Wind: {day.wind} km/h
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-right">
                                            <strong>
                                                Feels like: {day.day_feels_like}°C <br />
                                                Min: <span className="ice">{day.temp_min}°C</span>
                                            </strong>
                                        </p>
                                        <p className="text-right">
                                            Sunset: {day.sunset} <br />
                                            Humidity: {day.humidity} % <br />
                                            Cloudiness: {day.clouds} %
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            );
        }
        else {
            return null;
        }
    }
}