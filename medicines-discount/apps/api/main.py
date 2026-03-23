"""
medicines.discount — FastAPI Backend
Port: 8007
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.database import engine, Base
from app.routers import drugs, salts, manufacturers, prices, search, kendras, geo, affiliate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("medicines.discount API starting on port 8007")
    yield
    logger.info("medicines.discount API shutting down")


app = FastAPI(
    title="medicines.discount API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3008", "https://medicines.discount"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(drugs.router,         prefix="/api/drugs",         tags=["drugs"])
app.include_router(salts.router,         prefix="/api/salts",         tags=["salts"])
app.include_router(manufacturers.router, prefix="/api/manufacturers", tags=["manufacturers"])
app.include_router(prices.router,        prefix="/api/prices",        tags=["prices"])
app.include_router(search.router,        prefix="/api/search",        tags=["search"])
app.include_router(kendras.router,       prefix="/api/kendras",       tags=["kendras"])
app.include_router(geo.router,           prefix="/api/geo",           tags=["geo"])
app.include_router(affiliate.router,     prefix="/api/affiliate",     tags=["affiliate"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "medicines-discount-api"}
