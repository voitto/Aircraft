
class Persons extends Controller
  init: ( View, id, Person ) ->
    Person.find( id )
    @bind 'click', '#person-save', ->
      Person.save ->
        $( '#person-title' ).val ''
        $( '.modal' ).removeClass 'active'
        $( '.modal-bg' ).remove()
    @connect '/person/save', ( req, res ) ->
      @fullBody = '';
      req.on 'data', (chunk) =>
        @fullBody += chunk.toString()
      req.on 'end', =>
        @data = JSON.parse @fullBody
        Person.create @data, res
  render: ->
    @view.render()

module.exports.Persons = Persons

