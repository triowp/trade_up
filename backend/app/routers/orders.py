from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.order import Order, OrderItem
from ..models.product import Product
from ..models.cart import Cart
from ..schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    total = 0
    items = []

    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")
        total += product.price * item.quantity
        items.append((product, item.quantity))

    new_order = Order(user_id=order.user_id, total_price=total)
    db.add(new_order)
    db.flush()

    for product, quantity in items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price
        )
        product.stock -= quantity
        db.add(order_item)

    db.query(Cart).filter(Cart.user_id == order.user_id).delete()
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/{user_id}", response_model=List[OrderResponse])
def get_orders(user_id: int, db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == user_id).all()

@router.get("/detail/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/status/{order_id}")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    return {"message": "Status updated"}
