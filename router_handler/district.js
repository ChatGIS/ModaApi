/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-08-15 11:01:16
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-15 16:16:09
 * @FilePath: \ModaApi\router_handler\district.js
 * @Description: 
 */
const db = require('../db/index')
const axios = require('axios')
const mapKey = require('../mapKey.json')

/**
 * @description: 获取省份数据
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.getProvinceData = (req, res) => {
    const urlGD = `https://restapi.amap.com/v3/config/district?key=${mapKey.keyGaode}&keywords=中国&subdistrict=1&extensions=base`;
    axios.get(urlGD).then(resGD => {
        if(resGD.data.infocode === '10000') {
            const provinces = resGD.data.districts[0].districts;
            for(let i = 0; i < provinces.length; i++) {
                provinces[i].parent_id = 1;
                updateOrInsert(provinces[i]);
            }
            res.aa(`成功更新${provinces.length}条省份数据`, 200)
        }
    })   
}

/**
 * @description: 更新或插入省份数据
 * @param { Object } data
 * @return {*}
 */
function updateOrInsert(data) {
    const sqlSelect = `SELECT * FROM district WHERE name = '${data.name}'`;
    const sqlInsert = `INSERT INTO district (name, adcode, citycode, center, level, parent_id) VALUES ('${data.name}', '${data.adcode}', '${data.citycode}', '${data.center}', '${data.level}', ${data.parent_id})`;
    const sqlUpdate = `UPDATE district SET adcode = '${data.adcode}', citycode = '${data.citycode}', center = '${data.center}', level = '${data.level}', parent_id = ${data.parent_id} WHERE name = '${data.name}'`;
    db.query(sqlSelect, (error, resultsSelect) => {
        if (error) throw error;
        if (resultsSelect.length > 0) {
            db.query(sqlUpdate, (error, resultsUpdate) => {
                if (error) throw error;
                return resultsSelect[0].id;
            })
        } else {
            db.query(sqlInsert, (error, resultsInsert) => {
                if (error) throw error;
                return resultsInsert.insertId;
            })
        }
    })
}
/**
 * @description: 获取市级数据
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.getCityData = (req, res) => {
    const sqlSelect = `SELECT * FROM district WHERE level = 'province'`;
    db.query(sqlSelect, async (error, provinces) => {
        if (error) throw error;
        for(let i = 0; i < provinces.length; i++) {
            const urlGD = `https://restapi.amap.com/v3/config/district?key=${mapKey.keyGaode}&keywords=${provinces[i].name}&subdistrict=1&extensions=base`;
            await axios.get(urlGD).then(resGD => {
                if(resGD.data.infocode === '10000') {
                    const citys = resGD.data.districts[0].districts;
                    for(let j = 0; j < citys.length; j++) {
                        citys[j].parent_id = provinces[i].id;
                        updateOrInsert(citys[j]);
                    }
                }
            })
        }
    })  
    res.aa(`成功更新市数据`, 200);
}
/**
 * @description: 获取区级数据
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.getDistrictData = (req, res) => {
    const sqlSelect = `SELECT * FROM district WHERE level = 'city'`;
    db.query(sqlSelect, async (error, citys) => {
        if (error) throw error;
        for(let i = 0; i < citys.length; i++) {
            const urlGD = `https://restapi.amap.com/v3/config/district?key=${mapKey.keyGaode}&keywords=${citys[i].name}&subdistrict=1&extensions=base`;
            await axios.get(urlGD).then(resGD => {
                if(resGD.data.infocode === '10000') {
                    const districts = resGD.data.districts[0].districts;
                    for(let j = 0; j < districts.length; j++) {
                        districts[j].parent_id = citys[i].id;
                        updateOrInsert(districts[j]);
                    }
                }
            })
        }
    })  
    res.aa(`成功更新区数据`, 200);
}
