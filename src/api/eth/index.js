const Router = require('koa-router');
const controller = require('./eth.controller');


const router = new Router();

router.post('/set', controller.set);
router.post('/setTx', controller.setTx);


module.exports = router;
