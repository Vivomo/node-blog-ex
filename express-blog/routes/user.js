const express = require('express');
const router = express.Router();

const {login} = require('../controller/user');
const {SuccessModel, ErrorModel} = require('../model/resModel');

router.post('/login', function(req, res) {
    let {username, password} = req.body;
    login(username, password).then(result => {
        if (result.username) {
            req.session.username = result.username;
            req.session.realname = result.realname;

            res.json(new SuccessModel());
            return;
        }
        res.json(new ErrorModel('login false'));
    });
});

module.exports = router;