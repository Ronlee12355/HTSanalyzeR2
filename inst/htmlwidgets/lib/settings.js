addCustomBtns = function(panel) {
    var dropdown = panel.find('div .dropdown');
    var menu = dropdown.find('.dropdown-menu');

    var createButton = function(icon, tooltip) {
        var control = $('<a data-func="customBtn" id="customBtn' + tooltip + '" ></a>');
        control.append('<i class="panel-control-icon ' + icon + '"></i>');
        control.append('<span class="control-title">' + tooltip + '</span>');
        control.attr('data-tooltip', tooltip);
        control.on('mousedown', function(ev) {
            ev.stopPropagation();
        });
        control.on('click', function(ev) {
            ev.stopPropagation();
            // func();
        });

        return $('<li></li>').append(control);
    }

    menu.prepend(createButton("glyphicon glyphicon-pause", "Pause"));
    menu.prepend(createButton("glyphicon glyphicon-refresh", "Refresh"));
    menu.prepend(createButton("glyphicon glyphicon-floppy-disk", "Save"));
}

renderPalette = function(canvas, domain, range) {
    // width should be 100, height should be 1
    var width = 100;
    var context = canvas.getContext("2d");
    var image = context.createImageData(width, 1);

    var interpolate = function (factor) {
        return _interpolateColor(h2r(range[0]), h2r(range[1]), factor);
    }

    for (var i = 0, j = -1, c; i < width; ++i) {
        c = interpolate(i / width);
        image.data[++j] = c[0];
        image.data[++j] = c[1];
        image.data[++j] = c[2];
        image.data[++j] = 255;
    }
    context.putImageData(image, 0, 0);
}

refreshValues = function(panel, config) {
    // Layout
    $("#layoutLinLogMode", panel).prop("checked", config.layout.linLogMode);
    $("#layoutStrongGravityMode", panel).prop("checked", config.layout.strongGravityMode);
    $("#layoutOutboundAttractionDistribution", panel).prop("checked", config.layout.outboundAttractionDistribution);
    $("#layoutAdjustSizes", panel).prop("checked", config.layout.adjustSizes);
    $("#layoutBarnesHutOptimize", panel).prop("checked", config.layout.barnesHutOptimize);

    $('#layoutGravity', panel).slider().slider('setValue', config.layout.gravity);
    $('#layoutBarnesHutTheta', panel).slider().slider('setValue', config.layout.barnesHutTheta);
    $('#layoutEdgeWeightInfluence', panel).slider().slider('setValue', config.layout.edgeWeightInfluence);
    $('#layoutSlowDown', panel).slider().slider('setValue', config.layout.slowDown);

    // Label
    var labelOptions = $("#labelOption", panel);
    labelOptions.find("label").removeClass("active");
    // labelOptions.find("label[value='"+ curState.label +"']").addClass("active");
    $("#labelColor", panel)[0].jscolor.fromString(config.label.color);
    $('#labelOpacity', panel).slider().slider('setValue', config.label.opacity);
    $('#labelScale', panel).slider().slider('setValue', config.label.scale);

    // Node
    $('#nodeScale', panel).slider().slider('setValue', config.node.scale);
    $('#nodeOpacity', panel).slider().slider('setValue', config.node.opacity);
    $("#nodeBorderColor", panel)[0].jscolor.fromString(config.node.borderColor);
    $('#nodeBorderOpacity', panel).slider().slider('setValue', config.node.borderOpacity);
    $('#nodeBorderWidth', panel).slider().slider('setValue', config.node.borderWidth);
    
    // Edge
    $("#edgeColor", panel)[0].jscolor.fromString(config.edge.color);
    $('#edgeOpacity', panel).slider().slider('setValue', config.edge.opacity);
    $('#edgeScale', panel).slider().slider('setValue', config.edge.scale);

    // ColorScheme
    var ids = ["Pos", "Neg"];
    for(var i in ids) {
        var schemeId = ids[i];
        var palette = config.scheme.dual[schemeId];
        $("#nodeSchemes #dual" + schemeId + " #value1", panel).val(palette.domain[0]);
        $("#nodeSchemes #dual" + schemeId + " #value2", panel).val(palette.domain[1]);
        $("#nodeSchemes #dual" + schemeId + " #color1", panel)[0].jscolor.fromString(palette.range[0]);
        $("#nodeSchemes #dual" + schemeId + " #color2", panel)[0].jscolor.fromString(palette.range[1]);
    }
}

