const {getList} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');

const handleRouter = (req, res) => {
    const {method, path} = req;

    const router = {
        GET: {
            '/api/blog/list': (req, res) => {
                let {author = '', keyword = ''} = req.query;
                let list = getList(author, keyword);
                return new SuccessModel(list);
            },
            '/api/blog/detail': () => 'detail',
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