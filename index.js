/**
 * Created by tc949 on 2017/4/24.
 */
/**
 * 验证access_token的路由插件
 * @param scopes 访问该路由所需要的所有权限
 * @returns {function(*, *)}
 */
let authorization = (scopes) => {
    return async (ctx, next) => {
        let access_token = ctx.accept.headers['authorization'] ||
            ctx.query.authorization ||
            ctx.request.body.authorization;

        if (util.isNullOrUndefined(access_token)) {
            throw new BusinessError(500, 'access token is none');
        }
        let i = await token_repository.find_by_access_token(access_token);
        if (util.isNullOrUndefined(i) || util.isNullOrUndefined(i.user_id)) {
            throw new BusinessError(500, 'access_token is timeout or useless');
        }
        if (i.scope !== 'all') {
            let allInclude = await commonUtil.include(scopes, i.scope, ',');
            if (!allInclude) {
                throw new BusinessError(500, `${i.scope} can not match ${scopes}`);
            }
        }
        ctx.principle = i;
        ctx.user_id = i.user_id;
        next()
    }
};
module.exports = authorization;