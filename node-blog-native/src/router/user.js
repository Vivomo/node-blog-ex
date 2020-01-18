const handleRouter = (req, res) => {
    const {method, path} = req;

    const router = {
        POST: {
            '/api/user/login': () => 'login',
        }
    };

    let msg;
    try {
        msg = router[method][path]();
    } catch (e) {
        return;
    }
    return {
        msg
    };
};

module.exports = handleRouter;