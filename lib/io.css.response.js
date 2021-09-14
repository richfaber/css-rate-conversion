'use strict';

const fs = require('fs'),
    extend = require('util-extend'),
    errerHandler = require('./error.handler');

var defaults = {
    filePattern : 'styles.css',
    pathParse : { dir : '.' },
    charset : 'UTF-8',
    unit : 'px',
    model : 0.5,
    tmpDir : [],
    tempfolderName : 'temp'
};

function tmpwrite() {

    var deferred = new Promise(function(resolve, reject) {

        fs.mkdtemp(defaults.pathParse.dir + '/' + defaults.tempfolderName, function (err, folder) {

            if (err) reject(err, __filename, err.stack);
            else {
                defaults.tmpDir.push(folder);
                resolve({folder: folder});
                console.info('The empty folder was created! : ' + folder);
            }
        });
    });

    return deferred;
}

function write(folder, filename, words) {

    var deferred = new Promise(function(resolve, reject) {

        fs.writeFile(folder + '/' + filename, words, function (err) {

            if (err) reject(err, __filename, err.stack);
            else {
                resolve({folder: folder, filename: filename});
                console.info('The file is saved! : ' + filename);
            }
        });
    });

    return deferred;
}

function read(filepath) {

    var deferred = new Promise(function (resolve, reject) {

        fs.readFile(filepath, defaults.charset, function (err, res) {

            if (err) {
                errerHandler.log(err, __filename, 10);
                reject( false );
            } else resolve( {words:res} );
        });
    });

    return deferred;
}

function save() { // 읽고, 쓰기까지 한큐에...

}

function cssResponse(options) {

    defaults = extend(defaults, options);

    return {
        tmpwrite : tmpwrite,
        write : write,
        read : read,
        save : save
    }
}

module.exports = cssResponse;