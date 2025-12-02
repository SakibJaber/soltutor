# Postman API Endpoints - Tutor Platform

Base URL: `http://localhost:3000`

## Flow Overview

1. **Register Parent** → Create User
2. **Login** → Get Access Token
3. **Create Parent Profile** → Add Children
4. **Submit Consultation** → Parent request
5. **Admin: Schedule Meeting** → Update consultation
6. **Admin: Create Package** → Learning package
7. **Create Checkout Session** → Stripe payment
8. **Webhook** → Activate package
9. **Admin: Manage Blog** → Create/publish blog posts

---

## 1. Authentication

### Register User (Parent)

```
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "parent@example.com",
  "password": "SecurePass123!",
  "role": "PARENTS"
}
```

### Register User (Admin)

```
POST /auth/register
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "role": "ADMIN"
}
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

**Note:** Save the `accessToken` for subsequent requests.

---

## 2. Parent Profile & Children

### Create Parent Profile with Children

```
POST /parents
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userId": "USER_ID_FROM_REGISTRATION",
  "phoneNumber": "+1234567890",
  "address": "123 Main St, City, Country",
  "children": [
    {
      "name": "Alice Doe",
      "age": 10,
      "grade": "5th Grade",
      "subjectsOfInterest": ["Math", "Science"]
    },
    {
      "name": "Bob Doe",
      "age": 8,
      "grade": "3rd Grade",
      "subjectsOfInterest": ["English", "Art"]
    }
  ]
}

Response:
{
  "_id": "PARENT_ID",
  "user": { ... },
  "children": [
    {
      "_id": "CHILD_1_ID",
      "name": "Alice Doe",
      ...
    },
    {
      "_id": "CHILD_2_ID",
      "name": "Bob Doe",
      ...
    }
  ]
}
```

### Get All Parents

```
GET /parents
Authorization: Bearer {accessToken}
```

### Get Single Parent

```
GET /parents/{parentId}
Authorization: Bearer {accessToken}
```

---

## 3. Consultation Requests

### Create Consultation (Parent)

```
POST /consultations
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "parentId": "PARENT_ID",
  "childIds": ["CHILD_1_ID", "CHILD_2_ID"],
  "preferredSubjects": ["Math", "Science", "English"],
  "goals": "Help my children improve in STEM subjects and build confidence in problem-solving"
}

Response:
{
  "_id": "CONSULTATION_ID",
  "parentId": "PARENT_ID",
  "childIds": ["CHILD_1_ID", "CHILD_2_ID"],
  "status": "PENDING_REVIEW",
  ...
}
```

### Get All Consultations

```
GET /consultations
Authorization: Bearer {accessToken}
```

### Get Single Consultation

```
GET /consultations/{consultationId}
Authorization: Bearer {accessToken}
```

### Update Consultation - Schedule Meeting (Admin)

```
PATCH /consultations/{consultationId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "SCHEDULED",
  "meeting": {
    "meetingUrl": "https://zoom.us/j/123456789",
    "scheduledAt": "2025-12-10T14:00:00.000Z"
  }
}
```

---

## 4. Learning Packages

### Create Package (Admin)

```
POST /packages
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "parentId": "PARENT_ID",
  "consultationRequestId": "CONSULTATION_ID",
  "children": [
    {
      "childId": "CHILD_1_ID",
      "subjects": ["Math", "Science"],
      "hoursPerWeek": 4
    },
    {
      "childId": "CHILD_2_ID",
      "subjects": ["English"],
      "hoursPerWeek": 2
    }
  ],
  "totalHoursPerWeek": 6,
  "durationInWeeks": 12,
  "price": {
    "amount": 500,
    "currency": "usd"
  }
}

Response:
{
  "_id": "PACKAGE_ID",
  "status": "DRAFT",
  ...
}
```

### Get All Packages

```
GET /packages
Authorization: Bearer {accessToken}
```

### Get Single Package

```
GET /packages/{packageId}
Authorization: Bearer {accessToken}
```

### Update Package

```
PATCH /packages/{packageId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "PENDING_PAYMENT",
  "durationInWeeks": 16
}
```

---

## 5. Tutors

### Create Tutor Profile

```
POST /tutors
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userId": "TUTOR_USER_ID",
  "subjects": ["Math", "Physics", "Chemistry"],
  "bio": "Experienced STEM tutor with 5+ years of teaching",
  "qualifications": ["MSc in Mathematics", "Certified Teacher"],
  "availability": {
    "monday": ["9:00-12:00", "14:00-17:00"],
    "wednesday": ["9:00-12:00", "14:00-17:00"],
    "friday": ["9:00-12:00"]
  }
}
```

### Get All Tutors

```
GET /tutors
Authorization: Bearer {accessToken}
```

### Get Single Tutor

```
GET /tutors/{tutorId}
Authorization: Bearer {accessToken}
```

---

## 6. Payments (Stripe)

### Create Checkout Session

**Note:** You'll need to implement this endpoint in PaymentsController

```
POST /payments/create-checkout-session
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "packageId": "PACKAGE_ID",
  "customerEmail": "parent@example.com"
}

