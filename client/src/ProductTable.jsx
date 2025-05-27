import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Plus, Edit, Trash } from "lucide-react";
import SlideNavbar from "./SlideInNavbar";
import { DataTable } from "./components/ui/data-table";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "./components/ui/dialog";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    purchaseprice: "",
    quantity: "",
    profit: "",
    supplier: "",
  });

  // Fetch products from the backend
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/products"); // Adjust the endpoint as per your server setup
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  // Calculate profit when price or purchase price changes
  const calculateProfit = (price, purchaseprice) => {
    const profit = price - purchaseprice;
    setFormData((prevData) => ({ ...prevData, profit }));
  };

  // Open modal for adding or updating product
  const openModal = (product = null) => {
    setCurrentProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        purchaseprice: product.purchaseprice,
        quantity: product.quantity,
        profit: product.profit,
        supplier: product.supplier,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        purchaseprice: "",
        quantity: "",
        profit: "",
        supplier: "",
      });
    }
    setModalIsOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        // Update existing product
        await axios.put(
          `http://localhost:3000/api/products/${currentProduct._id}`,
          {
            ...formData,
          }
        );
        swal("Success!", "Product updated successfully.", "success");
      } else {
        // Add new product
        await axios.post("http://localhost:3000/api/products", {
          ...formData,
        });
        swal("Success!", "Product added successfully.", "success");
      }
      fetchProducts(); // Refresh the product list after addition/update
    } catch (err) {
      console.error("Error saving product:", err);
      swal("Oh noes!", "Failed to save product!", "error");
    } finally {
      setModalIsOpen(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Columns for DataTable
  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (row) => <div className="font-medium">{row.name}</div>,
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => <div>${row.price}</div>,
    },
    {
      key: "quantity",
      header: "Quantity",
      cell: (row) => <div>{row.quantity}</div>,
    },
    {
      key: "supplier",
      header: "Supplier",
      cell: (row) => <div>{row.supplier}</div>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openModal(row)}
            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100/20"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteProduct(row._id)}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100/20"
          >
            <Trash size={16} />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="flex h-screen ">
      <SlideNavbar />
      <main className="flex-1 overflow-auto transition-all duration-300 ml-20 lg:ml-64 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Products</h1>
            <Button onClick={() => openModal()} className="flex items-center gap-2">
              <Plus size={16} /> Add New Product
            </Button>
          </div>

          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={products}
                title="Product List"
                searchPlaceholder="Search products..."
                searchField="name"
                loading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Dialog for adding/updating product */}
        <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{currentProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="price" className="text-sm font-medium">
                      Price
                    </label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => {
                        const newPrice = e.target.value;
                        setFormData({ ...formData, price: newPrice });
                        calculateProfit(newPrice, formData.purchaseprice);
                      }}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="purchaseprice" className="text-sm font-medium">
                      Purchase Price
                    </label>
                    <Input
                      id="purchaseprice"
                      type="number"
                      value={formData.purchaseprice}
                      onChange={(e) => {
                        const newPurchasePrice = e.target.value;
                        setFormData({ ...formData, purchaseprice: newPurchasePrice });
                        calculateProfit(formData.price, newPurchasePrice);
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="profit" className="text-sm font-medium">
                      Profit
                    </label>
                    <Input
                      id="profit"
                      type="number"
                      value={formData.profit}
                      readOnly
                      className="bg-muted/50"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="quantity" className="text-sm font-medium">
                      Quantity
                    </label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="supplier" className="text-sm font-medium">
                    Supplier
                  </label>
                  <Input
                    id="supplier"
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {currentProduct ? "Update" : "Add"} Product
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ProductTable;
