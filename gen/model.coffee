
class Person extends Model
  save: ( f ) ->
    $.ajax
      url: '/person/save'
      complete: f
      data: JSON.stringify
        title: $( '#person-title' ).val()
        author: $( '#person-author' ).val()
        author_url: $( '#person-author_url' ).val()
        in_reply_to: $( '#person-in_reply_to' ).val()
  create: ( data, response ) ->
    client = new pg.Client 'postgres://'+prefs['dbuser']+':'+prefs['dbpass']+'@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']
    model = this
    client.on 'drain', client.end.bind client
    client.connect()
    dt = new Date()
    ins_query = client.query
      text: 'INSERT INTO person ( title, created_at ) VALUES ( $1, $2 )'
      values: [ data.title, dt.format "isoDateTime" ]
    ins_query.on 'end', ( result ) ->
      model.send 'changed'
      response.end 'ok'

module.exports.Person = Person # server
if app?
  app.Person = Person # client
