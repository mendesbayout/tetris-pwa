

sleepless = require("sleepless");
webserver = require("./webserver.js");


// webserver is an express app
// webserver.use("/foo", require("express").static('foo'));


// incoming messages (REST or WS)
ws_api = function(o, cb) {
	log("test: "+o2j(o));
	var fun = global["api_"+o.msg];
	fun(o, cb);
}

api_hello = function(o, cb) {
	cb({ msg: "welcome" });
}


