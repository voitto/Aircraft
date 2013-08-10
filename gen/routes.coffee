
app.get '/', ( req, res ) ->
  @person = new app.Person
  @view = new app.Show req, res, null, @person

app.get '/:id', ( req, res, id ) ->
  @person = new app.Person
  @view = new app.Show req, res, id, @person

app.post '/person/_show.html', ( req, res ) ->
  return app.file 'public/templates/person/_show.html', res
