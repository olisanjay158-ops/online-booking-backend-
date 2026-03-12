from dotenv import load_dotenv
load_dotenv()

from datetime import datetime 
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.routers import users, bookings, auth
from app.week4_validation import router as week4_router

app = FastAPI(title="Online Booking Backend", debug=True)

# CORS (needed for frontend UI like Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Week 4: force structured validation errors + HTTP 400
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []

    for err in exc.errors():
        loc = err.get("loc", [])
        field = loc[-1] if loc else "unknown"
        message = err.get("msg", "Invalid input")

        errors.append({
            "field": str(field),
            "message": str(message)
        })

    return JSONResponse(status_code=400, content={"errors": errors})


# register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(bookings.router)
app.include_router(week4_router)


@app.get("/")
def root():
    return {"message": "Online Booking Backend Running"}


@app.get("/healthz")
def healthz():
    return {
        "status": "ok",
        "version": "1.0",
        "time": datetime.utcnow().isoformat()
    } 