import {createHttpServer, Router} from '../src/index.ts';

let server=createHttpServer({port: 8080});

const {router}=server;

router.get('/', async ctx=>{
  return await ctx.send('./static/index.html');
});
router.get('/a.png', async ctx=>{
  return await ctx.send('./static/a.png');
});

router.get('/a', async (ctx,next)=>{
  ctx.set('a', 12);
  return {
    a: 12,
    b: 54
  };
});
router.get('/a/:id', async (ctx,next)=>{
  return ctx.params.id;
});


// console.log(router);
