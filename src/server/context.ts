import {ServerRequest} from 'http://deno.land/std/http/server.ts';
import send from '../libs/send.ts';
import {getMimeType} from '../libs/mime.ts';
import {extname} from 'https://deno.land/std/path/mod.ts';
// import {HttpServer} from './index.ts';

export class Context{
  public params:{
    [key:string]:string
  }={};
  private headers:Headers;

  constructor(private req:ServerRequest){
    this.headers=new Headers();
  }

  get(name:string){
    return this.req.headers.get(name);
  }
  set(name:string, value:any){
    this.headers.set(name, value);
  }

  redirect(url:string, msg='', status=302){
    this.headers.set('location', url);

    this.respond(msg, status);
  }

  respond(data:any, status:number=0){
    //make data
    if(!data){
      this.set('content-type', 'text/html');
      data=`Not Found ${this.req.url}`;
      status=404;
    }else if(typeof data==='object'){
      if(data instanceof Uint8Array){

      }else{
        this.set('content-type', 'application/json');
        data=JSON.stringify(data);
      }

      status=200;
    }else{
      this.set('content-type', 'text/html');
      status=200;
    }

    //default headers
    // console.log(this.headers.get('content-type'))
    !this.headers.get('content-type')&&this.set('content-type', 'application/octet-stream');
    let date=new Date();
    this.set('date', date.toUTCString());

    date.setTime(date.getTime()+3600);    //default: 1hr
    this.set('expires', date.toUTCString());
    this.set('server', 'rex');

    //send response
    this.req.respond({
      status,
      body: data,
      headers: this.headers
    })
  }

  send(path:string){
    let ext=extname(path).substring(1);
    let mime=getMimeType(ext);

    this.set('content-type', mime);

    return send(this.req, path);
  }
};
