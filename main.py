# from fastapi import FastAPI 

# from fastapi.middleware.cors import CORSMiddleware

# app=FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

# # @app.get("/")
# # def root():
# #     return {"Hello":"World"}

# @app.route("/http://127.0.0.1:8000/", methods=["GET"])
# def get_all_guides():
#     guides = Guide.query.all()
#     guide_list = [{"id": guide.id, "title": guide.title, "content": guide.content} for guide in guides]
#     return jsonify(guide_list), 200

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Example model
class Item(BaseModel):
    name: str
    price: float
    in_stock: bool

# Example routes
@app.get("/")
async def root():
    return {"message": "Hello from FastAPI!"}

@app.post("/items/")
async def create_item(item: Item):
    return {"name": item.name, "price": item.price, "in_stock": item.in_stock}
