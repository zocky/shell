import { Bios } from "@websh/bios"
export { assert, test } from "@websh/bios";

import registerAppController from "./app-controller.mjs"
import registerShell from "./shell.mjs"

export function Shell(args) {
  const {register,create} = Bios();
  
  registerAppController({register,create});
  registerShell({register,create});

  const shell = create('shell',args);
  return shell;
}