# 📅 Real-Time Event Engagement App 

A modern, full-stack mobile application for discovering and joining events — with **real-time attendee updates** powered by **Socket.IO**, **GraphQL**, and **React Native**.

Purpose of building this app was to test out my own skills and this is built in 3 days to put my consistency in test

[Watch the demo](https://youtu.be/Wx3AaRJsMeg) 🎥

---

## 🚀 Features

- 🔐 **Authentication** — Sign up & sign in with secure JWT-based auth.
- 🧑‍🤝‍🧑 **Join Events** — Explore upcoming events and check in with a tap.
- 🔁 **Live Updates** — See attendees join in real-time using websockets.
- 📦 **Persisted Auth State** — Automatic session restore using Zustand.
- 🧠 **Optimized Data Fetching** — Done using TanStack Query.
- 🔧 **Backend with GraphQL + Prisma + PostgreSQL** — Strongly typed and scalable.

---

## 🧱 Tech Stack

| Layer         | Technology                                   |
|--------------|-----------------------------------------------|
| 💬 Frontend   | React Native (Expo)                           |
| 🧠 State Mgmt | Zustand + TanStack Query                      |
| 🧪 Language    | TypeScript                                    |
| 🛰️ Backend    | Node.js, GraphQL (Pothos), Prisma ORM        |
| 🗃️ Database   | PostgreSQL (via Prisma)                      |
| 📡 Realtime   | Socket.IO                                     |

---

## 🧭 Folder Structure (Simplified)

### `app/`
- Built with **Expo App Router**.
- Contains routing logic, layouts, and screens.

### `components/`
- Reusable UI components like buttons, etc.
- Follows atomic or feature-based design structure.

### `constants/`
- Houses global values like:
  - Color palettes
  - API base URLs & and other constants

### `graphql/`
- Contains:
  - `.ts` files for queries/mutations

### `hooks/`
- Custom hooks including:
  - TanStack Query logic (`useQuery`, `useMutation`)
  - Client-side utilities (e.g., `useAuth`)

### `lib/`
- Initialization files:
  - Socket.IO setup
  - GraphQL Client
  - Other service clients

### `stores/`
- Global state logic using **Zustand**
- Shared state for user, UI themes, auth, etc.

### `utils/`
- Connection to backend server helper functions

### `backend/`
- Fully separate **GraphQL server**
  - Uses Pothos/GraphQL Yoga/etc.
  - Deployed independently (e.g., Vercel, Railway)
- Handles DB (Prisma), auth, and logic
- Exposes API for frontend to consume

---

## 🔑 Auth Flow

- JWT-based access token sent via `Authorization` header.
- Tokens stored locally for session recovery.
- Backend protects GraphQL routes using JWT validation middleware.

---

## ⚡ Real-Time Updates

When a user joins an event:

1. A GraphQL mutation `joinEvent(eventId)` is triggered.
2. Backend emits an event via `Socket.IO`: `event:attendeeAdded`.
3. Frontend listeners (`useEffect`-based) capture this and update the UI instantly.

---

## 🛠️ Local Setup

```bash
# Backend
AFTER POPULATING ENV FILE WITH REQUIRED FIELDS,
npm install
npx prisma db push # PUSHES SCHEMA to db AND generates prisma client and pothos integration files
npm run dev        # Starts GraphQL server + Socket.io

# Frontend
npm install
npx expo start     # Launches the mobile app
```

## 🌐 Deployment Notes

TO BE DONE (SOON)

## 📬 Contact

- Made with ❤️ by Rahul N Bangera
- Connect via [LinkedIn](https://www.linkedin.com/in/rahul-n-bangera)
