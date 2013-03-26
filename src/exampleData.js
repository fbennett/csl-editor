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
		"type": "song",
		"title": "The Trusty Lariat",
        "abstract": "A song",
		"publisher": "Victor",
		"publisher-place": "Culver City, California",
		"event-place": "Culver City, California",
		"archive-place": "Culver City, California",
		"URL": "http://www.youtube.com/watch?v=unmWIfSHN5c",
		"number": "V-40234",
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
	}
]
	return CSLEDIT_exampleData;
});
