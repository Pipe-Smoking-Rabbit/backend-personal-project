# Setup
## `Setup .env.development / .env.test`

Before doing anything else you will need to set up a .env file in the root of this directory to allow the NODE_ENV to connect to the correct database. It is advised to create both ".env.development" and ".env.test" so you have access to both the production database and test data for testing endpoints.


In the base of this repo:
```
touch .env.development
```
```
touch .env.test
```

( Inside `.env.development` / `.env.test` you will need to include a line to set the _PGDATABASE_ in the environment :  see below... )
```
PGDATABASE=nc_games 
```
and...
```
 PGDATABASE=nc_games_test
```

## `Setup Database With Scripts`

npm scripts have been included in the _package.json_ file that will need to be run to initalise the database. In the terminal run the following commands:
```
npm run setup-dbs
```
```
npm run seed
```

## `Testing Endpoints`

text here to describe testing process

