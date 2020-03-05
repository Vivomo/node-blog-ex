const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV;

let content = fs.readFileSync(path.join(__dirname, '../../db.json'), 'utf-8');
let dbCfg = JSON.parse(content);
// 配置
let cfg = dbCfg[env] || dbCfg.dev;

module.exports = cfg;