# pull official base image
FROM node:14.17-alpine

# set working directory
WORKDIR /parity-bridges-ui

RUN apk update && \
    apk add git

# add `/app/node_modules/.bin` to $PATH
ENV PATH /parity-bridges-ui/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# add app
COPY . ./

# start app
CMD ["npm", "start"]    
