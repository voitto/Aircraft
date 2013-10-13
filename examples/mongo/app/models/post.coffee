
class Post extends Model
  save: ( f ) ->
    $.ajax
      url: '/post/save'
      complete: f
      data: JSON.stringify
        title: $( '#post-title' ).val()
  create: ( data, response ) ->
    model = this
    dt = new Date()
    mods = mongoose.modelNames()
    if 'Post' not in mods
      postmodel = mongoose.model 'Post',
        title: String
        created_at: String
    else
      postmodel = mongoose.model 'Post'
    po = new postmodel 
      title:data.title
      created_at: dt.format "isoDateTime"
    po.save ( err ) ->
      model.send 'changed'
      response.end 'ok'

module.exports.Post = Post # server
if app?
  app.Post = Post # client
