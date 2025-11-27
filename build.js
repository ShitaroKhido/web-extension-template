import { build } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const browsers = ["chrome", "firefox"];

async function buildAll() {
  for (const browser of browsers) {
    dotenv.config();

    process.env.TARGET_BROWSER = browser;

    console.log(`Building for ${browser}...`);

    await build({
      configFile: resolve(__dirname, "vite.config.js"),
      envFile: false, // We are handling .env files manually
      build: {
        outDir: resolve(__dirname, `dist/${browser}`),
      },
    });

    console.log(`${browser} build finished.`);

    // Copy assets
    const assets = ["public/icon/icon.png", "src/js/bootstrap.bundle.min.js"];
    for (const asset of assets) {
      const srcPath = resolve(__dirname, asset);
      const destPath = resolve(__dirname, "dist", browser, asset.replace("public/", "").replace("src/", ""));
      if (fs.existsSync(srcPath)) {
        fs.ensureDirSync(dirname(destPath));
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${asset} to ${browser}`);
      }
    }
  }
}

buildAll();