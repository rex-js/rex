import {ServerRequest} from 'http://deno.land/std/http/server.ts';

export default async function (req:ServerRequest, path:string){
  //todo
  let body=await Deno.readFile(path);

  return body;
}
