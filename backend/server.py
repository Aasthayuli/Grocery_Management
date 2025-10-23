from flask import Flask, request, jsonify
from flask_cors import CORS

import products_dao
from sql_connection import get_sql_connection

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins":"http://localhost:5173"}}, supports_credentials=True)

connection = get_sql_connection()

@app.route('/getProducts', methods=['GET'])
def get_products():
    products = products_dao.get_all_products(connection)
    response = jsonify(products)
    return response


@app.route('/addProduct', methods=['POST'])
def add_product():
    product = request.get_json()
    product_id = products_dao.insert_new_product(connection, {
        'product_name':product['name'], 
        'uom_id':product['unit'], 
        'price_per_unit':product['price'],
        'stock':product['stock']
    })
    response = jsonify({'product_id': product_id, "msg":"Product Added Successfully"})
    return response

@app.route('/deleteProduct/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        products_dao.delete_row(connection, product_id)
        response = jsonify({"id":product_id,"msg":"Product Deleted Successfully"})
        return response
    except Exception as e:
        print("Error in deleting Product: ", e)
        return jsonify({"Error":str(e)}), 500
    
@app.route('/updateProduct/<int:product_id>', methods=['PATCH'])
def update_product(product_id):
    try:
        product = request.get_json()
        product_id = products_dao.update_product(connection, {
        'product_name':product['name'], 
        'uom_id':product['unit'], 
        'price_per_unit':product['price'],
        'stock':product['stock']
    }, product_id)
        response = jsonify({"id":product_id,"msg":"Product Updated Successfully"})
        return response
    except Exception as e:
        print("Error in updating Product: ", e)
        return jsonify({"Error":str(e)}), 500


if __name__ == "__main__":
    print("Starting Python Flask server for Grocery store Management System")
    app.run(port=5000)