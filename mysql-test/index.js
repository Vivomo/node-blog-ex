const mysql = require('mysql');

// 创建链接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    port: '3306',
    database: 'blog'
});

// 开始连接
con.connect();

// 执行 sql 语句
// const sql = `insert into blogs (title, content, createtime, author) values ('标题C', '内容C',${Date.now()}, 'zhangsan')`
const sql = 'select * from users';
con.query(sql, (err, result) => {
    if (err) {
        console.error('err', err);
        return
    }
    console.log(result)
});

// 关闭连接
con.end();