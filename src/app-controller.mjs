import { RemoteMasterPort } from "@websh/remote-master-port";
import { assert } from "@websh/bios";

export default function ({ register, create }) {
  register('app-controller', {
    extends: "component",
    init({ iframe, url, debug = false }) {
      this.iframe = iframe;
      this.debug = debug;
      const parsed = new URL(url, location.href);
      this.url = parsed.href;
      this.origin = parsed.origin;
      this.masterPort = new RemoteMasterPort('SOUTH-TOOTH', iframe, { origin: this.origin, debug: this.debug });
      this.loaded = false;
      this.connected = false;
    },
    props: {
      manifest: {
        value: {},
      },
      api: {
        value: {},
      },
    },
    private: {
      send(cmd, args = {}, transfer = []) {
        this.masterPort.send(cmd, args, transfer);
      },
      request(cmd, args = {}, transfer = []) {
        return this.masterPort.request(cmd, args, transfer);
      },
      on(event, fn) {
        this.masterPort.on(event, fn);
      },
    },

    commands: {
      'load': {
        async execute() {
          assert(!this.loaded, "app-already-loaded");
          const promise = new Promise(async (resolve, reject) => {
            this.iframe.onload = async () => {
              this.loaded = true;
              this.iframe.onload = null;
              try {
                const manifest = await this.masterPort.connect();
                this.connected = true;
                resolve(manifest);
              } catch (err) {
                reject(err);
              }
            }
          })
          this.iframe.removeAttribute('srcdoc');
          this.iframe.src = this.url;
          return promise;
        }
      },
      'close': {
        execute() {
          return new Promise(async (resolve, reject) => {
            const timeout = setTimeout(
              async () => {
                reject(new Error("app-close-timeout"));
              },
              5000
            );
            try {
              await this.request('app-close');
              clearTimeout(timeout);
              this.unload();
              resolve();
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
          })
        }
      },
      async 'api' ({cmd,args={}}) {
        return await this.masterPort.request(cmd,args);
      },
      'unload': {
        async execute() {
          this.iframe.removeAttribute('src');
          this.iframe.srcdoc = "Not loaded";
          await this.masterPort.disconnect();
          this.connected = false;
          this.loaded = false;
        }
      }
    }
  })
}