# pull official base image
FROM node:14.17-alpine AS builder

# set working directory
WORKDIR /parity-bridges-ui

RUN apk update
# Install git & python/pip
RUN apk add git python3
RUN ln -sf python3 /usr/bin/python
ENV PYTHONUNBUFFERED=1
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /parity-bridges-ui/build .
COPY --from=builder /parity-bridges-ui/.env .

# Fix network entrypoints and start nginx.
COPY run-nginx.sh .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["/usr/share/nginx/html/run-nginx.sh"]
