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