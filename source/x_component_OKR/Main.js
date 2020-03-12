MWF.xApplication.OKR  = MWF.xApplication.OKR || {};
MWF.require("MWF.widget.Identity", null,false);
MWF.xDesktop.requireApp("OKR", "Actions.RestActions", null, false);
MWF.xApplication.OKR.options = {
	multitask: true,
	executable: true
}
MWF.xApplication.OKR.Main = new Class({
	Extends: MWF.xApplication.Common.Main,
	Implements: [Options, Events],

	options: {
		"style": "default",
		"name": "OKR",
		"icon": "icon.png",
		"width": "1200",
		"height": "700",
		"isResize": false,
		"isMax": true,
		"title": MWF.xApplication.OKR.LP.title
	},
	onQueryLoad: function(){
		this.lp = MWF.xApplication.OKR.LP;
		this.user = layout.desktop.session.user.name;
		this.userGender = layout.desktop.session.user.genderType;
	},
	loadApplication: function(callback){
		this.manageDepartments =[];
		this.manageCompanys = [];
		this.restActions = new MWF.xApplication.OKR.Actions.RestActions();
		this.createNode();
		this.loadApplicationContent();
	},
	isAdmin: function(){
		return this.isCompanyManager() || MWF.AC.isAdministrator()
	},
	isDepartmentManager : function(){
		return this.manageDepartments.length > 0;
	},
	isCompanyManager : function(){
		return this.manageCompanys.length > 0;
	},
	loadController: function(callback){
		//this.restActions.listPermission( function( json ){
		//	json.data.each(function(item){
		//		if( item.adminLevel == "COMPANY" && item.adminName == layout.desktop.session.user.name){
		//			this.manageCompanys.push( item.organizationName )
		//		}else if( item.adminLevel == "DEPT" && item.adminName == layout.desktop.session.user.name ){
		//			this.manageDepartments.push( item.organizationName )
		//		}
		//	}.bind(this))
		//	if(callback)callback(json);
		//}.bind(this));
		if(callback)callback();
	},
	createNode: function(){
		this.content.setStyle("overflow", "hidden");
		this.node = new Element("div", {
			"styles": {"width": "100%", "height": "100%", "overflow": "hidden"}
		}).inject(this.content);
	},
	loadApplicationContent: function(){
		this.loadController(function(){
			this.loaNavi();
		}.bind(this))
		//this.loadApplicationLayout();
	},
	loaNavi: function(callback){
		this.naviNode = new Element("div.naviNode", {
			"styles": this.css.naviNode
		}).inject(this.node);

		var curNavi = { "id" : "" }
		if( this.status ){
			curNavi.id = this.status.id
		}
		this.navi = new MWF.xApplication.OKR.Navi(this, this.naviNode, curNavi );
	},
	clearContent: function(){
		if (this.explorerContent){
			if (this.explorer) delete this.explorer;
			this.explorerContent.destroy();
			this.explorerContent = null;
		}
	},
	openMinder : function(){
			MWF.xDesktop.requireApp("OKR", "MinderExplorer", function(){
				this.clearContent();
				this.explorerContent = new Element("div", {
					"styles": this.css.rightContentNode
				}).inject(this.node);
				this.explorer = new MWF.xApplication.OKR.MinderExplorer(this.explorerContent, this, this.restActions,{"isAdmin":this.isAdmin() } );
				this.explorer.load();
			}.bind(this));
	},
	opeCoreWork : function(){
		MWF.xDesktop.requireApp("Execution", "CenterWorkDeployer", function(){
			//this.clearContent();
			//this.explorerContent = new Element("div", {
			//	"styles": this.css.rightContentNode
			//}).inject(this.node);
			this.explorer = new MWF.xApplication.Execution.CenterWorkDeployer({"app":this}, this.restActions,{},{"isAdmin":this.isAdmin() } );
			this.explorer.load();
		}.bind(this));
	},
	opeWorkForm : function(){
		MWF.xDesktop.requireApp("Execution", "WorkForm", function(){
			//this.clearContent();
			//this.explorerContent = new Element("div", {
			//	"styles": this.css.rightContentNode
			//}).inject(this.node);
			this.form = new MWF.xApplication.Execution.WorkForm({"app":this}, this.restActions,{},{
				"isNew": true,
				"isEdited": false
			});
			this.form.load();
		}.bind(this));
	},
	opeWorkDetail : function(){
		MWF.xDesktop.requireApp("Execution", "WorkDetail", function(){
			//this.clearContent();
			//this.explorerContent = new Element("div", {
			//	"styles": this.css.rightContentNode
			//}).inject(this.node);
			this.form = new MWF.xApplication.Execution.WorkDetail({"app":this}, this.restActions,{},{
				"isNew": false,
				"isEdited": false
			});
			this.form.load();
		}.bind(this));
	},
	openImageCliper : function(){
		this.clearContent();
		this.explorerContent = new Element("div", {
			"styles": this.css.rightContentNode
		}).inject(this.node);
		MWF.require("MWF.widget.ImageClipper", function () {
			this.editor = new MWF.widget.ImageClipper(this.explorerContent, {})
			this.editor.load();
		}.bind(this))
	},
	//openExplorer : function(){
	//	MWF.xDesktop.requireApp("Template", "Explorer", function(){
	//		this.clearContent();
	//		this.explorerContent = new Element("div", {
	//			"styles": this.css.rightContentNode
	//		}).inject(this.node);
	//		this.explorer = new MWF.xApplication.Template.Explorer(this.explorerContent, this, this.restActions,{"isAdmin":this.isAdmin() } );
	//		this.explorer.load();
	//	}.bind(this));
	//},
	recordStatus: function(){
		return this.navi && this.navi.currentItem ?  this.navi.currentItem.retrieve("data") : {};
	}
});



