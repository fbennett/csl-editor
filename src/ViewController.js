"use strict";

CSLEDIT = CSLEDIT || {};

CSLEDIT.ViewController = function (treeView) {
	var	// smartTrees display a subset of the proper CSL tree
		// and allow transformations of the data
		//
		// name : visible name
		// nodeData : displayed in property panel
		// children : displayed in tree view as children
		smartTreeSchema = [
			{
				id : "citations",
				name : "Inline Citations",
				nodePaths : ["style/citation/layout"],
				buttons : [
				{
					type : "cslNode",
					icon : "../external/famfamfam-icons/cog.png",
					node : "style/citation"
				},
				{
					type : "cslNode",
					icon : "../external/fugue-icons/sort-alphabet.png",
					node : "style/citation/sort"
				}
				]
			},
			{
				id : "bibliography",
				name : "Bibliography",
				nodePaths : ["style/bibliography/layout"],
				buttons : [
				{
					type : "cslNode",
					icon : "../external/famfamfam-icons/cog.png",
					node : "style/bibliography"
				},
				{
					type : "cslNode",
					icon : "../external/fugue-icons/sort-alphabet.png",
					node : "style/bibliography/sort"
				}
				]
			},
			{
				id : "macro",
				name : "Macros",
				nodePaths : ["style/macro"],
				buttons : [
				{
					type : "custom",
					text : "Add macro",
					onClick : function () {
						// add after the last macro
						var macroNodes = CSLEDIT.data.getNodesFromPath("style/macro"),
							position;

						position = CSLEDIT.data.indexOfChild(macroNodes[macroNodes.length - 1],
							CSLEDIT.data.getNodesFromPath("style")[0]);
						
						CSLEDIT.controller.exec("addNode",
							[
								0, position + 1, 
								new CSLEDIT.CslNode("macro", [{
									key: "name",
									value: "New Macro",
									enabled: true
								}])
							]);
					}
				}
				]
			},
			{
				id : "info",
				name : "Style Info",
				nodePaths : ["style/info/*"]
			}
		],
		smartTrees = [],
		treesLoaded = 0,
		treesToLoad = 0,
		callbacks,
		selectedTree = null,
		formatCitationsCallback,
		selectedNodeId = 0,
		nodeButtons;

	var treeLoaded = function () {
		treesLoaded++;

		if (treesLoaded === treesToLoad) {
			callbacks.loaded();
		};
	};

	var createTree = function (cslData, _callbacks) {
		var eventName,
			jsTreeData,
			citationNodeId,
			citationNodeData,
			citationTree,
			cslId,
			nodes,
			table,
			row;

		callbacks = _callbacks;

		nodeButtons = [];
		
		treeView.html('');
		$.each(smartTreeSchema, function (index, value) {
			table = $('');//<table><\/table>');
			row = $('');//<tr><\/tr>');
			if (typeof value.buttons !== "undefined") {
				//$('<td>&nbsp;&nbsp;&nbsp;<\/td>').appendTo(row);

				$.each(value.buttons, function (i, button) {
					var buttonElement;
					switch (button.type) {
						case "cslNode":
							nodes = CSLEDIT.data.getNodesFromPath(button.node, cslData);
							if (nodes.length > 0) {
								cslId = nodes[0].cslId;
							} else {
								cslId = -1;
							}
				
							buttonElement = $('<div class="cslNodeButton"><\/div>');
							nodeButtons.push(new CSLEDIT.EditNodeButton(buttonElement, button.node, cslId,
								button.icon, function (cslId) {
									selectedTree = null;
									selectedNodeId = cslId;

									// deselect nodes in trees
									$.each(smartTrees, function (i, thisTree) {
										thisTree.deselectAll();
									});

									callbacks.selectNode();
								}));
							break;
						case "custom":
							buttonElement = $('<button class="customButton">' + 
									button.text + '<\/button>');
							buttonElement.on('click', button.onClick);
							break;
						default:
							assert(false);
					}
					buttonElement.appendTo(treeView);
				});
			}
			$('<h3>%1<\/h3>'.replace('%1', value.name)).appendTo(treeView);
			//row.appendTo(table);
			//table.appendTo(treeView);
			row = $('<div id="%1"><\/div>'.replace('%1', value.id));
			row.appendTo(treeView);
		});

		console.log("creating citation tree");

		$.each(smartTreeSchema, function (index, value) {
			var tree;
			treesToLoad++;
			tree = CSLEDIT.SmartTree(treeView.children("#" + value.id), value.nodePaths);
			tree.setCallbacks({
				loaded : treeLoaded,
				selectNode : selectNodeInTree(tree),
				moveNode : callbacks.moveNode,
				deleteNode : callbacks.deleteNode,
				checkMove : callbacks.checkMove
			});
			tree.createTree();
			smartTrees.push(tree);
		});
	};

	var selectNodeInTree = function (tree) {
		return function (event, ui) {
			// deselect nodes in other trees
			$.each(smartTrees, function (i, thisTree) {
				if (thisTree !== tree) {
					thisTree.deselectAll();
				}
			});

			selectedTree = tree;
			selectedNodeId = tree.selectedNode();
	
			return callbacks.selectNode(/*event, ui*/);
		};
	};

	var addNode = function (id, position, newNode, nodesAdded) {
		$.each(smartTrees, function (i, smartTree) {
			smartTree.addNode(id, position, newNode, nodesAdded);
		});
		$.each(nodeButtons, function (i, button) {
			button.addNode(id, position, newNode, nodesAdded);
		});
	};

	var deleteNode = function (id, nodesDeleted) {
		$.each(smartTrees, function (i, smartTree) {
			smartTree.deleteNode(id, nodesDeleted);
		});
		$.each(nodeButtons, function (i, button) {
			button.deleteNode(id, nodesDeleted);
		});
	};

	var ammendNode = function (id, ammendedNode) {
		$.each(smartTrees, function (i, smartTree) {
			smartTree.ammendNode(id, ammendedNode);
		});
	};

	var selectNode = function (id) {
		var treeNode = treeView.find('li[cslid=' + id + '] > a');

		if (treeNode.length > 0) {
			treeNode.first().click();
		} else {
			selectedNodeId = id;
			callbacks.selectNode();
		}
	};

	var selectedNode = function () {
		return selectedNodeId;
	};

	var expandNode = function (id) {
		$.each(smartTrees, function (i, tree) {
			tree.expandNode(id);
		});
	};
	
	var exec = function (command, args) {
		args = args || [];
		console.log("executing view update: " + command + "(" + args.join(", ") + ")");
		this[command].apply(null, args);
	};

	// public:
	return {
		createTree : createTree,

		addNode : addNode,
		deleteNode : deleteNode,
		ammendNode : ammendNode,

		selectNode : selectNode,
		selectedNode : selectedNode,

		expandNode : expandNode,

		formatCitations : function () {
			formatCitationsCallback();
		},
			
		// This callback is used to avoid re-calculating the example citations
		// until all subscribers have been informed of the recent change
		exec : exec,

		setFormatCitationsCallback : function (callback) {
			formatCitationsCallback = callback;
		}
	}
};

