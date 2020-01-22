const express = require('express');
const {getList, getDetail, createBlog, updateBlog, delBlog} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');
const router = express.Router();

router.get('/list', (req, res, next) => {
    let {author = '', keyword = ''} = req.query;
    if (req.query.isadmin) {
        if (req.session.username === null) {
            res.json(new ErrorModel('not login'));
            return;
        }
        author = req.session.username
    }
    getList(author, keyword).then(data => {
        res.json(new SuccessModel(data));
    });
});

router.get('/detail', (req, res, next) => {
    getDetail(req.query.id).then(data => {
        res.json(new SuccessModel(data));
    });
});

router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username;
    createBlog(req.body).then(data => {
        res.json(new SuccessModel(data));
    });
});

router.post('/update', loginCheck, (req, res, next) => {
    req.body.author = req.session.username;
    updateBlog(req.query.id, req.body).then(result => {
        if (result) {
            res.json(new SuccessModel());
            return;
        }
        res.json(new ErrorModel('update blog false'));
    });
});

router.post('/del', loginCheck, (req, res, next) => {
    req.body.author = req.session.username;
    delBlog(req.query.id, req.session.username).then(result => {
        if (result) {
            res.json(new SuccessModel());
            return;
        }
        res.json(new ErrorModel('delete blog false'));
    });
});

module.exports = router;
