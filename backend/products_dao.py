from sql_connection import get_sql_connection #connection established krne k baad uska object

def get_all_products(connection):
    cursor = connection.cursor()
    query = "select products.product_id, products.product_name, products.uom_id, products.price_per_unit ,products.stock,products.is_active, uom.uom_name from products inner join uom on products.uom_id = uom.uom_id;"
    cursor.execute(query)
    response = []
    for(product_id, product_name, uom_id, price_per_unit,stock,is_active, uom_name) in cursor:
        if(is_active == 1):
            response.append(
                {
                    'product_id': product_id,
                    'product_name': product_name,
                    'uom_id': uom_id, 
                    'price_per_unit': price_per_unit,
                    'stock' : stock,
                    'uom_name': uom_name
                }
            )
    return response

def insert_new_product(connection, product):
    cursor = connection.cursor()

    # setting defaults to avoid KeyError
    is_active = product.get('is_active', 1)

    # check if product exists by name + price
    checking_query = "SELECT product_id, is_active FROM products WHERE product_name=%s AND price_per_unit=%s;"
    data1 = (product['product_name'], product['price_per_unit'])
    cursor.execute(checking_query, data1)
    row = cursor.fetchone()

    if row:
        product_id, status = row
        if status == 0:
            # reactivate soft-deleted product
            query = "UPDATE products SET uom_id=%s, stock=%s, is_active=1 WHERE product_id=%s;"
            data = (product['uom_id'], product['stock'], product_id)
            cursor.execute(query, data)
            connection.commit()
            return {"status": "success", "msg": "Product reactivated in Stock!", "exists": False, "product_id": product_id}
        else:
            # active product already exists
            return {"status": "fail", "msg": "Product already exists", "exists": True}
    else:
        # insert new product
        query = "INSERT INTO products(product_name, uom_id, price_per_unit, stock, is_active) VALUES(%s, %s, %s, %s, 1);"
        data = (product['product_name'], product['uom_id'], product['price_per_unit'], product['stock'])
        cursor.execute(query, data)
        connection.commit()
        return {"status": "success", "product_id": cursor.lastrowid, "msg": "Product added successfully", "exists": False}



def update_product(connection, product,product_id):
    cursor = connection.cursor()
    query = "update products set product_name = %s, uom_id = %s, price_per_unit = %s, stock = %s where product_id = %s;"
    data = (product['product_name'], product['uom_id'], product['price_per_unit'], product['stock'], product_id)
    cursor.execute(query, data)
    connection.commit()
    return  {"status":"success","product_id":product_id,"msg":"Product Updated Successfully."}

def delete_row(connection, product_id):
    cursor = connection.cursor()
    query = "update products set is_active = 0 where product_id = %s;" 
    id = (product_id,)
    cursor.execute(query, id)
    connection.commit()
    return {"status":"success","id":product_id, "msg":"Product Deleted Successfully"}

if __name__ == '__main__':
    connection = get_sql_connection()
    # print(get_all_products(connection))
    print(update_product(connection, {
        'product_name' : 'Lady Finger',
        'uom_id' : 2,
        'price_per_unit' : 40,
        'stock':10
    }, 18))
    # delete_row(connection, 10)