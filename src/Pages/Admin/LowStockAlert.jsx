const LowStockAlert = () => {
    const lowStockProducts = []; // replace with filtered data
  
    return (
      <div className="p-6">
        <h2>Low Stock Products</h2>
        <ul>
          {lowStockProducts.map((p) => (
            <li key={p.id}>{p.name} - Only {p.quantity} left</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default LowStockAlert;
  