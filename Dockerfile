FROM node:14.15.5-alpine

# install dependencies
RUN apk add --no-cache --virtual .build-deps \
    git \
    python \
    make \
    g++

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
COPY .sentryclirc /usr/src/app
COPY .npmrc /usr/src/app
COPY tsconfig.json /usr/src/app

# install yarn and yarn install
RUN yarn install --production --no-progress

# Expose the public http port
EXPOSE 3000

# Bundle app source
COPY . /usr/src/app
ARG REACT_APP_ENV
ENV REACT_APP_ENV=$REACT_APP_ENV
ARG SENTRY_RELEASE
RUN SENTRY_RELEASE=${SENTRY_RELEASE} REACT_APP_ENV=${REACT_APP_ENV} yarn run build
RUN SENTRY_RELEASE=${SENTRY_RELEASE} yarn run sentry;

# build and Start server
CMD ["yarn", "start"]
