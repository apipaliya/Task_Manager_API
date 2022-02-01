const request = require('request')

const geocode = (address, callback) => {

    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?limit=2&access_token=pk.eyJ1IjoiYXBrLTEiLCJhIjoiY2t6M3A2cHdoMDBwMTJubXRpcXR6dDNteCJ9.t3mcrIayfzbwMvH76YKRqg'

    request(url,(error,{body})=>{
         res = JSON.parse(body);
        if(error) callback(url,undefined)
        else if(!res.features.length){
            callback('unable to find locatin , try to find another location',undefined)
        }
        else{
            const data = res.features[0].center
            callback(undefined,{
                latitude : data [1],
                longitude : data[0],
                location : res.features[0].place_name
            })
        }
    })
}

module.exports = geocode