import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import * as path from "path";
import { webhookAdminUi } from "vendure-plugin-webhook";

compileUiExtensions({
  outputPath: path.join(__dirname, "__admin-ui"),
  extensions: [webhookAdminUi],
})
  .compile?.()
  .then(() => {
    process.exit(0);
  });
