'use strict';

const rateConversion = require('./lib/css-rate-conversion');

var options = {
    baseSize:1080,
    model : ['Galaxy-S3'],
    unit : 'px',
    charset : 'UTF-8'
};

rateConversion(['styles.scss'], options);

