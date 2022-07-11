const net = require('net')
const punycode = require('punycode/')
var { getServer, domainFormatting, toJson } = require('./utils')

class Whois {
    _server
    _net
    recursiveLookup
    lookupTimeOut
    socketTimeOut
    results
    constructor(target, options = {}) {
        this.recursiveLookup = 2
        this.lookupTimeOut = 500
        this.socketTimeOut = 0
        this.results = []
        this.set(target, options)

    }

    set(target, options) {
        this.target = domainFormatting(target)
        if (options) {
            if (options.host)
                this._server = {
                    host: domainFormatting(options.host),
                    port: 43,
                    query: '$addr\r\n'
                }
            else
                this._server = getServer(target)

            if (
                options.port
                && typeof options.port === 'number'
                && options.port > 0 && options.port < 65535
            ) {
                this._server.port = options.port
            }

            if (
                options.recursiveLookup
                && typeof options.recursiveLookup === 'number'
                && options.recursiveLookup > 0 && options.recursiveLookup < 5
            ) {
                this.recursiveLookup = options.recursiveLookup
            }

            if (options.lookupTimeOut
                && typeof options.lookupTimeOut === 'number'
                && options.lookupTimeOut > 0
            ) {
                this.lookupTimeOut = options.lookupTimeOut
            }

            if (options.socketTimeOut
                && typeof options.socketTimeOut === 'number'
                && options.socketTimeOut > 0
            ) {
                this.socketTimeOut = options.socketTimeOut
            }

        }
    }

    lookup(server = this._server, rec = this.recursiveLookup, cb) {

        let data = ''
        if (typeof (server) === 'function') {
            cb = server
            server = this._server
        }
        if (typeof (rec) === 'function') {
            cb = rec
            rec = this.recursiveLookup
        }
        if (rec < 1 || !server.host) return cb(this.results)
        this._net = net.connect(server)
        if (this.socketTimeOut) {
            this._net.setTimeout(this.socketTimeOut)
        }
        this._net.on('data', (chunk) => {
            return data += chunk
        })
        this._net.on('error', (err) => {
            return cb(null, err)
        })
        this._net.on('close', (err) => {
            let jsonData = (data)
            this.results.push(jsonData)

            let keys = ["ReferralServer", "Registrar_Whois", "Whois_Server", "WHOIS_Server", "Registrar_WHOIS_Server"]
            let index = 0
            while (Object.keys(jsonData).indexOf(keys[index]) < 0 && index < keys.length) {
                index++
            }
            if (index < keys.length && server.host != jsonData[keys[index]]) {
                server.host = jsonData[keys[index]]
                --rec;
            }
            else return cb(this.results)
            this.lookup(server, rec, cb)
        })
        let query = this._server.query.replace('$addr', punycode.toASCII(this.target))
        this._net.write(query)
    }

    getResult(mode = 0) {
        if (mode === 0) return this.results[0]
        if (mode === 1) return this.results[this.results.length - 1]
        return this.results

    }

    flush() {
        this.results = []
    }

}

module.exports = Whois