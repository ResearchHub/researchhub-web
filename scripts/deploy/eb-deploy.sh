if git diff-index --quiet HEAD --; then
    set -o errexit; # Exit on error
echo Deploying to EB;
    mv Dockerfile Dockerfile.prod.off;
    mv Dockerrun.aws.json.production Dockerrun.aws.json;
    git add Dockerfile.prod.off Dockerfile;
    git add Dockerrun.aws.json.production Dockerrun.aws.json;
    eb deploy production2 --profile researchhub --staged;
    git reset;
    mv Dockerfile.prod.off Dockerfile;
    mv Dockerrun.aws.json Dockerrun.aws.json.production;
else
    echo Please commit your changes first.;
fi