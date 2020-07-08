#!/bin/bash
if git diff-index --quiet HEAD --; then
    set -o errexit; # Exit on error
echo Step 1/3: Logging into ECR;
    $(aws ecr get-login-password --no-include-email --region us-west-2 --profile researchhub);
echo Step 2/3: Creating new production image;
    yarn run build:staging;
    docker tag researchhub-web-staging:latest 794128250202.dkr.ecr.us-west-2.amazonaws.com/researchhub-web-staging:latest
    docker push 794128250202.dkr.ecr.us-west-2.amazonaws.com/researchhub-web-staging:latest
echo Step 3/3: Creating elastic beanstalk environment;
    mv Dockerfile Dockerfile.staging.off;
    mv Dockerrun.aws.json.staging Dockerrun.aws.json;
    git add Dockerfile.staging.off Dockerfile;
    git add Dockerrun.aws.json.staging Dockerrun.aws.json;
    eb deploy staging-web --profile researchhub --staged;
    git reset;
    mv Dockerfile.staging.off Dockerfile;
    mv Dockerrun.aws.json Dockerrun.aws.json.staging;
    SENTRY_RELEASE=staging-$(git rev-parse --short HEAD) yarn run sentry;
else
    echo Please commit your changes first.;
fi
