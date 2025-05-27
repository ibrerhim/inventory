import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarIcon, DollarSign, ShoppingCart, Search } from 'lucide-react';
import SlideNavbar from './SlideInNavbar';
import { DataTable } from './components/ui/data-table';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Label } from './components/ui/label';
import { format } from 'date-fns';

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
            key: "saleid",
            header: "Sale ID",
            cell: (row) => <div className="font-medium">{row.saleid}</div>,
        },
        {
            key: "totalitems",
            header: "Total Items",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span>{row.totalitems}</span>
                </div>
            ),
        },
        {
            key: "grandtotal",
            header: "Grand Total",
            cell: (row) => (
                <div className="font-medium text-green-500">
                    ${row.grandtotal.toFixed(2)}
                </div>
            ),
        },
        {
            key: "totalprofit",
            header: "Profit",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">${row.totalprofit.toFixed(2)}</span>
                </div>
            ),
        },
        {
            key: "date",
            header: "Date",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(row.date), 'MMM d, yyyy')}</span>
                </div>
            ),
        },
    ];

    return (
        <div className="flex h-screen ">
            <SlideNavbar />
            <main className="flex-1 overflow-auto transition-all duration-300 ml-20 lg:ml-64 p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h1 className="text-3xl font-bold">Sales Data</h1>

                        {/* Total Profit Card */}
                        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/30 shadow-lg">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30">
                                    <DollarSign className="h-6 w-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Profit</p>
                                    <h2 className="text-2xl font-bold text-green-500">${totalProfit.toFixed(2)}</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                            <CardDescription>Filter sales by ID or date range</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search by Sale ID"
                                        value={filterText}
                                        onChange={e => setFilterText(e.target.value)}
                                        className="pl-8 bg-background"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor="startDate" className="mb-2 block">Start Date</Label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                                className="pl-8 bg-background"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <Label htmlFor="endDate" className="mb-2 block">End Date</Label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="endDate"
                                                type="date"
                                                value={endDate}
                                                onChange={e => setEndDate(e.target.value)}
                                                className="pl-8 bg-background"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales Table */}
                    <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
                        <CardContent className="p-0">
                            <DataTable
                                columns={columns}
                                data={filteredSales}
                                title="Sales History"
                                searchPlaceholder="Search sales..."
                                searchField="saleid"
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Sales;
