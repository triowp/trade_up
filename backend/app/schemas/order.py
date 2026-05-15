from pydantic import BaseModel
from typing import List, Optional
from .product import ProductResponse

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductResponse

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    user_id: int
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_price: float
    status: str
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
