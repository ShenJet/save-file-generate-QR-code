'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

// [rootPathname, useQcloudLogin, cos, serverHost, tunnelServerUrl, tunnelSignatureKey, qcloudAppId, qcloudSecretId, qcloudSecretKey, wxMessageToken].
var CONF = {
    serverHost: 'localhost', //212.64.64.99
    port: '8898',
    rootPathname: '',

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost', //212.64.64.99
        db: 'qrcode',
        port: 3306,
        user: 'root',
        pass: 'siyuan@123',
        char: 'utf8mb4'
    }
};

exports.default = CONF;