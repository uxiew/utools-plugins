## 软件付费 — 用户按天数购买软件授权

#### 适用模式
1. 基本功能免费 + 高级功能付费 (**推荐**)
2. 插件应用完全付费使用

``` javascript
utools.onPluginEnter(({ type, code, payload }) => {
  const purchasedUser = utools.isPurchasedUser()
  if (purchasedUser) {
    // 已付费的合法用户，可使用插件应用完整功能
    // purchasedUser = true 表示永久授权
    // purchasedUser = "yyyy-mm-dd hh:mm:ss", 授权到期时间
  } else {
    // 打开付费
    utools.openPurchase(
      {goodsId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}, 
      () => {
        console.log('已购买成功')
      }
    )
  }
})
```

## 服务付费 — 用户按使用量购买应用服务

#### 适用模式
1. 服务 API 按次/按量购买
2. 售卖虚拟商品

``` javascript
  // 1. 配置好服务端支付通知地址
  // 2. 打开支付
  utools.openPayment(
    {goodsId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}, 
    () => {
       console.log('支付成功')
       // 重新从服务器获取已购买商品量
    }
  )

```

------

### 如何申请

1. 「uTools 开发者工具」中认证为企业开发者直接开通
2. 个人开发者将以下信息发邮件到 `service@u.tools` 申请开通

邮件标题为：申请 uTools 插件应用付费权限

邮件中提供的资料：
姓名、身份证正反面、手机号码、插件应用名称及应用ID、描述付费功能、结算银行及卡号（详细到开户行）

我们会在 3 个工作日内处理

### 服务费率

uTools 将收取收款金额的 30% (**当前推广期 15%**)  作为平台服务费

### 如何结算

1. 待结算的金额需至少到达 100 元
2. 插件应用获取的收益，将在扣除服务费后，于每月 10 号统一支付上一月的收益到你的结算银行卡中
