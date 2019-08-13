import { Shell, test } from "../src/index.mjs";

const iframe = document.getElementById("iframe");
const shell = Shell();
const url = "app.html";

(async function() {
  const foo = 

  await test(
    "load app",
    ()=>shell.call('app-open',{iframe,url})    
  )
  await test(
    "ping",
    "pong",
    async ()=>await shell.call('app-api',{iframe,cmd:"test-ping"})    
  )
  await test(
    "echo",
    "same",
    async ()=>await shell.call('app-api',{iframe,cmd:"test-echo",args:"same"})    
  )
  await test(
    "file new",
    "OK",
    async ()=>await shell.call('app-api',{iframe,cmd:"file-new"})    
  )
  await test(
    "file save returns empty",
    "",
    async ()=>(await shell.call('app-api',{iframe,cmd:"file-save",args:{format:"text"}})).content
  )
  await test(
    "file opens",
    "OK",
    async ()=>await shell.call('app-api',{iframe,cmd:"file-open",args:{content:"foobar"}})    
  )
  await test(
    "file save returns the same",
    "foobar",
    async ()=>(await shell.call('app-api',{iframe,cmd:"file-save",args:{format:"text"}})).content
  )
  try {
    await shell.call('app-close',{iframe})
  } catch (error) {
    console.log(error,typeof error);
  }
  await test(
    "file close wants more time",
    new Error("app-close-wait"),
    async ()=>(await shell.call('app-close',{iframe}))
  )
  
  

  test();
})()

