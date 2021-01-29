import {
  examplePaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import path from "path";
import { GoogleStorageStrategy } from "./google-storage-strategy/google-storage-strategy";

export const config: VendureConfig = {
  apiOptions: {
    port: ((process.env.PORT as unknown) as number) || 3000,
    adminApiPath: "admin-api",
    adminApiPlayground: {}, // turn this off for production
    adminApiDebug: false, // turn this off for production
    shopApiPath: "shop-api",
    shopApiPlayground: {}, // turn this off for production
    shopApiDebug: false, // turn this off for production
  },
  authOptions: {
    superadminCredentials: {
      identifier: "yostoreadmin",
      password: process.env.YOSTORE_PASS as string,
    },
  },
  dbConnectionOptions: {
    type: "postgres",
    synchronize: false, // turn this off for production
    logging: false,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: (process.env.DATABASE_PORT as unknown) as number,
    database: process.env.DATABASE_NAME,
    migrations: [path.join(__dirname, "../migrations/*.ts")],
  },
  paymentOptions: {
    paymentMethodHandlers: [examplePaymentHandler],
  },
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      storageStrategyFactory: () => new GoogleStorageStrategy("yo-store"),
      route: "assets",
      assetUploadDir: "/tmp/vendure/assets",
      port: 3001,
    }),
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      mailboxPort: 3003,
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: "http://localhost:8080/verify",
        passwordResetUrl: "http://localhost:8080/password-reset",
        changeEmailAddressUrl:
          "http://localhost:8080/verify-email-address-change",
      },
    }),
    AdminUiPlugin.init({
      port: 3002,
      app: {
        path: path.join(__dirname, "__admin-ui/dist"),
      },
    }),
  ],
};
