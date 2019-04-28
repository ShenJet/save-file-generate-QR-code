'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _qrcode = require('qrcode');

var _qrcode2 = _interopRequireDefault(_qrcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateQR = async function generateQR(text) {
    try {
        var base64 = await _qrcode2.default.toDataURL(text, {
            width: 600,
            type: 'png'
        });
        return base64;
    } catch (err) {
        console.error(err);
    }
};
console.log(_config2.default);

var app = new _koa2.default();

// upload目录存在性检查，不存在则创建
var savedir = _path2.default.join(__dirname, 'upload');
try {
    _fs2.default.statSync(savedir);
} catch (error) {
    _fs2.default.mkdirSync(savedir);
}
// 设置静态文件目录
app.use((0, _koaStatic2.default)(_path2.default.join(__dirname, 'upload')));

app.use((0, _koaBody2.default)({
    multipart: true,
    formidable: {
        maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认20M
    }
}));

app.use(async function (ctx, next) {
    if (ctx.path === '/') {
        ctx.body = 'nnn';
    }
    await next();
});

// app.use(async (ctx, next)=>{
//     if(ctx.path === '/upload'){
//         ctx.body = `<img src=${await generateQR(ctx.query.text || '<空空如也>')} >`
//     }
//     await next()
// })
app.use(async function (ctx, next) {
    if (ctx.path === '/form') {

        ctx.body = '<form action="/fileupload" method="post" enctype="multipart/form-data">\n                        <input type="text" name="str" id=""><br>\n                        <input type="file" name="file" id="" accept="image/*"><br>\n                        <input type="submit" value="\u4E0A\u4F20\u751F\u6210\u4E8C\u7EF4\u7801">\n                    </form>';
    }
    await next();
});
app.use(async function (ctx, next) {
    if (ctx.path === '/fileupload') {

        // 存储文件
        var file = ctx.request.files.file; // 获取上传文件
        var reader = _fs2.default.createReadStream(file.path); // 创建可读流
        var ext = file.name.split('.').pop(); // 获取上传文件扩展名
        var newname = Math.random().toString() + '.' + ext;
        var upStream = _fs2.default.createWriteStream(_path2.default.join(__dirname, 'upload/' + newname)); // 创建可写流
        reader.pipe(upStream); // 可读流通过管道写入可写流

        var ips = _os2.default.networkInterfaces().WLAN;
        var ip = 'http://127.0.0.1';
        for (var i = 0; i < ips.length; i++) {
            var alias = ips[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                ip = alias.address;
            }
        }
        ctx.body = '<img src=' + (await generateQR('http://' + ip + ':' + _config2.default.port + '/' + newname || 'nothing')) + '>';
    }

    await next();
});

// 启动程序，监听端口
app.listen(_config2.default.port, function () {
    console.log('listen @' + _config2.default.port + ' ');
});