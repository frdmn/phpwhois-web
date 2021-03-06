# API documentation

### Get available API endpoints

#### GET /api/*

Body Parameters:

*none*

Response:

```json
{
    "data": {
        "GET /api/*": "This API overview",
        "GET /api/tlds": "List all available TLDs",
        "POST /api/lookup/domain": "Check availablity of a single domain",
        "POST /api/lookup/package": "Check availablity of for several domains (using a TLD package)",
        "POST /api/whois": "Whois a single domain"
    },
    "status": "success"
}
```

### List supported TLDs

#### GET /api/tlds

Body Parameters:

*none*

Response:

```json
{
    "status": "success",
    "data": [
        "academy",
        "accountant",
        "accountants",
        "active",
        "actor",
        "biz",
        "com",
        "de",
        "info",
        "net",
        "[...]"
    ]
}
```

### Check availablity of a single domain

#### POST /api/lookup/domain

Body Parameters:

- **domain** (required)

Response:

```json
{  
   "status":"success",
   "data":{  
      "frdmn.de":{  
         "status":"success",
         "available":true
      }
   }
}
```

### Check availablity of multiple domains

#### POST /api/lookup/package

Body Parameters:

- **domain** (required)
- **package** (required)

Response:

```json
{  
   "status":"success",
   "data":{  
      "frdmn.com":{  
         "status":"success",
         "available":true
      },
      "frdmn.net":{  
         "status":"success",
         "available":true
      },
      "frdmn.org":{  
         "status":"success",
         "available":true
      },
      "frdmn.biz":{  
         "status":"success",
         "available":false
      },
      "frdmn.info":{  
         "status":"success",
         "available":false
      }
   }
}
```

### Raw whois lookup of a single domain

#### POST /api/whois

Body Parameters:

- **domain** (required)

Response:

```json
{
    "data": [
        "%",
        "% ",
        "%                o.     .",
        "%                 *0$.o$*    Copyright (c)2016 by InterNetX",
        "%        InterNet  $$$0",
        "%          GmbH   .o$$$Io    Restricted rights.",
        "%                _$$'$$o",
        "%               __*    *$$.",
        "%              __         *",
        "%  ",
        "%",
        "% Whois-Server: whois.member.denic.de",
        "% Copyright (c) 2010 by DENIC",
        "% Version: 2.0",
        "% ",
        "% Restricted rights.",
        "% ",
        "% ",
        "% Terms and Conditions of Use",
        "% ",
        "% All the domain data that is visible in the whois search is protected",
        "% by law. It is not permitted to use it for any purpose other than",
        "% technical or administrative requirements associated with the",
        "% operation of the Internet or in order to contact the domain holder",
        "% over legal problems. You are not permitted to save it electronically",
        "% or in any other way without DENIC's express written permission. It",
        "% is prohibited, in particular, to use it for advertising or any similar",
        "% purpose.",
        "% ",
        "% By maintaining the connection you assure that you have a legitimate",
        "% interest in the data and that you will only use it for the stated",
        "% purposes. You are aware that DENIC maintains the right to initiate",
        "% legal proceedings against you in the event of any breach of this",
        "% assurance and to bar you from using its whois query.",
        "% ",
        "",
        "",
        "Domain: telekom.de",
        "Nserver: dns1.telekom.de 217.6.95.193",
        "Nserver: dns2.telekom.de 192.166.53.61",
        "Nserver: pns.dtag.de",
        "Nserver: secondary006.dtag.net",
        "Status: connect",
        "Changed: 2012-10-16T15:22:10+02:00",
        "",
        "[Tech-C]",
        "Type: PERSON",
        "Name: Tech-C T-Systems International GmbH",
        "Organisation: T-Systems International GmbH",
        "Address: Philipp-Reis-Platz 1",
        "PostalCode: D-33602",
        "City: Bielefeld",
        "CountryCode: DE",
        "Phone: +49 521 92390",
        "Fax: +49 521 92392963",
        "Email: zone-c@t-systems.com",
        "Changed: 2013-11-13T13:15:13+01:00",
        "",
        "[Zone-C]",
        "Type: PERSON",
        "Name: Tech-C T-Systems International GmbH",
        "Organisation: T-Systems International GmbH",
        "Address: Philipp-Reis-Platz 1",
        "PostalCode: D-33602",
        "City: Bielefeld",
        "CountryCode: DE",
        "Phone: +49 521 92390",
        "Fax: +49 521 92392963",
        "Email: zone-c@t-systems.com",
        "Changed: 2013-11-13T13:15:13+01:00",
        ""
    ],
    "status": "success"
}
```
