import { useState } from "react";
import api from "../../api/client";
import { useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

export const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [revenueByMonth, setRevenueByMonth] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard-stats");
        setStats(res.data);
        const revenueData = res.data.revenueByMonth.map((item) => ({
          name: `Tháng ${item.month}/${item.year}`,
          revenue: item.revenue,
        }));
        setRevenueByMonth(revenueData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-50 relative overflow-hidden group">
      {/* Background gradient effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
          color === "yellow"
            ? "from-yellow-400 to-orange-500"
            : color === "blue"
            ? "from-blue-400 to-indigo-600"
            : color === "green"
            ? "from-green-400 to-emerald-600"
            : "from-purple-400 to-pink-600"
        }`}
      ></div>

      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>

          {change !== null && change !== undefined && (
            <div className="flex items-center space-x-1">
              <div
                className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  change > 0
                    ? "bg-green-100 text-green-700"
                    : change < 0
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {change > 0 ? (
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : change < 0 ? (
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : null}
                {change > 0 ? "+" : ""}
                {Number(change).toFixed(2)}% so với trước
              </div>
            </div>
          )}

          {(change === null || change === undefined) && (
            <p className="text-sm text-gray-600">—</p>
          )}
        </div>

        <div
          className={`p-4 rounded-2xl shadow-lg ${
            color === "yellow"
              ? "bg-gradient-to-br from-yellow-400 to-orange-500"
              : color === "blue"
              ? "bg-gradient-to-br from-blue-400 to-indigo-600"
              : color === "green"
              ? "bg-gradient-to-br from-green-400 to-emerald-600"
              : "bg-gradient-to-br from-purple-400 to-pink-600"
          } transform group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/2 mb-4"></div>
      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/3 mb-2"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-2/3"></div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          <p className="text-blue-600 font-semibold">
            Doanh thu: đ{Number(payload[0].value ?? 0).toLocaleString("vi-VN")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Tổng quan về cửa hàng sách</p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Doanh thu tháng này */}
            <StatCard
              title="Doanh thu tháng này"
              value={`đ${Number(stats?.revenueThisMonth ?? 0).toLocaleString(
                "vi-VN"
              )}`}
              change={stats?.revenueChange}
              color="yellow"
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              }
            />

            {/* Tổng sách */}
            <StatCard
              title="Tổng sách"
              value={stats?.booksTotal ?? 0}
              change={stats?.booksTotalChange}
              color="blue"
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
            />

            {/* Đơn hàng hôm nay */}
            <StatCard
              title="Đơn hàng hôm nay"
              value={stats?.ordersToday ?? 0}
              change={stats?.orderChange}
              color="green"
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              }
            />

            {/* Người dùng mới tháng này */}
            <StatCard
              title="Người truy cập mới tháng này"
              value={stats?.newUsers ?? 0}
              change={stats?.userChange}
              color="purple"
              icon={
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
          </div>
        )}

        {/* Doanh thu mỗi tháng - Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Doanh thu mỗi tháng
              </h3>
              <p className="text-gray-600">
                Theo dõi xu hướng doanh thu theo thời gian
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">
                Doanh thu
              </span>
            </div>
          </div>

          <div className="h-96">
            {loading ? (
              <div className="h-full animate-pulse flex flex-col">
                <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6 w-1/3"></div>
                <div className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl"></div>
              </div>
            ) : revenueByMonth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueByMonth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      `đ${Number(v).toLocaleString("vi-VN")}`
                    }
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                    width={90}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="url(#gradient)"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    dot={{
                      fill: "#3b82f6",
                      stroke: "#ffffff",
                      strokeWidth: 3,
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                      stroke: "#3b82f6",
                      strokeWidth: 3,
                      fill: "#ffffff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-lg font-medium">Không có dữ liệu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
