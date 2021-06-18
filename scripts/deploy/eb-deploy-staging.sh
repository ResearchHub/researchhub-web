if git diff-index --quiet HEAD --; then
    set -o errexit; # Exit on error
echo Deploying to EB;
    mv Dockerfile Dockerfile.staging.off;
    mv Dockerrun.aws.json.staging Dockerrun.aws.json;
    git add Dockerfile.staging.off Dockerfile;
    git add Dockerrun.aws.json.staging Dockerrun.aws.json;
    eb deploy staging-web --profile researchhub --staged;
    git reset;
    mv Dockerfile.staging.off Dockerfile;
    mv Dockerrun.aws.json Dockerrun.aws.json.staging;
else
    echo Please commit your changes first.;
fi