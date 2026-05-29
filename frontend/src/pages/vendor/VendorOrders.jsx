import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';

const VendorOrders = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-accent">Orders</h1>
        <p className="text-accent/60 text-sm mt-1">
          Track and manage orders for your products
        </p>
      </div>

      {/* Orders table shell */}
      <div className="bg-white rounded-xl border border-secondary/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-vendor-bg/50 text-left text-xs font-medium text-accent/60 uppercase tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Empty state */}
        <div className="px-5 py-16 text-center">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={36} className="text-secondary" />
          </div>
          <h3 className="font-serif text-lg text-accent mb-2">No orders yet</h3>
          <p className="text-accent/50 text-sm max-w-md mx-auto mb-4">
            When customers purchase your products, their orders will appear here.
            You'll be able to track statuses like pending, shipped, and delivered.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-accent/40">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              Pending
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Shipped
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Delivered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;
