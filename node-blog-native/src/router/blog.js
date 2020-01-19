const {getList, getDetail, createBlog, updateBlog, delBlog} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');

const handleRouter = (req, res) => {
    let {method, path, query} = req;
    let {id} = query;
    const router = {
        GET: {
            '/api/blog/list': () => {
                let {author = '', keyword = ''} = req.query;
                return getList(author, keyword).then(data => new SuccessModel(data));
            },
            '/api/blog/detail': () => {
                return getDetail(id).then(data => new SuccessModel(data));
            },
        },
        POST: {
            '/api/blog/new': () => {
                req.body.author = 'V';
                return createBlog(req.body).then(data => new SuccessModel(data));
            },
            '/api/blog/update': () => {
                return updateBlog(id, req.body).then(result => {
                    if (result) {
                        return new SuccessModel();
                    }
                    return new ErrorModel('update blog false');
                });
            },
            '/api/blog/del': () => {
                return delBlog(id).then(result => {
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