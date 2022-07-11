# who-is
whois for node

# Usage
    `var Whois = require('./whois')

    var traget = 'google.com'

    var whois = new Whois(traget)

    whois.lookup((data, err) => {
        console.log(data)
    })1`

# Parameters

## whois class

| params | Description |
| ----------- | ----------- |
| target | **String**, target's url of the whois lookup |
| options | **Object**, `{`|
|         |`    recursiveLookup: max number of recursive call to  execute based on the referal whois server, default 1`|
|         |`    lookupTimeOut: timeout between each  recursive call, default 0`|
|         |`    socketTimeOut: timeout of the lookup socket, default 0`|
|         |`}` |

## loookup method

| params | Description |
| ----------- | ----------- |
| server | **Object**, `{`|
|        |`     host: whois server to  query, default calculated based on target`|
|        |`     port: default 43,`|
|        |`     query: whois query,  default generated based on server`|
|        |`}` |
| rec | **Number**, max number of recursive call to  execute based on the referal whois server, default initial setup value |