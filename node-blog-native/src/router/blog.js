const {getList, getDetail, createBlog, updateBlog} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');

const handleRouter = (req, res) => {
    let {method, path, query} = req;
    let {id} = query;
    const router = {
        GET: {
            '/api/blog/list': (req, res) => {
                let {author = '', keyword = ''} = req.query;
                return new SuccessModel(getList(author, keyword));
            },
            '/api/blog/detail': (req, res) => {
                return new SuccessModel(getDetail(id));
            },
        },
        POST: {
            '/api/blog/new': (req) => {
                return new SuccessModel(createBlog(req.body));
            },
            '/api/blog/update': (req) => {
                let result = updateBlog(id, req.body);
                if (result) {
                    return new SuccessModel();
                }
                return new ErrorModel('update blog false');

            },
            '/api/blog/del': () => 'del',
        }
    };

    let data;
    try {
        data = router[method][path](req, res);
    } catch (e) {

    }
    return data;
};

module.exports = handleRouter;