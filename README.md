# BRAZVIA API

Backend NestJS da vitrine BRAZVIA — Sequelize + PostgreSQL, pronto para AWS Lambda (SAM), no mesmo desenho do `lions-back`.

## Local

```bash
docker compose up -d db
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

- API: http://localhost:3333/api
- Swagger: http://localhost:3333/api/docs
- Health: http://localhost:3333/api/health

Admin (Cognito mock):

- e-mail: `admin@brazvia.local`
- senha: qualquer valor não vazio

## Front

No `braz_via_front`:

```
VITE_API_URL=http://localhost:3333/api
```

## Lambda (depois)

Mesmo fluxo do lions-back:

```bash
npm run sam:build
npm run sam:deploy
```

A Lambda `brazvia-migrate` roda `sequelize-cli db:migrate` (+ seed se `RunDbSeed=true`).
