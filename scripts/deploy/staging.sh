#!/bin/bash
if git diff-index --quiet HEAD --; then
    set -o errexit; # Exit on error
echo Step 1/3: Logging into ECR;
    AWS_VER=`aws --version`
    AWS_REGEX="aws-cli\/2.+"
    echo "Using $AWS_VER"

    if [[ $AWS_VER =~ $AWS_REGEX ]]; then
        aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 794128250202.dkr.ecr.us-west-2.amazonaws.com
    else
        $(aws ecr get-login --no-include-email --region us-west-2 --profile researchhub);
    fi
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
else
    echo Please commit your changes first.;
fi
