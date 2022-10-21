const SentryCli = require("@sentry/cli");

async function createReleaseAndUpload() {
  const release = process.env.SENTRY_RELEASE;
  if (!release) {
    console.warn("SENTRY_RELEASE is not set");

    return;
  }

  const cli = new SentryCli();

  try {
    console.info("Creating sentry release " + release);
    await cli.releases.new(release);

    console.info("Uploading source maps");
    await cli.releases.uploadSourceMaps(release, {
      include: [".next/server/static/"],
      urlPrefix: "~/static/js",
      rewrite: false,
    });

    console.info("Finalizing release");
    await cli.releases.finalize(release);
  } catch (e) {
    console.error("Source maps uploading failed:", e);
  }
}

createReleaseAndUpload();
