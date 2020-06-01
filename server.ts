import {createHttpServer} from './src/index.ts';

let server=createHttpServer({port: 8080});

const {router}=server;

router.get('/', async ctx=>{
  return 'hello rex';
});
