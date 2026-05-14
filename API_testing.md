Here are all the endpoints with dummy JSON data ready to paste into Postman.

---

## Base URL
```
http://localhost:5000
```

---

## Admin Routes — `/api/admin`

### 1. Register Admin
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/admin/register` |
| **Auth** | None |

**Body (JSON):**
```json
{
  "name": "Ramesh Admin",
  "email": "ramesh@admin.com",
  "password": "ramesh123",
  "role": "SuperAdmin"
}
```

**Response:**
```json
{
  "_id": "664abc123...",
  "name": "Ramesh Admin",
  "email": "ramesh@admin.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login Admin
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/admin/login` |
| **Auth** | None |

**Body (JSON):**
```json
{
  "email": "ramesh@admin.com",
  "password": "ramesh123"
}
```

**Response:**
```json
{
  "_id": "664abc123...",
  "name": "Ramesh Admin",
  "email": "ramesh@admin.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
> Copy the `token` from this response — you'll need it for all protected routes below.

---

### 3. Get Admin Profile
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/admin/profile` |
| **Auth** | Bearer Token |

**Headers:**
```
Authorization: Bearer <your_token_here>
```

**No Body needed.**

---

## User Routes — `/api/users`
> All user routes require the Bearer token in the header.

**Header for all user routes:**
```
Authorization: Bearer <your_token_here>
```

---

### 4. Create User
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/users` |
| **Auth** | Bearer Token |

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "john1234"
}
```

**Response:**
```json
{
  "_id": "664xyz789...",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 5. Get All Users
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/users` |
| **Auth** | Bearer Token |

**No Body needed.**

**Response:**
```json
[
  {
    "_id": "664xyz789...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-05-05T10:00:00.000Z"
  }
]
```

---

### 6. Get Single User
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/users/<user_id>` |
| **Auth** | Bearer Token |

**Example URL:**
```
http://localhost:5000/api/users/664xyz789...
```

**No Body needed.**

---

### 7. Update User
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `http://localhost:5000/api/users/<user_id>` |
| **Auth** | Bearer Token |

**Body (JSON):**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response:**
```json
{
  "_id": "664xyz789...",
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

---

### 8. Delete User
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `http://localhost:5000/api/users/<user_id>` |
| **Auth** | Bearer Token |

**No Body needed.**

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## Quick Testing Order in Postman

Follow this sequence:

```
1. POST  /api/admin/register   → create your admin
2. POST  /api/admin/login      → grab the token
3. POST  /api/users            → create a user (use token)
4. GET   /api/users            → list all users
5. GET   /api/users/:id        → get one user
6. PUT   /api/users/:id        → update user
7. DELETE /api/users/:id       → delete user
8. GET   /api/admin/profile    → verify admin token works
```

In Postman, go to the **Authorization** tab → select **Bearer Token** → paste the token from step 2. You can also set it as a collection-level variable so you don't have to paste it on every request.