var express = require("express");
var serveStatic = require("serve-static");
var respMod = require("../index.js");
var app = express();
var request = require("supertest");
var assert = require("assert");

var matcher = "<b>thisString</b>";

app.use(respMod({
    rules: [
        {
            match: /set_length/g,
            fn: function () {
                return matcher;
            }
        }
    ],
    port: 35729
}));
// load static content before routing takes place
app.use(serveStatic(__dirname + "/fixtures"));

app.get("/set_length", function (req, res) {
    var html = "<html><head></head><body><p>set_length</p></body></html>";
    res.writeHead(200, {
        "content-length": html.length,
        "Content-Type": "text/html"
    });
    res.end(html);
});

app.get("/set_length2", function (req, res) {
    var html = "<html><head></head><body><p>set_length2</p></body></html>";
    res.write("<!DOCTYPE html>");
    res.writeHead(200, {
        "Content-Length": html.length,
        "Content-Type": "text/html"
    });
    res.end(html);
});

function hasText(html) {
    return (~html.indexOf(matcher));
}

describe("GET /set_length", function () {
    it("should", function (done) {
        request(app)
            .get("/set_length")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert(hasText(res.text));
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});
