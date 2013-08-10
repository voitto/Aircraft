# aircraft

https://aircraft.vc

a small framework for simple web apps

## Getting Started
Install the module with: `npm install aircraft`

Generate an Aircraft app with:

`aircraft new myapp`

`cd myapp`

`aircraft g model post`

`aircraft g controller post`

`aircraft g view post show`

`aircraft g routes post show`

[ edit app.coffee to set your db config ]

`coffee -cw .; coffee app.coffee`

[ browse to http://localhost:4444 ]

```javascript

app = require( 'aircraft' )...

app.get '/', ( req, res ) ->
  @post = new app.Post
  @view = new app.Show req, res, null, @post

```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Brian Hendrickson  
Licensed under the MIT license.
