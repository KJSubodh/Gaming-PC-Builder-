const generateInvoiceHTML = (cart, userName, userPhoneNumber, userAddress) => {
    let totalPrice = 0;
    const cartItems = cart.map(item => {
        totalPrice += item.price;
        const formattedPrice = item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Add commas to price
        return `
            <tr>
                <td>${item.type}</td>
                <td>${item.name}</td>
                <td>₹${formattedPrice}</td>
            </tr>
        `;
    }).join('');

    // Include user details in the invoice
    const userDetails = `
        <div class="user-info">
            <p><strong>Invoice ID:</strong></p>
            <p><strong>Customer Name:</strong> ${userName}</p>
            <p><strong>Customer Phone Number:</strong> ${userPhoneNumber}</p>
            <p><strong>Customer Address:</strong> ${userAddress}</p>
        </div>
    `;

    // Get current date in "dd/mm/yyyy" format
    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Get current time
    const currentTime = new Date().toLocaleTimeString();

    return `
        <html>
            <head>
                <title>Build Your Own PC Invoice</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 20px;
                        background-color: #f9f9f9;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 40px;
                        border: 1px solid #ccc;
                        border-radius: 10px;
                        background-color: #fff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1, h2 {
                        text-align: center;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .user-info {
                        margin-bottom: 30px;
                    }
                    .user-info p {
                        margin-bottom: 10px;
                    }
                    .invoice-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    .invoice-table th, .invoice-table td {
                        border: 1px solid #ccc;
                        padding: 10px;
                        text-align: left;
                    }
                    .total {
                        font-weight: bold;
                        text-align: right;
                        font-size: 20px;
                        margin-bottom: 20px;
                        color: #333;
                    }
                    .total span {
                        color: #ff5722;
                    }
                    /* Target thead element */
                    thead {
                    background-color: #f0f0f0; 
                    color: white;
                    }

                    /* Target th elements within thead */
                    thead th {
                    color: black; 
                    /* Ensure text color matches background color */
                    }
                    .signature-section {
                        margin-top: 50px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .signature-box {
                        width: 45%;
                        border: 1px solid #ccc;
                        padding: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Your Gaming PC Shop Name</h1>
                    <h2>Purchase Invoice</h2>
                    ${userDetails} <!-- Include user details -->
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cartItems}
                        </tbody>
                    </table>
                    <p class="total">Total: <span>₹${totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span></p>
                    <p><strong>Date:</strong> ${currentDate}</p>
                    <p><strong>Time:</strong> ${currentTime}</p>
                    <div class="signature-section">
                        <div class="signature-box">
                            <h3>Authorized Signatory</h3>
                        </div>
                        <div class="signature-box">
                            <h3>Customer's Signature</h3>
                        </div>
                    </div>

                </div>
            </body>
        </html>
    `;
};

export { generateInvoiceHTML };
