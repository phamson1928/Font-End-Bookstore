import { useState } from "react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader } from "../components/admin/AdminHeader";
import { BookManagement } from "../components/admin/BookManagement";
import { Dashboard } from "../components/admin/Dashboard";
import { OrderManagement } from "../components/admin/OrderManagement";
import { UserManagement } from "../components/admin/UserManagement";
import { AuthorManagement } from "../components/admin/AuthorManagement";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "books":
        return <BookManagement />;
      case "authors":
        return <AuthorManagement />;
      case "orders":
        return <OrderManagement />;
      case "users":
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
