MWF.require(["MWF.widget.Common", "MWF.widget.Identity"], null, false);
MWF.xApplication.process = MWF.xApplication.process || {};
MWF.xApplication.process.Xform = MWF.xApplication.process.Xform || {};
MWF.xDesktop.requireApp("process.Xform2", "Package_", null, false);

MWF.xApplication.process.Xform.Form_ = MWF.APPForm_ =  new Class({
	Implements: [Options, Events],
	Extends: MWF.widget.Common,
    options: {
        "style": "default",
        "readonly": false,
        "cssPath": "",
        "macro": "FormContext",
        "parameters": null,
        "moduleEvents": ["queryLoad",
            "beforeLoad",
            "postLoad",
            "afterLoad",
            "beforeSave",
            "afterSave",
            "beforeClose",
            "beforeProcess",
            "beforeProcessWork",
            "afterProcess",
            "beforeReset",
            "afterReset",
            "beforeRetract",
            "afterRetract",
            "beforeReroute",
            "afterReroute",
            "beforeDelete",
            "afterDelete",
            "beforeModulesLoad",
            "resize",
            "afterModulesLoad"]
    },
	initialize: function(node, data, options){
		this.setOptions(options);

		this.container = $(node);
        this.container.setStyle("-webkit-user-select", "text");
		this.data = data;
		this.json = data.json;
		this.html = data.html;

		this.path = "/x_component_process_Xform2/$Form/";
		this.cssPath = this.options.cssPath || "/x_component_process_Xform2/$Form/"+this.options.style+"/css.wcss";
		this._loadCss();

		this.sectionListObj = {};
		this.modules = [];
        this.all = {};
        this.forms = {};

        //if (!this.personActions) this.personActions = new MWF.xAction.org.express.RestActions();
	},

	load: function(callback){
        this.loadExtendStyle( function(){
            if (this.app){
                if (this.app.formNode) this.app.formNode.setStyles(this.json.styles);
                if (this.app.addEvent){
                    this.app.addEvent("resize", function(){
                        this.fireEvent("resize");
                    }.bind(this));
                    this.app.addEvent("queryClose", function(){
                        this.beforeCloseWork();
                    }.bind(this))
                }
            }
            //if (!this.businessData.control.allowSave) this.setOptions({"readonly": true});

            // var cssClass = "";
            // if (this.json.css && this.json.css.code) cssClass = this.loadCss();

            //this.loadMacro(function(){
                //this.container.setStyle("opacity", 0);

                this.container.set("html", this.html);
                this.node = this.container.getFirst();
                //if (cssClass) this.node.addClass(cssClass);

                //this._loadEvents();

                //if (this.fireEvent("queryLoad")){
                    //if (this.app) if (this.app.fireEvent) this.app.fireEvent("queryLoad");
                    MWF.xDesktop.requireApp("process.Xform", "lp."+MWF.language, null, false);
                    this._loadBusinessData();
                    //this.fireEvent("beforeLoad");
                    //if (this.app) if (this.app.fireEvent) this.app.fireEvent("beforeLoad");
                    this.loadContent(callback);
                //}
            //}.bind(this));
        }.bind(this))
	},
    loadExtendStyle : function(callback ){
        if( !this.json.styleConfig || !this.json.styleConfig.extendFile ){
            if (callback) callback();
            return;
        }
        var stylesUrl = "/x_component_process_FormDesigner/Module/Form/skin/"+this.json.styleConfig.extendFile;
        MWF.getJSON(stylesUrl,{
                "onSuccess": function(responseJSON){
                    if( responseJSON && responseJSON.form ){
                        this.json = Object.merge( this.json, responseJSON.form );
                    }
                    if (callback) callback();
                }.bind(this),
                "onRequestFailure": function(){
                    if (callback) callback();
                }.bind(this),
                "onError": function(){
                    if (callback) callback();
                }.bind(this)
            }
        );
    },

    loadContent: function(callback){
        this.subformCount = 0;
        this.subformLoadedCount = 0;
        this.subformLoaded = [ this.json.id ];

        this.subpageCount = 0;
        this.subpageLoadedCount = 0;
        this.subpageLoaded = [];

        this.widgetCount = 0;
        this.widgetLoadedCount = 0;
        this.widgetLoaded = [];

        this._loadHtml();
        this._loadForm();
        //this.fireEvent("beforeModulesLoad");
        //if (this.app && this.app.fireEvent) this.app.fireEvent("beforeModulesLoad");
        this._loadModules(this.node);
        //if (Browser.firefox) this.container.setStyle("opacity", 1);

        if (this.json.mode === "Mobile"){
            var node = document.body.getElement(".o2_form_mobile_actions");
            //if (node)
            this._loadMobileActions(node, callback);
        }else{
            if (callback) callback();
        }

        this.fireEvent("postLoad");
        // if (this.app && this.app.fireEvent)this.app.fireEvent("postLoad");
        this.checkSubformLoaded( true );
    },
    checkSubformLoaded : function( isAllSubformLoaded ){
        if( isAllSubformLoaded ){
            this.isAllSubformLoaded = true;
        }
        if( !this.isAllSubformLoaded )return;
        //console.log( "checkSubformLoaded this.subformCount="+ this.subformCount + " this.subformLoadedCount="+this.subformLoadedCount );
        if( (!this.subformCount || this.subformCount === this.subformLoadedCount) &&
            (!this.subpageCount || this.subpageCount === this.subpageLoadedCount) &&
            (!this.widgetCount || this.widgetCount === this.widgetLoadedCount)
        ){
            //this.container.setStyle("opacity", 1);
            //this.fireEvent("afterModulesLoad");
            //if (this.app && this.app.fireEvent)this.app.fireEvent("afterModulesLoad");

            this.fireEvent("afterLoad");
            //if (this.app && this.app.fireEvent)this.app.fireEvent("afterLoad");
            this.isLoaded = true;
        }
    },
    _loadMobileDefaultTools: function(callback){
	    if (this.json.defaultTools){
	        if (callback) callback();
        }else{
            this.json.defaultTools = o2.JSON.get("/x_component_process_FormDesigner/Module/Form/toolbars.json", function(json){
                this.json.defaultTools = json;
                if (callback) callback();
            }.bind(this));
        }
    },

    _loadMobileActions: function(node, callback){
	    var tools = [];
        this._loadMobileDefaultTools(function(){
            if (this.json.defaultTools){
                this.json.defaultTools.each(function(tool){
                    var flag = this._checkDefaultMobileActionItem(tool, this.options.readonly);
                    if (flag) tools.push(tool);
                }.bind(this));
            }
            if (this.json.tools){
                this.json.tools.each(function(tool){
                    var flag = this._checkCustomMobileActionItem(tool, this.options.readonly);
                    if (flag) tools.push(tool);
                }.bind(this));
            }
            this.mobileTools = tools;
            if (tools.length) if (node) this._createMobileActions(node, tools);
            if (callback) callback();
        }.bind(this));
    },
    _createMobileActions:function(node, tools){
        node.show();
	    var count = tools.length;
	    if (count<=2){
            this.css.html5ActionButton.width = "100%";
            if (count==2) this.css.html5ActionButton.width = "49%";
            tools.each(function(tool){
                var action = new Element("div", {"styles": this.css.html5ActionButton, "text": tool.text}).inject(node);
                action.store("tool", tool);
                action.addEvent("click", function(e){
                    var t = e.target.retrieve("tool");
                    e.setDisable = function(){}
                    if (t.actionScript){
                        this._runCustomAction(t.actionScript);
                    }else{
                        if (this[t.action]) this[t.action](e);
                    }
                }.bind(this));
                this._setMobileBottonStyle(action);
            }.bind(this));
            if (count==2) new Element("div", {"styles": this.css.html5ActionButtonSplit}).inject(node.getLast(), "before");
        }else{
            this.css.html5ActionButton.width = "38%"
            for (var i=0; i<2; i++){
                tool = tools[i];
                var action = new Element("div", {"styles": this.css.html5ActionButton, "text": tool.text}).inject(node);
                action.store("tool", tool);
                action.addEvent("click", function(e){
                    var t = e.target.retrieve("tool");
                    e.setDisable = function(){}
                    if (t.actionScript){
                        this._runCustomAction(t.actionScript);
                    }else{
                        if (this[t.action]) this[t.action](e);
                    }
                }.bind(this));
                this._setMobileBottonStyle(action);
            }
            new Element("div", {"styles": this.css.html5ActionButtonSplit}).inject(node.getLast(), "before");
            new Element("div", {"styles": this.css.html5ActionButtonSplit}).inject(node);
            this.css.html5ActionButton.width = "23%"
            var action = new Element("div", {"styles": this.css.html5ActionButton, "text": "…"}).inject(node);
            action.addEvent("click", function(e){
                this._loadMoreMobileActions(tools, 2, node);
            }.bind(this));
            this._setMobileBottonStyle(action);
        }
    },
    _loadMoreMobileActions: function(tools, n, node){
	    document.body.mask({
            "style": {
                "background-color": "#cccccc",
                "opacity": 0.6
            },
            "hideOnClick": true,
            "onHide": function(){
                this.actionMoreArea.setStyle("display", "none");
            }.bind(this)
        });
	    if (this.actionMoreArea){
            this.actionMoreArea.setStyle("display", "block");
        }else{

	        var size = document.body.getSize();
            this.actionMoreArea = new Element("div", {"styles": this.css.html5ActionOtherArea}).inject(document.body);
            var pl = this.actionMoreArea.getStyle("padding-left").toInt();
            var pr = this.actionMoreArea.getStyle("padding-right").toInt();
            var w = size.x-pl-pr;
            this.actionMoreArea.setStyle("width", ""+w+"px");
            for (var i=n; i<tools.length; i++){
                tool = tools[i];
                var action = new Element("div", {"styles": this.css.html5ActionOtherButton, "text": tool.text}).inject(this.actionMoreArea);
                action.store("tool", tool);
                action.addEvent("click", function(e){
                    var t = e.target.retrieve("tool");
                    e.setDisable = function(){}
                    if (t.actionScript){
                        this._runCustomAction(t.actionScript);
                    }else{
                        if (this[t.action]) this[t.action](e);
                    }
                }.bind(this));
                this._setMobileBottonStyle(action);
            }
        }

        // actionArea.position({
        //     relativeTo: node,
        //     position: 'topCenter',
        //     edge: 'bottomCenter'
        // });
    },
    _setMobileBottonStyle:function(action){
        var _self = this;
        action.addEvents({
            "mouseover": function(e){ this.setStyles(_self.css.html5ActionButton_over)},
            "mouseout": function(e){this.setStyles(_self.css.html5ActionButton_up)},
            "mousedown": function(e){this.setStyles(_self.css.html5ActionButton_over)},
            "mouseup": function(e){this.setStyles(_self.css.html5ActionButton_up)},
            "touchstart": function(e){this.setStyles(_self.css.html5ActionButton_over)},
            "touchcancel": function(e){this.setStyles(_self.css.html5ActionButton_up)},
            "touchend": function(e){this.setStyles(_self.css.html5ActionButton_up)},
            "touchmove": function(e){this.setStyles(_self.css.html5ActionButton_over)}
        });
    },
    _runCustomAction: function(actionScript){
        //var script = bt.node.retrieve("script");
        this.Macro.exec(actionScript, this);
    },
    _checkCustomMobileActionItem: function(tool,readonly){
        var flag = true;
        if (readonly){
            flag = tool.readShow;
        }else{
            flag = tool.editShow;
        }
        if (flag){
            flag = true;
            if (tool.control){
                flag = this.form.businessData.control[tool.control]
            }
            if (tool.condition){
                var hideFlag = this.Macro.exec(tool.condition, this);
                flag = !hideFlag;
            }
        }
        return flag;
    },
    _checkDefaultMobileActionItem: function(tool, readonly, noCondition){
        var flag = true;
        if (tool.control){
            flag = this.businessData.control[tool.control]
        }
        if (!noCondition) if (tool.condition){
            var hideFlag = this.Macro.exec(tool.condition, this);
            flag = flag && (!hideFlag);
        }
        if (tool.id == "action_processWork"){
            if (!this.businessData.task){
                flag = false;
            }
        }
        if (tool.id == "action_rollback") tool.read = true;
        if (readonly) if (!tool.read) flag = false;
        return flag;
    },
	_loadBusinessData: function(){
        if (!this.businessData){
            this.businessData = {};
        }
	},

	_loadHtml: function(){
		// this.container.set("html", this.html);
		// this.node = this.container.getFirst();
        //this.node.setStyle("overflow", "hidden");
        this.node.addEvent("selectstart", function(e){
            var select = "text";
            if (e.target.getStyle("-webkit-user-select")){
                select = e.target.getStyle("-webkit-user-select").toString().toLowerCase();
            }

            if (select!=="text" && select!=="auto") e.preventDefault();
        });
	},

	_loadForm: function(){
		this._loadStyles();
		//this._loadCssLinks();
		//this._loadScriptSrc();
		//this._loadJsheader();
		//this._loadEvents();
	},
	_loadStyles: function(){
        if (this.json.styles) Object.each(this.json.styles, function(value, key){
            if ((value.indexOf("x_processplatform_assemble_surface")!=-1 || value.indexOf("x_portal_assemble_surface")!=-1)){
                var host1 = MWF.Actions.getHost("x_processplatform_assemble_surface");
                var host2 = MWF.Actions.getHost("x_portal_assemble_surface");
                if (value.indexOf("/x_processplatform_assemble_surface")!==-1){
                    value = value.replace("/x_processplatform_assemble_surface", host1+"/x_processplatform_assemble_surface");
                }else if (value.indexOf("x_processplatform_assemble_surface")!==-1){
                    value = value.replace("x_processplatform_assemble_surface", host1+"/x_processplatform_assemble_surface");
                }
                if (value.indexOf("/x_portal_assemble_surface")!==-1){
                    value = value.replace("/x_portal_assemble_surface", host2+"/x_portal_assemble_surface");
                }else if (value.indexOf("x_portal_assemble_surface")!==-1){
                    value = value.replace("x_portal_assemble_surface", host2+"/x_portal_assemble_surface");
                }
            }
            this.node.setStyle(key, value);
        }.bind(this));
		//this.node.setStyles(this.json.styles);
	},

	_getDomjson: function(dom){
		var mwfType = dom.get("MWFtype") || dom.get("mwftype");
		switch (mwfType) {
			case "form":
				return this.json;
			case "":
				return null;
			default:
				var id = dom.get("id");
				if (!id) id = dom.get("MWFId");
				if (id){
					return this.json.moduleList[id];
				}else{
					return null;
				}
		}
	},
	_getModuleNodes: function(dom){
		var moduleNodes = [];
		var subDom = dom.getFirst();
		while (subDom){
		    var mwftype = subDom.get("MWFtype") || subDom.get("mwftype");
			if (mwftype){
                var type = mwftype;
				if (type.indexOf("$")===-1){
                    moduleNodes.push(subDom);
                }
                // && mwftype !== "tab$Content"
                if (mwftype !== "datagrid" && mwftype !== "subSource" && mwftype !== "tab$Content"){
					moduleNodes = moduleNodes.concat(this._getModuleNodes(subDom));
				}
			}else{
				moduleNodes = moduleNodes.concat(this._getModuleNodes(subDom));
			}
			subDom = subDom.getNext();
		}
		return moduleNodes;
	},

	_loadModules: function(dom){
        //var subDom = this.node.getFirst();
        //while (subDom){
        //    if (subDom.get("MWFtype")){
        //        var json = this._getDomjson(subDom);
        //        var module = this._loadModule(json, subDom);
        //        this.modules.push(module);
        //    }
        //    subDom = subDom.getNext();
        //}
		var moduleNodes = this._getModuleNodes(dom);
        //alert(moduleNodes.length);

		moduleNodes.each(function(node){
			var json = this._getDomjson(node);
            //if( json.type === "Subform" || json.moduleName === "subform" )this.subformCount++;
            //if( json.type === "Subpage" || json.moduleName === "subpage" )this.subpageCount++;
            var module = this._loadModule(json, node);
            this.modules.push(module);
		}.bind(this));
	},
	_loadModule: function(json, node, beforeLoad){
        //console.log( json.id );
        if( json.type === "Subform" || json.moduleName === "subform" )this.subformCount++;
        //if( json.type === "Subform" || json.moduleName === "subform" ){
        //    console.log( "add subformcount ， this.subformCount = " + this.subformCount );
        //}
        if( json.type === "Subpage" || json.moduleName === "subpage" )this.subpageCount++;
        if( json.type === "Widget" || json.moduleName === "widget" )this.widgetCount++;
	    if (!MWF["APP"+json.type+"_"]){
            MWF.xDesktop.requireApp("process.Xform", json.type+"_", null, false);
        }
		var module = new MWF["APP"+json.type+"_"](node, json, this);
        if (beforeLoad) beforeLoad.apply(module);
        if (!this.all[json.id]) this.all[json.id] = module;
        if (module.field){
            if (!this.forms[json.id]) this.forms[json.id] = module;
        }
        module.readonly = this.options.readonly;
		module.load();
		return module;
	}

});