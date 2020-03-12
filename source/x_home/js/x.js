/**
 * Created by TOMMY on 2020/02/03.
 */
layout = (window["layout"]) ? window["layout"] : {};
var locate = window.location;
layout.protocol = locate.protocol;
layout.session = layout.session || {};
layout["debugger"] = o2.session.isDebugger;

o2.addReady(function(){
    o2.loadLP(o2.language);
    o2.load("../o2_lib/mootools/plugin/mBox-all.js");
    o2.require("o2.widget.Common", function(){
        o2.xDesktop = o2.xDesktop || {};
        o2.xDesktop.requireApp = function(module, clazz, callback, async){
            o2.requireApp(module, clazz, callback, async)
        };
        o2.xApplication = o2.xApplication || {};

        o2.require([
            "o2.xDesktop.UserData",
            "o2.xDesktop.Common",
            "o2.xDesktop.Actions.RestActions",
            "o2.xAction.RestActions",
            "o2.xDesktop.Authentication",
            "o2.xDesktop.Homepage",
            "o2.widget.UUID",
            ["Common", ""]
        ], function(){
            o2.JSON.get("/x_desktop/res/config/config.json", function(config){
                layout.config = config;

                if (layout.config.app_protocol==="auto"){
                    layout.config.app_protocol = window.location.protocol;
                }
                layout.config.systemName = layout.config.systemName || layout.config.footer;
                layout.config.systemTitle = layout.config.systemTitle || layout.config.title;
                document.title = layout.config.title || layout.config.systemTitle || layout.config.footer || layout.config.systemName;

                //$("browser_loading").fade("out");
                //o2.require("o2.xDesktop.Homepage", function(){
                var loadingNode = $("browser_loading");
                    layout.desktop = new MWF.xDesktop.Homepage("layout", {
                        "onLoad": function(){
                            debugger;
                            if (loadingNode){
                                new Fx.Tween(loadingNode).start("opacity", 0).chain(function(){
                                    loadingNode.destroy();
                                    loadingNode = null;
                                });
                            }
                        },
                        "onLogin": function(){
                            if (loadingNode){
                                new Fx.Tween(loadingNode).start("opacity", 0).chain(function(){
                                    loadingNode.destroy();
                                });
                            }
                        }
                    });
                //});

            });
        });
    });




    // o2.load(["../o2_lib/mootools/plugin/mBox-all.min.js"], function(){
    //
    // });




    return false;

    // $("browser_loading_area_text").set("text", o2.LP.desktop.loadding);
    // $("browser_error_area_text").set("text", o2.LP.desktop.lowBrowser);
    // $("browser_error_area_up_text").set("text", o2.LP.desktop.upgradeBrowser);

    var loadingNode = $("browser_loadding");
    var errorNode = $("browser_error");

    if (Browser.name==="ie" && Browser.version<9){
        if (loadingNode) loadingNode.setStyle("display", "none");
        if (errorNode) errorNode.setStyle("display", "block");
        return false;
    }else{
        if (Browser.name==="ie" && Browser.version<10){
            layout["debugger"] = true;
            o2.session.isDebugger = true;
        }
    }
    if (errorNode) errorNode.destroy();
    errorNode = null;

    //COMMON.setContentPath("/x_desktop");
    //COMMON.AjaxModule.load("ie_adapter", function(){

    //});
});


