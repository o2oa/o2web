MWF.xDesktop.requireApp("process.Xform", "$Module", null, false);
MWF.xDesktop.requireApp("process.Xform", "Button", null, false);
MWF.xApplication.process.Xform.ViewSelector = MWF.APPViewSelector =  new Class({
	Implements: [Events],
	Extends: MWF.xApplication.process.Xform.Button,

	_loadUserInterface: function(){
		var button = new Element("button");
		button.inject(this.node, "after");
		this.node.destroy();
		this.node = button;
		this.node.set({
			"id": this.json.id,
			"text": this.json.name || this.json.id,
			"styles": this.form.css.buttonStyles,
			"MWFType": this.json.type
		});
        this.node.addEvent("click", function(){
            this.selectedData = null;
            this.selectView(function(data){
                this.doResult(data);
            }.bind(this));
        }.bind(this));
	},
    doResult: function(data){
        if (this.json.result === "script"){
            this.selectedData = data;
            return (this.json.selectedScript.code) ? this.form.Macro.exec(this.json.selectedScript.code, this) : "";
        }else{
            Object.each(this.json.selectedSetValues, function(v, k){
                var value = "";
                data.each(function(d, idx){
                    Object.each(d.data, function(dv, dk){
                        if (dk===v) value = (value) ? (value+", "+dv) : dv;
                    }.bind(this));
                }.bind(this));

                var field = this.form.all[k];
                if (field){
                    field.setData(value);
                    if (value){
                        if (field.descriptionNode) field.descriptionNode.setStyle("display", "none");
                    }else{
                        if (field.descriptionNode) field.descriptionNode.setStyle("display", "block");
                    }
                }
            }.bind(this));
        }
    },

    selectCMSView: function(callback){
        var viewData = this.json.cmsViewName;
        if (viewData){
            var filter = null;
            if (this.json.filterList && this.json.filterList.length){
                filter = [];
                this.json.filterList.each(function(entry){
                    entry.value = this.form.Macro.exec(entry.code.code, this);
                    //delete entry.code;
                    filter.push(entry);
                }.bind(this));
            }
            var viewJson = {
                "application": viewData.appId,
                "viewName": viewData.name,
                "isTitle": this.json.isTitle || "yes",
                "select": this.json.select || "single",
                "titleStyles": this.json.titleStyles,
                "itemStyles": this.json.itemStyles,
                "isExpand": this.json.isExpand || "no",
                "filter": filter
            };
            var options = {};
            var width = options.width || "800";
            var height = options.height || "450";

            var size;
            if (layout.mobile){
                size = document.body.getSize();
                width = size.x;
                height = size.y;
                options.style = "viewmobile";
            }
            width = width.toInt();
            height = height.toInt();

            size = this.form.app.content.getSize();
            var x = (size.x-width)/2;
            var y = (size.y-height)/2;
            if (x<0) x = 0;
            if (y<0) y = 0;
            if (layout.mobile){
                x = 20;
                y = 0;
            }

            var _self = this;
            MWF.require("MWF.xDesktop.Dialog", function(){
                var dlg = new MWF.xDesktop.Dialog({
                    "title": this.json.title || "select view",
                    "style": options.style || "view",
                    "top": y,
                    "left": x-20,
                    "fromTop":y,
                    "fromLeft": x-20,
                    "width": width,
                    "height": height,
                    "html": "<div></div>",
                    "maskNode": this.form.app.content,
                    "container": this.form.app.content,
                    "buttonList": [
                        {
                            "text": MWF.LP.process.button.ok,
                            "action": function(){
                                //if (callback) callback(_self.view.selectedItems);
                                if (callback) callback(_self.view.getData());
                                this.close();
                            }
                        },
                        {
                            "text": MWF.LP.process.button.cancel,
                            "action": function(){this.close();}
                        }
                    ]
                });
                dlg.show();

                if (layout.mobile){
                    var backAction = dlg.node.getElement(".MWF_dialod_Action_back");
                    var okAction = dlg.node.getElement(".MWF_dialod_Action_ok");
                    if (backAction) backAction.addEvent("click", function(e){
                        dlg.close();
                    }.bind(this));
                    if (okAction) okAction.addEvent("click", function(e){
                        //if (callback) callback(this.view.selectedItems);
                        if (callback) callback(this.view.getData());
                        dlg.close();
                    }.bind(this));
                }

                // MWF.xDesktop.requireApp("process.Xform", "widget.CMSView", function(){
                //     this.view = new MWF.xApplication.process.Xform.widget.CMSView(dlg.content.getFirst(), viewJson, {"style": "select"});
                // }.bind(this));

                MWF.xDesktop.requireApp("process.Application", "Viewer", function(){
                    this.view = new MWF.xApplication.process.Application.Viewer(dlg.content, viewJson, {
                        "actions": {
                            "lookup": {"uri": "/jaxrs/queryview/flag/{view}/application/flag/{application}/execute", "method":"PUT"},
                            "getView": {"uri": "/jaxrs/queryview/flag/{view}/application/flag/{application}"}
                        },
                        "actionRoot": "x_cms_assemble_control"
                    });
                }.bind(this));
            }.bind(this));
        }
    },
    selectProcessView: function(callback){
        var viewData = this.json.processViewName;
        if (viewData){
            var filter = null;
            if (this.json.filterList && this.json.filterList.length){
                filter = [];
                this.json.filterList.each(function(entry){
                    entry.value = this.form.Macro.exec(entry.code.code, this);
                    //delete entry.code;
                    filter.push(entry);
                }.bind(this));
            }

            var viewJson = {
                "application": viewData.application,
                "viewName": viewData.name,
                "isTitle": this.json.isTitle || "yes",
                "select": this.json.select || "single",
                "titleStyles": this.json.titleStyles,
                "itemStyles": this.json.itemStyles,
                "isExpand": this.json.isExpand || "no",
                "filter": filter
            };
            var options = {};
            var width = options.width || "800";
            var height = options.height || "600";

            var size;
            if (layout.mobile){
                size = document.body.getSize();
                width = size.x;
                height = size.y;
                options.style = "viewmobile";
            }
            width = width.toInt();
            height = height.toInt();

            size = this.form.app.content.getSize();
            var x = (size.x-width)/2;
            var y = (size.y-height)/2;
            if (x<0) x = 0;
            if (y<0) y = 0;
            if (layout.mobile){
                x = 20;
                y = 0;
            }

            var _self = this;
            MWF.require("MWF.xDesktop.Dialog", function(){
                var dlg = new MWF.xDesktop.Dialog({
                    "title": this.json.title || "select view",
                    "style": options.style || "view",
                    "top": y,
                    "left": x-20,
                    "fromTop":y,
                    "fromLeft": x-20,
                    "width": width,
                    "height": height,
                    "html": "",
                    "maskNode": this.form.app.content,
                    "container": this.form.app.content,
                    "buttonList": [
                        {
                            "text": MWF.LP.process.button.ok,
                            "action": function(){
                                //if (callback) callback(_self.view.selectedItems);
                                if (callback) callback(_self.view.getData());
                                this.close();
                            }
                        },
                        {
                            "text": MWF.LP.process.button.cancel,
                            "action": function(){this.close();}
                        }
                    ]
                });
                dlg.show();

                if (layout.mobile){
                    var backAction = dlg.node.getElement(".MWF_dialod_Action_back");
                    var okAction = dlg.node.getElement(".MWF_dialod_Action_ok");
                    if (backAction) backAction.addEvent("click", function(e){
                        dlg.close();
                    }.bind(this));
                    if (okAction) okAction.addEvent("click", function(e){
                        //if (callback) callback(this.view.selectedItems);
                        if (callback) callback(this.view.getData());
                        dlg.close();
                    }.bind(this));
                }

                // MWF.xDesktop.requireApp("process.Xform", "widget.View", function(){
                //     this.view = new MWF.xApplication.process.Xform.widget.View(dlg.content.getFirst(), viewJson, {"style": "select"});
                // }.bind(this));

                MWF.xDesktop.requireApp("process.Application", "Viewer", function(){
                    this.view = new MWF.xApplication.process.Application.Viewer(dlg.content, viewJson);
                }.bind(this));
            }.bind(this));
        }
    },

    selectQueryView: function(callback){
        var viewData = this.json.queryView;

        if (viewData){
            var filter = null;
            if (this.json.filterList && this.json.filterList.length){
                filter = [];
                this.json.filterList.each(function(entry){
                    entry.value = this.form.Macro.exec(entry.code.code, this);
                    //delete entry.code;
                    filter.push(entry);
                }.bind(this));
            }

            var viewJson = {
                "application": viewData.appName,
                "viewName": viewData.name,
                "viewId": viewData.id,
                "isTitle": this.json.isTitle || "yes",
                "select": this.json.select || "single",
                "titleStyles": this.json.titleStyles,
                "itemStyles": this.json.itemStyles,
                "isExpand": this.json.isExpand || "no",
                "filter": filter
            };
            var options = {};
            var width = options.width || "800";
            var height = options.height || "600";

            if (layout.mobile){
                var size = document.body.getSize();
                width = size.x;
                height = size.y;
                options.style = "viewmobile";
            }
            width = width.toInt();
            height = height.toInt();

            var size = this.form.app.content.getSize();
            var x = (size.x-width)/2;
            var y = (size.y-height)/2;
            if (x<0) x = 0;
            if (y<0) y = 0;
            if (layout.mobile){
                x = 20;
                y = 0;
            }

            var _self = this;
            MWF.require("MWF.xDesktop.Dialog", function(){
                var dlg = new MWF.xDesktop.Dialog({
                    "title": this.json.title || "select view",
                    "style": options.style || "view",
                    "top": y,
                    "left": x-20,
                    "fromTop":y,
                    "fromLeft": x-20,
                    "width": width,
                    "height": height,
                    "html": "",
                    "maskNode": this.form.app.content,
                    "container": this.form.app.content,
                    "buttonList": [
                        {
                            "text": MWF.LP.process.button.ok,
                            "action": function(){
                                //if (callback) callback(_self.view.selectedItems);
                                if (callback) callback(_self.view.getData());
                                this.close();
                            }
                        },
                        {
                            "text": MWF.LP.process.button.cancel,
                            "action": function(){this.close();}
                        }
                    ],
                    "onPostShow": function(){
                        MWF.xDesktop.requireApp("query.Query", "Viewer", function(){
                            this.view = new MWF.xApplication.query.Query.Viewer(dlg.content, viewJson, {"style": "select"});
                        }.bind(this));
                    }.bind(this)
                });
                dlg.show();

                if (layout.mobile){
                    var backAction = dlg.node.getElement(".MWF_dialod_Action_back");
                    var okAction = dlg.node.getElement(".MWF_dialod_Action_ok");
                    if (backAction) backAction.addEvent("click", function(e){
                        dlg.close();
                    }.bind(this));
                    if (okAction) okAction.addEvent("click", function(e){
                        //if (callback) callback(this.view.selectedItems);
                        if (callback) callback(this.view.getData());
                        dlg.close();
                    }.bind(this));
                }

                // MWF.xDesktop.requireApp("process.Xform", "widget.View", function(){
                //     this.view = new MWF.xApplication.process.Xform.widget.View(dlg.content.getFirst(), viewJson, {"style": "select"});
                // }.bind(this));
                // MWF.xDesktop.requireApp("query.Query", "Viewer", function(){
                //     this.view = new MWF.xApplication.query.Query.Viewer(dlg.content, viewJson, {"style": "select"});
                // }.bind(this));
            }.bind(this));
        }
    },
    selectView: function(callback){
        if (this.json.queryView){
            this.selectQueryView(callback);
        }else{
            if (this.json.selectViewType==="cms"){
                this.selectCMSView(callback);
            }else{
                this.selectProcessView(callback);
            }
        }
    }
	
}); 