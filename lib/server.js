
/*
* aircraft
* https://github.com/voitto/aircraft
*
* Copyright (c) 2013 Brian Hendrickson
* Licensed under the MIT license.
*/


var http = require( 'http' );
var mustache = require( 'mustache' );
var fs = require('fs');

// require these to use sessions
// var krumkake = require('krumkake');
// var keygrip = require('keygrip');

var session = null;
var signed_in = false;
var tables = [];



var server = http.createServer( function( req, res ) {

  console.log(req.url);
  
  if (typeof krumkake != 'undefined') {
  
    var keys = new keygrip(['pants','monkeys']);
  
    session = new krumkake(req, res, {
      cookieName: 'user',
      expire: 60 * 60 * 24 * 365,
      keys: keys
    });
  
    var val = session.get('signed_in');

    if (!val) {
      signed_in = false;
    } else {
      signed_in = true;
    }
  
  }
    

  var f = routes[ req.url + req.method.toLowerCase() ];

  var value = false;

  if (f == undefined) {
    var myarray  = req.url.split(/[\/]/);
    if (!(undefined == myarray[1]))
      if (isInt(myarray[1])) {
        f = routes[ '/:id' + 'get' ];
        value = myarray[1];
      }
  }

  if ( isFunc( f ))
    f( req, res, value );

  trigger( req.method.toLowerCase(), req, res );

});




var socket = null;
var prefs = {};
var scripts = "";
var subscripts = "";
var io = require( 'socket.io' ).listen( server, { log: false } );

io.sockets.on( 'connection', function ( sock ) {
  socket = sock;
  socket.on('clientevent', function (data) {
    //
  });
});

var port = 4444;

var routes = {};

var models = {};

var events = {};

function trigger( evt, req, res ) {
  
  f = events[ evt ];

  if ( !in_array( evt, [ 'get', 'post' ] ))

    if ( isFunc( f ) && socket != null )

      socket.emit( evt, f );
  
    else if ( socket != null )
  
      socket.emit( evt );

}

function get( path, func ) {

  routes[ path + "get" ] = func;

}

function post( path, func ) {

  routes[ path + "post" ] = func;

}

function isFunc( ff ) {

  var getType = {};

  return ff && getType.toString.call( ff ) === '[object Function]';

}

server.listen( port );

