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
    try:
        product = request.get_json()
        backend_product = {
            'product_name': product['name'],
            'uom_id': product['unit'],
            'price_per_unit': product['price'],
            'stock': product['stock'],
            'is_active': product.get('is_active', 1),  # default 1
            'product_id': product.get('id', None)      # for update check
        }

        result = products_dao.insert_new_product(connection, backend_product)

        return jsonify(result)
    
    except Exception as e:
        print("Error in adding Product:", e)
        return jsonify({"status":"error","msg":str(e)}), 500

@app.route('/deleteProduct/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        result = products_dao.delete_row(connection, product_id)
        response = jsonify(result)
        return response
    except Exception as e:
        print("Error in deleting Product: ", e)
        return jsonify({"Error":str(e)}), 500
    
@app.route('/updateProduct/<int:product_id>', methods=['PATCH'])
def update_product(product_id):
    try:
        product = request.get_json()
        result = products_dao.update_product(connection, {
        'product_name':product['name'], 
        'uom_id':product['unit'], 
        'price_per_unit':product['price'],
        'stock':product['stock']
    }, product_id)
        response = jsonify(result)
        return response
    except Exception as e:
        print("Error in updating Product: ", e)
        return jsonify({"Error":str(e)}), 500

@app.route('/getOrders', methods=['GET'])
def get_orders():
    orders = products_dao.get_orders(connection)
    response = jsonify(orders)
    return response

order_id = 0
@app.route('/saveOrder', methods=['POST'])
def save_order():
    try:
        order = request.get_json()
        result = products_dao.save_order(connection, order)
        response = jsonify(result)
        global order_id
        order_id = result['order_id']
        return response
    except Exception as e:
        print("Error in adding Order: ", e)
        return jsonify({"Error":str(e)}), 500
    
@app.route('/getOrderDetails', methods=['GET'])
def add_order_details():
    try:
        result = products_dao.get_order_details(connection)
        response = jsonify(result)
        return response
    except Exception as e:
        print("Error in getting Order Details: ", e)
        return jsonify({"Error":str(e)}), 500

@app.route('/saveOrderDetails', methods=['POST'])
def save_order_details():
    try:
        order_details = request.get_json()
        result = products_dao.save_order_details(connection, order_details)
        response = jsonify(result)
        return response
    except Exception as e:
        print("Error in adding Order Details: ", e)
        return jsonify({"Error":str(e)}), 500
    
if __name__ == "__main__":
    print("Starting Python Flask server for Grocery Store Management System")
    app.run(port=5000)