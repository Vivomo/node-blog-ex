const env = process.env.NODE_ENV;  // 环境参数
const fs = require('fs');

let content = fs.readFileSync('../../../db.json', 'utf-8');
let dbCfg = JSON.parse(content);
// 配置
let cfg = dbCfg[env] || dbCfg.dev;

module.exports = cfg;
