from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.cart import Cart
from ..models.product import Product
from ..schemas.cart import CartItemAdd, CartItemResponse

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("/{user_id}", response_model=List[CartItemResponse])
def get_cart(user_id: int, db: Session = Depends(get_db)):
    return db.query(Cart).filter(Cart.user_id == user_id).all()

@router.post("/{user_id}", response_model=CartItemResponse)
def add_to_cart(user_id: int, item: CartItemAdd, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.product_id == item.product_id
    ).first()

    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = Cart(user_id=user_id, product_id=item.product_id, quantity=item.quantity)
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{user_id}/{item_id}")
def remove_from_cart(user_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(Cart).filter(Cart.id == item_id, Cart.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed"}

@router.delete("/{user_id}")
def clear_cart(user_id: int, db: Session = Depends(get_db)):
    db.query(Cart).filter(Cart.user_id == user_id).delete()
    db.commit()
    return {"message": "Cart cleared"}