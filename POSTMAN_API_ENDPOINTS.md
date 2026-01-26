# SQL Tutor API Documentation

Comprehensive guide for testing the SQL Tutor API endpoints using Postman or any other HTTP client.

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Users Module](#2-users-module)
3. [Supporting Modules](#3-supporting-modules) (Contact, Contact Info, FAQ, Blog, Banner, Testimonial, Video Management, Pages)
4. [Upload Module](#4-upload-module)
5. [Notification Module](#5-notification-module)
6. [Common Response Formats](#6-common-response-formats)
7. [Testing Workflows](#7-testing-workflows)

---

## 1. Authentication & Authorization

Base URL: `/api/v1/auth`

### User Roles

- `admin`: Full system access

### 1. Login

**POST** `/auth/login`
**Access:** Public

**Request Body (JSON):**

```json
{
  "email": "admin@admin.com",
  "password": "admin1234"
}
```

### 2. Logout

**POST** `/auth/logout`
**Access:** Authenticated (Bearer Token)

### 3. Send OTP (Password Reset)

**POST** `/auth/send-otp`
**Access:** Public

**Request Body (JSON):**

```json
{
  "email": "admin@admin.com"
}
```

### 4. Verify OTP

**POST** `/auth/verify-otp`
**Access:** Public

**Request Body (JSON):**

```json
{
  "email": "admin@admin.com",
  "otp": "123456"
}
```

### 5. Reset Password

**POST** `/auth/reset-password`
**Access:** Public

**Request Body (JSON):**

```json
{
  "token": "RESET_TOKEN_FROM_VERIFY_OTP",
  "newPassword": "newSecurePassword123"
}
```

### 6. Refresh Token

**POST** `/auth/refresh`
**Headers:** `Authorization: Bearer <refreshToken>`

---

## 2. Users Module

Base URL: `/api/v1/users`

### 1. Create User (Admin Only)

**POST** `/users`
**Access:** `ADMIN`
**Request Body (Multipart/Form-Data):**

- `firstName`: "Jane"
- `lastName`: "Doe"
- `email`: "jane.doe@example.com"
- `password`: "securePassword123"
- `image`: [File Upload] (Optional)

### 2. Get All Users

**GET** `/users?page=1&limit=10&role=admin&search=jane`
**Access:** `ADMIN`

### 3. Get Current User Profile

**GET** `/users/me`
**Access:** Authenticated

### 4. Update Current User Profile

**PATCH** `/users/me`
**Access:** Authenticated
**Request Body (Multipart/Form-Data):**

- `firstName`: "Jane Updated"
- `lastName`: "Doe Updated"
- `image`: [File Upload] (Optional)

### 5. Delete My Account

**DELETE** `/users/me`
**Access:** Authenticated

### 6. Get User by ID

**GET** `/users/:id`
**Access:** `ADMIN`

### 7. Update User by ID

**PATCH** `/users/:id`
**Access:** `ADMIN`
**Request Body (JSON):**

```json
{
  "firstName": "Updated Name",
  "isActive": false
}
```

### 8. Remove User by ID

**DELETE** `/users/:id`
**Access:** `ADMIN`

---

## 3. Supporting Modules

### Contact Info

Base URL: `/api/v1/contact-info`

- **GET** `/contact-info` (Public) - Get frontend contact section info.
- **PATCH** `/contact-info` (Admin)
  **Request Body (JSON):**
  ```json
  {
    "email": "contact@sqltutor.com",
    "phone": "+1234567890",
    "addressLine1": "123 SQL Street",
    "addressLine2": "Suite 100",
    "city": "Tech City"
  }
  ```

### Pages (Static Content)

Base URL: `/api/v1`

- **GET** `/privacy-policy` (Public)
- **PUT** `/privacy-policy` (Admin)
  **Request Body (JSON):**
  ```json
  {
    "content": "<h1>Privacy Policy</h1><p>Updated content...</p>",
    "isActive": true
  }
  ```
- **GET** `/terms-and-conditions` (Public)
- **PUT** `/terms-and-conditions` (Admin)
  **Request Body (JSON):**
  ```json
  {
    "content": "<h1>Terms and Conditions</h1><p>Updated content...</p>",
    "isActive": true
  }
  ```
- **GET** `/about-us` (Public)
- **PUT** `/about-us` (Admin)
  **Request Body (JSON):**
  ```json
  {
    "content": "<h1>About Us</h1><p>Updated content...</p>",
    "isActive": true
  }
  ```

### Video Management

Base URL: `/api/v1/video`

- **POST** `/video` (Admin)
  **Request Body (Multipart/Form-Data):**
  - `title`: "Introduction to SQL"
  - `description`: "A beginner's guide to SQL basics."
  - `file`: [Video File Upload]
- **GET** `/video` (Public) - Get all videos.
- **GET** `/video/:id` (Public) - Get video by ID.
- **PATCH** `/video/:id` (Admin)
  **Request Body (Multipart/Form-Data):**
  - `title`: "Updated Title"
  - `file`: [Optional New Video File]
- **DELETE** `/video/:id` (Admin) - Remove video.

### Blog

Base URL: `/api/v1/blog`

- **POST** `/blog` (Admin)
  **Request Body (Multipart/Form-Data):**
  - `title`: "Mastering Joins"
  - `content`: "Detailed explanation of SQL joins..."
  - `image`: [Image File Upload]
- **GET** `/blog` (Public) - Get all posts.
- **GET** `/blog/:id` (Public) - Get post by ID.
- **PATCH** `/blog/:id` (Admin)
  **Request Body (Multipart/Form-Data):**
  - `title`: "Updated Blog Title"
  - `image`: [Optional New Image File]
- **DELETE** `/blog/:id` (Admin) - Remove post.

### FAQ

Base URL: `/api/v1/faq`

- **POST** `/faq` (Admin)
  **Request Body (JSON):**
  ```json
  {
    "question": "What is SQL?",
    "answer": "Structured Query Language...",
    "isActive": true
  }
  ```
- **GET** `/faq` (Public)
- **PATCH** `/faq/:id` (Admin)
- **DELETE** `/faq/:id` (Admin)

### Banner

Base URL: `/api/v1/banner`

- **POST** `/banner` (Admin)
  **Request Body (JSON):**
  ```json
  {
    "title": "Welcome to SQL Tutor",
    "videoUrl": "https://youtube.com/..."
  }
  ```
- **GET** `/banner` (Public)

### Testimonial

Base URL: `/api/v1/testimonial`

- **POST** `/testimonial` (Admin)
  **Request Body (Multipart/Form-Data):**
  - `quote`: "Great platform!"
  - `authorName`: "John Smith"
  - `authorTitle`: "Data Analyst"
  - `image`: [File Upload] (Optional)
  - `isActive`: true (Optional)
- **GET** `/testimonial` (Public)
- **PATCH** `/testimonial/:id` (Admin)
  **Request Body (Multipart/Form-Data):**
  - `quote`: "Updated quote"
  - `image`: [Optional New Avatar File]

### Contact (Submissions)

Base URL: `/api/v1/contact`

- **POST** `/contact` (Public)
  **Request Body (JSON):**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I have a question about the courses."
  }
  ```
- **GET** `/contact` (Admin) - View submissions.

---

## 4. Upload Module

Base URL: `/api/v1/upload`

### 1. Regular File Upload

**POST** `/upload/file`
**Access:** Authenticated
**Request Body (Multipart/Form-Data):**

- `file`: [File Upload]

### 2. Upload for User

**POST** `/upload/user/:userId/:type`
**Access:** Public (or as per logic)
**Path Params:**

- `userId`: ID of the user
- `type`: `general`, `images`, or `documents`
  **Request Body (Multipart/Form-Data):**
- `file`: [File Upload]

### 3. Delete File

**DELETE** `/upload`
**Access:** Authenticated
**Request Body (JSON):**

```json
{
  "key": "path/to/file.jpg"
}
```

---

## 5. Notification Module

Base URL: `/api/v1/notifications`

### 1. Create Notification

**POST** `/notifications`
**Access:** Authenticated
**Request Body (JSON):**

```json
{
  "title": "New Message",
  "body": "You have a new message from admin.",
  "userId": "TARGET_USER_ID",
  "metadata": {
    "link": "/dashboard"
  }
}
```

_Note: Non-admins can only send notifications to themselves._

### 2. Get My Notifications

**GET** `/notifications`
**Access:** Authenticated

### 3. Mark as Read

**PATCH** `/notifications/:id/read`
**Access:** Authenticated (Owner only)

---

## 6. Common Response Formats

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## 7. Testing Workflows

### Admin Management Workflow

1. **Login** with Seeded Admin (`/auth/login`)
2. **Create New Admin** (`/users`)
3. **Get All Admins** (`/users`)
4. **Update Profile** (`/users/me`)
5. **Logout** (`/auth/logout`)
