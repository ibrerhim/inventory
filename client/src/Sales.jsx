import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import "./User.css";
import SlideNavbar from './SlideInNavbar';

const Sales = () => {
    const [salesData, setSalesData] = useState([]);
    const [filterText, setFilterText] = useState(''); // State for search text
    const [filteredSales, setFilteredSales] = useState([]); // State for filtered data
    const [startDate, setStartDate] = useState(''); // State for start date
    const [endDate, setEndDate] = useState(''); // State for end date
    const [totalProfit, setTotalProfit] = useState(0); // State for total profit

    // Fetch sales data from the backend
    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/sales');
                setSalesData(response.data);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };

        fetchSalesData();
    }, []);

    // Filter sales data based on sale ID and date range
    useEffect(() => {
        const filteredData = salesData.filter(sale => {
            const saleDate = new Date(sale.date);
            const isWithinDateRange = 
                (!startDate || saleDate >= new Date(startDate)) &&
                (!endDate || saleDate <= new Date(endDate));
            return sale.saleid.toString().includes(filterText) && isWithinDateRange;
        });
        setFilteredSales(filteredData);

        // Calculate total profit for the filtered data
        const total = filteredData.reduce((acc, sale) => acc + sale.totalprofit, 0);
        setTotalProfit(total);
    }, [filterText, startDate, endDate, salesData]);

    // Define the columns for the DataTable
    const columns = [
        {
            name: 'Sale ID',
            selector: row => row.saleid,
            sortable: true,
        },
        {
            name: 'Total Items',
            selector: row => row.totalitems,
            sortable: true,
        },
        {
            name: 'Grand Total',
            selector: row => row.grandtotal,
            sortable: true,
            format: row => `$${row.grandtotal.toFixed(2)}`, // Format as currency
        },
        {
            name: ' Profit',
            selector: row => row.totalprofit,
            sortable: true,
            format: row => `$${row.totalprofit.toFixed(2)}`, // Format as currency
        },
        {
            name: 'Date',
            selector: row => new Date(row.date).toLocaleDateString(),
            sortable: true,
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
                backgroundColor: "#001021",
                color: "azure",
                borderLeft: "1px solid #0056b3",
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
                transition: "background-color 0.3s ease",
                '&:hover': {
                    backgroundColor: "#004367 ", // Set highlight color to black on hover
                },
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
                margin: "auto",
                padding: "10px",
                justifyContent: "center",
                color: "azure",
                borderRight: "1px solid #0056b3",
            },
        },
    };

    return (
        <div>
            <SlideNavbar/>
            <div className='content'>
                <h2 id='ik'>Sales Data</h2>

                {/* Search input for Sale ID */}
                <div className='dts'>
                <input
                    type="text"
                    placeholder="Search by Sale ID"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    style={{
                        padding: "10px",
                        marginBottom: "15px",
                        width: "200px",
                        borderRadius: "5px",
                        border: "1px solid #0056b3",
                        marginRight: "10px"
                    }}
                />

                {/* Date range filters */}
  
                <input 
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    style={{
                        padding: "10px",
                        marginBottom: "15px",
                        width: "200px",
                        borderRadius: "5px",
                        border: "1px solid #0056b3",
                        marginRight: "10px"
                    }}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    style={{
                        padding: "10px",
                        marginBottom: "15px",
                        width: "200px",
                        borderRadius: "5px",
                        border: "1px solid #0056b3"
                    }}
                />
</div>
                {/* Display total profit */}
                <h2 id="prft">Total Profit: ${totalProfit.toFixed(2)}</h2>

                <DataTable
                    columns={columns}
                    data={filteredSales} // Use filtered data in DataTable
                    pagination
                   
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};

export default Sales;
