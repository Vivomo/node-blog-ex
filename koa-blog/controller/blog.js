const { exec, escape } = require('../db/mysql');
const xss = require('xss');

const getList = async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        author = escape(author);
        sql += `and author=${author} `;
    }
    if (keyword) {
        keyword = escape(keyword);
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc;`;

    return await exec(sql)
};

const getDetail = async (id) => {
    id = escape(id);
    const sql = `select * from blogs where id=${id}`;
    return (await exec(sql))[0];
};

const createBlog = async (data = {}) => {
    let {title, content, author} = data;
    title = xss(escape(title));
    content = xss(escape(content));
    author = escape(author);
    const createTime = Date.now();

    const sql = `
        insert into blogs (title, content, createtime, author)
        values (${title}, ${content}, ${createTime}, ${author});
    `;

    const insertData = await exec(sql);
    return {
        id: insertData.insertId
    }
};

const updateBlog = async (id, data = {}) => {
    let {title, content} = data;
    id = escape(id);
    title = xss(escape(title));
    content = xss(escape(content));
    const sql = `
        update blogs set title=${title}, content=${content} where id=${id}
    `;
    return (await exec(sql)).affectedRows > 0;
};

const delBlog = async (id, author) => {
    id = escape(id);
    const sql = `delete from blogs where id=${id} and author='${author}';`;
    return (await exec(sql)).affectedRows > 0;
};

module.exports = {
    getList,
    getDetail,
    createBlog,
    updateBlog,
    delBlog
};