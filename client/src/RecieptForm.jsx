import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import SlideNavbar from './SlideInNavbar';
import {
  Plus,
  Trash,
  Search,
  ShoppingCart,
  User,
  CreditCard,
  DollarSign,
  Receipt,
  Tag
} from "lucide-react";
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './components/ui/card';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './components/ui/select';

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
        <div className="flex h-screen">
            <SlideNavbar />
            <main className="flex-1 overflow-auto transition-all duration-300 ml-20 lg:ml-64 p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Generate Receipt</h1>
                    </div>

                    <Card className="border-2 border-blue-950 bg-card/30 backdrop-blur-lg ">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Receipt Information
                            </CardTitle>
                            <CardDescription>Enter the receipt details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="saleId">Sale ID</Label>
                                        <div className="relative">
                                            <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="saleId"
                                                value={saleid || ''}
                                                readOnly
                                                className="pl-8 bg-muted/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="salesperson">Salesperson</Label>
                                        <div className="relative">
                                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="salesperson"
                                                value={salesperson}
                                                onChange={(e) => setSalesperson(e.target.value)}
                                                className="pl-8 bg-muted/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="customerName">Customer Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="customerName"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                className="pl-8 bg-muted/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Items</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="searchProduct">Add Product</Label>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="searchProduct"
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Type to search products..."
                                                className="pl-8 bg-muted/50"
                                            />
                                        </div>
                                    </div>

                                    {filteredProducts.length > 0 && (
                                        <Card className="border-border/40">
                                            <CardContent className="p-0">
                                                <ul className="divide-y divide-border/40">
                                                    {filteredProducts.map((product) => (
                                                        <li
                                                            key={product._id}
                                                            onClick={() => handleAddItem(product)}
                                                            className="p-3 flex justify-between items-center hover:bg-muted/50 cursor-pointer transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-medium">{product.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span className="text-green-500">${product.price}</span>
                                                                <span className="text-muted-foreground">In stock: {product.quantity}</span>
                                                                <Plus className="h-4 w-4" />
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {items.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="rounded-md border border-border/40 overflow-hidden">
                                                <table className="w-full">
                                                    <thead className="bg-muted/50">
                                                        <tr>
                                                            <th className="p-2 text-left font-medium text-muted-foreground">Product</th>
                                                            <th className="p-2 text-left font-medium text-muted-foreground">Price</th>
                                                            <th className="p-2 text-left font-medium text-muted-foreground">Quantity</th>
                                                            <th className="p-2 text-left font-medium text-muted-foreground">Total</th>
                                                            <th className="p-2 text-left font-medium text-muted-foreground">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/40">
                                                        {items.map((item, index) => (
                                                            <tr key={index} className="hover:bg-muted/30">
                                                                <td className="p-2">{item.product}</td>
                                                                <td className="p-2">${item.price}</td>
                                                                <td className="p-2">
                                                                    <Input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                                        max={item.maxQuantity}
                                                                        min={0}
                                                                        required
                                                                        className="w-20 h-8"
                                                                    />
                                                                </td>
                                                                <td className="p-2 font-medium">${item.totalprice.toFixed(2)}</td>
                                                                <td className="p-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleRemoveItem(index)}
                                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100/20"
                                                                    >
                                                                        <Trash size={16} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card className="border-border/40">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-base">Order Summary</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Total Items:</span>
                                                                <span className="font-medium">{totalItems}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Grand Total:</span>
                                                                <span className="font-medium text-green-500">${grandTotal.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-border/40">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-base">Payment Details</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="amountPaid">Amount Paid</Label>
                                                                <div className="relative">
                                                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        id="amountPaid"
                                                                        type="number"
                                                                        value={amountPaid}
                                                                        onChange={(e) => {
                                                                            setAmountPaid(parseFloat(e.target.value));
                                                                            setBalance(grandTotal - parseFloat(e.target.value));
                                                                        }}
                                                                        className="pl-8"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="balance">Balance</Label>
                                                                <div className="relative">
                                                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        id="balance"
                                                                        type="number"
                                                                        value={balance}
                                                                        readOnly
                                                                        className="pl-8 bg-muted/50"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="paymentMethod">Payment Method</Label>
                                                                <Select
                                                                    value={paymentMethod}
                                                                    onValueChange={(value) => setPaymentMethod(value)}
                                                                >
                                                                    <SelectTrigger id="paymentMethod" className="w-full">
                                                                        <SelectValue placeholder="Select payment method" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Cash">Cash</SelectItem>
                                                                        <SelectItem value="Card">Card</SelectItem>
                                                                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={handleGenerateReceipt}
                                        className="flex items-center gap-2"
                                    >
                                        <Receipt className="h-4 w-4" />
                                        Generate Receipt
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default RecieptForm;
