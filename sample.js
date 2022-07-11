var Whois = require('./whois')

var traget = 'google.com'

var whois = new Whois(traget)

whois.lookup((data, err) => {
    console.log(data)
})

