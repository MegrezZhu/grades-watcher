# grades-watcher
A tool to automatically querying for course grades, checking if therea are new ones.



## Feature

* automatically re-login when the login cookie expired
* using WeChat Subscription (微信公众号)  to inform user as new course grades comes

## How

1. `git clone https://github.com/MegrezZhu/grades-watcher.git & cd grades-watcher`

2. `npm i --production` 

3. modify `config/index.js` and `config/secret.js`, with the watching config in `index.js` and the credential configures (like your netid and password) in `secret.js`

   > hopefully the field names in config are self-explainable enough
   >
   > read [this](https://github.com/Andiedie/wechat-inform#如何获取测试号) for tutorial of acquiring a WeChat Testing Subscription

4. `npm start` and enjoy!

