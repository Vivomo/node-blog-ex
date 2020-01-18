const handleRouter = (req, res) => {
    const {method, url} = req;
    const path = url.split('?')[0];

    const router = {
        GET: {
            '/api/blog/list': () => 'list',
            '/api/blog/detail': () => 'detail',
        },
        POST: {
            '/api/blog/new': () => 'new',
            '/api/blog/update': () => 'update',
            '/api/blog/del': () => 'del',
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