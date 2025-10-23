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
    query = "insert into products(product_name, uom_id, price_per_unit, stock) values(%s, %s, %s, %s);"
    data = (product['product_name'], product['uom_id'], product['price_per_unit'], product['stock'])
    cursor.execute(query, data)
    connection.commit()
    return cursor.lastrowid

def update_product(connection, product,product_id):
    cursor = connection.cursor()
    query = "update products set product_name = %s, uom_id = %s, price_per_unit = %s, stock = %s where product_id = %s;"
    data = (product['product_name'], product['uom_id'], product['price_per_unit'], product['stock'], product_id)
    cursor.execute(query, data)
    connection.commit()
    return product_id

def delete_row(connection, product_id):
    cursor = connection.cursor()
    query = "update products set is_active = 0 where product_id = %s;" 
    id = (product_id,)
    cursor.execute(query, id)
    connection.commit()

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