import Koa from 'koa'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import fs from 'fs'
import path from 'path'
import os from 'os'
import config from './config'
import QRCode from 'qrcode'

// 定义一个将字符串生成二维码的方法
const generateQR = async text => {
    try {
        let base64 = await QRCode.toDataURL(text,{
            width: 600,
            type: 'png'
        })
        return base64
    } catch (err) {
        console.error(err)
    }
}
console.log(config);

const app = new Koa()

// upload目录存在性检查，不存在则创建
let savedir = path.join(__dirname,'upload')
try {
    fs.statSync(savedir)
} catch (error) {
    fs.mkdirSync(savedir)
}
// 设置静态文件目录
app.use(koaStatic(path.join(__dirname, 'upload')));

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 2000 * 1024 * 1024  // 设置上传文件大小最大限制，默认20M
    }
}));

app.use(async (ctx, next)=>{
    if(ctx.path === '/'){
        ctx.body = 'nnn'
    }
    await next()
})

app.use(async (ctx, next)=>{
    if(ctx.path === '/form'){
        
        ctx.body = `<form action="/fileupload" method="post" enctype="multipart/form-data">
                        <input type="text" name="str" id=""><br>
                        <input type="file" name="file" id="" accept="image/*"><br>
                        <input type="submit" value="上传生成二维码">
                    </form>`
    }
    await next()
})
app.use(async (ctx, next)=>{
    if(ctx.path === '/fileupload'){
        
        // 存储文件
        const file = ctx.request.files.file;   // 获取上传文件
        const reader = fs.createReadStream(file.path);  // 创建可读流
        const ext = file.name.split('.').pop(); // 获取上传文件扩展名
        let newname = `${Math.random().toString()}.${ext}`
        const upStream = fs.createWriteStream(path.join(__dirname, `upload/${newname}`)); // 创建可写流
        reader.pipe(upStream);  // 可读流通过管道写入可写流
        
        let ips = os.networkInterfaces().WLAN
        let ip = 'http://127.0.0.1'
        for(var i=0;i<ips.length;i++){
            var alias = ips[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                ip = alias.address;
            }
        }
        ctx.body = `<img src=${await generateQR((`http://${ip}:${config.port}/${newname}`) || 'nothing')}>`
    }
    
    await next()
})

// 启动程序，监听端口
app.listen(config.port, () => {
    console.log(`listen @${config.port} `);
})