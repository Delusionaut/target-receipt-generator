from flask import Flask, request, jsonify
from flask_cors import CORS
from database import Database
import random

app = Flask(__name__)
CORS(app)
db = Database()

def generate_receipt_number():
    return f"TRG{random.randint(100000, 999999)}"

@app.route('/api/receipts', methods=['POST'])
def create_receipt():
    data = request.json
    
    receipt_number = generate_receipt_number()
    
    receipt_data = {
        'receipt_number': receipt_number,
        'store_number': data.get('store_number'),
        'store_city': data.get('store_city'),
        'address_line1': data.get('address_line1'),
        'city': data.get('city'),
        'state': data.get('state'),
        'zip_code': data.get('zip_code'),
        'phone': data.get('phone'),
        'reg_number': data.get('reg_number'),
        'cashier_name': data.get('cashier_name'),
        'tran_number': data.get('tran_number'),
        'str_number': data.get('str_number'),
        'tax_rate': data.get('tax_rate', '9.5'),
        'items': data.get('items', []),
        'redcard_percent': data.get('redcard', {}).get('percent'),
        'redcard_today': data.get('redcard', {}).get('today_savings'),
        'redcard_ytd': data.get('redcard', {}).get('ytd_savings'),
        'date': data.get('date'),
        'barcode': data.get('barcode'),
        'survey_id': data.get('survey_id')
    }
    
    db.save_receipt(receipt_data)
    
    return jsonify({'receipt_number': receipt_number})

@app.route('/api/receipts/<receipt_number>', methods=['GET'])
def get_receipt(receipt_number):
    receipt = db.get_receipt(receipt_number)
    if receipt:
        return jsonify(receipt)
    return jsonify({'error': 'Receipt not found'}), 404

@app.route('/api/receipts', methods=['GET'])
def list_receipts():
    receipts = db.list_receipts()
    return jsonify(receipts)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