Response:
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### Stripe Webhook (Public - No Auth)

```
POST /payments/webhook
Stripe-Signature: {signature_from_stripe}
Content-Type: application/json

{
  "id": "evt_...",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "metadata": {
        "packageId": "PACKAGE_ID"
      },
      ...
    }
  }
}
```

---

## Testing Sequence

### Step 1: Setup

1. Register Parent user → Save `userId`
2. Register Admin user
3. Login as Parent → Save `accessToken`

### Step 2: Parent Flow

4. Create Parent profile with children → Save `parentId`, `childIds`
5. Create Consultation → Save `consultationId`

### Step 3: Admin Flow (Login as Admin)

6. Login as Admin → Get admin `accessToken`
7. Get consultations → Find the created one
8. Update consultation with meeting details

### Step 4: Package Flow (Admin)

9. Create Learning Package → Save `packageId`
10. Verify package status is `DRAFT`

### Step 5: Payment Flow (Parent)

11. Login as Parent
12. Create Checkout Session (you need to implement this endpoint)
13. Simulate Webhook call (or use Stripe CLI)
14. Verify package status changed to `ACTIVE`

---

## Additional Implementation Needed

### Create Checkout Session Endpoint

Add this to `PaymentsController`:

```typescript
@Post('create-checkout-session')
async createCheckoutSession(
  @Body() body: { packageId: string; customerEmail: string },
) {
  const pkg = await this.packagesService.findOne(body.packageId);

  const session = await this.stripeService.createCheckoutSession(
    body.packageId,
    `Learning Package - ${pkg.totalHoursPerWeek}hrs/week`,
    pkg.price.amount,
    pkg.price.currency,
    body.customerEmail,
  );

  return {
    sessionId: session.id,
    url: session.url,
  };
}
```

---

## Environment Variables Required

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL for Stripe redirects
FRONTEND_URL=http://localhost:3000
```

---

## 7. Blog Posts

### Get All Published Blog Posts (Public)

```
GET /blog?page=1&limit=10&category=Tutorial&tags=NestJS&search=authentication
# No authentication required
```

### Get Single Blog Post (Public)

```
GET /blog/getting-started-with-nestjs
# or by ID
GET /blog/{blogId}
# No authentication required
```

### Get Categories (Public)

```
GET /blog/meta/categories
```

### Get Tags (Public)

```
GET /blog/meta/tags
```

### Increment View Count (Public)

```
PATCH /blog/{blogId}/view
```

### Create Blog Post (Admin)

```
POST /blog
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Getting Started with NestJS",
  "content": "This is the full blog content...",
  "excerpt": "A brief introduction to NestJS",
  "author": "USER_ID",
  "category": "Tutorial",
  "tags": ["NestJS", "Backend", "TypeScript"],
  "featuredImage": "https://example.com/image.jpg",
  "status": "draft",
  "metaDescription": "Learn NestJS basics",
  "metaKeywords": ["nestjs", "tutorial"]
}
```

### Get All Blog Posts (Admin)

```
GET /blog/admin/all?page=1&limit=10&status=draft&category=Tutorial
Authorization: Bearer {accessToken}
```

### Update Blog Post (Admin)

```
PATCH /blog/{blogId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "Advanced Tutorial"
}
```

### Publish Blog Post (Admin)

```
PATCH /blog/{blogId}/publish
Authorization: Bearer {accessToken}
```

### Unpublish Blog Post (Admin)

```
PATCH /blog/{blogId}/unpublish
Authorization: Bearer {accessToken}
```

### Delete Blog Post (Admin)

```
DELETE /blog/{blogId}
Authorization: Bearer {accessToken}
```

---

## Notes

1. **Authentication**: All endpoints except `/auth/*` and `/payments/webhook` require `Authorization: Bearer {accessToken}` header
2. **Role-Based Access**: Some endpoints should be restricted by role (Admin, Parent, Tutor)
3. **IDs**: Replace placeholders like `USER_ID`, `PARENT_ID` with actual MongoDB ObjectIds from responses
4. **Stripe Testing**: Use Stripe test mode keys and test card `4242 4242 4242 4242`
5. **Webhook Testing**: Use Stripe CLI to forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/payments/webhook
   ```
