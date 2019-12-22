# Simple CRUD server for NEPPI

Sensor database server created with NodeJS, MongoDB, Swagger, and Docker.

Supports CRUD (Create, Read, Update, Delete) commands.

The API-port is 3000 by default. In order to change this, it needs to be modified in app.js, Dockerfile, and docker-compose.yml.

API-documents can be found in address http://<localhost/VM_address>/api-docs

Some helpful commands for testing the environment are written below.

## Local environment

### Write package.json

`npm init --yes`

### Install packages

`npm install`

### Build and run the backend

`docker build -t my-nodejs-app .`
`docker run -d --name my-running-app -p 3000:3000 my-nodejs-app`

### Run the MongoDB

`docker run -d -p 27017:27017 -v ~/data:/data/db mongo`

### Remove all images, container, and volumes

`docker rm -f $(docker ps -a -q) || docker rmi -f $(docker images -a -q) || docker volume rm $(docker volume ls -q)`

## Docker environment

### Run the whole program

`docker-compose build && docker-compose up` (sudo most likely needed with VM environment)
