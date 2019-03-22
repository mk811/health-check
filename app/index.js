'use strict';

const express = require('express');
const app = express();
const log4js = require('log4js');
const bodyParser = require('body-parser');
const execSync = require('child_process').execSync;

// log
log4js.configure({
    appenders: {
        access: { type: 'stdout'  } //追加
    },
    categories: {
        default: { appenders: ['access'], level: 'info' } //追加
    }
});

const accessLogger = log4js.getLogger();
app.use(log4js.connectLogger(accessLogger));

//body-parser setting
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080; // port number

// Read routes folder as root for api
const router = require('./routes/v1/');
app.use('/api/v1/', router);

// Server Start
app.listen(port);
console.log("server stating on " + port + " ...")

// Document Root
app.get('/', function (req, res) {
    res.write('Hellow World, API test is sccessful');
    res.end();
});

// Docker Container ID
app.get('/docker', function (req, res) {
    // Stdout docker container id from inside
    const result = execSync(`cat /proc/self/cgroup | grep "docker" | sed s/\\\\//\\\\n/g | tail -1 | cut -c 1-20`);
    res.write('The container id receiving this get requiest is: ');
    res.write(result.toString())
    res.end();
});
