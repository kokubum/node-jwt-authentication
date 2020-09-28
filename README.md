# JWT Authentication | Node.js
An API for authentication with JWT (Json Web Token) made with Express, MongoDB for storing the users and Redis for revoking the logout users token.
<br><br>
**Obs:** Make sure to have a .env file with all the configurations. Take a look at the config.js file to see which one do you need.

## Routes

- `/api/v1/auth/register` - Register the user
- `/api/v1/auth/login` - Login the user
- `/api/v1/auth/logout` - Logout the user
- `/api/v1/auth/change-password` - Change the current password to a new one
- `api/v1/auth/protected` - Protected route to test

## Getting Started

Cloning the project:
```
git clone https://github.com/kokubum/node-jwt-authentication.git
```
Installing the dependencies:
```
npm install
```
Running a local redis server:
```
redis-server --daemonize yes
```
Running the server (dev | prod):
```
npm run dev | npm run prod
```
## TOP NPM Packages
* [Express](https://www.npmjs.com/package/express)
* [Mongoose](https://www.npmjs.com/package/mongoose)
* [Redis](https://www.npmjs.com/package/redis)
* [Json Web Token](https://www.npmjs.com/package/jsonwebtoken)
