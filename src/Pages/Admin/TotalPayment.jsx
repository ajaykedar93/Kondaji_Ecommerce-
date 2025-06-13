import React, { useEffect, useState } from 'react';

const TotalPayment = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);

  useEffect(() => {
    fetch('https://kondaji-express-api.onrender.com/api/orders')
      .then(res => res.json())
      .then(data => {
        let revenue = 0;
        let productCount = 0;

        data.forEach(order => {
          if (order.payment_status === 'Paid') {
            revenue += parseFloat(order.total || 0);

            if (order.items && Array.isArray(order.items)) {
              order.items.forEach(item => {
                productCount += parseInt(item.quantity || 0);
              });
            }
          }
        });

        setTotalRevenue(revenue);
        setTotalProductsSold(productCount);
      })
      .catch(err => console.error('❌ Error fetching orders:', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Total Payment Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg text-center border-t-4 border-green-500">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">📦 Total Products Sold</h3>
          <p className="text-4xl font-bold text-green-600">{totalProductsSold}</p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg text-center border-t-4 border-blue-500">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">💰 Total Revenue Earned</h3>
          <p className="text-4xl font-bold text-blue-600">₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalPayment;
