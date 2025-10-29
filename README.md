# Backend Labs Repository

Repository for lab assignments of the "Server-Side Software Development Technologies (Back-end)" course.

## Variant

Group number: IM-33 => 33 % 3 = 0

## How to run

1. Ensure Node.js is installed on your system
2. Clone this repository:

```bash
git clone https://github.com/soylltari/backend-labs
```

3. Install dependencies:

```bash
npm install
```

4. Run application:

```bash
npm start
```

You should see this in terminal:

```bash
Server listening on port 3000
```

5. Open http://localhost:3000 in your browser

## Run with Docker

If you have Docker installed:

```bash
docker compose up --build
```

Then open http://localhost:3000

### Database Settings (PostgreSQL)

Start the DB:

```bash
docker-compose up db
```

## Migration and ORM

To start migration, execute the command to create tables using the script that loads .env:

```bash
npm run migrate -- --name initial_setup
```

Make sure db container is up.

## Technologies Used

- Node.js
- Express.js
- Prisma
- Zod
