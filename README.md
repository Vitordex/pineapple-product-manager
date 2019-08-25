# pineapple-product-manager
A product manager built for the Pineapple Inc.

## Table of Contents
- [Requirements](#requirements)
- [Before you start](#before-you-start)
- [Database Model](#database-model)
- [Things I would like to add](#things-i-would-like-to-add)
    * [Back-end](#back-end)
    * [Front-end](#front-end)

## Requirements
- NodeJS v10 or greater
- Docker and Docker Compose
- Your ports 3000 and 4200 need to be freed to listen

## Before you start
- Run `npm install` on both pine-api and pine-front folders
- Run `npm run tsc` on both pine-api and pine-front folders
- Run `docker-compose up -d` on pine-api folder, so postgres container may start

## How to run
### Back-end:
Server starts at port 3000
- Run `npm start` on pine-api folder
### Front-end:
Server starts at port 4200
- Run `npm start` on pine-front folder

## Database Model
### User
A table with all data about the users to login/logout
- id: number
- email: varchar
- password: varchar
- createdAt: datetime
- updatedAt: datetime
### Product
A table with all info about the pineapple products
- id: number
- name: varchar 50
- description: varchar 255
- rate: number
- imagePath: varchar
- createdAt: datetime
- updatedAt: datetime

## Things I would like to add
## Back-end:
 - CI/CD file for the git platform I'm using (Travis - Github, GitlabCI Gitlab, Pipelines - Bitbucket, or even a CircleCI or Jenkins configuration), this facilitates development in a way we would assure some parts of our code are not broken because of updates
 - Swagger documentation, so anyone that wanted to consume the API would only view a beautilful file with an intuitive layout
 - Integration tests with the cloud provider, mostly to test permissions to methods, and view if resources are available
 - Infrastructure as code file, such as Terraform or Cloudformation Stack, so it would be easier to deploy and update structures as we develop. With that there would be the need to develop a series of scripts to deploy the app
 - Deployment jobs, so all the deploy in different environments, would be facilitated and configured only once, to be applied many times.
 - Give a better way to impĺement inheritance in db model instancing as it is not recomended to not have any intellisense on manipulating data
 - Put all requests in a route called 'api/vversionnumber' as it is a best practice and it facilitates routing from frontend to backend and vice versa
 - Change the password hash method to salt hashing as it is safer (more dificult to crack)
 - Change input manipulation as multer puts all form data in req.body instead of request.body
## Front-end:
 - CI/CD file for the git platform I'm using (Travis - Github, GitlabCI Gitlab, Pipelines - Bitbucket, or even a CircleCI or Jenkins configuration), this facilitates development in a way we would assure some parts of our code are not broken because of updates
 - Automated tests, so it would be easier to assure things appear at the correct time and space
 - Deployment jobs, so all the deploy in different environments, would be facilitated and configured only once, to be applied many times.
