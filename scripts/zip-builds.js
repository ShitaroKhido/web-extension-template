const fs = require("fs");
const archiver = require("archiver");
const path = require("path");

function zipDir(srcDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () =>
      resolve({ path: outPath, size: archive.pointer() })
    );
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(srcDir, false);
    archive.finalize();
  });
}

async function main() {
  try {
    const base = path.resolve(process.cwd(), "dist");

    const outDir = path.join(process.cwd(), "dist_zip");

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    const targets = [
      {
        dir: path.join(base, "chrome"),
        out: path.join(outDir, "chrome.zip"),
      },
      {
        dir: path.join(base, "firefox"),
        out: path.join(outDir, "firefox.zip"),
      },
    ];

    for (const t of targets) {
      if (!fs.existsSync(t.dir)) {
        console.warn(`Skipping ${t.dir}: not found`);
        continue;
      }
      process.stdout.write(`Zipping ${t.dir} → ${t.out}... `);
      const r = await zipDir(t.dir, t.out);
      console.log(`done (${r.size} bytes)`);
    }

    console.log("All done.");
  } catch (err) {
    console.error("Failed to zip builds", err);
    process.exit(1);
  }
}

if (require.main === module) main();
