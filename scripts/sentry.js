const SentryCli = require("@sentry/cli");
const { emptyFncWithMsg } = require("~/config/utils/nullchecks");

async function createReleaseAndUpload() {
  const release = process.env.SENTRY_RELEASE;
  if (!release) {
    emptyFncWithMsg("SENTRY_RELEASE is not set");
    return;
  }

  const cli = new SentryCli();

  try {
    emptyFncWithMsg("Creating sentry release " + release);
    await cli.releases.new(release);

    emptyFncWithMsg("Uploading source maps");
    await cli.releases.uploadSourceMaps(release, {
      include: [".next/server/static/"],
      urlPrefix: "~/static/js",
      rewrite: false,
    });

    emptyFncWithMsg("Finalizing release");
    await cli.releases.finalize(release);
  } catch (e) {
    emptyFncWithMsg("Source maps uploading failed:", e);
  }
}

createReleaseAndUpload();
