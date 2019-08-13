export default function ({ register, create }) {

  register('shell', {
    init() {
      this.iframeControllers = new WeakMap();
    },
    extends: "component",
    commands: {
      async 'app-open'({ iframe, url }) {
        const current = this.iframeControllers.get(iframe);
        if (current) {
          await current.call("unload");
          this.iframeControllers.delete(iframe);
        }
        const appController = create('app-controller', { iframe, url });
        this.iframeControllers.set(iframe, appController)
        return await appController.call("load");
      },
      async 'app-close'({iframe}) {
        return await this.iframeControllers.get(iframe).call('close');
      },
      async 'app-unload'({iframe}) {
        return await this.iframeControllers.get(iframe).call('close');
      },
      async 'app-api'({ iframe, cmd, args }) {
        return await this.iframeControllers.get(iframe).call('api',{cmd,args});
      }
    }
  })
}