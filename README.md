

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

### Run the app (development)

first clone the repo
```
git clone (url_project)
```

install the dependencies
```
pnpm install
```

install nest cli
```
npm i -g @nestjs/cli
```

the docker command is used for run de mongo database
```docker
docker-compose up
```

clone the file __.env.example__ and rename to __.env__ and set the variables

execute the app
```
pnpm run start:dev
```

reload the database with the seed
```
http://localhost:{PORT}/api/seed
```

run the up 
```
pnpm run start:dev
```

Build
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

Run
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up

Nota
Por defecto, docker-compose usa el archivo .env, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con

docker-compose -f docker-compose.prod.yaml up --build