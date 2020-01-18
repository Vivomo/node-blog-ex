const getList = (author, keyword) => {
    return [
        {
            id: 1,
            title: 'title1',
            content: 'content1',
            author: 'A',
            createTime: 1579372445150
        },
        {
            id: 2,
            title: 'title2',
            content: 'content2',
            author: 'B',
            createTime: 1579372465716
        },
    ]
};

module.exports = {
    getList
};