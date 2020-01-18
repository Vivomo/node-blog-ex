const {getList, getDetail} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');

const handleRouter = (req, res) => {
    const {method, path} = req;

    const router = {
        GET: {
            '/api/blog/list': (req, res) => {
                let {author = '', keyword = ''} = req.query;
                return new SuccessModel(getList(author, keyword));
            },
            '/api/blog/detail': (req, res) => {
                let {id} = req.query;
                return new SuccessModel(getDetail(id));
            },
        },
        POST: {
            '/api/blog/new': () => 'new',
            '/api/blog/update': () => 'update',
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