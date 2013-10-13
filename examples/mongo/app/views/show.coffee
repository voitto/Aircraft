
class Show extends View
  init: ( req, res, id, post ) ->
    @controller = new module.exports.Posts @, id, post

module.exports.Show = Show # server
if app?
  app.Show = Show # client