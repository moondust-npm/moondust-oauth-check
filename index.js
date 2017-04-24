/**
 * Created by tc949 on 2017/4/24.
 */
/**
 * 验证access_token的路由插件
 * @param scopes 访问该路由所需要的所有权限
 * @returns {function(*, *)}
 */
const precheck = require('./check');


let authorization = (ops) => {
    this.url = ops.url;
    this.precheck = ops.precheck || precheck;

    this.check = () => {
        return async (ctx, next) => {
            let access_token = ctx.accept.headers['authorization'] ||
                ctx.query.authorization ||
                ctx.request.body.authorization;
            let res = await this.precheck(access_token);
            if (!res) throw new Error('access_token cant check');
            let i = 'asd';
            ctx.principle = i;
            ctx.user_id = i.user_id;
            next();
        }
    }
};


module.exports = authorization;