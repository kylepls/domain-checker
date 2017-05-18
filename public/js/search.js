/* global $ */

var tlds;
var body = $('tbody');
function appendToTable(domain, taken) {
    var tld = tlds[domain.substr(domain.indexOf('.'))];
    var registar = tld.registarName;
    var price = tld.price;
    var whois = tld.whoisPrivacy ? 'yes' : 'no';
    var t = taken ? 'taken' : 'open';
    body.append(`<tr class='${t}'><td>${domain}</td><td>${price}</td><td>${whois}</td><td>${registar}</td><td><a href='#' onclick="showWhois('${domain}', false)">Whois</a></td></tr>`);
}

$(function() {
    $('table').tablesorter({
        headers: {
            4: {
                sorter: false
            }
        }
    });
    
    $.get('/tlds', function(data) {
       tlds = data; 
       console.log('got', tlds)
    });
    
    $('form').submit(function(e) {
        e.preventDefault();
        var results = $('#results');
        var domain = $('#domain').val();
        body.html(' ');
        
        if (domain.indexOf('.') != -1) {
            showWhois(domain, true);
            results.show();
            return;
        }
        results.hide();

        $('#loader').show();
        $.get(domain, function(data) {
            console.log('results', data);
            $('#loader').hide();

            var keys = Object.keys(data);
            keys.sort();

            for (var i = 0; i < keys.length; i++) {
                var domain = keys[i];
                appendToTable(domain, data[domain]);
                results.show();
            }
            $('table').trigger('update');
        });
    });
})
function showWhois(domain, append) {
    var modal = $('#whois');
    modal.find($('.for')).text(domain);
    var loader = modal.find($('#whoisLoader'));
    var content = modal.find($('.content'));
    content.html(' ');
    loader.show();
    modal.openModal();
    
    $.get(`/whois/${domain}`, function(data) {
        content.html(data);
        loader.hide();
        if (append) {
            appendToTable(domain, !(data.indexOf('no entries found') > -1));
        }
    });
}