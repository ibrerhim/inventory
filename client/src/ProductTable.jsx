import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import swal from "sweetalert";
import { Plus, Edit, Trash } from "lucide-react"; // Import Lucide icons
import SlideNavbar from "./SlideInNavbar";
import Modal from "react-modal"; // Import modal library
import "./UserTable.css";
import "./UserForm.css";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/products"); // Adjust the endpoint as per your server setup
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
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
    } catch (error) {
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
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: "Supplier",
      selector: (row) => row.supplier,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ background:'transparent', display: "flex", gap: "10px" }}>
          <button onClick={() => openModal(row)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Edit color="blue" size={16} />
          </button>
          <button onClick={() => deleteProduct(row._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Trash color="red" size={16} />
          </button>
        </div>
      ),
    },
  ];
  const customStyles = {
    table: {
      style: {
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "15px",
        textAlign: "center",
        backgroundColor: "#00223a",
        color: "blue",
        border: "1px solid #003482",
        width: "1000px",
         justifyContent: "center",
      },
    },
    pagination: {
      style: {
        backgroundColor: "transparent",
        color: "white",
      },
    },
    headRow: {
      style: {
        borderRadius: "10px",
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
        margin: "20px auto",
        padding: "0px",
        // justifyContent: "center",
        // textAlign: "center",
        backgroundColor: "#001021",
        color: "azure",
        borderLeft: "1px solid #0056b3",
        // border: "1px solid #003482",
        borderRight: "1px solid #0056b3",
        textAlign: "center",
      },
    },
    rows: {
      style: {
      
        padding: "5px",
        borderRadius: "10px",
        backgroundColor: "#001021",
        color: "azure",
        border: "1px solid #0056b3",
      },
    },
  headCells: {
      style: {
        
         justifyContent: "center",
         textAlign: "center",
       
      },
    },
    cells: {
      style: {
        margin: " auto",
        padding: "10px",
        // borderRadius: "15px",
        // textAlign: "center",
        justifyContent: "center",
        color: "azure",
        borderRight: "1px solid #0056b3",
      },
    },
  };
  return (
    <div className="container">
        <SlideNavbar />
      <div className="content">
        <h2 className="ii">Product List</h2>
        <button className="b" onClick={() => openModal()}>
          <Plus size={16} /> Add New Product
        </button>
        <DataTable
          columns={columns}
          data={products}
          progressPending={loading}
          pagination
          persistTableHead
          customStyles={customStyles}
        />

        {/* Modal for adding/updating product */}

        <Modal
          className="form-container"
          overlayClassName="modal-overlay" 
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Product Form"
        >
          <h2>{currentProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
              <label>
                Name:
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const newPrice = e.target.value;
                    setFormData({ ...formData, price: newPrice });
                    calculateProfit(newPrice, formData.purchaseprice); // Calculate profit
                  }}
                  required
                />
              </label>
              <label>
                Purchase Price:
                <input
                  type="number"
                  value={formData.purchaseprice}
                  onChange={(e) => {
                    const newPurchasePrice = e.target.value;
                    setFormData({
                      ...formData,
                      purchaseprice: newPurchasePrice,
                    });
                    calculateProfit(formData.price, newPurchasePrice); // Calculate profit
                  }}
                  required
                />
              </label>
              <label>
                Profit:
                <input type="number" value={formData.profit} readOnly />
              </label>
              <label>
                Quantity:
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Supplier:
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                />
              </label>

              <button type="submit">
                {currentProduct ? "Update" : "Add"} Product
              </button>
            </div>
          </form>
          <button onClick={() => setModalIsOpen(false)}>Close</button>
        </Modal>
      </div>
    </div>
  );
};

export default ProductTable;
