"use strict";

define(
		[	'src/Titlebar',
			'src/SmartTree',
			'src/SmartTreeHeading',
			'src/propertyPanel',
			'src/NodePathView',
			'src/notificationBar',
			'src/CslNode',
			'src/Iterator',
			'src/cslData',
			'src/debug',
			'jquery.scrollTo'
		],
		function (
			CSLEDIT_Titlebar,
			CSLEDIT_SmartTree,
			CSLEDIT_SmartTreeHeading,
			CSLEDIT_propertyPanel,
			CSLEDIT_NodePathView,
			CSLEDIT_notificationBar,
			CSLEDIT_CslNode,
			CSLEDIT_Iterator,
			CSLEDIT_data,
			debug,
			jquery_scrollTo
		) {
	return function CSLEDIT_ViewController ( 
		treeView, titlebarElement, propertyPanelElement, nodePathElement,
		syntaxHighlighter) {
	
		// smartTrees display a subset of the proper CSL tree
		// and allow transformations of the data
		//
		// name : visible name
		// nodeData : displayed in property panel
		// children : displayed in tree view as children
		var smartTreeSchema = [
				{
					id : "info",
					name : "Style Info",
					headingNodePath : "",
					nodePaths : ["style/info", "style"/*, "style/locale"*/],
					macroLinks : false,
					leafNodes : ["info", "style"]
				},
				{
					id : "citations",
					name : "Inline Citations",
					headingNodePath : "style/citation",
					headingNodePossibleChildren : {
						"layout" : "one",
						"sort" : "one"
					},
					nodePaths : ["style/citation/layout", "style/citation/sort"],
					//leafNodes : ["sort"],
					macroLinks : true
				},
				{
					id : "bibliography",
					name : "Bibliography",
					headingNodePath : "style/bibliography",
					headingNodePossibleChildren : {
						"layout" : "one",
						"sort" : "one"
					},
					nodePaths : ["style/bibliography/layout", "style/bibliography/sort"],
					//leafNodes : ["sort"],
					macroLinks : true
				},
				{
					id : "macro",
					name : "Macros",
					headingNodePath : "style",
					headingNodePossibleChildren : {
						"macro" : "zeroOrMore"
					},
					headingNodeShowPropertyPanel : false,
					nodePaths : ["style/macro"],
					macroLinks : true,
				},
				{
					id : "locale",
					name : "Advanced",
					headingNodePath : "",
					macroLinks : false,
					nodePaths : ["style"]
				}
			],
			views = [],
			treesLoaded,
			treesToLoad,
			callbacks,
			selectedTree = null,
			selectedNodeId = -1,
			recentlyEditedMacro = -1,
			nodePathView,
			suppressSelectNode = false;

		var treeLoaded = function () {
			treesLoaded++;

			if (treesLoaded === treesToLoad) {
				if (selectedNode() === -1) {
					selectNode(CSLEDIT_data.getNodesFromPath('style/info')[0].cslId);
				}
				callbacks.formatCitations();
				callbacks.viewInitialised();
			}
		};

		var newStyle = function () {
			init(CSLEDIT_data.get(), callbacks);
		};

		var init = function (cslData, _callbacks) {
			var eventName,
				jsTreeData,
				citationNodeId,
				citationNodeData,
				citationTree,
				cslId,
				nodes,
				row;

			treesLoaded = 0;
			treesToLoad = 0;

			selectedNodeId = -1;
			views = [];

			views.push(new CSLEDIT_Titlebar(titlebarElement));

			callbacks = _callbacks;

			treeView.html('');
			$.each(smartTreeSchema, function (index, value) {
				row = $('');
				row = $('<div id="%1"><div class="heading"/><div class="tree"/></div>'.replace(
					'%1', value.id));
				row.appendTo(treeView);
				treeView.append($('<div class=spacer></div>'));
			});

			$.each(smartTreeSchema, function (index, value) {
				var tree, heading;
				treesToLoad++;
				
				heading = new CSLEDIT_SmartTreeHeading(
					treeView.find('#' + value.id + ' .heading'), value.headingNodePath,
					value.name, value.headingNodePossibleChildren, value.headingNodeShowPropertyPanel);
				heading.setCallbacks({
					selectNode : selectNodeInView(heading)
				});
				views.push(heading);

				tree = CSLEDIT_SmartTree(treeView.find('#' + value.id + ' .tree'), value.nodePaths, 
					value.macroLinks, value.leafNodes);

				// Use this for debugging if you're not sure the view accurately reflects the data
				//tree.setVerifyAllChanges(true);
				tree.setCallbacks({
					loaded : treeLoaded,
					selectNode : selectNodeInView(tree),
					moveNode : callbacks.moveNode,
					deleteNode : callbacks.deleteNode,
					checkMove : callbacks.checkMove
				});
				tree.createTree();
				views.push(tree);
			});

			nodePathView = new CSLEDIT_NodePathView(nodePathElement, {
				selectNodeFromPath : selectNodeFromPath
			}, syntaxHighlighter);
		};
		
		var selectedNodeChanged = function () {
			var nodeAndParent,
				node,
				parentNode,
				parentNodeName,
				possibleElements,
				element,
				possibleChildNodesDropdown,
				schemaAttributes,
				dataType,
				translatedCslId,
				translatedNodeInfo,
				translatedParentName;

			if (selectedNode() === -1) {
				// clear property panel if nothing selected
				propertyPanelElement.children().remove();
				return;
			}

			nodeAndParent = CSLEDIT_data.getNodeAndParent(selectedNode());
			node = nodeAndParent.node;
			parentNode = nodeAndParent.parent;

			// hack to stop parent of style being style
			if (node.name === "style") {
				parentNodeName = "root";
			} else if (parentNode !== false) {
				parentNodeName = parentNode.name;
			} else {
				parentNodeName = "root";
			}

			nodePathView.selectNode(getSelectedNodePath());

			if (selectedViewProperty("showPropertyPanel") === false) {
				propertyPanelElement.children().remove();
			} else {
				CSLEDIT_propertyPanel.setup(propertyPanelElement, node, parentNodeName + '/' + node.name);
			}

			syntaxHighlighter.selectedNodeChanged(node.cslId);		
		};

		var selectNodeInView = function (selectedView) {
			return function (event, ui) {
				// deselect nodes in other views
				$.each(views, function (i, view) {
					if (view !== selectedView) {
						if ("deselectAll" in view) {
							view.deselectAll();
						}
					}
				});

				selectedTree = selectedView;
				selectedNodeId = selectedView.selectedNode();
		
				selectedNodeChanged();
			};
		};

		var getSelectedNodePath = function () {
			if (selectedTree === null) {
				return "no selected tree";
			}

			return selectedTree.getSelectedNodePath();
		};

		var macroEditNotification = function (id) {
			var nodeStack = CSLEDIT_data.getNodeStack(id),
				node,
				iter,
				next,
				macroName,
				timesUsed;

			while (nodeStack.length > 0) {
				node = nodeStack.pop();
				if (node.name === "macro" && recentlyEditedMacro !== node.cslId) {
					macroName = new CSLEDIT_CslNode(node).getAttr("name");
					if (macroName === "") {
						return;
					}

					// check how many places this macro is used
					iter = new CSLEDIT_Iterator(CSLEDIT_data.get());
					timesUsed = 0;

					while (iter.hasNext()) {
						next = new CSLEDIT_CslNode(iter.next());

						if (next.name === "text" && next.getAttr("macro") === macroName) {
							timesUsed++;

							if (timesUsed > 1) {
								recentlyEditedMacro = node.cslId;
								CSLEDIT_notificationBar.showMessage(
									'You just edited a macro which is used in multiple places');
							}
						}
					}
				}
			}
		};

		var setSuppressSelectNode = function (suppress) {
			suppressSelectNode = suppress;
		};

		var addNode = function (id, position, newNode, nodesAdded) {
			macroEditNotification(id);	
			$.each(views, function (i, view) {
				if ("addNode" in view) {
					view.addNode(id, position, newNode, nodesAdded);
				}
			});
			if (!suppressSelectNode) {
				selectNode(newNode.cslId);
			}
		};

		var deleteNode = function (id, nodesDeleted) {
			macroEditNotification(id - 1);
			$.each(views, function (i, view) {
				if ("deleteNode" in view) {
					view.deleteNode(id, nodesDeleted);
				}
			});
		};

		var amendNode = function (id, amendedNode) {
			macroEditNotification(id);
			$.each(views, function (i, view) {
				if ("amendNode" in view) {
					view.amendNode(id, amendedNode);
				}
			});
			debug.log("amendNode - calling selectedNodeChanged");
			selectedNodeChanged();
		};

		var selectNode = function (id, highlightedNodes) {
			var treeNode,
				headingNode;
			
			headingNode = treeView.find('span[cslid=' + id + ']');

			if (typeof(highlightedNodes) === "undefined") {
				treeNode = treeView.find('li[cslid=' + id + '] > a');
			} else {
				treeNode = highlightedNodes.filter('li[cslid=' + id + ']').children('a');
			}

			if (headingNode.length === 0 && treeNode.length > 0) {
				clickNode(treeNode.first());
			} else {
				selectedNodeId = id;
				selectedNodeChanged();
			}
		};

		var selectNodeFromPath = function (nodePath) {
			var treeNode = treeView,
				cslId;

			debug.log("select node from path");
			$.each(nodePath, function (i, cslId) {
				treeNode = treeNode.find('li[cslId="' + cslId + '"]');
			});

			treeNode = treeNode.children('a');

			if (treeNode.length > 0) {
				clickNode(treeNode.first());
			}
		};

		var clickNode = function (node) {
			node.click();

			treeView.scrollTo(node, 200, {
				offset: {left: -treeView.width() + 80, top: -treeView.height() * 0.4}
			});
		};

		var selectedNode = function () {
			return selectedNodeId;
		};

		var selectedViewProperty = function (property) {
			if (selectedTree === null) {
				return null;
			}
			if (property in selectedTree) {
				return selectedTree[property];
			}
			return null;
		};

		var expandNode = function (id) {
			$.each(views, function (i, view) {
				if ('expandNode' in view) {
					view.expandNode(id);
				}
			});
		};

		var styleChanged = function (command, args) {
			args = args || [];
			debug.log("executing view update: " + command + "(" + args.join(", ") + ")");
			this[command].apply(null, args);
		};
		
		var collapseAll = function () {
			$.each(views, function (i, view) {
				if ('collapseAll' in view) {
					view.collapseAll();
				}
			});
		};

		// public:
		return {
			init : init,

			addNode : addNode,
			deleteNode : deleteNode,
			amendNode : amendNode,
			newStyle : newStyle,

			selectNode : selectNode,
			selectedNode : selectedNode,

			expandNode : expandNode,

			collapseAll : collapseAll,

			formatCitations : function () {
				callbacks.formatCitations();
			},
				
			styleChanged : styleChanged,

			getSelectedNodePath : getSelectedNodePath,

			selectNodeFromPath : selectNodeFromPath,

			setSuppressSelectNode : setSuppressSelectNode,

			selectedViewProperty : selectedViewProperty
		};
	};
});
