# domain-checker
Useful tool for finding OG domains. Google likely doesn't approve.

Scraper:
  Scrapes tld-list.com every day for an updated list of TLDs

Search:
  Searches for avaiable domains by hammering Googles DNS servers with a myriad of requests. 
  This is more efficent (and cheaper) then hammering whois servers.
  This works about 90% of the time to weed out taken domains. 
  The last step is to acutally do a whois lookup and make sure it's 100% not taken.
  
  Should move this to http://data.iana.org/TLD/tlds-alpha-by-domain.txt at some point.

  Domain prices and suggested sites are also listed in the search results.
  
  You can either enter a name to search (ex: 'kyle') to search for avaiable domains.
  
  Or you can enter a domain to look up the whois record.
 
![preview](http://i.imgur.com/PZlOiqK.png)

![preview 2](http://i.imgur.com/0f2eqrB.png)
