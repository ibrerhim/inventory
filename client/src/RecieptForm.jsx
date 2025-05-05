import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import "./Form.css";
import SlideNavbar from './SlideInNavbar';
import { Plus, Edit, Trash } from "lucide-react";

const RecieptForm = () => {
    const navigate = useNavigate();
    const [saleid, setSalesId] = useState(null);  // New state for saleid
    const [salesperson, setSalesperson] = useState('');
    const [customerName, setCustomerName] = useState('walk in customer');
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [balance, setBalance] = useState(0);
    const [totalprofit, setTotalProfit] = useState(0);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchNextSaleId = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/sales/next-saleid');
                setSalesId(response.data.nextSaleId);
            } catch (error) {
                console.error('Error fetching next sale ID:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchNextSaleId();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [searchTerm, products]);

    const handleAddItem = (selectedProduct) => {
        // Check if the product's quantity is 0
        if (selectedProduct.quantity === 0) {
            swal("Out of Stock", "This product is currently out of stock and cannot be added.", "warning");
            return; // Exit the function if the product is out of stock
        }
    
        // Check if the product is already in the items list
        const existingItemIndex = items.findIndex(item => item.productId === selectedProduct._id);
    
        if (existingItemIndex !== -1) {
            // If the product is already in the list, increase its quantity by 1
            const updatedItems = [...items];
            const existingItem = updatedItems[existingItemIndex];
    
            // Ensure the new quantity does not exceed the product's max quantity
            if (existingItem.quantity < selectedProduct.quantity) {
                existingItem.quantity += 1;
                existingItem.totalprice = existingItem.price * existingItem.quantity;
                existingItem.profit = existingItem.unitProfit * existingItem.quantity;
            } else {
                swal("Max Quantity Reached", "You have reached the maximum available quantity for this product.", "warning");
                return;
            }
    
            setItems(updatedItems);
            calculateTotals(updatedItems);
        } else {
            // If the product is not in the list, add it as a new item
            const newItem = {
                productId: selectedProduct._id,
                product: selectedProduct.name,
                price: selectedProduct.price,
                quantity: 1,
                totalprice: selectedProduct.price,
                unitProfit: selectedProduct.profit,
                profit: selectedProduct.profit,
                maxQuantity: selectedProduct.quantity // Store the max quantity available
            };
    
            const updatedItems = [...items, newItem];
            setItems(updatedItems);
            calculateTotals(updatedItems);
        }
    
        // Clear search term and filtered results
        setSearchTerm('');
        setFilteredProducts([]);
    };
    
    
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        if (field === 'price' || field === 'quantity') {
            let newValue = parseFloat(value);
            // Ensure quantity does not exceed maxQuantity
            if (field === 'quantity') {
                newValue = Math.min(newValue, updatedItems[index].maxQuantity);
            }
            updatedItems[index][field] = newValue;
        }
        updatedItems[index].totalprice = updatedItems[index].price * updatedItems[index].quantity;
        updatedItems[index].profit = updatedItems[index].unitProfit * updatedItems[index].quantity;
        setItems(updatedItems);
        calculateTotals(updatedItems);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        calculateTotals(updatedItems);
    };

    const calculateTotals = (updatedItems) => {
        const totalItemsCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
        const grandTotalAmount = updatedItems.reduce((acc, item) => acc + item.totalprice, 0);
        const totalProfitAmount = updatedItems.reduce((acc, item) => acc + item.profit, 0);

        setTotalItems(totalItemsCount);
        setGrandTotal(grandTotalAmount);
        setTotalProfit(totalProfitAmount);
        setBalance(grandTotalAmount - amountPaid);
    };

    const formData = {
        saleid,  // Include the new saleid here
        salesperson,
        customername: customerName,
        items,
        totalitems: totalItems,
        grandtotal: grandTotal,
        totalprofit,
        amountpaid: amountPaid,
        paymentmethod: paymentMethod,
        balance,
    };
    const handleGenerateReceipt = () => {
        if (!salesperson || !items.length || !paymentMethod) {
            swal("Incomplete Form", "Please fill out all required fields!", "warning");
        } else if (items.some(item => item.quantity <= 0 || isNaN(item.quantity))) {
            swal("Invalid Quantity", "Please ensure all item quantities are greater than zero!", "warning");
        } else {
            navigate("/reciept-table", { state: formData });
        }
    };
    

    return (
        <div>
            <SlideNavbar />
            <div className='content'>
                <form className='form-contain'>
                    <h2>Generate Receipt</h2>
                    <div className='total-container'>
                        <div>
                            <label>Sale ID:</label>
                            <input type="text" value={saleid || ''} readOnly />
                        </div>
                        <div>
                            <label>Salesperson:</label>
                            <input
                                type="text"
                                value={salesperson}
                                onChange={(e) => setSalesperson(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Customer Name:</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                    </div>
                    <h2>Items</h2>
                    <div className='ii'>
                        <label>Add Product:</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Type to search..."
                        />
                    </div>
                    {filteredProducts.length > 0 && (
                        <ul className='ww' >
                            {filteredProducts.map((product) => (
                                <li key={product._id} onClick={() => handleAddItem(product)}>
                                   {product.name}_____price:${product.price}______instock:{product.quantity}
                                </li>
                            ))}
                        </ul>
                    )}
                    {items.length > 0 && (
                        <>
                            {items.map((item, index) => (
                                <div key={index} className="total-container2">
                                    <label>Product:</label>
                                    <input type="text" value={item.product} readOnly />
                                    <label>Price:</label>
                                    <input type="number" value={item.price} readOnly />
                                    <label>Quantity:</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        max={item.maxQuantity} 
                                        min={0}// Set max attribute here
                                        required
                                    />
                                    <label>Total:</label>
                                    <input type="number" value={item.totalprice} readOnly />
                                    
                                    <button type="button" onClick={() => handleRemoveItem(index)}>
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}
                            <div className="total-container">
                                <div>
                                    <label>Total Items:</label>
                                    <input type="number" value={totalItems} readOnly />
                                </div>
                                <div>
                                    <label>Grand Total:</label>
                                    <input type="number" value={grandTotal} readOnly />
                                </div>
                                
                                <div>
                                    <label>Amount Paid:</label>
                                    <input
                                        type="number"
                                        value={amountPaid}
                                        onChange={(e) => {
                                            setAmountPaid(parseFloat(e.target.value));
                                            setBalance(grandTotal - parseFloat(e.target.value));
                                        }}
                                    />
                                </div>
                                <div>
                                    <label>Balance:</label>
                                    <input type="number" value={balance} readOnly />
                                </div>
                                <div>
                                    <label>Payment Method:</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        required
                                    >
                                        <option value=""></option>
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                    <button type="button" onClick={handleGenerateReceipt}>Generate Receipt</button>
                </form>
            </div>
        </div>
    );
};

export default RecieptForm;
