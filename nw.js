/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-08-01 09:09:29
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-11 23:06:09
 * @FilePath: \ModaApi\nw.js
 * @Description: 
 */
var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'ModaApi',
  description: '个人网站后台接口。',
  script: './app.js',  // node项目要启动的文件路径
//   nodeOptions: [
//     '--harmony',
//     '--max_old_space_size=4096'
//   ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

// 监听卸载事件
svc.on("uninstall", () => {
  console.log("卸载完成");
  console.log("服务是否存在：" + svc.exists);
})

// 防止程序运行两次
svc.on("alreadyinstalled", () => {
  console.log("服务已经存在");
})

// 存在就卸载
if(svc.exists) {
  svc.uninstall();
}

svc.install();