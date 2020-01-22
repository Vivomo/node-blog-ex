const { exec, escape } = require('../db/mysql');
const xss = require('xss');

const getList = (author, keyword) => {
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

    return exec(sql)
};

const getDetail = (id) => {
    id = escape(id);
    const sql = `select * from blogs where id=${id}`;
    return exec(sql).then(rows => {
        return rows[0]
    });
};

const createBlog = (data = {}) => {
    let {title, content, author} = data;
    title = xss(escape(title));
    content = xss(escape(content));
    author = escape(author);
    const createTime = Date.now();

    const sql = `
        insert into blogs (title, content, createtime, author)
        values (${title}, ${content}, ${createTime}, ${author});
    `;
    console.log('sql', sql);

    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    });
};

const updateBlog = (id, data = {}) => {
    let {title, content} = data;
    id = escape(id);
    title = xss(escape(title));
    content = xss(escape(content));
    const sql = `
        update blogs set title=${title}, content=${content} where id=${id}
    `;
    return exec(sql).then(updateData => updateData.affectedRows > 0);
};

const delBlog = (id, author) => {
    id = escape(id);
    const sql = `delete from blogs where id=${id} and author='${author}';`;
    return exec(sql).then(delData => delData.affectedRows > 0)
};

module.exports = {
    getList,
    getDetail,
    createBlog,
    updateBlog,
    delBlog
};