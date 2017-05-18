var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var assert = require('assert');

var schedule = require('node-schedule');

var tld = {};

const URL = 'https://tld-list.com/?q=&pr=1&ln=&lx=&wp=0&ab=0&nr=0&rpp=20&a=';

exports.scrape = function() {

    console.log('Loading existing tlds...');
    fs.readFile(__dirname + '/../tlds.json', function(err, content) {
        assert.ifError(err);
        tld = JSON.parse(content.toString());
        console.log('Done');
    });

    schedule.scheduleJob('0 0 12 1/1 * ? *', function() {
        console.log('Updating TLD list...');
        scrape(URL + '1');
    })
}

exports.getTld = function() { return tld; };

function scrape(url) {
    console.log('Scraping ' + url);
    request(url, function(err, res, html) {
        assert.ifError(err);
        var $ = cheerio.load(html);

        var page = parseInt($('#main > div > div > div > div:nth-child(1) > div > ul > li > .current').text());
        var pages = parseInt($('#main > div > div > div > div:nth-child(1) > div > ul > li:nth-child(8)').text());

        var meh = $('.meh');
        meh.each(function(i, element) {
            var row = $(this);
            var name = row.find($('.label')).text();
            var registar = row.find($('td:nth-child(2) > div:nth-child(1) > div > div.pull-left > a'));
            var registarName = registar.text();
            var registarUrl = registar.attr('href');
            var whoisPrivacy = parseYN(row.find($('td:nth-child(5) > i')).attr('title'));
            var priceCurrency = row.find($('td:nth-child(2) > div:nth-child(1) > div > div.pull-right > span > span:nth-child(1)')).text();
            var price = row.find($('td:nth-child(2) > div:nth-child(1) > div > div.pull-right > span > span:nth-child(2)')).text();
            tld[name] = {
                registarName: registarName,
                registarUrl: registarUrl,
                whoisPrivacy: whoisPrivacy,
                price: priceCurrency + price
            };
            console.log(page + '/' + pages + ' - Got: ' + name + " - " + whoisPrivacy, '-', priceCurrency + price);
            if (i == meh.length - 1) {
                if (page == pages) {
                    fs.writeFile('tlds.json', JSON.stringify(tld, null, 2), function(err) {
                        assert.ifError(err);
                    });
                    console.log('Loading complete');
                }
            }
        });

        if (page < pages) {
            var np = page + 1;
            scrape(URL + np);
        }
    })
}

function parseYN(string) {
    return string.toLowerCase() === 'yes';
}