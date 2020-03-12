MWF.xApplication.process.Xform = MWF.xApplication.process.Xform || {};
MWF.xDesktop.requireApp("process.Xform2", "$Module_", null, false);
// MWF.xApplication.process.Xform.require = function(callback){
//     var modules = [
//         ["process.Xform", "Form"],
//         ["process.Xform", "Label"],
//         ["process.Xform", "Textfield"],
//         ["process.Xform", "Number"],
//         ["process.Xform", "Personfield"],
//         ["process.Xform", "Orgfield"],
//         ["process.Xform", "Org"],
//         ["process.Xform", "Calendar"],
//         ["process.Xform", "Textarea"],
//         ["process.Xform", "Opinion"],
//         ["process.Xform", "Select"],
//         ["process.Xform", "Radio"],
//         ["process.Xform", "Checkbox"],
//         ["process.Xform", "Button"],
//         ["process.Xform", "Combox"],
//         ["process.Xform", "Address"],
//         ["process.Xform", "Table"],
//         ["process.Xform", "Datagrid"],
//         ["process.Xform", "Tab"],
//         ["process.Xform", "Tree"],
//         ["process.Xform", "Iframe"],
//         ["process.Xform", "Htmleditor"],
//         ["process.Xform", "Office"],
//         ["process.Xform", "Attachment"],
//         ["process.Xform", "Actionbar"],
//         ["process.Xform", "Sidebar"],
//         ["process.Xform", "Log"],
//         ["process.Xform", "Monitor"],
//         ["process.Xform", "View"],
//         ["process.Xform", "ViewSelector"],
//         ["process.Xform", "Stat"],
//         ["process.Xform", "ImageClipper"],
//         ["process.Xform", "Subform"],
//         ["process.Xform", "Widget"],
//         ["process.Xform", "Source"],
//         ["process.Xform", "SourceText"],
//         ["process.Xform", "SubSource"]
//     ];
//     MWF.xDesktop.requireApp(modules, null, function(){
//         if (callback) callback();
//     });
// };


// MWF.xDesktop.requireApp("process.Xform", "Label", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Textfield", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Number", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Personfield", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Orgfield", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Calendar", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Textarea", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Opinion", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Select", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Radio", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Checkbox", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Button", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Combox", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Address", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Table", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Datagrid", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Tab", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Tree", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Iframe", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Htmleditor", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Office", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Attachment", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Actionbar", null, false);
// MWF.xDesktop.requireApp("process.Xform", "sidebar", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Log", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Monitor", null, false);
// MWF.xDesktop.requireApp("process.Xform", "View", null, false);
// MWF.xDesktop.requireApp("process.Xform", "ViewSelector", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Stat", null, false);
// MWF.xDesktop.requireApp("process.Xform", "ImageClipper", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Subform", null, false);
// MWF.xDesktop.requireApp("process.Xform", "Source", null, false);
// MWF.xDesktop.requireApp("process.Xform", "SourceText", null, false);
// MWF.xDesktop.requireApp("process.Xform", "SubSource", null, false);

