** .env is included because it doesn't include sensitive information **
# 🧾Postgres Membership Management API with Prisma

A Node.js RESTful API for managing members and their memberships using PostgreSQL and Prisma ORM. This project demonstrates a clean architecture with Express.js, Prisma, and modular service/controller layers.

## ✨Features

- **👤Member Management:**  
  - Create, read, update, and delete members.
  - Pagination and sorting for member lists.
- **💳Membership Management:**  
  - Assign memberships to members with start and end dates.
  - CRUD operations for memberships.
  - Pagination and sorting for memberships.
- **🔒Validation & Security:**  
  - Input validation for dates and required fields.
  - Allowed sort fields to prevent SQL injection.
- **🧹Cascade Delete:**  
  - Deleting a member also deletes their memberships (cascade).

## Project Structure

## 🗂️ Project Structure

```
.
├── .env
├── .gitignore
├── package.json
├── PRISMA_Folders_Structure.pdf
├── prisma/                             #   Prisma ORM setup and migrations
│   ├── schema.prisma
│   └── migrations/                     #   Database migration history
│       ├── migration_lock.toml
│       ├── 20250511114921_init/
│       │   └── migration.sql
│       ├── 20250512055316_membership/
│       │   └── migration.sql
│       └── 20250513155357_added_cascade_delete/
│           └── migration.sql
└── src/                                #   Main source code
    ├── server.js
    ├── controllers/                    #   Route handlers for API logic
    │   ├── memberController.js
    │   └── membershipController.js
    ├── helpers/                        #   Utility functions
    │   ├── allowedSortFields.js
    │   └── newDateConverter.js
    ├── routes/                         #   Express route definitions
    │   ├── memberRoutes.js
    │   └── membershipRoutes.js
    └── services/                       #   Business logic and database interaction
        ├── memberService.js
        └── membershipService.js
```


## 📡API Endpoints

### 👤Member Endpoints

- `POST   /api/member`  
  Create a new member.

- `GET    /api/member`  
  Get paginated members. Query: `?page=1&pageSize=10&sortBy=name&order=asc|desc`

- `GET    /api/member/:id`  
  Get a member by ID.

- `PUT    /api/member/:id`  
  Update a member.

- `DELETE /api/member/:id`  
  Delete a member (also deletes their memberships).

### 💳Membership Endpoints

- `POST   /api/membership/:id`  
  Add a membership for a member (by member ID).

- `GET    /api/membership`  
  Get paginated memberships. Query: `?page=1&pageSize=10&sortBy=startDate&order=asc|desc`

- `GET    /api/membership/:id`  
  Get a membership by ID.

- `PUT    /api/membership/:id`  
  Update a membership.

- `DELETE /api/membership/:id`  
  Delete a membership.

## ⚙️Setup & Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/PrasiddhaBhattarai/PostgreSQL-PRISMA-Membership-Manager.git
cd <project-folder>
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add your PostgreSQL connection string:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
PORT=3000
```

### 4️⃣ Set Up the Database

Run Prisma migrations to set up the database schema:

```sh
npx prisma migrate deploy
```

Or, for development:

```sh
npx prisma migrate dev
```

### 5️⃣ Start the Server

```sh
npm run dev
```

The server will run on `http://localhost:3000` by default.

## 🧬Prisma Schema

See [`prisma/schema.prisma`](prisma/schema.prisma) for model definitions.

## 📝Notes

- Dates must be in `YYYY-MM-DD` format.
- Pagination defaults: `page=1`, `pageSize=10` (max 50).
- Only allowed fields can be used for sorting (see [`src/helpers/allowedSortFields.js`](src/helpers/allowedSortFields.js)).
- Cascade delete is enabled for memberships when a member is deleted.

## 📄License

MIT

---

🎉**Happy coding!**
