from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.sim_router import sim_router as sim_router
from routes.logging_router import router as logging_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    #["http://localhost:5173"],  # or "*" for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sim_router, prefix="/api/sim")
app.include_router(logging_router, prefix="/api/logs")
