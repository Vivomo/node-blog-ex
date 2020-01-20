const {getList, getDetail, createBlog, updateBlog, delBlog} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
};

const handleRouter = (req, res) => {
    let {method, path, query} = req;
    let {id} = query;
    const router = {
        GET: {
            '/api/blog/list': () => {
                let {author = '', keyword = ''} = req.query;
                if (req.query.isadmin) {
                    console.log(req.session);
                    const loginCheckResult = loginCheck(req);
                    if (loginCheckResult) {
                        return loginCheckResult;
                    }
                    author = req.session.username
                }
                return getList(author, keyword).then(data => new SuccessModel(data));
            },
            '/api/blog/detail': () => {
                return getDetail(id).then(data => new SuccessModel(data));
            },
        },
        POST: {
            '/api/blog/new': () => {
                const loginCheckResult = loginCheck(req);
                if (loginCheckResult) {
                    return loginCheckResult;
                }

                req.body.author = req.session.username;
                return createBlog(req.body).then(data => new SuccessModel(data));
            },
            '/api/blog/update': () => {
                const loginCheckResult = loginCheck(req);
                if (loginCheckResult) {
                    return loginCheckResult;
                }

                return updateBlog(id, req.body).then(result => {
                    if (result) {
                        return new SuccessModel();
                    }
                    return new ErrorModel('update blog false');
                });
            },
            '/api/blog/del': () => {
                const loginCheckResult = loginCheck(req);
                if (loginCheckResult) {
                    return loginCheckResult;
                }

                return delBlog(id, req.session.username).then(result => {
                    if (result) {
                        return new SuccessModel();
                    }
                    return new ErrorModel('delete blog false');
                });
            },
        }
    };

    let data;
    try {
        data = router[method][path]();
    } catch (e) {

    }
    return data;
};

module.exports = handleRouter;