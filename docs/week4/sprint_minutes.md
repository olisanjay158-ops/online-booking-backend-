
Date: March 2026  
Sprint: OABS Sprint 1  

Agenda
- Finalise mock dataset (app/mock/users.json)
- Implement server-side validation and structured errors (HTTP 400)
- Add negative tests using pytest
- Capture evidence screenshots and save under docs/week4/

Decisions
- Use FastAPI validation + custom error handler for consistent 400 responses
- Use pytest and loop through mock dataset rows for negative testing
- Store all evidence inside docs/week4 for submission

Improvements 
- Add CI workflow (GitHub Actions) to automatically run pytest on every push
- Add .gitignore to exclude venv, __pycache__, and .env from repo
- Expand test coverage to include bookings and auth endpoints