## Introduction
Rex is an **open framework** base on deno, for building high-security and high-performance application in a easy way.

### Hello Rex

```typescript
// server.ts
import {createHttpServer} from 'http://raw.githubusercontent.com/rex-js/rex/master/src/index.ts';

let server=createHttpServer({port: 8080});

const {router}=server;

router.get('/', async ctx=>{
  return 'hello rex';
});
```



You can run like this

> deno run -A server.ts

And then, you can open `http://localhost:8080` in your browser

