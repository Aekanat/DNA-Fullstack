from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import dataRoute, metadataRoutes, modelRoutes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(dataRoute.router, prefix="/data")
app.include_router(metadataRoutes.router, prefix="/metadata")
app.include_router(modelRoutes.router,    prefix="/model")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
