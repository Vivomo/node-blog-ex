const express = require('express');
const router = express.Router();

/* GET home page. */
router.post('/login', function(req, res, next) {
    let {username, password} = req.body;
    res.json({
        code: 200,
        data: {username, password}
    })
});

module.exports = router;