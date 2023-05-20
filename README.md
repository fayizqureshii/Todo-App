# Smart To-Do

A full-stack task manager built with the MERN stack: **MongoDB**, **Express**, **React**, and **Node.js**.

Users can add tasks, mark them complete, edit text (double-click a task), and delete them. Tasks persist in MongoDB across page refreshes.

## Tech stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React (hooks), Vite                 |
| API      | Node.js, Express, REST              |
| Database | MongoDB with Mongoose               |

## Project structure

```
todo-app/
├── client/          # React + Vite UI
├── server/          # Express REST API
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- MongoDB — either:
  - **Local:** [MongoDB Community](https://www.mongodb.com/try/download/community)
  - **Cloud:** [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)

## Setup

### 1. MongoDB

**Local (default):**

```bash
# macOS with Homebrew
brew services start mongodb-community
```

Connection string: `mongodb://127.0.0.1:27017/todoapp`

**Atlas:**

1. Create a cluster and database user.
2. Whitelist your IP (or `0.0.0.0/0` for development).
3. Copy the connection string into `server/.env`.

### 2. Server

```bash
cd server
cp .env.example .env
# Edit .env if using Atlas or a custom port
npm install
npm run dev
```

Server runs at `http://localhost:3000`.

### 3. Client

In a second terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment variables

### Server (`server/.env`)

| Variable       | Default                              | Description              |
| -------------- | ------------------------------------ | ------------------------ |
| `PORT`         | `3000`                               | API port                 |
| `MONGODB_URI`  | `mongodb://127.0.0.1:27017/todoapp`  | MongoDB connection       |
| `CLIENT_URL`   | `http://localhost:5173`              | CORS allowed origin      |

### Client (`client/.env`)

| Variable        | Default                              | Description   |
| --------------- | ------------------------------------ | ------------- |
| `VITE_API_URL`  | `http://localhost:3000/api/tasks`    | Tasks API URL |

## API endpoints

| Method   | Path              | Description        |
| -------- | ----------------- | ------------------ |
| `GET`    | `/api/tasks`      | List all tasks     |
| `POST`   | `/api/tasks`      | Create a task      |
| `PATCH`  | `/api/tasks/:id`  | Update task        |
| `DELETE` | `/api/tasks/:id`  | Delete task        |
| `GET`    | `/api/health`     | Health check       |

**Create example:**

```json
POST /api/tasks
{ "text": "Buy milk" }
```

**Update example:**

```json
PATCH /api/tasks/:id
{ "completed": true }
```

## Features

- Add tasks with client-side validation (empty tasks blocked)
- Mark tasks complete / incomplete
- Edit task text (double-click, Enter to save, Escape to cancel)
- Delete tasks
- Server-side validation for empty text
- Responsive layout for mobile and desktop

## Scripts

| Location | Command        | Purpose              |
| -------- | -------------- | -------------------- |
| `server` | `npm run dev`  | Start API with watch |
| `server` | `npm start`    | Start API            |
| `client` | `npm run dev`  | Start Vite dev server|
| `client` | `npm run build`| Production build     |

## License

MIT
