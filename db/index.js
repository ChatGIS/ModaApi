/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2022-12-04 19:57:16
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-11 23:04:25
 * @FilePath: \ModaApi\db\index.js
 * @Description: 
 */
// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root123',
  database: 'moda',
})

// 向外共享 db 数据库连接对象
module.exports = db