MWF.xApplication.OKR.Navi = new Class({
	Implements: [Options, Events],
	options : {
		"id" : ""
	},
	initialize: function(app, node, options){
		this.setOptions(options);
		this.app = app;
		this.node = $(node);
		this.css = this.app.css;
		this.currentMenu = null;
		this.currentItem = null;
		this.menus = {};
		this.items = {};
		this.elements = [];
		this.load();
	},
	load: function(){
		var naviUrl = this.app.path+"navi.json";
		MWF.getJSON(naviUrl, function(json){
			json.each(function(navi){
				if( navi.access && navi.access == "admin" ){
					if( this.app.isAdmin() )this.createNaviNode(navi);
				}else if( navi.access && navi.access == "admin_dept" ){
					if( this.app.isDepartmentManager() || this.app.isAdmin() )this.createNaviNode(navi);
				}else{
					this.createNaviNode(navi);
				}
			}.bind(this));
			if( this.options.id == "" )this.elements[0].click();
		}.bind(this));
	},
	createNaviNode :function(data){
		if( data.type == "sep" ){
			var flag = true;
			if( data.access == "admin" ){
				if( !this.app.isAdmin() )flag = false;
			}else if( data.access && data.access == "admin_dept" ){
				if( !this.app.isDepartmentManager() && !this.app.isAdmin() )flag = false;
			}
			if( flag ){
				new Element("div", { "styles": this.css.viewNaviSepartorNode }).inject(this.node);
			}
		}else if( data.sub && data.sub.length > 0 ){
			this.createNaviMenuNode(data);
		}else{
			this.menus[data.id] = {};
			this.createNaviItemNode(data, data.id);
		}
	},
	createNaviMenuNode :function(data){
		if( data.access == "admin" ){
			if( !this.app.isAdmin() )return;
		}else if(data.access == "admin_dept"){
			if( !this.app.isDepartmentManager() && !this.app.isAdmin() )return;
		}
		var _self = this;
		var menuNode = new Element("div", {
			"styles": this.css.naviMenuNode
		});
		menuNode.store("data", data);
		menuNode.store("type", "menu");

		var textNode =  new Element("div", {
			"styles": this.css.naviMenuTextNode,
			"text": data.title
		});
		textNode.inject(menuNode);
		menuNode.inject(this.node);

		this.menus[data.id] = {};
		this.menus[data.id].node = menuNode;
		this.elements.push(menuNode);

		menuNode.addEvents({
			"mouseover": function(){ if (_self.currentMenu!=this) this.setStyles(_self.app.css.naviMenuNode_over);},
			"mouseout": function(){if (_self.currentMenu!=this) this.setStyles(_self.app.css.naviMenuNode);},
			"mousedown": function(){if (_self.currentMenu!=this) this.setStyles(_self.app.css.naviMenuNode_down);},
			"mouseup": function(){if (_self.currentMenu!=this) this.setStyles(_self.app.css.naviMenuNode_over);},
			"click": function(){
				//if (_self.currentNavi!=this) _self.doAction.apply(_self, [this]);
				_self.clickMenu.apply(_self, [this]);
			}
		});

		data.sub.each(function( d ){
			this.createNaviItemNode( d, data.id, menuNode  )
		}.bind(this))
	},
	clickMenu: function(naviNode) {
		var navi = naviNode.retrieve("data");
		var action = navi.action;

		this.closeCurrentMenu();
		if( this.menus[navi.id].itemNodes ) {
			this.menus[navi.id].itemNodes.each( function(itemNode){
				itemNode.setStyle("display","block");
			})
		}

		var type = naviNode.retrieve("type");
		if (!navi.target || navi.target != "_blank") {
			naviNode.setStyles( this.css.naviMenuNode_current );
			this.currentMenu = naviNode;
		}
	},
	closeCurrentMenu:function(){
		if( this.currentMenu ) {
			var data = this.currentMenu.retrieve("data");
			if (this.menus[data.id].itemNodes) {
				this.menus[data.id].itemNodes.each(function (itemNode) {
					itemNode.setStyle("display", "none");
				})
			}
			this.currentMenu.setStyles( this.css.naviMenuNode);
		}
	},
	createNaviItemNode : function( data,menuId ){

		if( data.access == "admin" ){
			if( !this.app.isAdmin() )return;
		}else if( data.access && data.access == "admin_dept" ){
			if( !this.app.isDepartmentManager() && !this.app.isAdmin() )return;
		}

		var _self = this;

		var items = this.menus[menuId].itemNodes = this.menus[menuId].itemNodes || [];

		var itemNode = new Element("div", {
			"styles": this.css.naviItemNode
		});
		itemNode.setStyle("display","block");

		items.push(itemNode);
		itemNode.store("data", data);
		itemNode.store("type", "item");

		var textNode =  new Element("div", {
			"styles": this.css.naviItemTextNode,
			"text": data.title
		});
		textNode.inject(itemNode);

		itemNode.inject(this.node);

		this.elements.push(itemNode);
		this.items[data.id] = itemNode;

		itemNode.addEvents({
			"mouseover": function(){ if (_self.currentItem!=this) this.setStyles(_self.app.css.naviItemNode_over);},
			"mouseout": function(){if (_self.currentItem!=this) this.setStyles(_self.app.css.naviItemNode);},
			"mousedown": function(){if (_self.currentItem!=this) this.setStyles(_self.app.css.naviItemNode_down);},
			"mouseup": function(){if (_self.currentItem!=this) this.setStyles(_self.app.css.naviItemNode_over);},
			"click": function(){
				_self.clickItem.apply(_self, [this]);
			}
		});

		if( data.id == this.options.id ){
			itemNode.click();
		}
	},
	clickItem : function(naviNode) {
		var navi = naviNode.retrieve("data");
		var action = navi.action;

		var type = naviNode.retrieve("type");
		if (!navi.target || navi.target != "_blank") {
			if (this.currentItem) this.currentItem.setStyles(this.css.naviItemNode);
			naviNode.setStyles(this.css.naviItemNode_current);
			this.currentItem = naviNode;
		}

		if (navi.action && this.app[navi.action]) {
			this.app[navi.action].call(this.app, navi);
		}
	}
});
