const {SuccessModel, ErrorModel} = require('../model/resModel');
const {login} = require('../controller/user');
const { set } = require('../db/redis');

const handleRouter = (req, res) => {
    const {method, path} = req;

    const router = {
        POST: {
            '/api/user/login': (req) => {
                let {username, password} = req.body;
                return login(username, password).then(result => {
                    if (result.username) {
                        req.session.username = result.username;
                        req.session.realname = result.realname;
                        // 同步到 redis
                        set(req.sessionId, req.session);
                        return new SuccessModel();
                    }
                    return new ErrorModel('login false');
                });
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