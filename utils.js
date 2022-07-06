const punycode = require('punycode/')
const net = require('net')
const serverList = require('./data/servers.json')

exports.getServer = (addr) => {
    let server = null
    if (addr.indexOf("@") > -1) {
        return Error('E02: email  are no accepted !')
    }
    if (net.isIP(addr)) {
        server = serverList['$ip$']
    }
    else {
        let tld = punycode.toASCII(addr)
        while (!server || tld.length > 0) {
            server = serverList[tld];
            tld = tld.replace(/^.+?(\.|$)/, '');
        }
        if (!server)
            return Error('E01: no server found !')
    }
    if (typeof (server) === "string") {
        return { host: server, query: "$addr\r\n", port: 43 }
    }
    return { ...server, port: 43 }
}

exports.domainFormatting = (string) => {
    return string.replace(/^[:\s]+/, '').replace(/^https?[:\/]+/, '').replace(/(\/|:).+/, '') || string;
};

exports.toJson = (string) => {
    var json = {}
    var lines = string.split('\n')
    lines.map(line => {
        let match = line.match(/(http|https){0}[:]/)
        if (match != null) {
            let item = [line.slice(0, match.index), line.slice(match.index + 1)]
            json[item[0].trim().replace(RegExp('\\.', 'g'), '').replace(RegExp('(\\s|\/)', 'g'), '_').trim()] = item[1].trim()
        }
    })
    return json
}