
// Copyright 2017 Sleepless Software Inc.  All Rights Reserved 
"use strict";


const fs = require("fs");
const http = require("http");
const https = require("https");
const EventEmitter = require('events');

const parseUrl = require("parseurl");
const send = require("send");

const sleepless = require("sleepless");


function createServer(opts) {

	var httpd = http.createServer();

	var ee = new EventEmitter();
	var server = {
		routes: [],
		listen: function(port, cb) { httpd.listen(port, cb); },
		on: function(e, cb) { ee.on(e, cb); },
		emit: function(e) {
			ee.emit.apply(this, arguments);
		},
	};

	var r404 = function(rsp, err) {
		rsp.StatusCode = 404;
		rsp.end("404: NOT FOUND\n");
		ee.emit("error", err);
	}

	httpd.on("request", function(req, rsp) {
		ee.emit("request", req);

		var path = parseUrl(req).pathname;

		for(var i = 0; i < server.routes.length; i++) {
			var r = server.routes[i];
			var m = path.match(r.match);
			if(m) {
				// send wasn't able to deliver a static file for some reason

				// try to deal with dynamic content.
				var mod_path = opts.DOC_ROOT + "/" + r.module;
				ee.emit("route", r, m, mod_path);
				fs.stat(mod_path, (err, st) => {
					try {
						var mod = require(mod_path);
						mod(req, rsp, m, server, ee);
					}
					catch(e) {
						r404(rsp, e.toString());
					}
				});
				return;
			}
		}

		send(req, path, { root: opts.DOC_ROOT }).on("error", function(err) {
			r404(rsp, err.toString());
		}).pipe(rsp);

	});

	return server;
};

//	-	-	-	-	-	-	-	-	-	-	-	-

var ws = createServer({ DOC_ROOT: "./site" });

ws.on("error", log);
ws.on("request", function(req) { log(req.method + " " + req.url); });
ws.on("route", function(route, matches, path) { log("ROUTING: "+o2j(route)+" path= "+path+" matches="+o2j(matches)); });

ws.routes.push({ match: /^\/user\/([a-z]+)$/, module:"user" });
ws.routes.push({ match: /^\/foo/, module:"foo" });

ws.listen(12345, () => {
	log("listening");
});


