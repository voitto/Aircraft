
app = require( 'aircraft' ).config
  port: 4444,
  dbname: 'appdb',
  dbhost: 'localhost',
  url: 'http://localhost:4444'
  
app.get '/', ( req, res ) ->
  @post = new app.Post
  @view = new app.Show req, res, null, @post

app.get '/:id', ( req, res, id ) ->
  @post = new app.Post
  @view = new app.Show req, res, id, @post

app.post '/post/_show.html', ( req, res ) ->
  return app.file 'public/templates/post/_show.html', res
