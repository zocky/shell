import { WebShellApp } from "@websh/web-shell-app";

const textarea = document.getElementById('textarea');

WebShellApp.manifest({
  name:"Test App",
  api: {
    test:{},
    file: {
      formats: {
        text: {
          type:"text/plain",
          open: true,
          save: true,
          new: true
        }
      }
    }
  }
})
.command('test-ping', () => 'pong')
.command('test-log', (args) => { console.log(args) })
.command('test-echo', (args) => args)
.command('app-close', () => { WebShellApp.throw("app-close-wait") })
.command('file-open', function({format,extension,content}){
  textarea.value = content;
  return "OK";
})
.command('file-save', function({format,extension}){
  return {content:textarea.value,type:"text/plain"};
})
.command('file-new', function({format,extension}){
  textarea.value = "";
  return "OK"
});
