import {serve, Server} from 'http://deno.land/std/http/server.ts';

import {Router} from './router.ts';
export {Router};

import {Context} from './context.ts';
export {Context};

//
type HttpServerOptions={
  port?:number;
};

type CloseCallback=()=>void;

const defaultHttpOptions:HttpServerOptions={
  port: 80
};



//
class HttpServer{
  private server:Server;
  public readonly router:Router;
  public readonly locals:{
    [key:string]:string
  }={};

  constructor(options:HttpServerOptions){
    //
    // options=Object.assign(defaultHttpOptions, options);


    //
    this.server=serve({
      port: options.port||80
    });

    //
    this.router=new Router();

    this.run();
  }

  public async run(){
    for await (const req of this.server) {
      const handlers=this.router.getAllRoutes(req.method, req.url);

      const ctx=new Context(req);
      // console.log(handlers);

      let body:any;

      if(handlers.length){
        let i=0;
        async function next(){
          const {handler,params}=handlers[i];

          ctx.params=params;
          return await handler(ctx, async ()=>{
            i++;
            if(i<handlers.length){
              return await next();
            }
          });
        }

        body=await next();
      }

      // console.log('body:', body);
      ctx.respond(body);
    }
  }

  close(cb?:CloseCallback){

  }
}

export function createHttpServer(options:HttpServerOptions):HttpServer{
  let server=new HttpServer(options);

  return server;
}
