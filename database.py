from sqlalchemy import create_engine
from  sqlalchemy.orm import sessionmaker


db_url = "mysql+pymysql://root:Sinan%402003@localhost:3306/mydatabase"
engine = create_engine(db_url)
session= sessionmaker(autocommit=False,autoflush = False, bind=engine )