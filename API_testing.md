Your base URL from `.env` is:

```txt
http://localhost:5000
```

First run your server:

```bash
npm run dev
```

In Postman, set these variables:

```txt
baseUrl = http://localhost:5000
accessToken = paste login/register accessToken here
refreshToken = paste login/register refreshToken here
userId = paste created user _id here
```

For JSON APIs, use header:

```txt
Content-Type: application/json
```

For protected APIs, also add:

```txt
Authorization: Bearer {{accessToken}}
```

**Step 1: Health Check**

```txt
GET {{baseUrl}}/
```

Response:

```txt
Hello Welcome to the Backend of Admin CRUD Operations
```

```txt
GET {{baseUrl}}/check
```

Response:

```json
{
  "status": "ok",
  "uptime": 12.34
}
```

**Step 2: Register Admin**

```txt
POST {{baseUrl}}/api/admin/register
```

Body:

```json
{
  "name": "Ramesh Admin",
  "email": "admin@example.com",
  "password": "123456",
  "role": "Admin"
}
```

Response:

```json
{
  "_id": "admin_id",
  "name": "Ramesh Admin",
  "email": "admin@example.com",
  "role": "Admin",
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

Save:

```txt
accessToken = response.accessToken
refreshToken = response.refreshToken
```

**Step 3: Login Admin**

```txt
POST {{baseUrl}}/api/admin/login
```

Body:

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "_id": "admin_id",
  "name": "Ramesh Admin",
  "email": "admin@example.com",
  "role": "Admin",
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

**Step 4: Admin Profile**

```txt
GET {{baseUrl}}/api/admin/profile
```

Headers:

```txt
Authorization: Bearer {{accessToken}}
```

Response:

```json
{
  "message": "Admin Profile",
  "admin": {
    "_id": "admin_id",
    "name": "Ramesh Admin",
    "email": "admin@example.com",
    "role": "Admin"
  }
}
```

**Step 5: Refresh Access Token**

```txt
POST {{baseUrl}}/api/admin/refresh-token
```

Body:

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

Response:

```json
{
  "accessToken": "new_jwt_access_token"
}
```

Update your Postman `accessToken`.

**Step 6: Create User**

```txt
POST {{baseUrl}}/api/users
```

Headers:

```txt
Authorization: Bearer {{accessToken}}
```

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

Save:

```txt
userId = response._id
```

**Step 7: Get All Users**

```txt
GET {{baseUrl}}/api/users
```

With pagination/search:

```txt
GET {{baseUrl}}/api/users?page=1&limit=5&search=john
```

Headers:

```txt
Authorization: Bearer {{accessToken}}
```

Response:

```json
{
  "total": 1,
  "page": 1,
  "limit": 5,
  "pages": 1,
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isDeleted": false,
      "deletedAt": null,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Step 8: Get Single User**
Important: your code currently has this route:

```js
router.get("userid/:id", protectAdmin, getUserById);
```

That is missing a `/`. It should probably be:

```js
router.get("/:id", protectAdmin, getUserById);
```

After fixing it, use:

```txt
GET {{baseUrl}}/api/users/{{userId}}
```

Headers:

```txt
Authorization: Bearer {{accessToken}}
```

Response:

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "isDeleted": false,
  "deletedAt": null,
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Step 9: Update User**

```txt
PUT {{baseUrl}}/api/users/{{userId}}
```

Headers:

```txt
Authorization: Bearer {{accessToken}}
```

Body:

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

Response:

```json
{
  "_id": "user_id",
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Step 10: Soft Delete User**

```txt
DELETE {{baseUrl}}/api/users/{{userId}}
```

Headers:

```txt
Authorization: Bearer {{accessToken}}
```

Response:

```json
{
  "message": "User deleted successfully"
}
```

**Step 11: Restore Deleted User**

```txt
PATCH {{baseUrl}}/api/users/{{userId}}/restore
```

Headers:

```txt
Authorization: Bearer {{accessToken}}
```

Response:

```json
{
  "message": "User restored successfully"
}
```

**Step 12: Logout Admin**

```txt
POST {{baseUrl}}/api/admin/logout
```

Body:

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

Response:

```json
{
  "message": "Logged out successfully"
}
```

Common errors:

```json
{ "message": "No token provided" }
```

```json
{ "message": "Invalid token" }
```

```json
{ "message": "Token expired, please refresh" }
```

```json
{ "message": "Route not found" }
```

Also your Swagger docs are mounted here:

```txt
GET {{baseUrl}}/api-docs
```
