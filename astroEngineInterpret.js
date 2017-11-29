var AstroEngineInterpret = function (parentQuery) {
    var baseID = '';
    var objectDOM = [];
    var DATA = [];
    objectDOM['_parent'] = document.querySelector(parentQuery);

    var _loadData = function (type, data) {
        DATA[type] = data;
    };
    var _createGenericTextBlock = function (cssClass, header) {
        var commonObject = [];
        commonObject['block'] = egtGeneric.createElementWithAttr('div', {
            'class': 'block hidden ' + cssClass
        });
        commonObject['block'].appendChild(commonObject['header'] = egtGeneric.createElementWithAttr('h4', {
            'class': 'header'
        }));
        commonObject['block'].appendChild(commonObject['body'] = egtGeneric.createElementWithAttr('p', {
            'class': 'details'
        }));
        commonObject['header'].textContent = header;
        return commonObject;
    };
    var _updateText = function (planet, category, header, content) {
        objectDOM[planet][category]['header'].innerHTML = header;
        objectDOM[planet][category]['body'].innerHTML = content;
    };
    var _updateDOM = function (data, callbackOptions) {
        if (data) {
            _updateText(callbackOptions['planet'], callbackOptions['type'], callbackOptions['header'], data);
            objectDOM[callbackOptions['planet']][callbackOptions['type']]['block'].classList.remove('hidden');
        } else {
            objectDOM[callbackOptions['planet']][callbackOptions['type']]['block'].classList.add('hidden');
        }
    };
    var _addAspect = function (planet, planet2, aspect) {

        objectDOM[planet][aspect + planet2] = _createGenericTextBlock('aspect' + aspect, aspect + ' with ' + planet2)
        objectDOM[planet]['children'].appendChild(objectDOM[planet][aspect + planet2]['block']);

        egtGeneric.getFileAndCall(egtGeneric.getCurrentDirectory() + "/data/aspects/" + aspect + '_' + planet + '_' + planet2 + ".txt", _updateDOM, {
            'planet': planet,
            'type': aspect + planet2,
            'header': DATA['render']['aspectData'][aspect]['label'] + ' with ' + planet2
        });
    };
    var _updateChart = function (data) {
        for (planet in data['Objects']) {
            if (DATA['render']['planetDescs'][planet]) {
                var sign = data['Objects'][planet]['sign']
                var house = Math.floor(data['Objects'][planet]['house']);
                egtGeneric.getFileAndCall(egtGeneric.getCurrentDirectory() + "/data/" + planet + "_" + sign + ".txt", this.updateDOM, {
                    'planet': planet,
                    'type': 'zodiac',
                    'header': sign
                });
                if (DATA['render']['planetDescs'][planet]['showHouse']) {
                    egtGeneric.getFileAndCall(egtGeneric.getCurrentDirectory() + "/data/" + planet + "_house" + house + ".txt", this.updateDOM, {
                        'planet': planet,
                        'type': 'house',
                        'header': 'House ' + egtGeneric.romanizeNumber(house)
                    });
                }
                if (DATA['render']['planetDescs'][planet]['showRetrograde']) {
                    if (data['Objects'][planet]['speed'] < 0) {
                        var retQuery;
                        if (DATA['render']['planetDescs'][planet]['retrogradeDepth'] == 'sign') {
                            retQuery = planet + '_' + data['Objects'][planet]['sign'] + "_Retrograde.txt";
                        } else {
                            retQuery = planet + "_Retrograde.txt";
                        }
                        egtGeneric.getFileAndCall(egtGeneric.getCurrentDirectory() + "/data/" + retQuery, this.updateDOM, {
                            'planet': planet,
                            'type': 'retrograde',
                            'header': 'Retrograde'
                        });
                        objectDOM[planet]['retrograde']['block'].classList.remove('hidden');
                    } else {
                        objectDOM[planet]['retrograde']['block'].classList.add('hidden');
                    }
                }
                for (planet2 in data['Aspects'][planet]) {
                    if (DATA['render']['planetDescs'][planet2]) {
                        var aspQueryType = data['Aspects'][planet][planet2]['type'];
                        if (DATA['render']['planetDescs'][planet]['aspectDepth'] == 'presence') {
                            aspQueryType = 'General'
                        }
                        if (DATA['render']['planetDescs'][planet2]['aspectDepth'] == 'presence') {
                            aspQueryType = 'General'
                        }
                        _addAspect(planet, planet2, aspQueryType);
                    }
                }
            }
        }
    };
    var _drawTable = function () {
        try {
            for (keyRender in DATA['render']['planetDescs']) {
                if (!DATA['render']['planetDescs'].hasOwnProperty(keyRender)) continue;
                var commonObject = [];

                objectDOM['_parent'].appendChild(commonObject['group'] = egtGeneric.createElementWithAttr('div', {
                    'id': baseID + keyRender,
                    'class': 'objectInterpretation'
                }));
                commonObject['group'].appendChild(commonObject['objectGroup'] = egtGeneric.createElementWithAttr('div', {
                    'class': 'headerContainer'
                }));
                commonObject['objectGroup'].appendChild(commonObject['objectHeader'] = egtGeneric.createElementWithAttr('h2', {
                    'class': 'mheader'
                }));
                commonObject['group'].appendChild(commonObject['children'] = egtGeneric.createElementWithAttr('div', {
                    'class': 'definitions'
                }));
                if (DATA['render']['planetDescs'][keyRender]['displayName']) {
                    commonObject['objectHeader'].innerHTML = DATA['render']['planetDescs'][keyRender]['displayName'];
                } else {
                    commonObject['objectHeader'].innerHTML = keyRender;
                }

                commonObject['zodiac'] = _createGenericTextBlock('planet', 'Zodiac');
                commonObject['children'].appendChild(commonObject['zodiac']['block']);

                if (DATA['render']['planetDescs'][keyRender]['showRetrograde']) {
                    commonObject['retrograde'] = _createGenericTextBlock('retrograde', 'Retrograde');
                    commonObject['children'].appendChild(commonObject['retrograde']['block']);
                }

                if (DATA['render']['planetDescs'][keyRender]['showHouse']) {
                    commonObject['house'] = _createGenericTextBlock('house', 'House');
                    commonObject['children'].appendChild(commonObject['house']['block']);
                }
                objectDOM[keyRender] = commonObject;
            }
        } catch (err) {
            console.log(key);
            console.log(err);
            console.log(objectDOM);
            console.log(DATA);
        }
    };

    this.addAspect = _addAspect;
    this.drawTable = _drawTable;
    this.loadData = _loadData;
    this.updateChart = _updateChart;
    this.updateDOM = _updateDOM
    this.updateText = _updateText;
    return this;
};