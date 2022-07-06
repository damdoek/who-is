var Whois = require('./whois')

var traget = 'paypaymalljp.co'

var whois = new Whois(traget)

whois.lookup((data, err) => {
    console.log(data)
})