var Model,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  Model = (function() {
    function Model() {
      
      
      var mdl = this;
      if ( !in_array( get_class(mdl).toLowerCase(), ['post','appcontroller','appview','data','apptemplate'] )) {
        post('/'+ get_class(mdl).toLowerCase()+'.json', function(req,res){
          var modelname = get_class(mdl).toLowerCase();
          var fullBody = '';
          var rows = [];
          req.on('data', function(chunk) {
            fullBody += chunk.toString();
          });
          var id = false;
          var response = res;
          var rows = [];
          if (typeof pg == 'undefined')
            var pg = require('pg');
          var client = new pg.Client('postgres://'+prefs['dbuser']+':'+prefs['dbpass']+'@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
          client.on('drain', client.end.bind(client));
          client.connect();
          req.on('end', function() {
            id = fullBody;
            if (isInt(id))
              var query = client.query({
                text: 'SELECT * FROM '+modelname+' WHERE id = $1',
                values: [id]
              });
            else
              var query = client.query({
                text: 'SELECT * FROM '+modelname +' ORDER BY id desc',
                values: []
              });
            query.on('row', function(row) {
              rows.push(row);
            });
            query.on('end', function(result) {
              response.end(JSON.stringify(rows));
            });
          });
        });
      }
  
         var mmodel = this;
         var model = get_class(this).toLowerCase();
         
          model = model.charAt(0).toUpperCase() + model.slice(1);
          if ( !in_array( model.toLowerCase(), tables )) {
            if (typeof pg == 'undefined')
              var pg = require('pg');
            var client = new pg.Client('postgres://'+prefs['dbuser']+':@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
            client.on('drain', client.end.bind(client));
            client.connect();
            var query = client.query({
              text: 'CREATE TABLE '+model.toLowerCase()+' (title text, created_at varchar(30), id serial)',
              values: []
            });
            query.on('error', function(row) {
              mmodel.dependents = [];
              mmodel.bind('changed',function(){
                mmodel.send('changed');
              });
            });
            query.on('end', function() {
              mmodel.dependents = [];
              mmodel.bind('changed',function(){
                mmodel.send('changed');
              });
            });
          } else {
            mmodel.dependents = [];
            mmodel.bind('changed',function(){
              mmodel.send('changed');
            });
          }


      
      
    }
    return Model;
})();

var View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  View = (function() {
    function View( req, res, id, mod, other, o2, o3, o4, o5, o6, o7, o8, o9 ) {
      this.response = res;
      this.model = mod;
      this.model.register( this );
      this.init( req, res, id, mod, other, o2, o3, o4, o5, o6, o7, o8, o9 );
    }
    return View;
})();

var Controller,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  Controller = (function() {
    function Controller( View, id, Model, other, o2, o3, o4, o5, o6, o7, o8, o9  ) {
      this.view = View;
      this.view.controller = this;
      this.init( View, id, Model, other, o2, o3, o4, o5, o6, o7, o8, o9 );
    }
    return Controller;
})();


Model.prototype.dependents = [];

Model.prototype.events = {};

Model.prototype.data = [];

Model.prototype.create = function( data, response ) {
  if (typeof pg == 'undefined')
    var pg = require('pg');
  var client = new pg.Client('postgres://'+prefs['dbuser']+':'+prefs['dbpass']+'@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
  var model = this;
  client.on('drain', client.end.bind(client));
  client.connect();
  // body text, updated varchar(255), published varchar(255), author varchar(255), author_url v
  var dt = new Date();
  dt = dt.format("isoDateTime");
  var ins_query = client.query({
    text: 'INSERT INTO post (title,body,updated,published,author,author_url,author_email,profile_image,in_reply_to) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
    values: [data.title,"","",dt,data.author,data.author_url,"","http://megapump.com/defaultavatar.jpg",data.in_reply_to]
  });
  ins_query.on('end', function(result) {
    
    if (data.in_reply_to.length > 0) {
    
      model.find();
      var squery = client.query({
        text: "select currval('post_id_seq')",
        values: []
      });
      var target = data.in_reply_to;
      squery.on('row', function(row) {
        var source = prefs['url']+'/'+row['currval'];
        if (typeof url == 'undefined')
          var url = require('url');
        var parsed = url.parse(target);
        var port = 80;
        if (!(null == parsed.port))
          port = parsed.port;
        console.log('posting to '+parsed.hostname+' '+port.toString()+parsed.path);
          var options = {
            host: parsed.hostname,
            port: port,
            path: parsed.path
          };
          var pingback = require('pingback');
          pingback.send(url.parse(target), url.parse(source), function(err, pingback) {
            if (!err) console.log('Pinged ' + pingback.href + ' successfully.');
            else console.log('Pingback try but failed ' +JSON.stringify(pingback)+ ' t='+target+' s='+source);
          });
        console.log('starting web mention');
        if (typeof jsdom == 'undefined')
          var jsdom = require('jsdom');
        jsdom.env({
          html: target,
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (errors, window) {
            console.log('done web mention');
            if (typeof $ == 'undefined')
              var $ = require('jquery');
            var $ = window.$;
            var endpoint = $("link[rel='http://webmention.org/']").attr('href');
            if (null == endpoint) {
              return;
            }
            console.log(endpoint + ' web mention endpoint');
            var querystring = require('querystring');
            var http = require('http');
            var fs = require('fs');
            function PostCode(codestring,endpoint) {
              var post_data = querystring.stringify({
                'source': source,
                'target': target
              });
              console.log(JSON.stringify(post_data) + ' web mention endpoint');
              var parsed = url.parse(endpoint);
              var port = 80;
              if (!(null == parsed.port))
                port = parsed.port;
              console.log('posting to '+parsed.hostname+' '+port.toString()+parsed.path);
              var post_req = http.request({
                  host: parsed.hostname,
                  port: port,
                  path: parsed.path,
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-Length': post_data.length
                  }
              }, function(res) {
                  res.setEncoding('utf8');
                  res.on('data', function (chunk) {
                      console.log('Response: ' + chunk);
                  });
                  res.on('end',function(){
                    model.send( 'changed' );
                    response.end('ok');
                  });
              });
              post_req.write(post_data);
              post_req.end();
            }
            PostCode('data',endpoint);
          }
        });
      });
    
    } else {
      model.send( 'changed' );
      response.end('ok');
    }
    
  });
}

Model.prototype.register = function( view ) {
  this.dependents.push( view )
}

Model.prototype.bind = function( evt, func ) {
  this.events[ evt ] = func;
}

Model.prototype.send = function( evt ) {
  evt = evt + ' ' + get_class(this).toLowerCase();
  for (view in this.dependents) {
    this.dependents[view].receive( evt );
  }
  trigger(evt);
}

Model.prototype.find = function(id) {
  var modelname = get_class(this).toLowerCase();
  var model = this;
  var rows = [];
  if (typeof pg == 'undefined')
    var pg = require('pg');
  var client = new pg.Client('postgres://'+prefs['dbuser']+':'+prefs['dbpass']+'@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
  client.on('drain', client.end.bind(client));
  client.connect();
  var query = client.query({
    text: 'CREATE TABLE post (title text, body text, created_at varchar(255), updated varchar(255), published varchar(255), author varchar(255), author_url varchar(255), author_email varchar(255), profile_image  varchar(255), in_reply_to varchar(255), id serial)',
    values: []
  });
  query.on('error', function(row) {
  });
  if (isInt(id))
    var query = client.query({
      text: 'SELECT * FROM '+modelname+' WHERE id = $1',
      values: [id]
    });
  else
    var query = client.query({
      text: 'SELECT * FROM '+modelname +' ORDER BY id desc',
      values: []
    });
  query.on('row', function(row) {
    rows.push(row);
  });
  query.on('end', function(result) {

    if (rows.length > 1 || rows.length == 0) {
      
      model.data = rows;
      model.send( 'changed' );
      
    } else {
      var mentions = [];

      var query2 = client.query({
        text: 'SELECT * FROM mention WHERE in_reply_to = $1',
        values: [rows[0].id]
      });
      query2.on('error', function(row) {
      });

      query2.on('row', function(men) {
        mentions.push(men);
      });

      query2.on('end', function(result) {
        
        var is_reply = false;
        var original_url = '';
    
        if (!(rows[0].in_reply_to == null))
          if (rows[0].in_reply_to.length > 0) {
            is_reply = true;
            original_url = rows[0].in_reply_to;
          }
        rows[0].is_reply = is_reply;
        rows[0].original_url = original_url;
        rows[0].has_replies = false;
        rows[0].replies = mentions;
        if (mentions.length > 0) {
          rows[0].has_replies = true;
        }
        model.data = rows;
        model.send( 'changed' );
      });
    }
  });
}

Model.prototype.to_hash = function() {
  return {content:'this i content',items:this.data};
}


Controller.prototype.model = null;

Controller.prototype.view = null;

Controller.prototype.bind = function(evt,selector,f) {
}

Controller.prototype.connect = function( route, func ) {
  post(route,func);
}


View.prototype.model = null;

View.prototype.controller = null;

View.prototype.response = null;

View.prototype.render = function() {

  var viewname = get_class(this).toLowerCase();
  var modelname = get_class(this.model).toLowerCase();
  var tpldir = 'public/templates/';
  var _view = tpldir+modelname+'/_'+viewname+'.html';
  var view = tpldir+modelname+'/'+viewname+'.html';
  var data = this.model.to_hash();
  data['url'] = prefs['url'];
  data['signed_in'] = signed_in;
  data['content'] = '';
  var t = '';

  if ( fs.existsSync( _view ))
    t = fs.readFileSync(_view, 'utf-8');

  if ( fs.existsSync( view )) {
    t = fs.readFileSync(view, 'utf-8');
    this.response.end( mustache.to_html( t, data ));
  }

};

View.prototype.receive = function( message ) {
  if (message == 'changed '+get_class(this.model).toLowerCase()) {
    //console.log('rendering '+get_class(this.model).toLowerCase()+' '+get_class(this).toLowerCase());
    this.response.end( this.controller.render() );
  }
}

function config( settings ) {

  if ( !( undefined == settings['port'] ))

    port = settings['port'];
  
  if ( !( undefined == settings['dbname'] ))
    prefs['dbname'] = settings['dbname'];

  if ( !( undefined == settings['dbuser'] ))
    prefs['dbuser'] = settings['dbuser'];

  if ( !( undefined == settings['dbpass'] ))
    prefs['dbpass'] = settings['dbpass'];

  if ( !( undefined == settings['dbport'] ))
    prefs['dbport'] = settings['dbport'];

  if ( !( undefined == settings['dbhost'] ))
    prefs['dbhost'] = settings['dbhost'];

  if ( !( undefined == settings['url'] ))
    prefs['url'] = settings['url'];
    
  if (!server == undefined)
    server.close();
    
  
  
  if (typeof pg == 'undefined')
    var pg = require('pg');
  
  var client = new pg.Client('postgres://'+prefs['dbuser']+':@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
  client.on('drain', client.end.bind(client));
  client.connect();
  var query = client.query({
    text: 'select * from pg_tables where schemaname = $1',
    values: ['public']
  });
  query.on('row', function( row ) {
    tables.push( row['tablename'] );
  });
  query.on('end', function( result ) {
    
    var systables = ['model','view','controller','template','route','app'];
    for( var i in systables ) {
      if ( !in_array( systables[i], tables )) {
        var query = client.query({
          text: 'CREATE TABLE '+systables[i]+' (title text, source text, created_at varchar(30), id serial)',
          values: []
        });
        query.on('error', function(row) {
        });
        console.log('created table '+systables[i])
      }
    }
    
    
    var cbc = 0;
    var cbt = 3;
    
    
    var dir1 = "app/controllers";
    fs.readdir( dir1, function( err, list ) {
      list.forEach(function (file) {
        cbt++;
        var ext = file.substr(file.lastIndexOf('.') + 1);
        if (ext == 'js'){
          var script = fs.readFileSync( dir1 + "/" + file, 'utf-8' );
          scripts = scripts + script;
          eval(script);
          var controller = ""+file.substring(0, file.length - 3);
          controller = controller.charAt(0).toUpperCase() + controller.slice(1);
        }
        cbc++;
        if (cbc == cbt)
          continueSetup();
      });
      cbc++;
      if (cbc == cbt)
        continueSetup();
    });

    var dir2 = "app/views";
    fs.readdir( dir2, function( err, list ) {
      list.forEach(function (file) {
        cbt++;
        var ext = file.substr(file.lastIndexOf('.') + 1);
        if (ext == 'js'){
          var script = fs.readFileSync( dir2 + "/" + file, 'utf-8' );
          scripts = scripts + script;
          eval(script);
          var view = ""+file.substring(0, file.length - 3);
          view = view.charAt(0).toUpperCase() + view.slice(1);
        }
        cbc++;
        if (cbc == cbt)
          continueSetup();
      });
      cbc++;
      if (cbc == cbt)
        continueSetup();
    });

    var dir3 = "app/models";
    fs.readdir( dir3, function( err, list ) {
      list.forEach(function (file) {
        cbt++;
        var ext = file.substr(file.lastIndexOf('.') + 1);
        if (ext == 'js'){
          var script = fs.readFileSync( dir3 + "/" + file, 'utf-8' );
          scripts = scripts + script;
          eval(script);
          var model = ""+file.substring(0, file.length - 3);
          model = model.charAt(0).toUpperCase() + model.slice(1);
          if ( !in_array( model.toLowerCase(), tables )) {
            var query = client.query({
              text: 'CREATE TABLE '+model.toLowerCase()+' (title text, created_at varchar(30), id serial)',
              values: []
            });
            query.on('error', function(row) {
            });
            console.log('created table '+model.toLowerCase())
          }
        }
        cbc++;
        if (cbc == cbt)
          continueSetup();
      });
      cbc++;
      if (cbc == cbt)
        continueSetup();
    });
    
    function continueSetup() {
      
      return true;
    }
    
    
    
    // query.end
  });
  
  
  
  


  server.listen( port );

  return this;

}

function file( tpl, res ) {
  if ( fs.existsSync( tpl ))
    return res.end(fs.readFileSync( tpl, 'utf-8' ));
}



if (typeof pg == 'undefined')
  pg = false;

module.exports.pg = pg;

if (typeof url == 'undefined')
  url = false;

module.exports.url = url;

module.exports.get = get;

module.exports.post = post;

module.exports.Model = Model;

module.exports.View = View;

module.exports.Controller = Controller;

module.exports.config = config;

module.exports.trigger = trigger;

module.exports.file = file;

module.exports.prefs = prefs;

module.exports.fs = fs;




var dir = "public";

fs.readdir( dir, function( err, list ) {
  if (err)
    return action(err);
  list.forEach(function (file) {
    var path = dir + "/" + file;
    fs.stat(path, function (err, stat) {
      if (stat && stat.isDirectory()) {
      } else {
        var ffile = file;
        var ttype = 'application/javascript';
        get('/'+ffile, function(req,res){
          var ext = ffile.substr(ffile.lastIndexOf('.') + 1);
          if (ext == 'css')
            ttype = 'text/css';
          res.writeHead( 200, { 'Content-Type' : ttype } );
          return res.end(fs.readFileSync( 'public/' + file, 'utf-8' ));
        });
      }
    });
  });
});



get('/app.js', function(req,res){
  res.writeHead( 200, { 'Content-Type' : 'application/javascript' } );
  data = {};
  data['url'] = prefs['url'];
  data['signed_in'] = session.get('signed_in');
  var appjs = fs.readFileSync('app.js', 'utf-8' );
  res.end( mustache.to_html( scripts+appjs, data ));
});

get('/lib.js', function(req,res){
  res.writeHead( 200, { 'Content-Type' : 'application/javascript' } );
  data = {};
  data['url'] = prefs['url'];
  data['signed_in'] = session.get('signed_in');
  res.end( mustache.to_html( fs.readFileSync( __dirname + '/client.js', 'utf-8' ), data ));
});

get('/favicon.ico', function(req,res){
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  res.end('');
});

post('/rosie.json', function(req,res){
  res.writeHead( 200, { 'Content-Type' : 'application/javascript' } );
  res.end(JSON.stringify([]));
});



post('/mention',function(req,res){
    var querystring = require('querystring');
    var fullBody = '';
    req.on('data', function(chunk) {
      fullBody += chunk.toString();
    });
    req.on('end', function() {
      var decodedBody = querystring.parse(fullBody);
      var in_reply_to_id = 0;
      if (typeof url == 'undefined')
        var url = require('url');
      var parsed = url.parse(decodedBody.target);
        var myarray  = parsed.path.split(/[\/]/);
        if (!(undefined == myarray[1]))
          if (isInt(myarray[1]))
            in_reply_to_id = myarray[1];
      if (in_reply_to_id > 0) {
        if (typeof pg == 'undefined')
          var pg = require('pg');
        var client = new pg.Client('postgres://'+prefs['dbuser']+':@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
        client.on('drain', client.end.bind(client));
        client.connect();
        var query = client.query({
          text: 'CREATE TABLE mention (title text, body text, created_at varchar(255), updated varchar(255), published varchar(255), author varchar(255), author_url varchar(255), author_email varchar(255), profile_image varchar(255), in_reply_to int, reply_url varchar(255), id serial)',
          values: []
        });
        query.on('error', function(row) {
        });
        query.on('end', function(result) {
          var ins_query = client.query({
            text: 'INSERT INTO mention (title,body,updated,published,author,author_url,author_email,profile_image,in_reply_to,reply_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
            values: ["","","","","","","","http://megapump.com/defaultavatar.jpg",in_reply_to_id,decodedBody.source]
          });
          ins_query.on('end', function(result) {
            Post = (function(_super) {
              __extends(Post, _super);
              function Post() {
                _ref = Post.__super__.constructor.apply(this, arguments);
                return _ref;
              }
              return Post;
            })(Model);
            model = new Post();
            model.send( 'changed' );
          });
        });
      }
      console.log('mention, target = '+req.body.target);
      console.log(' source = '+req.body.source);
      res.end();
    });
    res.end('sweet');
});

post('/post.json', function(req,res){
  var modelname = 'post';
  var fullBody = '';
  var rows = [];
  req.on('data', function(chunk) {
    fullBody += chunk.toString();
  });
  var id = false;
  var response = res;
  var rows = [];
  if (typeof pg == 'undefined')
    var pg = require('pg');
  var client = new pg.Client('postgres://'+prefs['dbuser']+':'+prefs['dbpass']+'@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
  client.on('drain', client.end.bind(client));
  client.connect();
  req.on('end', function() {
    id = fullBody;
    if (isInt(id))
      var query = client.query({
        text: 'SELECT * FROM '+modelname+' WHERE id = $1',
        values: [id]
      });
    else
      var query = client.query({
        text: 'SELECT * FROM '+modelname +' ORDER BY id desc',
        values: []
      });
    query.on('row', function(row) {
      rows.push(row);
    });
    query.on('end', function(result) {
        if (rows.length === 1) {
        var mentions = [];
        var query2 = client.query({
          text: 'SELECT * FROM mention WHERE in_reply_to = $1',
          values: [rows[0].id]
        });
        query2.on('error', function(row) {
        });
        query2.on('row', function(men) {
          mentions.push(men);
        });
        query2.on('end', function(result) {
          var is_reply = false;
          var original_url = '';
          var query3 = client.query({
            text: "SELECT * FROM mention WHERE reply_url = '"+prefs['url']+"/"+rows[0].id+"'",
            values: []
          });
          query3.on('error', function(row) {
          });
          query3.on('row', function(isrep) {
            is_reply = true;
            original_url = prefs['url']+'/'+isrep.in_reply_to;
          });
          query3.on('end', function(result) {
            if (rows.length > 0) {
              rows[0].is_reply = is_reply;
              rows[0].original_url = original_url;
              rows[0].has_replies = false;
              rows[0].replies = mentions;
              if (mentions.length > 0) {
                rows[0].has_replies = true;
              }
              if (!(null == rows[0].in_reply_to)) {
                if (rows[0].in_reply_to.length > 0) {
                  rows[0].is_reply = true;
                  rows[0].original_url = rows[0].in_reply_to;
                }
              }
            }
            response.end(JSON.stringify(rows));
          });
        });
      } else {
        response.end(JSON.stringify(rows));
      }
    });
  });
});



post('/person/signout',function(req,res){
  var val = session.get('signed_in');
  if (!val) {
  } else {
    session.del('signed_in');
  }
  res.end('ok');
});



post('/person/signin', function(req,res) {
  var fullBody = '';
  var rows = [];
  req.on('data', function(chunk) {
    fullBody += chunk.toString();
  });
  req.on('end', function() {
    var data = JSON.parse(fullBody);
    if (typeof pg == 'undefined')
      var pg = require('pg');
    var client = new pg.Client('postgres://'+prefs['dbuser']+':'+prefs['dbpass']+'@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
    client.on('drain', client.end.bind(client));
    client.connect();
    var query = client.query({
      text: 'SELECT password,email,id FROM person WHERE email ilike $1',
      values: [data.email]
    });
    query.on('row', function(row) {
      rows.push(row);
    });
    query.on('end', function(result) {
      if (rows.length === 1) {
        row = rows[0];
        if (typeof crypto == 'undefined')
          var crypto = require("crypto");
        var sha256 = crypto.createHash("sha256");
        sha256.update(data.password, "utf8");
        var hashed = sha256.digest("base64");
        if (hashed === row.password) {
          session.set('signed_in', data.email);
          session.set('signed_in_id', row.id);
          res.end('ok');
        } else {
          res.end('failed');
        }
      } else {
        res.end('failed');
      }
    });
  });
});





post('/person/signup', function(req,res) {
  if (typeof pg == 'undefined')
    var pg = require('pg');
  var client = new pg.Client('postgres://'+prefs['dbuser']+':'+prefs['dbpass']+'@'+prefs['dbhost']+':'+prefs['dbport'].toString()+'/'+prefs['dbname']);
  client.on('drain', client.end.bind(client));
  client.connect();
  var query = client.query({
    text: 'CREATE TABLE person (email varchar(255), password text, id serial)',
    values: []
  });
  query.on('error', function(row) {
  });
  var fullBody = '';
  var rows = [];
  req.on('data', function(chunk) {
    fullBody += chunk.toString();
  });
  req.on('end', function() {
      var data = JSON.parse(fullBody);
      var query = client.query({
          text: 'SELECT password,email,id FROM person WHERE email ilike $1',
          values: [data.email]
      });
      query.on('row', function(row) {
        rows.push(row);
      });
      query.on('end', function(result) {
          if (rows.length === 0 && data.password.length > 0) {
              if (typeof crypto == 'undefined')
                var crypto = require("crypto");
              var sha256 = crypto.createHash("sha256");
              sha256.update(data.password, "utf8");
              var hashed = sha256.digest("base64");
              var ins_query = client.query({
                  text: 'INSERT INTO person (email,password) VALUES ($1,$2)',
                  values: [data.email,hashed]
              });
              ins_query.on('end', function(result) {
                var srows = [];
                var squery = client.query({
                  text: "select currval('person_id_seq')",
                  values: []
                });
                squery.on('row', function(row) {
                  srows.push(row);
                });
                squery.on('end', function(){
                  session.set('signed_in_id', srows[0]['currval']);
                  session.set('signed_in', data.email);
                  res.end('ok');
                })
              });
          } else {
            res.end('ok');
          }
      });
  });
});


function get_class(obj){
 function get_class(obj){
  return "".concat(obj).replace(/^.*function\s+([^\s]*|[^\(]*)\([^\x00]+$/, "$1") || "anonymous";
 };
 var result = "";
 if(obj === null)
  result = "null";
 else if(obj === undefined)
  result = "undefined";
 else {
  result = get_class(obj.constructor);
  if(result === "Object" && obj.constructor.prototype) {
   for(result in this) {
    if(typeof(this[result]) === "function" && obj instanceof this[result]) {
     result = get_class(this[result]);
     break;
    }
   }
  }
 };
 return result;
};
function is_a(obj, className){
  className = className.replace(/[^\w\$_]+/, "");
  return  get_class(obj) === className && {function:1}[eval("typeof(".concat(className,")"))] && obj instanceof eval(className)
};


function isInt(value){
    var er = /^[0-9]+$/;
    return ( er.test(value) ) ? true : false;
}

function in_array( needle, haystack ) {
  for ( var key in haystack ) {
    if ( needle === haystack[key] ) {
      return true;
    }
  }
  return false;
}




/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
  var  token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var  _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d:    d,
        dd:   pad(d),
        ddd:  dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m:    m + 1,
        mm:   pad(m + 1),
        mmm:  dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy:   String(y).slice(2),
        yyyy: y,
        h:    H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H:    H,
        HH:   pad(H),
        M:    M,
        MM:   pad(M),
        s:    s,
        ss:   pad(s),
        l:    pad(L, 3),
        L:    pad(L > 99 ? Math.round(L / 10) : L),
        t:    H < 12 ? "a"  : "p",
        tt:   H < 12 ? "am" : "pm",
        T:    H < 12 ? "A"  : "P",
        TT:   H < 12 ? "AM" : "PM",
        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some common format strings
dateFormat.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};
