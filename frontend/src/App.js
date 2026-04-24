import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import TargetBullseye from './TargetBullseye';

const defaultStoreDetails = {
  store_number: "2389",
  store_city: "LOS ANGELES",
  address_line1: "7100 SANTA MONICA BLVD",
  city: "WEST HOLWOOD",
  state: "CA",
  zip_code: "90046",
  phone: "(323) 882-0100",
  reg_number: "03",
  cashier_name: "SARAH M",
  tran_number: "1547",
  str_number: "2389",
  tax_rate: "9.5"
};

const defaultItems = [
  { id: 1, name: "TIDE PODS 42CT", price: 14.99 },
  { id: 2, name: "BOUNTY PAPER TOWELS 6PK", price: 19.98 },
  { id: 3, name: "COFFEE MAKER BLACK", price: 39.99 },
  { id: 4, name: "ORGANIC MILK GALLON", price: 17.97 },
  { id: 5, name: "CHEERIOS CEREAL", price: 3.49 },
  { id: 6, name: "DOVE BODY WASH", price: 11.98 }
];

const TargetReceiptGenerator = () => {
  const [storeDetails, setStoreDetails] = useState(defaultStoreDetails);
  const [items, setItems] = useState(defaultItems);
  const [receiptNumber, setReceiptNumber] = useState(null);
  const [redcard, setRedcard] = useState({
    percent: "5",
    today_savings: "5.20",
    ytd_savings: "234.67"
  });
  const receiptRef = useRef(null);

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * (parseFloat(storeDetails.tax_rate) / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/,/g, '').toUpperCase();
  };

  const generateBarcode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const generateSurveyID = () => {
    const random1 = Math.floor(1000 + Math.random() * 9000);
    const random2 = Math.floor(1000 + Math.random() * 9000);
    const random3 = Math.floor(10 + Math.random() * 90);
    const random4 = Math.floor(1000 + Math.random() * 9000);
    return `${storeDetails.store_number}-${storeDetails.tran_number}-${storeDetails.reg_number}-${random4}`;
  };

  const handleSubmit = async () => {
    const receiptData = {
      ...storeDetails,
      items,
      redcard,
      date: formatDate(),
      barcode: generateBarcode(),
      survey_id: generateSurveyID()
    };

    try {
      const response = await fetch('http://localhost:5000/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiptData)
      });
      const data = await response.json();
      setReceiptNumber(data.receipt_number);
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  const downloadPDF = async () => {
    if (!receiptRef.current) return;
    
    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      backgroundColor: '#FFFFFF',
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', [80, 200]);
    const imgWidth = 80;
    const pageHeight = 200;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`target_receipt_${receiptNumber || 'preview'}.pdf`);
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Target Receipt Generator</h1>
      </header>
      
      <div className="main-content">
        <div className="builder-panel">
          <h2>Receipt Builder</h2>
          
          <div className="form-section">
            <h3>Store Information</h3>
            <input 
              type="text" 
              placeholder="Store Number"
              value={storeDetails.store_number}
              onChange={(e) => setStoreDetails({...storeDetails, store_number: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Store City"
              value={storeDetails.store_city}
              onChange={(e) => setStoreDetails({...storeDetails, store_city: e.target.value.toUpperCase()})}
            />
            <input 
              type="text" 
              placeholder="Address Line 1"
              value={storeDetails.address_line1}
              onChange={(e) => setStoreDetails({...storeDetails, address_line1: e.target.value.toUpperCase()})}
            />
            <input 
              type="text" 
              placeholder="City"
              value={storeDetails.city}
              onChange={(e) => setStoreDetails({...storeDetails, city: e.target.value.toUpperCase()})}
            />
            <input 
              type="text" 
              placeholder="State"
              value={storeDetails.state}
              onChange={(e) => setStoreDetails({...storeDetails, state: e.target.value.toUpperCase()})}
              maxLength="2"
            />
            <input 
              type="text" 
              placeholder="ZIP Code"
              value={storeDetails.zip_code}
              onChange={(e) => setStoreDetails({...storeDetails, zip_code: e.target.value})}
              maxLength="5"
            />
            <input 
              type="text" 
              placeholder="Phone"
              value={storeDetails.phone}
              onChange={(e) => setStoreDetails({...storeDetails, phone: e.target.value})}
            />
            
            <h3>Register Information</h3>
            <input 
              type="text" 
              placeholder="Register Number"
              value={storeDetails.reg_number}
              onChange={(e) => setStoreDetails({...storeDetails, reg_number: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Cashier Name"
              value={storeDetails.cashier_name}
              onChange={(e) => setStoreDetails({...storeDetails, cashier_name: e.target.value.toUpperCase()})}
            />
            <input 
              type="text" 
              placeholder="Transaction Number"
              value={storeDetails.tran_number}
              onChange={(e) => setStoreDetails({...storeDetails, tran_number: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="STR Number"
              value={storeDetails.str_number}
              onChange={(e) => setStoreDetails({...storeDetails, str_number: e.target.value})}
            />
            
            <h3>Items</h3>
            {items.map((item, index) => (
              <div key={item.id} className="item-row">
                <input 
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].name = e.target.value.toUpperCase();
                    setItems(newItems);
                  }}
                  placeholder="Item name"
                  className="item-name-input"
                />
                <input 
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].price = parseFloat(e.target.value);
                    setItems(newItems);
                  }}
                  placeholder="Price"
                  className="item-price-input"
                />
                <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="remove-btn">×</button>
              </div>
            ))}
            <button onClick={() => setItems([...items, { id: Date.now(), name: '', price: 0 }])} className="add-btn">
              + Add Item
            </button>
            
            <h3>RedCard Savings</h3>
            <input 
              type="text" 
              placeholder="Percent"
              value={redcard.percent}
              onChange={(e) => setRedcard({...redcard, percent: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Today's Savings"
              value={redcard.today_savings}
              onChange={(e) => setRedcard({...redcard, today_savings: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="YTD Savings"
              value={redcard.ytd_savings}
              onChange={(e) => setRedcard({...redcard, ytd_savings: e.target.value})}
            />
            
            <div className="actions">
              <button onClick={handleSubmit} className="primary-btn">Generate Receipt</button>
              <button onClick={downloadPDF} className="secondary-btn">Download PDF</button>
            </div>
          </div>
        </div>

        <div className="preview-panel">
          <div ref={receiptRef} className="receipt-container">
            {/* Target Bullseye Logo */}
            <div className="logo-container">
              <TargetBullseye />
              <div className="store-name">TARGET</div>
            </div>

            {/* Store Info */}
            <div className="store-info">
              <div>STORE #{storeDetails.store_number} - {storeDetails.store_city}</div>
              <div>{storeDetails.address_line1}</div>
              <div>{storeDetails.city}, {storeDetails.state} {storeDetails.zip_code}</div>
              <div>{storeDetails.phone}</div>
            </div>

            {/* Separator */}
            <pre className="separator-heavy">========================================</pre>

            {/* Date & Time */}
            <div className="date-time">{receiptNumber ? receiptData?.date : formatDate()}</div>

            {/* Register Info */}
            <pre className="register-info">
REG  {storeDetails.reg_number.padEnd(2)}   CSHR {storeDetails.cashier_name}
TRAN {storeDetails.tran_number.padEnd(4)}   STR  {storeDetails.str_number}</pre>

            {/* Items Separator */}
            <pre className="separator-light">- - - - - - - - - - - - - - - - - - -</pre>

            {/* Items */}
            <div className="items-section">
              {items.map((item, idx) => (
                <div key={idx} className="item-line">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals Separator */}
            <pre className="separator-heavy">========================================</pre>
            <pre className="separator-heavy">========================================</pre>

            {/* Totals */}
            <div className="totals-section">
              <div className="total-line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Tax ({storeDetails.tax_rate}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-line total-bold">
                <span>TOTAL</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* RedCard Section */}
            <div className="redcard-section">
              <div className="redcard-header">YOUR REDCARD SAVINGS</div>
              <div className="redcard-percent">{redcard.percent}%</div>
              <div className="redcard-line">
                <span>TODAY'S SAVINGS:</span>
                <span>${redcard.today_savings}</span>
              </div>
              <div className="redcard-line">
                <span>YTD SAVINGS:</span>
                <span>${redcard.ytd_savings}</span>
              </div>
            </div>

            {/* Return Policy Separator */}
            <pre className="separator-light">- - - - - - - - - - - - - - - - - - -</pre>

            {/* Return Policy */}
            <div className="return-policy">
              <div className="return-title">RETURN POLICY</div>
              <div className="return-text">
                MOST UNOPENED ITEMS IN NEW<br />
                CONDITION RETURNED<br />
                WITHIN 90 DAYS WILL RECEIVE<br />
                A REFUND. SOME ITEMS<br />
                HAVE A MODIFIED RETURN POLICY.<br />
                VISIT TARGET.COM/<br />
                RETURNS
              </div>
            </div>

            {/* Barcode Separator */}
            <pre className="separator-heavy">========================================</pre>

            {/* Barcode */}
            <div className="barcode-section">
              <svg className="barcode-svg" viewBox="0 0 200 50">
                {/* Simple Code128 barcode representation */}
                {generateBarcodeBars(receiptNumber ? generateBarcode() : '70369258').map((bar, i) => (
                  <rect key={i} x={i * 2} y="0" width={bar.width} height="40" fill="#000" />
                ))}
              </svg>
              <div className="barcode-number">{receiptNumber ? generateBarcode() : '70369258'}</div>
            </div>

            {/* Survey */}
            <div className="survey-section">
              <div>TELL US ABOUT YOUR VISIT TODAY</div>
              <div className="survey-url">TARGET.COM/SURVEY</div>
              <div className="survey-id">
                ID: {storeDetails.store_number}-{storeDetails.tran_number}-{storeDetails.reg_number}-1452
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              THANK YOU FOR SHOPPING AT TARGET
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate simple barcode bars
const generateBarcodeBars = (number) => {
  const bars = [];
  const seed = number.split('').reduce((a, b) => a + parseInt(b), 0);
  for (let i = 0; i < 100; i++) {
    const width = ((seed + i) % 3) + 1;
    bars.push({ width: width });
  }
  return bars;
};

export default TargetReceiptGenerator;
