For initial setup of database,
Ensure knex is installed globally
Then, run

```sh
knex migrate:make initial_setup
```
To migrate to latest,
```sh
knex migrate:latest
```

In the frontend, request for a personal message based on user public address.

In the backend, generate a random message and send it to frontend. (
    If user exists, store it against that user, else append it in the new table
)

In the frontend, make the user sign a personal message once you receive the private key.

In backend, call /authenticate api

Middleware to verify the jwt

All routes should be of the following standard

Update data code