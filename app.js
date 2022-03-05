const Koa = require('koa');
const route = require('koa-route');
const koaBody = require('koa-body');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const uuid = require('uuid');
const fs = require('fs');

//实例化koa
const app = new Koa();

//错误
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                ok: false,
                msg: err.originalError ? err.originalError.message : err.message
            }
        } else {
            throw err;
        }
    });
});

//不校验jwt的接口
app.use(koaJwt({ secret: 'mysecret' }).unless({
    path: ['/login', '/register']
}));

app.use(koaBody());

//定义文件路径
const userPath = './public/user.json';
const tokenPath = './public/token.json';

//登录接口
app.use(route.post('/login', (ctx) => {
    const { name, password } = ctx.request.body;
    if (!fs.existsSync(userPath)) {
        ctx.body = {
            msg: "fail",
            status: false,
        }
    }
    if (!fs.existsSync(tokenPath)) {
        fs.writeFileSync(tokenPath, '{}', 'utf-8');
    }

    let users = JSON.parse(fs.readFileSync(userPath, 'utf8'));
    if (users[name] != undefined && users[name] == password) {
        const token = jwt.sign({ name, _id: uuid.v4() }, 'mysecret');

        //将token存入文件
        let tokenInfo = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
        tokenInfo[name] = token;
        fs.writeFileSync(tokenPath, JSON.stringify(tokenInfo), 'utf8');

        ctx.body = {
            msg: "success",
            status: true,
            token: token
        }
    } else {
        ctx.body = {
            msg: "fail",
            status: false,
        }
    }
}));

//注册接口
app.use(route.post('/register', async (ctx) => {
    if (!fs.existsSync(userPath)) {
        fs.writeFileSync(userPath, '{}', 'utf-8');
    }

    const { name, password } = ctx.request.body;
    let users = JSON.parse(fs.readFileSync(userPath, 'utf8'));
    if (users[name] == undefined) {
        users[name] = password;
        fs.writeFileSync(userPath, JSON.stringify(users), 'utf8');
    }

    ctx.body = {
        msg: "success",
        status: true
    }
}));

app.listen(8000);