MWF.xApplication.process.Xform2.Div_ = MWF.APPDiv_ =  new Class({
	Extends: MWF.APP$Module_
});
MWF.xApplication.process.Xform2.Label_ = MWF.APPLabel_ =  new Class({
    Extends: MWF.APP$Module_,
    _loadUserInterface: function(){
        if (this.json.valueType == "text"){
            this.node.set("text", this.json.text || "");
        }
        if (this.json.valueType == "script"){
            // var code = this.json.script.code;
            // if (code){
            //     this.node.set("text", this.form.Macro.exec(code, this) || "");
            // }
        }
        if (this.json.prefixIcon || this.json.suffixIcon){
            var text = this.node.get("text");
            this.node.empty();

            var tNode = new Element("div", {"styles": {
                    "margin-left": (this.json.prefixIcon) ? "20px" : "0px",
                    "margin-right": (this.json.suffixIcon) ? "20px" : "0px",
                    "height": "100%"
                }, "text": text}).inject(this.node);

            if (this.json.prefixIcon){
                var node = new Element("div", {"styles": {
                        "float": "left",
                        "width": "20px",
                        "height": ""+this.node.getSize().y+"px",
                        "background": "url("+this.json.prefixIcon+") center center no-repeat"
                    }}).inject(tNode, "before");
            }
            if (this.json.suffixIcon){
                var node = new Element("div", {"styles": {
                        "float": "right",
                        "width": "20px",
                        "height": ""+this.node.getSize().y+"px",
                        "background": "url("+this.json.suffixIcon+") center center no-repeat"
                    }}).inject(tNode, "before");
            }
        }
    }
});
MWF.xApplication.process.Xform2.Textfield_ = MWF.APPTextfield_ =  new Class({
    Extends: MWF.APP$Module_,
    _loadUserInterface: function(){
        this._loadNode();
    },
    _loadNode: function(){
        var input = new Element("input", {
            "styles": {
                "background": "transparent",
                "width": "100%",
                "display": "block",
                "border": "0px"
            }
        });
        input.set(this.json.properties);

        var node = new Element("div", {"styles": {
                "overflow": "hidden",
                "position": "relative",
                "margin-right": "20px",
                "padding-right": "4px"
            }}).inject(this.node, "after");
        input.inject(node);

        this.node.destroy();
        this.node = node;
        this.node.set({
            "id": this.json.id,
            "MWFType": this.json.type
        });
        if (this.json.showIcon!='no' && !this.form.json.hideModuleIcon){
            this.iconNode = new Element("div", {
                "styles": this.form.css[this.iconStyle]
            }).inject(this.node, "before");
        }else if( this.form.json.nodeStyleWithhideModuleIcon ){
            this.node.setStyles(this.form.json.nodeStyleWithhideModuleIcon)
        }
    },
    _loadStyles: function(){
        if (this.json.styles) this.node.setStyles(this.json.styles);
        if (this.json.inputStyles) if (this.node.getFirst()) this.node.getFirst().setStyles(this.json.inputStyles);
        if (this.iconNode){
            var size = this.node.getSize();
            this.iconNode.setStyle("height", ""+size.y+"px");
        }
    }
});

MWF.xApplication.process.Xform2.Table_ = MWF.APPTable_ =  new Class({
    Extends: MWF.APP$Module_,
    _afterLoaded: function(){
        if (!this.table) this.table = this.node.getElement("table");
        var rows = this.table.rows;
        for (var i=0; i<rows.length; i++){
            var row = rows[i];
            for (var j=0; j<row.cells.length; j++){
                var td = row.cells[j];

                var json = this.form._getDomjson(td);
                if (json){
                    var table = this;
                    var module = this.form._loadModule(json, td, function(){
                        this.table = table;
                    });
                }
                //this.form.modules.push(module);
            }
        }
    },
    _loadBorderStyle: function(){
        if (this.json.styles.border){
            if (!this.table) this.table = this.node.getElement("table");
            this.table.set("cellspacing", "0");
            this.table.setStyles({
                "border-top": this.json.styles.border,
                "border-left": this.json.styles.border
            });
            var ths = this.table.getElements("th");
            ths.setStyles({
                "border-bottom": this.json.styles.border,
                "border-right": this.json.styles.border
            });
            var tds = this.table.getElements("td");
            tds.setStyles({
                "border-bottom": this.json.styles.border,
                "border-right": this.json.styles.border,
                "background": "transparent"
            });
        }
    },
    _loadStyles: function(){
        Object.each(this.json.styles, function(value, key){
            var reg = /^border\w*/ig;
            if (!key.test(reg)){
                this.node.setStyle(key, value);
            }
        }.bind(this));
        this._loadBorderStyle();
    }
});
MWF.xApplication.process.Xform2.Table$Td_ = MWF.APPTable$Td_ =  new Class({
    Extends: MWF.APP$Module_,
    _queryLoaded: function(){

    },
    _afterLoaded: function(){
        //this.form._loadModules(this.node);
    },
    _loadStyles: function(){
        var addStyles = {};
        if (this.json.cellType=="title"){
            addStyles = this.table.json.titleTdStyles
        }
        if (this.json.cellType=="content"){
            addStyles = this.table.json.contentTdStyles
        }
        if (this.json.cellType=="layout"){
            addStyles = this.table.json.layoutTdStyles
        }
        this.node.setStyles(addStyles);
        this.node.setStyles(this.json.styles);

        if (this.json.cellType=="content"){
            this.form.addEvent("postLoad", function(){
                var inputs = this.node.getElements("input");
                inputs.each(function(input){
                    var inputType = input.get("type").toLowerCase();
                    if (inputType!="radio" && inputType!="checkbox" && inputType!="submit" && inputType!="buttom" && inputType!="image"){
                        input.setStyle("width", "100%");
                    }
                }.bind(this));
                var textareas = this.node.getElements("textarea");
                textareas.each(function(textarea){
                    textarea.setStyle("width", "100%");
                }.bind(this));

            }.bind(this))
        }
    }
});






