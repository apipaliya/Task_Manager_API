const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=8a8badeb32d206d297ef65b44887391f&query=' + latitude + ',' + longitude

    request({ url, json: true }, (error, { body }) => {
        if (error) callback('unable to connect with url', undefined)
        else if (body.error) {
            callback('unable to find locatin , try to find another location', undefined)
        }
        else {
            data = 'Current weather in ' + body.location.name + ' is '+body.current.weather_descriptions+' And temperature is ' + body.current.temperature + ' but feels like ' + body.current.feelslike;
            callback(undefined, data)
        }
    })
}

module.exports = forecast