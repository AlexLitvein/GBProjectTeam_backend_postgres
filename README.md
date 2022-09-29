## Подготовка

Установить docker на дев-машину

## Установка

```bash
$ npm install
```

## Генрация классов сущностей бд

```bash
$ npx prisma generate
```

Запусить docker (для windows Docker desktop)

## Запуск контейнера с базой

```bash
$ npm run db:dev:restart
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
