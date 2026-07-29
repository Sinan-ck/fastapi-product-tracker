from fastapi import Depends,FastAPI
from models import product
from database import session
import database_model
from database import  engine
from sqlalchemy.orm import Session
from  fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware( 
     CORSMiddleware,
     allow_origins=["http://localhost:3000"],
    allow_methods =["*"] )
database_model.Base.metadata.create_all(bind=engine)
@app.get("/")
def greet():
    return "hello world"

products = [
    product(id=1,name="phone",description="this is a phone",price=1000.0,quantity=10),
    product(id=2,name="laptop",description="this is a laptop",price=2000.0,quantity=5),
    product(id=5,name="tablet",description="this is a tablet",price=500.0,quantity=20),
    product(id=4,name="headphones",description="this is a headphones",price=100.0,quantity=15),
    product(id=3,name="smartwatch",description="this is a smartwatch",price=300.0,quantity=8)


]

def get_db():
    db=session()
    try:
        yield db
    finally:
        db.close()     
def  init_db():
    db = session()
    
    count = db.query(database_model.product).count()
    if count == 0:
        for product in products:
            db.add(database_model.product(**product.model_dump()))

        db.commit()
        db.close()
init_db()    

@app.get("/products")
def get_products(db:Session = Depends(get_db)):
    db_products = db.query(database_model.product).all()
    return db_products

@app.get("/products/{id}")
def product_id( id : int, db:Session = Depends(get_db)):
    db_products = db.query(database_model.product).filter(database_model.product.id == id).first()
    if db_products:
            return db_products
    return "product not found"
@app.post("/products")
def add_product(product:product, db:Session = Depends(get_db)):
    db_products = db.add(database_model.product(**product.model_dump()))
    db.commit()
    return product
@app.put("/products")
def updt_product(product:product , id :int, db:Session = Depends(get_db)):
    get_products = db.query(database_model.product).filter(database_model.product.id==id).first()       
    if get_products:
            get_products.name = product.name
            get_products.description = product.description
            get_products.price = product.price
            get_products.quantity = product.quantity
            db.commit()
            return "updated successfuly"
    return "product not found"
@app.delete("/products")
def delete_product(id:int,db:Session = Depends(get_db)):
    db_products = db.query(database_model.product).filter(database_model.product.id == id).first()
    if db_products:
        db.delete(db_products)
        db.commit()
        return "successfully deleted"
    return "product not found"    


     