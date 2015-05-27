'use strict';

var rename = function (name) {
    return name.replace(/^[^_]+_(?:【[^】]+】)?([^_／]+)[^\d]+(\d+)_(.+)\.csv$/, '$2_$1様_$3.csv');
};

module.exports = rename;
