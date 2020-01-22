const {ErrorModel} = require('../model/resModel');

const loginCheck = (req, res, next) => {
    if (req.session.username) {
        next();
        return;
    }
    res.json(new ErrorModel('not login'));
};

module.exports = loginCheck;