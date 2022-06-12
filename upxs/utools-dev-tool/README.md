# uTools 开发者工具

uTools 开发者工具 源码

个人破解版，无需登录...
version 1.0.8

仅限个人学习使用


## window.services.getLocalAccount
个人账户信息，来自：`this.accountCmp.getAccountInfo`
```js
    {
        _id:string, // 数据库中的 id
        uid:string, // user id
        avatar:string,
        nickname:string,
        cellphone:string,
        type:number,    // 1 === t.type ? "member" : "user"
        avatar:string,
        token: boolean,   // token
        expired_at: boolean,   // 会员到期日
        db_sync: boolean,   // 账户数据是否开启同步
        db_secrect_key:string, // 数据库密钥
    }
```