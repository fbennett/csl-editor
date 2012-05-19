"use strict";

CSLEDIT = CSLEDIT || {};

CSLEDIT.ViewController = function (treeView, titlebarElement) {
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
				macroLinks : true,
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
				macroLinks : true,
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
			},/*
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
			},*/
			{
				id : "locale",
				name : "Advanced",
				macroLinks : false,
				nodePaths : ["style"]
			}
		],
		views = [],
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

	var init = function (cslData, _callbacks) {
		var eventName,
			jsTreeData,
			citationNodeId,
			citationNodeData,
			citationTree,
			cslId,
			nodes,
			table,
			row;

		views = [];

		views.push(new CSLEDIT.Titlebar(titlebarElement));

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
							views.push(new CSLEDIT.EditNodeButton(buttonElement, button.node, cslId,
								button.icon, function (cslId, selectedView) {
									selectedTree = selectedView;
									selectedNodeId = cslId;

									// deselect nodes in trees
									$.each(views, function (i, view) {
										if ("deselectAll" in view) {
											view.deselectAll();
										}
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

		$.each(smartTreeSchema, function (index, value) {
			var tree;
			treesToLoad++;
			tree = CSLEDIT.SmartTree(treeView.children("#" + value.id), value.nodePaths, 
				value.macroLinks);

			// Use this for debugging if you're not sure the view accurately reflects the data
			//tree.setVerifyAllChanges(true);
			tree.setCallbacks({
				loaded : treeLoaded,
				selectNode : selectNodeInTree(tree),
				moveNode : callbacks.moveNode,
				deleteNode : callbacks.deleteNode,
				checkMove : callbacks.checkMove
			});
			tree.createTree();
			views.push(tree);
		});
	};

	var selectNodeInTree = function (tree) {
		return function (event, ui) {
			// deselect nodes in other trees
			$.each(views, function (i, view) {
				if (view !== tree) {
					if ("deselectAll" in view) {
						view.deselectAll();
					}
				}
			});

			selectedTree = tree;
			selectedNodeId = tree.selectedNode();
	
			return callbacks.selectNode(/*event, ui*/);
		};
	};

	var getSelectedNodePath = function () {
		if (selectedTree === null) {
			return "no selected tree";
		}

		return selectedTree.getSelectedNodePath();
	};

	var addNode = function (id, position, newNode, nodesAdded) {
		$.each(views, function (i, view) {
			if ("addNode" in view) {
				view.addNode(id, position, newNode, nodesAdded);
			}
		});
	};

	var deleteNode = function (id, nodesDeleted) {
		$.each(views, function (i, view) {
			if ("deleteNode" in view) {
				view.deleteNode(id, nodesDeleted);
			}
		});
	};

	var amendNode = function (id, amendedNode) {
		$.each(views, function (i, view) {
			if ("amendNode" in view) {
				view.amendNode(id, amendedNode);
			}
		});
	};

	var selectNode = function (id, highlightedNodes) {
		var treeNode;
	   
		if (typeof highlightedNodes === "undefined") {
			treeNode = treeView.find('li[cslid=' + id + '] > a');
		} else {
			treeNode = highlightedNodes.filter('li[cslid=' + id + ']').children('a');
		}

		if (treeNode.length > 0) {
			clickNode(treeNode.first());
		} else {
			selectedNodeId = id;
			callbacks.selectNode();
		}
	};

	var selectNodeFromPath = function (nodePath) {
		var treeNode = treeView,
			cslId;

		$.each(nodePath, function (i, cslId) {
			treeNode = treeNode.find('li[cslId="' + cslId + '"]');
		});

		treeNode = treeNode.children('a');

		if (treeNode.length > 0) {
			clickNode(treeNode.first());
		} else {
			selectedNodeId = id;
			callbacks.selectNode();
		}		
	};

	var clickNode = function (node) {
		node.click();
		treeView.scrollTo(node, 200, {
			offset:{left: -treeView.width() + 80, top: -treeView.height() * 0.4}
		});
	};

	var selectedNode = function () {
		return selectedNodeId;
	};

	var expandNode = function (id) {
		$.each(views, function (i, tree) {
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
		init : init,

		addNode : addNode,
		deleteNode : deleteNode,
		amendNode : amendNode,

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
		},

		getSelectedNodePath : getSelectedNodePath,

		selectNodeFromPath : selectNodeFromPath
	}
};
