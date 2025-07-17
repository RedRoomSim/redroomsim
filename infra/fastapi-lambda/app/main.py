from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routes.sim_router import sim_router
from routes.logging_router import router as logging_router
from routes.progress_router import progress_router
from routes.audit_router import router as audit_router
from services.audit_service import record_audit_event
from mangum import Mangum

app = FastAPI()

origins = [
    "https://redroomsim.com",
    "https://www.redroomsim.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    """Capture every request in the audit table."""
    response = await call_next(request)
    try:
        actor = request.headers.get("x-user")  # optional user performing the request
        action = f"{request.method} {request.url.path}"  # summarize the action
        record_audit_event(actor=actor, action=action)
    except Exception:
        # Never interrupt a request if audit logging fails
        pass
    return response

app.include_router(sim_router, prefix="/sim")
app.include_router(logging_router, prefix="/logs")
app.include_router(progress_router, prefix="/progress")
app.include_router(audit_router, prefix="/audit")

handler = Mangum(app)
