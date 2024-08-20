from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .api_routes import router

app = FastAPI()

app.include_router(router)
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)