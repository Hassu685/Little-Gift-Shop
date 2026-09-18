"use client";

import { useEffect, useState } from "react";
import {
  DollarSign, ShoppingCart, Package, Users, Clock, CheckCircle2, AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import StatCard from "@/components/admin/StatCard";
import { formatPrice } from "@/utils/format";

const COLORS = ["#5B3B82", "#B9A1D8", "#E9A7C5", "#C9A96E", "#2D2045", "#8b7ab5"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStats(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!stats) {
    return <p className="text-sm text-primary/50">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">Live overview from your store&apos;s database.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={formatPrice(stats.totalRevenue)} tone="emerald" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} tone="primary" />
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} tone="slate" />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} tone="slate" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} tone="amber" />
        <StatCard icon={CheckCircle2} label="Completed Orders" value={stats.completedOrders} tone="emerald" />
        <StatCard icon={AlertTriangle} label="Low Stock Products" value={stats.lowStockProducts} tone="red" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-lavender/40 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.revenueOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatPrice(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#5B3B82" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-lavender/40 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Orders Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.revenueOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#B9A1D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-lavender/40 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Top Products</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-primary/50">No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.topProducts} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="unitsSold" fill="#5B3B82" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-lavender/40 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Sales by Category</h2>
          {stats.salesByCategory.length === 0 ? (
            <p className="text-sm text-primary/50">No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={stats.salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                  {stats.salesByCategory.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatPrice(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
