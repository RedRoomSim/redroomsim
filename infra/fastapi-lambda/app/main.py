from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from routes.sim_router import sim_router
from routes.logging_router import router as logging_router
from mangum import Mangum

app = FastAPI()

origins = [
    "https://redroomsim.com",
    "https://www.redroomsim.com",
]

@app.options("/{full_path:path}")
def preflight_handler(full_path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "https://redroomsim.com",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
        },
    )


@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "https://redroomsim.com"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
    return response

app.include_router(sim_router, prefix="/sim")
app.include_router(logging_router, prefix="/logs")

handler = Mangum(app)
