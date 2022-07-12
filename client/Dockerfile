# pull official base image
FROM node:17-alpine

# set working directory
WORKDIR /client

# add `/app/node_modules/.bin` to $PATH
ENV PATH /client/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --save
EXPOSE 3000

# add app
COPY . /client

# start app
CMD ["npm", "start"]