MWF.xApplication.process.Xform2.Common_ = MWF.APPCommon_ =  new Class({
    Extends: MWF.APP$Module_,
    _loadUserInterface: function(){
        if (this.json.innerHTML){
            var nodes = this.node.childNodes;
            for (var i=0; i<nodes.length; i++){
                if (nodes[i].nodeType===Node.ELEMENT_NODE){
                    if (!nodes[i].get("MWFtype")){
                        nodes[i].destroy();
                        i--;
                    }
                }else{
                    if (nodes[i].removeNode){
                        nodes[i].removeNode();
                    }else{
                        nodes[i].parentNode.removeChild(nodes[i]);
                    }
                    i--;
                    //nodes[i]
                }
            }
            this.node.appendHTML(this.json.innerHTML);

            // if (this.node.get("html") !== this.json.innerHTML){
            //this.node.appendHTML(this.json.innerHTML);
            // }
        }
        this.node.setProperties(this.json.properties);
    }
});

MWF.xApplication.process.Xform2.Image_ = MWF.APPImage_ =  new Class({
    Extends: MWF.APP$Module_,
    _loadUserInterface: function(){
        if (this.json.properties && this.json.properties["src"]){
            var value = this.json.properties["src"];
            if ((value.indexOf("x_processplatform_assemble_surface")!=-1 || value.indexOf("x_portal_assemble_surface")!=-1 || value.indexOf("x_cms_assemble_control")!=-1)){
                var host1 = MWF.Actions.getHost("x_processplatform_assemble_surface");
                var host2 = MWF.Actions.getHost("x_portal_assemble_surface");
                var host3 = MWF.Actions.getHost("x_cms_assemble_control");
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
                if (value.indexOf("/x_cms_assemble_control")!==-1){
                    value = value.replace("/x_cms_assemble_control", host3+"/x_cms_assemble_control");
                }else if (value.indexOf("x_cms_assemble_control")!==-1){
                    value = value.replace("x_cms_assemble_control", host3+"/x_cms_assemble_control");
                }
            }
            try{
                this.node.set("src", value);
            }catch(e){}
        }else if (this.json.srcfile && this.json.srcfile!="none"){
            value = this.json.srcfile;
            if (typeOf(value)==="object"){
                var url = (value.portal) ? MWF.xDesktop.getPortalFileUr(value.id, value.portal) : MWF.xDesktop.getProcessFileUr(value.id, value.application);
                this.node.set("src", url);
            }else{
                var host = MWF.Actions.getHost("x_portal_assemble_surface");
                var action = MWF.Actions.get("x_portal_assemble_surface");
                var uri = action.action.actions.readFile.uri;
                uri = uri.replace("{flag}", value);
                uri = uri.replace("{applicationFlag}", this.form.json.application);
                value = host+"/x_portal_assemble_surface"+uri;
                this.node.set("src", value);
            }
        }else if (typeOf(this.json.src)=="object"){
            var src = MWF.xDesktop.getImageSrc( this.json.src.imageId );
            this.node.set("src", src);
        }
    },
    reset: function(){
        this._loadUserInterface();
    }
});



MWF.xApplication.process.Xform2.Html_ = MWF.APPHtml_ =  new Class({
	Extends: MWF.APP$Module_,
	load: function(){
		this.node.insertAdjacentHTML("beforebegin", this.json.text);
		this.node.destroy();
	}
});

