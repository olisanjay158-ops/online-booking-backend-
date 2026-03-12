# Week 5 Demo Script

## Objective
Demonstrate that the backend API is deployed and functioning in the staging environment.

## Demo Steps

1. Open the deployed API documentation:

https://online-booking-backend-qyvh.onrender.com/docs

2. Verify the health endpoint

GET /healthz

Expected response:
{
  "status": "ok"
}

3. Create a user account

POST /auth/signup

Expected result:
201 Created

4. Login using the created account

POST /auth/login

Expected result:
200 OK

Response includes:
access_token

5. Show server logs

Open Render dashboard → Logs

Confirm requests:
POST /auth/signup
POST /auth/login

## Evidence

- login_success.png
- render_logs.png

## Result

Backend API successfully deployed to Render and authentication flow verified.