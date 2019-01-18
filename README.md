# gocardless node api

## Usage

```js
const Promise = require('bluebird');

const gocardless = require('gocardless-node-api')('your-gocardless-token');

gocardless.post('redirect_flows', {
    session_token: 'dummy-session-token',
    success_redirect_url: 'https://myapp.example.com'
  })
  .then((res) => console.log(res));
```
