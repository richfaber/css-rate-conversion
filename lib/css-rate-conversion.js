'use strict';

const css = require('css'),
    path = require('path'),
    extend = require('util-extend'),
    cssResponse = require('./io.css.response'),
    compileSass = require('./compile.sass'),
    BASE_PATH = path.resolve('./'),
    DEVICE_MODEL = require('./deviceInformation.json').model,
    errerHandler = require('./error.handler');

var defaults,
    cache = {
        originalwords: null,
        finalywords: null
    };

function changeUnits(parseStyles) {

    function calculate(match, p1, p2, p3, offset, string) {
        return (parseInt(match,10) * defaults.ratio).toFixed(2) + defaults.unit;
    }

    function unitIterate(declarations, keys, idx) { // TODO: Check Point, 재귀호출이.. 더 성능이 떨어지지 않나?

        var declarations = declarations,
            keys = keys,
            idx = idx,
            currentObject,
            regex = new RegExp("\\d+"+defaults.unit, 'g');

        if(keys.length == idx) return;

        currentObject = declarations[keys[idx]];
        currentObject.value = currentObject.value.replace(regex, calculate);

        unitIterate(declarations, keys, ++idx);
    }

    for(let idx in parseStyles.stylesheet.rules) {
        let Element = parseStyles.stylesheet.rules[idx];

        unitIterate( Element.declarations, Object.keys(Element.declarations), 0 );
    }

    return parseStyles;
}


function conversion(files, options) {

    var pathResolve = path.resolve( BASE_PATH + '/' + files[0] ),
        cssresponse,
        words;

    defaults = {
        filePattern : pathResolve || ['./styles.css'],
        pathParse : path.parse( pathResolve ),
        charset : options.charset,
        unit : options.unit,
        model : options.model
    };

    defaults.ratio = (DEVICE_MODEL[defaults.model[0]]['device_width'] / options.baseSize).toFixed(2);

    cssresponse = cssResponse(defaults);
    cssresponse
        .read(defaults.filePattern)
        .then(function(res) { // 파일 읽기가 성공하면, 단위를 변경하고.

            cache.originalwords = res.words;
            cache.finalywords = changeUnits( css.parse(cache.originalwords, {}) );

            return cssresponse.tmpwrite();

        })
        .then(function(res) {

            var folder = res.folder,
                filename = files[0];

            return cssresponse.write(res.folder, filename, css.stringify( cache.finalywords ));

        })
        .then(function(res) { // 사스 컴파일을 하고, 저장한 다음. 임시 사스 파일은 삭제.
            var folder = res.folder,
                filename = res.filename;

            return compileSass(folder, filename);
        })
        .then(function(res) {


        })
        .catch(function(error) {
            //errerHandler.log(error, __filename, 10);
        });

    // 읽어와서, 복사본을 제작 한 후에, 컴파일 하고, css만 옮긴 후, 복사본을 지움.

}

module.exports = conversion;
