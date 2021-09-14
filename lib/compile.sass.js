'use strict';

var compileSass = function(folder, filename) {
    var deferred = new Promise(function(resolve, reject) {

        resolve();
    });

    return deferred;
};

compileSass.compiler = require('node-sass');

module.exports = compileSass;