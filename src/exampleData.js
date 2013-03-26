"use strict";

// Hard-coded data for the example citations

define(function () {
	var CSLEDIT_exampleData = {};

	// Possible options to apply to each reference in each inline citation
	CSLEDIT_exampleData.additionalOptions = [
		{
			"description" : "Plain citation",
			"options" : {}
		},
		{
			"description" : "Locator: Pages 244-255",
			"options" : {
				"locator" : "244-252",
				"label" : "page"
			}
		},
		{
			"description" : "Locator: Chapter 5",
			"options" : {
				"locator" : "5",
				"label" : "chapter"
			}
		},
		{
			"description" : "Locator: Section 8",
			"options" : {
				"locator" : "sec. 8",
				"label" : "page"
			}
		},
		{
			"description" : "Suppress author",
			"options" : {
				"suppress-author" : true
			}
		}
	];

	// Hard coded default list of csl-data.json references used
	// in the editor and search pages
	CSLEDIT_exampleData.jsonDocumentList = [
	{
		"id": 2952,
		"type": "webpage",
		"key": "WETSI8AT",
		"title": "<sc>CSL-m</sc> Specification Supplement",
		"URL": "http://gsl-nagoya-u.net/http/pub/citeproc-js-csl.html",
		"author": [
			{
				"family": "Bennett",
				"given": "Frank G."
			}
		],
		"issued": {
			"date-parts": [
				[
					2011,
					9,
					29
				]
			]
		},
		"accessed": {
			"date-parts": [
				[
					2012,
					9,
					20
				]
			]
		}
	},
	{
		"id": 3567,
		"type": "song",
		"key": "T99WKGHA",
		"title": "The Trusty Lariat",
		"publisher": "Victor",
		"publisher-place": "Culver City, California",
		"event-place": "Culver City, California",
		"archive-place": "Culver City, California",
		"URL": "http://www.youtube.com/watch?v=unmWIfSHN5c",
		"note": "{:number: V-40234}",
		"author": [
			{
				"family": "McClintock",
				"given": "Harry"
			}
		],
		"issued": {
			"date-parts": [
				[
					1930
				]
			]
		}
	},
   {
      "id": 2486,
      "type": "book",
      "key": "4M2VZD7M",
      "title": "The TeXbook",
      "collection-number": "vol. A",
      "collection-title": "Computers & Typesetting",
      "publisher": "Addison-Wesley Professional",
      "number-of-pages": "496",
      "edition": "1",
      "ISBN": "0201134470",
      "author": [
         {
            "family": "Knuth",
            "given": "Donald E."
         }
      ],
      "issued": {
         "date-parts": [
            [
               1986,
               1,
               11
            ]
         ]
      }
   },
   {
      "id": 2439,
      "type": "article-journal",
      "key": "REJAQASD",
      "title": "Self-regulation and depletion of limited resources: Does self-control resemble a muscle?",
      "container-title": "Psychological Bulletin",
      "page": "247-259",
      "volume": "126",
      "issue": "2",
      "DOI": "10.1037/0033-2909.126.2.247",
      "shortTitle": "Self-regulation and depletion of limited resources",
      "author": [
         {
            "family": "Muraven",
            "given": "Mark"
         },
         {
            "family": "Baumeister",
            "given": "Roy F."
         }
      ],
      "issued": {
         "date-parts": [
            [
               "2000",
               3
            ]
         ]
      }
   },
   {
      "id": 2219,
      "type": "book",
      "key": "EJ9R5RIP",
      "title": "Scribe: Introductory User's Manual",
      "publisher": "Computer Science Department, Carnegie-Mellon University",
      "note": "Cites and bib described at pp. 45-49",
      "author": [
         {
            "family": "Reid",
            "given": "Brian K."
         }
      ],
      "issued": {
         "date-parts": [
            [
               1978,
               7
            ]
         ]
      }
   },
   {
      "id": 15643,
      "type": "book",
      "key": "DTQAK5CN",
      "title": "Fahrenheit 451",
      "publisher": "Denoël",
      "publisher-place": "Paris",
      "event-place": "Paris",
      "author": [
         {
            "family": "Bradbury",
            "given": "Ray"
         }
      ],
      "translator": [
         {
            "family": "Chambon",
            "given": "Jacques"
         },
         {
            "family": "Robillot",
            "given": "Henri"
         }
      ],
      "issued": {
         "date-parts": [
            [
               1955
            ]
         ]
      }
   },
   {
      "id": 10512,
      "type": "legal_case",
      "key": "PJRRRB9R",
      "title": "Feist Publications, Inc. v. Rural Telephone Service Co.",
      "container-title": "US",
      "authority": "Supreme Court",
      "page": "340",
      "volume": "499",
      "issued": {
         "date-parts": [
            [
               1991
            ]
         ]
      }
   },
   {
      "id": 15805,
      "type": "article-journal",
      "key": "QVAKRCDA",
      "title": "Goodbye to the Bluebook",
      "container-title": "U. Chi. L. Rev.",
      "page": "1343-1368",
      "volume": "53",
      "issue": "4",
      "URL": "http://www.jstor.org/stable/1599750",
      "DOI": "10.2307/1599750",
      "note": "ArticleType: research-article / Full publication date: Autumn, 1986 / Copyright © 1986 The University of Chicago Law Review",
      "author": [
         {
            "family": "Posner",
            "given": "Richard A."
         }
      ],
      "issued": {
         "date-parts": [
            [
               "1986",
               10,
               1
            ]
         ]
      },
      "accessed": {
         "date-parts": [
            [
               2012,
               1,
               2
            ]
         ]
      }
   },
   {
      "id": 15796,
      "type": "legal_case",
      "key": "TW6RBU6I",
      "title": "Harvard Crimson, Inc. v. President and Fellows of Harvard Coll.",
      "container-title": "N.E.2d",
      "page": "518",
      "volume": "840",
      "issued": {
         "date-parts": [
            [
               2006
            ]
         ]
      }
   },
   {
      "id": 1044,
      "type": "report",
      "key": "CMCUN3M9",
      "title": "Information Management: A Proposal",
      "publisher": "CERN",
      "URL": "http://www.w3.org/History/1989/proposal.html",
      "author": [
         {
            "family": "Berners-Lee",
            "given": "Tim"
         }
      ],
      "issued": {
         "date-parts": [
            [
               "1989",
               3
            ]
         ]
      }
   },
   {
      "id": 15645,
      "type": "bill",
      "key": "S8E3PK7D",
      "title": "Rules of Appellate Procedure",
      "container-title": "Wisconsin Statutes",
      "section": "809.19(1)(e)",
      "URL": "https://docs.legis.wisconsin.gov/statutes/statutes/809/II/19",
      "note": "{:jurisdiction:us;wi}",
      "issued": {
         "date-parts": [
            [
               2011
            ]
         ]
      }
   },
   {
      "id": 15638,
      "type": "legal_case",
      "key": "QSVDQQDA",
      "title": "West Publ'g Co. v. Mead Data Ctr., Inc.",
      "container-title": "F.2d",
       "authority":"8th Circuit Court of Appeals",
      "page": "1219",
      "volume": "799",
      "jurisdiction":"us",
      "issued": {
         "date-parts": [
            [
               1986
            ]
         ]
      }
   }
]
	return CSLEDIT_exampleData;
});
