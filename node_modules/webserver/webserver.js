#!/usr/bin/env node


// Copyright 2020
// Sleepless Software Inc.
// All Rights Reserved
// sleepless.com

const argv = process.argv;
if( argv.length < 3 ) {
	console.log( "Usage: node webserver.js PORT [ DOC_ROOT ]" );
	process.exit( 1 );
}

let PORT = argv[ 2 ] || 80;
let PATH = argv[ 3 ] || "./";

if( PATH[ PATH.length - 1 ] != "/" ) 
	PATH += "/";

var http = require('http')
var parseUrl = require('parseurl')
var send = require('send')
 
var server = http.createServer(function onRequest (req, res) {
	console.log( req.method + " " + req.url );
	send(req, parseUrl(req).pathname, { root: PATH }) .pipe(res);
});
 
server.listen( PORT, function() { 
	console.log( "Copyright " + (new Date() . getFullYear()) + " Sleepless Software Inc.  All Rights Reserved - sleepless.com" );
	console.log( "Listening on port " + PORT + ", serving from directory \"" + PATH + "\"");
});

