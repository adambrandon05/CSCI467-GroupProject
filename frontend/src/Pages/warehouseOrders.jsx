import { useEffect, useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';

export default function WarehouseOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [authorized, setAuthorized] = useState(null);

    const printRef = useRef(null);

    // Check session before loading warehouse orders
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch('http://localhost:5000/api/auth/me', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Not logged in');
                }

                const data = await response.json();

                if (data.user?.role !== 'employee' && data.user?.role !== 'admin') {
                    throw new Error('Access denied');
                }

                setAuthorized(true);
                loadOrders();
            } catch (err) {
                setError(err.message);
                setAuthorized(false);
            }
        }

        checkSession();
    }, []);

    // Get orders waiting to ship
    async function loadOrders() {
        try {
            const response = await fetch('http://localhost:5000/api/warehouse/orders', {
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setOrders(data);
        } catch (err) {
            setError(err.message);
        }
    }

    // Get details for one order
    async function viewOrder(id) {
        try {
            setError('');

            const response = await fetch(`http://localhost:5000/api/warehouse/orders/${id}`, {
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setSelectedOrder(data);
        } catch (err) {
            setError(err.message);
        }
    }

    // Mark order as shipped
    async function shipOrder() {
        if (!selectedOrder) return;

        try {
            setError('');

            const response = await fetch(
                `http://localhost:5000/api/warehouse/orders/${selectedOrder.order.id}/ship`,
                {
                    method: 'PATCH',
                    credentials: 'include'
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setSelectedOrder(null);
            setMessage('Order shipped successfully!');
            await loadOrders();
        } catch (err) {
            setError(err.message);
        }
    }

    // Print invoice or packing list
    function printDocument(type) {
        if (!printRef.current) return;

        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            setError('Please allow popups to print.');
            return;
        }

        const title = type === 'invoice' ? 'Invoice' : 'Packing List';

        printWindow.document.write(`
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body {
                        font-family: Arial;
                        padding: 30px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        padding: 12px;
                        border-bottom: 1px solid #ddd;
                        text-align: left;
                    }

                    .warehouse-totals {
                        width: 300px;
                        margin-left: auto;
                    }

                    .warehouse-totals p {
                        display: flex;
                        justify-content: space-between;
                    }

                    .warehouse-close {
                        display: none;
                    }

                    ${type === 'packing' ? `
                        .invoice-only {
                            display: none;
                        }
                    ` : ''}
                </style>
            </head>
            <body>
                <h1>AutoParts Store - ${title}</h1>
                ${printRef.current.innerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.print();
        };
    }

    // Selected order information
    const order = selectedOrder?.order;
    const items = selectedOrder?.items || [];
    const payment = selectedOrder?.payments?.[0];
    const shipping = Number(selectedOrder?.shipments?.[0]?.shipping_cost || 0);

    // Calculate invoice totals
    const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * Number(item.unit_price),
        0
    );

    const total = Number(order?.total || 0);
    const tax = total - subtotal - shipping;

    // Wait until session check finishes
    if (authorized === null) {
        return <p>Checking session...</p>;
    }

    // Block customers and logged-out users
    if (!authorized) {
        return (
            <>
                <Navbar />
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Access Denied</h2>
                    <p>{error}</p>
                    <a href="/">Return to Store</a>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="warehouse-page">

                <div className="warehouse-header">
                    <div>
                        <h1>Warehouse Orders</h1>
                        <p>Manage orders waiting to be shipped.</p>
                    </div>

                    <button onClick={loadOrders}>Refresh</button>
                </div>

                {error && <p className="warehouse-error">{error}</p>}
                {message && <p className="warehouse-success">{message}</p>}

                {/* Orders Table */}
                <div className="warehouse-card">
                    <h2>Pending Orders ({orders.length})</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((item) => (
                                <tr key={item.id}>
                                    <td>#{item.id}</td>
                                    <td>{new Date(item.order_date).toLocaleDateString()}</td>
                                    <td>${Number(item.total).toFixed(2)}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button onClick={() => viewOrder(item.id)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {orders.length === 0 && <p>No orders waiting to ship.</p>}
                </div>

                {/* Selected Order */}
                {selectedOrder && (
                    <div className="warehouse-card">

                        <div ref={printRef}>
                            <div className="warehouse-header">
                                <h2>Order #{order.id}</h2>

                                <button
                                    className="warehouse-close"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Close
                                </button>
                            </div>

                            <h3>Order Information</h3>

                            <p>
                                <strong>Date:</strong>{' '}
                                {new Date(order.order_date).toLocaleDateString()}
                            </p>

                            <p>
                                <strong>Shipping Address:</strong>{' '}
                                {order.shipping_address}
                            </p>

                            <h3>Order Items</h3>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th className="invoice-only">Price</th>
                                        <th className="invoice-only">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td className="invoice-only">
                                                ${Number(item.unit_price).toFixed(2)}
                                            </td>
                                            <td className="invoice-only">
                                                ${(item.quantity * item.unit_price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Invoice Totals */}
                            <div className="warehouse-totals invoice-only">
                                <p>
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </p>

                                <p>
                                    <span>Shipping & Handling</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </p>

                                <p>
                                    <span>Tax / Adjustment</span>
                                    <span>${tax.toFixed(2)}</span>
                                </p>

                                <hr />

                                <p>
                                    <strong>Final Total</strong>
                                    <strong>${total.toFixed(2)}</strong>
                                </p>
                            </div>

                            {/* Payment Information */}
                            <div className="invoice-only">
                                <h3>Payment Information</h3>

                                {payment ? (
                                    <>
                                        <p>Amount: ${Number(payment.amount).toFixed(2)}</p>
                                        <p>Status: {payment.payment_status}</p>
                                        <p>Authorization: {payment.payment_reference}</p>
                                    </>
                                ) : (
                                    <p>No payment information available.</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="warehouse-actions">
                            <button onClick={() => printDocument('packing')}>
                                Print Packing List
                            </button>

                            <button onClick={() => printDocument('invoice')}>
                                Print Invoice
                            </button>

                            <button onClick={shipOrder}>
                                Mark as Shipped
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .warehouse-page {
                    max-width: 1100px;
                    margin: 30px auto;
                    padding: 20px;
                    color: #333;
                    font-family: Arial, sans-serif;
                }

                .warehouse-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .warehouse-header h1 {
                    margin: 0;
                    font-size: 28px;
                }

                .warehouse-header p {
                    color: #666;
                }

                .warehouse-card {
                    background: white;
                    padding: 25px;
                    margin-bottom: 25px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    overflow-x: auto;
                }

                .warehouse-card h2 {
                    margin-top: 0;
                    font-size: 20px;
                }

                .warehouse-card table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                    margin: 15px 0;
                }

                .warehouse-card th {
                    background: #f5f6f8;
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                }

                .warehouse-card td {
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                }

                .warehouse-card button,
                .warehouse-header button {
                    background: #2563eb;
                    color: white;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .warehouse-card button:hover,
                .warehouse-header button:hover {
                    background: #1d4ed8;
                }

                .warehouse-totals {
                    max-width: 320px;
                    margin: 25px 0 25px auto;
                }

                .warehouse-totals p {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                }

                .warehouse-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 25px;
                    flex-wrap: wrap;
                }

                .warehouse-error {
                    color: #991b1b;
                    background: #fee2e2;
                    padding: 12px;
                }

                .warehouse-success {
                    color: #166534;
                    background: #dcfce7;
                    padding: 12px;
                }
            `}</style>
        </>
    );
}