/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-08-15 11:01:06
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-15 14:59:14
 * @FilePath: \ModaApi\router\district.js
 * @Description: 
 */
const express = require('express')
const router = express.Router()

const districtHandler = require('../router_handler/district.js')

router.get('/getProvinceData', districtHandler.getProvinceData)
router.get('/getCityData', districtHandler.getCityData)
router.get('/getDistrictData', districtHandler.getDistrictData)


module.exports = router