refreshListeners = function(panel, config) {
    var decorator = function(funcName) {
        return function(obj) {
            config.controllers[funcName](obj.value);
        }
    }

    // Layout
    $("#layoutLinLogMode", panel).change(function() {
        config.controllers['linLogMode'](this.checked);
    });
    $("#layoutStrongGravityMode", panel).change(function() {
        config.controllers['strongGravityMode'](this.checked);
    });
    $("#layoutOutboundAttractionDistribution", panel).change(function() {
        config.controllers['outboundAttractionDistribution'](this.checked);
    });
    $("#layoutAdjustSizes", panel).change(function() {
        config.controllers['adjustSizes'](this.checked);
    });
    $("#layoutBarnesHutOptimize", panel).change(function() {
        config.controllers['barnesHutOptimize'](this.checked);
    });
    $('#layoutGravity', panel).slider().on('slide', decorator('gravity'));
    $('#layoutBarnesHutTheta', panel).slider().on('slide', decorator('barnesHutTheta'));
    $('#layoutEdgeWeightInfluence', panel).slider().on('slide', decorator('edgeWeightInfluence'));
    $('#layoutSlowDown', panel).slider().on('slide', decorator('slowDown'));


    //Label
    $("#labelOption :input", panel).change(function() { config.controllers['labelOption'](this.value) });
    $("#labelColor", panel).change(function() { config.controllers['labelColor']("#" + this.value) });
    $('#labelOpacity', panel).slider().on('slide', decorator('labelOpacity'));
    $('#labelScale', panel).slider().on('slide', decorator('labelScale'));

    // Node
    $('#nodeScale', panel).slider().on('slide', decorator('nodeScale'));
    $('#nodeOpacity', panel).slider().on('slide', decorator('nodeOpacity'));
    $("#nodeBorderColor", panel).change(function() { config.controllers['nodeBorderColor']("#" + this.value) });
    $('#nodeBorderOpacity', panel).slider().on('slide', decorator('nodeBorderOpacity'));
    $('#nodeBorderWidth', panel).slider().on('slide', decorator('nodeBorderWidth'));

    // Edge
    $("#edgeColor", panel).change(function() { config.controllers.edgeColor('#' + this.value) });
    $('#edgeOpacity', panel).slider().on('slide', decorator('edgeOpacity'));
    $('#edgeScale', panel).slider().on('slide', decorator('edgeScale'));

    // Scheme
    var fetchSchemeValues = function(schemeId) {
        var val1 = parseFloat($("#nodeSchemes #" + schemeId + " #value1", panel).val());
        var val2 = parseFloat($("#nodeSchemes #" + schemeId + " #value2", panel).val());
        var color1 = "#" + $("#nodeSchemes #" + schemeId + " #color1", panel).val();
        var color2 = "#" + $("#nodeSchemes #" + schemeId + " #color2", panel).val();
        return {domain: [val1, val2], range: [color1, color2]};
    }

    var uniTextColors = function(schemeId) {
        var txtColor1 = $("#nodeSchemes #" + schemeId + " #color1", panel).css("color");
        var txtColor2 = $("#nodeSchemes #" + schemeId + " #color2", panel).css("color");
        $("#nodeSchemes #" + schemeId + " #value1", panel).css("color", txtColor1);
        $("#nodeSchemes #" + schemeId + " #value2", panel).css("color", txtColor2);
    }

    var renderFunc = function(schemeId) {
        return function() {
            var values = fetchSchemeValues(schemeId);
            var canvas = $("#nodeSchemes #" + schemeId + " #palette", panel)[0];
            renderPalette(canvas, values.domain, values.range);
            uniTextColors(schemeId);
            config.controllers.scheme(schemeId, values.domain, values.range);
        }
    }

    var ids = ["dualPos", "dualNeg"];
    for(var i in ids) {
        var schemeId = ids[i];
        var values = fetchSchemeValues(schemeId);
        var canvas = $("#nodeSchemes #" + schemeId + " #palette", panel)[0];
        renderPalette(canvas, values.domain, values.range);
        uniTextColors(schemeId);
        $("#nodeSchemes #" + schemeId+ " input", panel).change(renderFunc(schemeId));
    }

    // CustomButtons
    $("#customBtnPause", panel).on('click', function(ev) { 
        ev.stopPropagation(); 
        config.controllers.pause(); 
    });
    $("#customBtnRefresh", panel).on('click', function(ev) { 
        ev.stopPropagation(); 
        config.controllers.refresh(); 
    });
    $("#customBtnSave", panel).on('click', function(ev) { 
        ev.stopPropagation(); 
        config.controllers.saveSVG(); 
    });
}

appendPanelId = function(panel, panelId) {
    $("#accordion", panel).attr("id", "accordion" + panelId);

    $("[data-toggle='collapse']", panel).each(function() {
        $(this).attr("href", $(this).attr("href") + panelId);
        $(this).attr("data-parent", $(this).attr("data-parent") + panelId);
    });

    $(".panel-collapse", panel).each(function() {
        $(this).attr("id", $(this).attr("id") + panelId);
    });
}

initPanel = function(panel, title) {
    if("undefined" != typeof title) {
        $("#settingPanelTitle", panel).text("Settings (" + title + ")");
    }

    panel.lobiPanel({
        state: "collapsed",
        minWidth: 400,
        maxWidth: 600,
        minHeight: 600,
        maxHeight: 800,

        reload: false,
        close: false,
        editTitle: false,
        expand: false,
        unpin: false,
        minimize: {
            tooltip: "Settings"
        },
    })

    var instance = panel.data('lobiPanel');
    instance.$el.attr("old-style", "left: 200px; top: 80px; z-index: 10001; position: fixed; width: 750px; right: auto; bottom: auto; height: 730px; user-select: initial;");

    instance.disableTooltips();
    instance.toggleMinimize = function() {
        if (instance.isMinimized()) {
            instance.maximize();
            instance.unpin();
        } else {
            instance.pin();
            instance.minimize();
        }
        return instance;
    };

    addCustomBtns(panel);
    panel.removeClass("hidden");
}

configureSettingPanel = function(state, config) {
    var panelId = state.elId;
    var elParent = $('#' + panelId).parent();
    var title = elParent.parents(".tab-pane").data("value");
    var panel = elParent.children(":first");
    var innerId = elParent.data("lobipanel-child-inner-id");
    if("undefined" != typeof innerId) {
        panel = $("[data-inner-id='" + innerId + "']")
    }

    var lobiInited = panel.hasClass('lobipanel') && "undefined" != typeof panel.data('inner-id');
    if(!lobiInited) {
        appendPanelId(panel, panelId);
        initPanel(panel, title);
    }

    refreshValues(panel, config);
    refreshListeners(panel, config);
}
