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

/* 
  * 网站推荐
*/
exports.recommendsayings = (req, res) => {
    let num = parseInt(req.query.num)
    num = num - 12
    const subSql = " SELECT w.*, lc.num_click, tags.tags_name FROM saying w LEFT JOIN log_click lc ON w.id = lc.saying_id LEFT JOIN (SELECT rwt.webid, GROUP_CONCAT(st.name) tags_name, GROUP_CONCAT(st.id) tags_id FROM rel_web_tag rwt LEFT JOIN sys_tag st ON rwt.tagid = st.id GROUP BY rwt.webid) tags ON w.id = tags.webid "
    const sql = 
        "SELECT myTable.* FROM ("
        + " ( " + subSql + " ORDER BY lc.num_click DESC LIMIT 4)"
        + " UNION (" + subSql + " ORDER BY lc.num_click ASC LIMIT 4)"
        + " UNION (" + subSql + " ORDER BY w.create_time DESC LIMIT 4)"
        + " UNION (" + subSql + " WHERE w.id >= (RAND()*(SELECT MAX(id) FROM saying)) LIMIT ?)"
        + " ) AS myTable "
        + " ORDER BY RAND()"
        // + " LIMIT ?"
    console.log(sql)
    
    db.query(sql, num, (err, results) => {
        const total = results.length
        const data = {
            total: total,
            num: num,
            sayings: results
        }
        res.aa("获取推荐网站成功", 200, data)
    })
} 