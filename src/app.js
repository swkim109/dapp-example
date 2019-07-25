const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const ethRouter = require('./api/eth');

const port = process.env.PORT || 4000;

const app = new Koa();

const router = new Router();

router.use('/eth', ethRouter.routes());

app.use(bodyParser());

app.use(router.routes());


app.listen(port, ()=>{
    console.log(`listening to PORT ${port}`);
});
