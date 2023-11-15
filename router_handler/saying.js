const db = require('../db/index')

exports.sayingList = (req, res) => {
    const pageNum = parseInt(req.query.pagenum)
    const pageSize = parseInt(req.query.pagesize)
    const serachWord = '%' + req.query.query + '%'
    // sql:获取总数
    const sql_total = `select w.id from saying w 
        where w.name like ?`
    // sql:查询数据
    const sql_select = `SELECT * FROM saying w
        where w.name like ?
        limit ${(pageNum - 1)  * pageSize}, ${pageSize} `
    db.query(sql_total, serachWord, (err, results) => {
        const total = results.length
        db.query(sql_select, serachWord, (err, results1) => {
            const data = {
                total: total,
                pagenum: pageNum,
                sayings: results1
            }
            res.aa("获取语录列表成功", 200, data)
        })
    })
} 

exports.addsaying = (req, res) => {
    const sayingInfo = req.body;
    const time = Math.round(new Date().getTime()/1000).toString();
    delete sayingInfo.tags;
    const sql = `insert into saying set ?`
    sayingInfo.create_time = time
    sayingInfo.update_time = time
    db.query(sql, sayingInfo, (err, results) => {
        if(err || results.affectedRows !== 1) return res.aa('添加语录报错', 500) 
        return res.aa('添加语录成功', 201)
    })   
}
/* 
  * 更新网站
*/
exports.updateSaying = (req, res) => {
    // 获取参数, 构建对象
    const id = req.body.id;
    const name = req.body.name;
    const author = req.body.author;
    const book = req.body.book;
    const article = req.body.article;
    const update_time =  Math.round(new Date().getTime()/1000).toString();
    const webObj = {name, author, book, article, update_time}
    // sql
    const sqlUpdateWeb = `update saying set ? where id = ?`
    db.query(sqlUpdateWeb, [webObj, id], async (err, results) => {
        if(err || results.affectedRows !== 1) return res.aa('修改saying报错', 500)
        return res.aa('更新语录成功', 201)
    })
}

exports.deleteSaying = (req, res) => {
    const id = req.params.id
    const sql = `delete from saying where id = ?`
    db.query(sql, id, (err, results) => {
        if(err || results.affectedRows !== 1) return res.aa('删除saying报错', 500)
        return res.aa('删除语录成功！', 200)
    })
}
/**
 * @description: 语录推荐
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.recommendSaying = (req, res) => {
    const sql = "SELECT * FROM saying s ORDER BY RAND() LIMIT 1;"
    db.query(sql, (err, results) => {
        const total = results.length
        const data = {
            total: total,
            saying: results
        }
        res.aa("获取推荐语录成功", 200, data)
    })
}
/**
 * @description: 语录分组
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.groupSaying = (req, res) => {
    // 数量大于1的分组
    const sqlNoOne = `select author, count(id) num  from saying s
    group by author
    having count(id) > 1`
    // 全部分组
    const sql = `select author, count(id) num  from saying s
    group by author`
    
    db.query(sql, (err, results) => {
        const data = {
            group: results
        }
        res.aa("获取语录分组成功", 200, data)
    })
} 