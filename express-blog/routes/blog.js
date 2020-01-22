const express = require('express');
const {getList, getDetail, createBlog, updateBlog, delBlog} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');

const router = express.Router();
// 统一的登录验证函数
// const loginCheck = (req) => {
//     if (!req.session.username) {
//         return Promise.resolve(
//             new ErrorModel('尚未登录')
//         )
//     }
// };

/* GET home page. */
router.get('/list', function(req, res, next) {
    let {author = '', keyword = ''} = req.query;
    // if (req.query.isadmin) {
    //     const loginCheckResult = loginCheck(req);
    //     if (loginCheckResult) {
    //         return loginCheckResult;
    //     }
    //     author = req.session.username
    // }
    return getList(author, keyword).then(data => {
        res.json(new SuccessModel(data));
    });
});

module.exports = router;
