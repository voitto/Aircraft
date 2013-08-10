#! /usr/bin/env node
/*
* aircraft
* https://github.com/voitto/aircraft
*
* Copyright (c) 2013 Brian Hendrickson
* Licensed under the MIT license.
*/

// Aircraft
// July 13, 2013
// Brian Hendrickson <bh@bh.ly>

// Todo:
// - make aircraft work as a global npm module
// - add a layer that allows other types of databases
// - remove: if app? app.Post = Post - from models & views
// - try engine.io rather than socket.io
// - fix controller syntax in view: new module.exports.[NAME]

var fs = require('fs');

var cmd = process.argv.slice(2);

if ( cmd[0] == 'g' || cmd[0] == 'gen' || cmd[0] == 'generate' ) {
	if ( cmd[1] == 'model' ) {
		var tpl = fs.readFileSync( __dirname + '/../gen/model.coffee', 'utf-8' );
		var name = cmd[2].toLowerCase().charAt(0).toUpperCase() + cmd[2].toLowerCase().slice(1);
		var mdl = tpl.replace( /Person/g , name );
		mdl = mdl.replace( /person/g , name.toLowerCase() );
		fs.writeFile("app/models/"+name.toLowerCase()+".coffee", mdl);
	  console.log( 'generated model ' + name );
	}
	if ( cmd[1] == 'controller' ) {
		var tpl = fs.readFileSync( __dirname + '/../gen/controller.coffee', 'utf-8' );
		var name = cmd[2].toLowerCase().charAt(0).toUpperCase() + cmd[2].toLowerCase().slice(1);
		var cnt = tpl.replace( /Person/g , name );
		cnt = cnt.replace( /person/g , name.toLowerCase() );
		fs.writeFile("app/controllers/"+name.toLowerCase()+"s.coffee", cnt);
	  console.log( 'generated controller ' + name +'s' );
	}
	if ( cmd[1] == 'view' ) {
		var tpl = fs.readFileSync( __dirname + '/../gen/view.coffee', 'utf-8' );
		var name = cmd[3].toLowerCase().charAt(0).toUpperCase() + cmd[3].toLowerCase().slice(1);
		var modname = cmd[2].toLowerCase().charAt(0).toUpperCase() + cmd[2].toLowerCase().slice(1);
		var view = tpl.replace( /Post/g , modname );
		view = view.replace( /post/g , modname.toLowerCase() );
		view = view.replace( /Show/g , name );
		view = view.replace( /show/g , name.toLowerCase() );
		fs.writeFile("app/views/"+name.toLowerCase()+".coffee", view);
    if ( !fs.existsSync( "public/templates/"+modname.toLowerCase() ))
			fs.mkdir( "public/templates/"+modname.toLowerCase(), 0755);
		var tpl = fs.readFileSync( __dirname + '/../gen/show.html', 'utf-8' );
		var view2 = tpl.replace( /Post/g , modname );
		view2 = view2.replace( /post/g , modname.toLowerCase() );
		view2 = view2.replace( /Show/g , name );
		view2 = view2.replace( /show/g , name.toLowerCase() );
		fs.writeFile( "public/templates/"+modname.toLowerCase()+"/"+name.toLowerCase()+".html", view2);
		var tpl = fs.readFileSync( __dirname + '/../gen/_show.html', 'utf-8' );
		var view3 = tpl.replace( /Post/g , modname );
		view3 = view3.replace( /post/g , modname.toLowerCase() );
		view3 = view3.replace( /Show/g , name );
		view3 = view3.replace( /show/g , name.toLowerCase() );
		fs.writeFile( "public/templates/"+modname.toLowerCase()+"/_"+name.toLowerCase()+".html", view3);
	  console.log( 'generated views ' + name + ' for the '+ modname + ' model' );
	}
	if ( cmd[1] == 'routes' ) {
		var tpl = fs.readFileSync( __dirname + '/../gen/routes.coffee', 'utf-8' );
		var name = cmd[3].toLowerCase().charAt(0).toUpperCase() + cmd[3].toLowerCase().slice(1);
		var modname = cmd[2].toLowerCase().charAt(0).toUpperCase() + cmd[2].toLowerCase().slice(1);
		var rte = tpl.replace( /Person/g , modname );
		rte = rte.replace( /person/g , modname.toLowerCase() );
		rte = rte.replace( /Show/g , name );
		rte = rte.replace( /show/g , name.toLowerCase() );
    if ( fs.existsSync( 'app.coffee' ))
			fs.appendFile( 'app.coffee', rte );
	  console.log( 'generated routes for view ' + name + ' and model ' + modname );
	}
}

if ( cmd[0] == 'new' ) {
  try {
    if ( !fs.existsSync( cmd[1] )) {
      fs.mkdir( cmd[1], 0755, function(){
        var folders = [
          'app',
          'public',
        ];
        var callbacks = [
          function(){
            var folders2 = [
              'app/models',
              'app/views',
              'app/controllers',
            ];
            for (var pz in folders2)
              fs.mkdir( cmd[1]+'/'+folders2[pz], 0755);
            var files = [
              'app.coffee',
              'package.json'
            ];
            for (var f in files)
              fs.createReadStream(__dirname + '/../gen/'+files[f]).pipe(fs.createWriteStream(cmd[1]+'/'+files[f]));
          },
          function(){
            fs.mkdir( cmd[1]+'/public/templates', 0755);
            var files = [
              'io.js',
              'jquery.js',
              'mustache.js',
              'style.css'
            ];
            for (var f in files)
              fs.createReadStream(__dirname + '/../public/'+files[f]).pipe(fs.createWriteStream(cmd[1]+'/public/'+files[f]));
          }
        ];
        for (var p in folders) {
          fs.mkdir( cmd[1]+'/'+folders[p], 0755, callbacks[p]);
          //
        }
      });
    } else {
      console.log( 'sorry that folder seems to exist already!' );
    }
  } catch (e) {
    console.log( 'error ' + JSON.stringify( e ));
  }
}