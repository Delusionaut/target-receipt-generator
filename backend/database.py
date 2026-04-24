import sqlite3
import json
from datetime import datetime

DATABASE_NAME = 'target_receipts.db'

class Database:
    def __init__(self):
        self.init_db()
    
    def get_connection(self):
        return sqlite3.connect(DATABASE_NAME)
    
    def init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS receipts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                receipt_number TEXT UNIQUE NOT NULL,
                store_number TEXT,
                store_city TEXT,
                address_line1 TEXT,
                city TEXT,
                state TEXT,
                zip_code TEXT,
                phone TEXT,
                reg_number TEXT,
                cashier_name TEXT,
                tran_number TEXT,
                str_number TEXT,
                tax_rate TEXT,
                items TEXT,
                redcard_percent TEXT,
                redcard_today TEXT,
                redcard_ytd TEXT,
                date TEXT,
                barcode TEXT,
                survey_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save_receipt(self, data):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO receipts (
                receipt_number, store_number, store_city, address_line1,
                city, state, zip_code, phone, reg_number, cashier_name,
                tran_number, str_number, tax_rate, items, redcard_percent,
                redcard_today, redcard_ytd, date, barcode, survey_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['receipt_number'],
            data['store_number'],
            data['store_city'],
            data['address_line1'],
            data['city'],
            data['state'],
            data['zip_code'],
            data['phone'],
            data['reg_number'],
            data['cashier_name'],
            data['tran_number'],
            data['str_number'],
            data['tax_rate'],
            json.dumps(data['items']),
            data['redcard_percent'],
            data['redcard_today'],
            data['redcard_ytd'],
            data['date'],
            data['barcode'],
            data['survey_id']
        ))
        
        conn.commit()
        conn.close()
    
    def get_receipt(self, receipt_number):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM receipts WHERE receipt_number = ?', (receipt_number,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return None
        
        columns = [desc[0] for desc in cursor.description]
        receipt = dict(zip(columns, row))
        receipt['items'] = json.loads(receipt['items'])
        return receipt
    
    def list_receipts(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT receipt_number, store_number, store_city, date, created_at 
            FROM receipts ORDER BY created_at DESC
        ''')
        rows = cursor.fetchall()
        
        conn.close()
        
        receipts = []
        for row in rows:
            receipts.append({
                'receipt_number': row[0],
                'store_number': row[1],
                'store_city': row[2],
                'date': row[3],
                'created_at': row[4]
            })
        
        return receipts
