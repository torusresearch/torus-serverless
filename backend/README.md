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
```js
function auth(req, res, next) {
  jwt.verify(req.body.token, ‘i am another string’, function(err, decoded) {
    if (err) { res.send(500, { error: ‘Failed to authenticate token.’}); }
    else {
      req.user = decoded.user;
      next();
    };
  });
}
```

All routes should be of the following standard
```js
app.post(‘/UpdateData’, auth, Routes.UpdateData);
```

Update data code
```js
function UpdateData(req, res) {
  // Only use the user that was set in req by auth middleware!
  var user = req.user;
  updateYourData(user, req.body.data);
  ...
}
```