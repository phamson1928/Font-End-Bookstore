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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Tổng quan về cửa hàng sách</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Doanh thu tháng này */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Doanh thu tháng này
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {`đ${Number(stats?.revenueThisMonth ?? 0).toLocaleString(
                    "vi-VN"
                  )}`}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stats?.revenueChange == null
                      ? "text-gray-600"
                      : stats.revenueChange > 0
                      ? "text-green-600"
                      : stats.revenueChange < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stats?.revenueChange == null
                    ? "—"
                    : stats.revenueChange > 0
                    ? "+" + stats.revenueChange + "% so với trước"
                    : "-" + stats.revenueChange + "% so với trước"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Tổng sách */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng sách</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.booksTotal ?? 0}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stats?.booksTotalChange == null
                      ? "text-gray-600"
                      : stats.booksTotalChange > 0
                      ? "text-green-600"
                      : stats.booksTotalChange < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stats?.booksTotalChange == null
                    ? "—"
                    : `${stats.booksTotalChange > 0 ? "+" : ""}${Number(
                        stats.booksTotalChange
                      ).toFixed(2)}% so với trước`}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Đơn hàng hôm nay */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Đơn hàng hôm nay
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.ordersToday ?? 0}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stats?.orderChange == null
                      ? "text-gray-600"
                      : stats.orderChange > 0
                      ? "text-green-600"
                      : stats.orderChange < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stats?.orderChange == null
                    ? "—"
                    : stats.orderChange > 0
                    ? "+" + stats.orderChange + "% so với trước"
                    : "-" + stats.orderChange + "% so với trước"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Người dùng mới tháng này */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Người dùng mới tháng này
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.newUsers ?? 0}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stats?.userChange == null
                      ? "text-gray-600"
                      : stats.userChange > 0
                      ? "text-green-600"
                      : stats.userChange < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stats?.userChange == null
                    ? "—"
                    : stats.userChange > 0
                    ? "+" + stats.userChange + "% so với trước"
                    : "-" + stats.userChange + "% so với trước"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-8 h-8 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doanh thu theo tháng - Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Doanh thu theo tháng
          </h3>
        </div>
        <div className="h-80">
          {loading ? (
            <div className="h-full animate-pulse">
              <div className="h-8 bg-gray-100 rounded mb-3 w-1/3"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          ) : revenueByMonth?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => `đ${Number(v).toLocaleString("vi-VN")}`}
                  width={90}
                />
                <Tooltip
                  formatter={(value) => [
                    `đ${Number(value ?? 0).toLocaleString("vi-VN")}`,
                    "Doanh thu",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
