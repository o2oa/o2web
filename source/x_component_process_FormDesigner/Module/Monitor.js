MWF.xApplication.process.FormDesigner.Module = MWF.xApplication.process.FormDesigner.Module || {};
MWF.xDesktop.requireApp("process.FormDesigner", "Module.$Element", null, false);
MWF.xApplication.process.FormDesigner.Module.Monitor = MWF.FCMonitor = new Class({
	Extends: MWF.FC$Element,
	Implements: [Options, Events],
	options: {
		"style": "default",
		"propertyPath": "/x_component_process_FormDesigner/Module/Monitor/monitor.html"
	},
	
	initialize: function(form, options){
		this.setOptions(options);
		
		this.path = "/x_component_process_FormDesigner/Module/Monitor/";
		this.cssPath = "/x_component_process_FormDesigner/Module/Monitor/"+this.options.style+"/css.wcss";

		this._loadCss();
		this.moduleType = "element";
		this.moduleName = "monitor";

		this.form = form;
		this.container = null;
		this.containerNode = null;
	},
	load : function(json, node, parent){

		this.json = json;
		this.node= node;
		this.node.store("module", this);

		//this.node.empty();

		this.node.setStyles(this.css.moduleNode);

		this._loadNodeStyles();

		this._initModule();
		this._loadTreeNode(parent);

        this.setCustomStyles();

		this.parentContainer = this.treeNode.parentNode.module;
        this._setEditStyle_custom("id");

		this.parseModules();
        this.json.moduleName = this.moduleName;
	},
	_createMoveNode: function(){
		this.moveNode = new Element("div", {
			"MWFType": "log",
			"id": this.json.id,
			"styles": this.css.moduleNodeMove,
			"events": {
				"selectstart": function(){
					return false;
				}
			}
		}).inject(this.form.container);
	},
	_createNode: function(){
		this.node = this.moveNode.clone(true, true);
		this.node.setStyles(this.css.moduleNode);
		this.node.set("id", this.json.id);
		this.node.addEvent("selectstart", function(){
			return false;
		});

		this.iconNode = new Element("div", {
			"styles": this.css.iconNode
		}).inject(this.node);
		new Element("div", {
			"styles": this.css.iconNodeIcon
		}).inject(this.iconNode);
		new Element("div", {
			"styles": this.css.iconNodeText,
			"text": "Monitor"
		}).inject(this.iconNode);
	},
	_loadNodeStyles: function(){
		this.iconNode = this.node.getElement("div").setStyles(this.css.iconNode);
		this.iconNode.getFirst("div").setStyles(this.css.iconNodeIcon);
		this.iconNode.getLast("div").setStyles(this.css.iconNodeText);
	}
});
