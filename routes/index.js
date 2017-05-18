var express = require('express');
var router = express.Router();
var scraper = require('../lib/scraper');
var whois = require('node-whois');
var assert = require('assert');
var _ = require('underscore');

var dns = require('native-dns');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/tlds', function(req, res, next) {
    res.send(scraper.getTld());
})

router.get('/whois/:domain', function(req, res, next) {
    whois.lookup(req.params.domain, function(err, data) {
        assert.ifError(err);
        res.send('<pre>' + data + '</pre>');
    });
});

router.get('/:domain', function(req, res, next) {
    var domain = req.params.domain;
    var tlds = scraper.getTld();
    var report = {};
    var a = Object.keys(tlds);
    var ind = 0;
    var fail = 0;
    
    _.each(a, function(tld) {

        var t = domain + tld;

        var question = dns.Question({
            name: t,
            type: 'NS',
        });

        function send() {
            console.log(ind, '/', a.length, '-', fail);
            if (++ind == a.length) {
                res.send(report);
            }
        }

        var dnsReq = dns.Request({
            question: question,
            server: {
                address: '8.8.8.8',
                port: 53,
                type: 'udp'
            },
            timeout: 3000,
        });

        dnsReq.on('timeout', function() {
            fail++;
            send();
        });

        dnsReq.on('message', function(err, answer) {
            report[t] = answer.answer.length != 0;
            send();
        });

        dnsReq.on('end', function() {});

        dnsReq.send();

        /*
        lookup(t, function(err, address, family) {
            report[t] = !err;
            console.log(ind, '/', a.length, t, !err);

            if (++ind == a.length) {
                res.send(report);
            }
        });
        */
    });
});

// start the scraper
scraper.scrape();

module.exports = router;