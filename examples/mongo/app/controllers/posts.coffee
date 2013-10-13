
class Posts extends Controller
  init: ( View, id, Post ) ->
    Post.find( id )
    @bind 'click', '#post-save', ->
      Post.save ->
        $( '#post-title' ).val ''
        $( '.modal' ).removeClass 'active'
        $( '.modal-bg' ).remove()
    @connect '/post/save', ( req, res ) ->
      @fullBody = '';
      req.on 'data', (chunk) =>
        @fullBody += chunk.toString()
      req.on 'end', =>
        @data = JSON.parse @fullBody
        Post.create @data, res
  render: ->
    @view.render()

module.exports.Posts = Posts

