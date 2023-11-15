/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-11-14 11:02:07
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-11-14 16:09:14
 * @FilePath: \ModaApi\router\saying.js
 * @Description: 
 */
/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-11-14 11:02:07
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-11-14 15:12:15
 * @FilePath: \ModaApi\router\saying.js
 * @Description: 
 */
const express = require('express')
const router = express.Router()

const sayingHandler = require('../router_handler/saying')

router.get('/saying', sayingHandler.sayingList)
router.post('/saying', sayingHandler.addsaying)
router.put('/saying/:id', sayingHandler.updateSaying)
router.delete('/saying/:id', sayingHandler.deleteSaying)
// router.put('/sayingclick/:id', sayingHandler.clicksaying)
/* 
  * 语录推荐
*/
router.get('/recommendSaying', sayingHandler.recommendSaying)

/**
 * @description: 语录分组
 * @return {*}
 */
router.get('/groupSaying', sayingHandler.groupSaying)

module.exports = router