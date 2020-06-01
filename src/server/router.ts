import {Context} from './context.ts';

type HttpHandler=(ctx:Context, next?:Function)=>any|Promise<any>;
// TODO:
function isHttpHandler(fn:any):fn is HttpHandler{
  if(typeof fn=='function')return true;
  else return false;
}

type Route={
  handlers: {handler:HttpHandler, path: string[]}[],
  children: {
    [key:string]:Route
  }
};

export class Router{
  private routes:{
    [key:string]:{
      [key:string]:Route
    }
  }={};

  //
  add(method:string, url:string, handler:HttpHandler){
    let path=parseUrl(url);
    method=method.toLowerCase();

    // console.log(method, path);

    //method
    this.routes[method]=this.routes[method]||{};

    //
    let route=null;
    let routes=this.routes[method];
    for(let i=0;i<path.length;i++){
      let p=path[i][0]===':'?'*':path[i];

      routes[p]=routes[p]||{
        handlers: [],
        children: {}
      };
      route=routes[p];
      routes=routes[p].children;
    }

    if(route){
      route.handlers.push({handler, path});
    }
  }
  // remove(method:string, url:string, handler:HttpHandler|Router){
  //   method=method.toLowerCase();
  //
  //   this.routes=this.routes.filter(route=>route.method!=method||route.url!=url||route.handler!=handler);
  // }
  // removeAll(method:string, url:string){
  //   method=method.toLowerCase();
  //
  //   this.routes=this.routes.filter(route=>route.method!=method||route.url!=url);
  // }





  //
  all(url:string, handler:HttpHandler){
    this.add('*', url, handler);
  }
  get(url:string, handler:HttpHandler){
    this.add('get', url, handler);
  }
  head(url:string, handler:HttpHandler){
    this.add('head', url, handler);
  }
  post(url:string, handler:HttpHandler){
    this.add('post', url, handler);
  }
  put(url:string, handler:HttpHandler){
    this.add('put', url, handler);
  }
  delete(url:string, handler:HttpHandler){
    this.add('delete', url, handler);
  }
  connect(url:string, handler:HttpHandler){
    this.add('connect', url, handler);
  }
  options(url:string, handler:HttpHandler){
    this.add('options', url, handler);
  }
  trace(url:string, handler:HttpHandler){
    this.add('trace', url, handler);
  }
  patch(url:string, handler:HttpHandler){
    this.add('patch', url, handler);
  }

  //
  getAllRoutes(method:string,url:string):{
    handler:HttpHandler,
    params:{
      [key:string]:string
    }
  }[]{
    let path=parseUrl(url);
    method=method.toLowerCase();

    if(!this.routes[method])return [];



    //
    function getAll(routes:{[key:string]:Route}, i:number){
      let res:{handler:HttpHandler, path: string[]}[]=[];

      if(i==path.length-1){
        if(routes['*']){
          res=res.concat(routes['*'].handlers);
        }

        if(routes[path[i]]){
          res=res.concat(routes[path[i]].handlers);
        }
      }else{
        if(routes['*']){
          res=res.concat(getAll(routes['*'].children, i+1));
        }

        if(routes[path[i]]){
          res=res.concat(getAll(routes[path[i]].children, i+1));
        }
      }

      return res;
    }

    let handlers=getAll(this.routes[method], 0);

    //
    return handlers.map(({handler, path: path2})=>{
      let params:{
        [key:string]:string
      }={};
      path2.forEach((name,index)=>{
        if(name[0]===':'){
          params[name.substring(1)]=path[index];
        }
      });

      return {
        handler,
        params
      }
    });
  }
}





function parseUrl(url:string){
  // return url.split('/').map(str=>str.trim()).filter(s=>s);
  return url.replace(/^\//, '').split('/').map(str=>str.trim());
}
