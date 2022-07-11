# who-is
whois for node

# Usage
```js
    var Whois = require('./whois')

    var traget = 'google.com'

    var whois = new Whois(traget)

    whois.lookup((data, err) => {
        console.log(data)
    })
```
# Parameters

## whois class


<table>
<tr>
<td> params </td> <td> Description </td>
</tr>
<tr>
<td> target </td>
<td>
 **String**, target's url of the whois lookup 
</td>
<tr>
<td> options </td>
<td>
  **Object**,

```json
{
    recursiveLookup: max number of recursive call to  execute based on the referal whois server, default 1
    lookupTimeOut: timeout between each  recursive call, default 0
    socketTimeOut: timeout of the lookup socket, default 0
}	
``` 
</td>
</tr>


## loookup method

| params | Description |
| ----------- | ----------- |
| server | **Object**, 

```json
    {   
        host: whois server to  query, default calculated based on target
        port: default 43,
        query: whois query,  default generated based on server
    }	
``` 
|
| rec | **Number**, max number of recursive call to  execute based on the referal whois server, default initial setup value}` |