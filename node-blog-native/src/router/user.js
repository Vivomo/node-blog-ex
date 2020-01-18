const {SuccessModel, ErrorModel} = require('../model/resModel');
const {login} = require('../controller/user');

const handleRouter = (req, res) => {
    const {method, path} = req;

    const router = {
        POST: {
            '/api/user/login': (req) => {
                let {username, password} = req.body;
                let result = login(username, password);
                if (result) {
                    return new SuccessModel();
                }
                return new ErrorModel('login false');
            },
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