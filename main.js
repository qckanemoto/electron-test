'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require('fs-extra');
var rename = require(__dirname + '/rename.js');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function() {

    mainWindow = new BrowserWindow({ width: 400, height: 180 });
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    ipc.on('form-sent', function (event, dir) {
        // prepare "renamed" directory.
        if (!fs.existsSync(dir + '/renamed')) {
            fs.mkdirSync(dir + '/renamed');
        }

        // directories and dotfiles will be skipped.
        var oldNames = fs.readdirSync(dir).filter(function (elem) {
            return (fs.statSync(dir + '/' + elem).isFile() && !elem.match(/^\./));
        });

        // copy files.
        oldNames.forEach(function (oldName) {
            var newName = rename(oldName);
            fs.copySync(dir + '/' + oldName, dir + '/renamed/' + newName);
        });

        mainWindow.webContents.send('rename-finished', 'ping');
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
