[JAVASCRIPT__BADGE]: https://img.shields.io/badge/Javascript-000?style=for-the-badge&logo=javascript
[EXPRESS__BADGE]: https://img.shields.io/badge/express-005CFE?style=for-the-badge&logo=express
[NPM]: https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white
[FRONTEND]: https://github.com/snportela/arda-wiki-frontend
[Postgres]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white

<h1 align="center" style="font-weight: bold;">Arda Wiki Backend 💻</h1>

<p align="center">
 <a href="#tech">Technologies</a> • 
 <a href="#requisites">Prerequisites</a> • 
 <a href="#started">Getting Started</a> • 
  <a href="#routes">API Endpoints</a> 
</p>

<p align="center">
  <b>Node.js API using Express for the <a href="https://github.com/snportela/arda-wiki-frontend">Arda Wiki</a> website.</b>
</p>

<h2 id="tech">💻 Technologies</h2>

![NPM]
![express][EXPRESS__BADGE]
![javascript][JAVASCRIPT__BADGE]
![POSTGRES]

<h3 id="requisites">Prerequisites</h3>

- Install Node.js version 22.11.0

<h2 id="started">🚀 Getting started</h2>

- Clone the repository

```shell
git clone https://github.com/snportela/arda-wiki-backend
```

- Install dependencies

```shell
npm install
```

- Build and run the project

```shell
npm start
```

<h3> Environment Variables</h2>

Use the `.env.example` as reference to create your configuration file `.env`.

<h3>Database </h3>

Install PostgreSQL on your machine and get a database up and running.
-Entities: users, characters, locations, races, events, periods, weapons.

<!-- <h2 id="routes">📍 API Endpoints</h2>

Here you can list the main routes of your API, and what are their expected request bodies.
​
| route | description
|----------------------|-----------------------------------------------------
| <kbd>GET /authenticate</kbd> | retrieves user info see [response details](#get-auth-detail)
| <kbd>POST /authenticate</kbd> | authenticate user into the api see [request details](#post-auth-detail)

<h3 id="get-auth-detail">GET /authenticate</h3>

**RESPONSE**

```json
{
  "name": "Fernanda Kipper",
  "age": 20,
  "email": "her-email@gmail.com"
}
```

<h3 id="post-auth-detail">POST /authenticate</h3>

**REQUEST**

```json
{
  "username": "fernandakipper",
  "password": "4444444"
}
```

**RESPONSE**

```json
{
  "token": "OwoMRHsaQwyAgVoc3OXmL1JhMVUYXGGBbCTK0GBgiYitwQwjf0gVoBmkbuyy0pSi"
}
``` -->
