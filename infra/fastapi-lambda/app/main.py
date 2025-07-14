from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.sim_router import sim_router
from routes.logging_router import router as logging_router
from routes.progress_router import progress_router
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

app.include_router(sim_router, prefix="/sim")
app.include_router(logging_router, prefix="/logs")
app.include_router(progress_router, prefix="/progress")

handler = Mangum(app)
