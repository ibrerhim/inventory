import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import './RTable.css';

const RecieptTable = () => {
    const location = useLocation();
    const data = location.state || {};

    const checkSaleExists = async (saleid) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/sales/${saleid}`);
            return response.data; // Return the existing sale record if found
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Sale not found
                return null;
            }
            console.error('Error checking sale existence:', error);
            throw error; // Rethrow error for handling in the main function
        }
    };

    const handleSaveAndPrint = async () => {
        try {
            // Check if the sale record already exists
            const existingSale = await checkSaleExists(data.saleid);

            if (existingSale) {
                // If the record exists, just print it
               
                 window.print();
            } else {
                // If the record does not exist, save the sale data to the sales collection
                await axios.post('http://localhost:3000/api/sales', data);

                // Update the stock for each item in the sale
                for (const item of data.items) {
                    const productId = item.productId;
                    await axios.patch(`http://localhost:3000/api/products/${productId}`, {
                        quantitySold: item.quantity
                    });
                }

                // Show success alert
                swal({
                    title: "Success!",
                    text: "Data successfully saved to the database and stock updated.",
                    icon: "success",
                    button: "OK",
                }).then(() => {
                    // Print the receipt after alert is closed
                    window.print();
                });
            }
        } catch (error) {
            // Show error alert if saving fails or fetching existing record fails
            swal({
                title: "Error",
                text: "Failed to process your request. Please try again.",
                icon: "error",
                button: "OK",
            });
            console.error('Error processing request:', error);
        }
    };

    return (
        <div className="receipt-container">
            <h2 className="receipt-title">Receipt</h2>
            <table className="receipt-table">
                <tbody>
                    {/* Display Sale ID */}
                    <tr>
                        <td colSpan="2"><strong>Sale ID:</strong></td>
                        <td colSpan="2">{data.saleid}</td>
                    </tr>

                    {/* Customer Name and Salesperson Information */}
                    <tr>
                        <td colSpan="2"><strong>Customer Name:</strong></td>
                        <td colSpan="2">{data.customername || 'WALK IN CUSTOMER'}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Salesperson:</strong></td>
                        <td colSpan="2">{data.salesperson || 'ISMAIL MUHAMMAD'}</td>
                    </tr>
                    <tr><td colSpan="4">.</td></tr>

                    {/* Table Headers */}
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>

                    {/* Product Items */}
                    {data.items && data.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.product}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>${item.totalprice.toFixed(2)}</td>
                        </tr>
                    ))}
                  
                    {/* Summary Information */}
                    <tr><td colSpan="4">.</td></tr>
                    <tr>
                        <td colSpan="3"><strong>Total Items</strong></td>
                        <td>{data.totalitems}</td>
                    </tr>
                    <tr>
                        <td colSpan="3"><strong>Grand Total</strong></td>
                        <td>${data.grandtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3"><strong>Amount Paid</strong></td>
                        <td>${data.amountpaid.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3"><strong>Balance</strong></td>
                        <td>${data.balance.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Print Button */}
            <button className="print-button" onClick={handleSaveAndPrint}>Print Receipt</button>
        </div>
    );
};

export default RecieptTable;
