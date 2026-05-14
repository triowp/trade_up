import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingSuppliers: 0,
    });
    const [suppliers, setSuppliers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Load suppliers
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const supplierList = allUsers.filter((u) => u.role === "supplier");
        setSuppliers(supplierList);

        // Load orders
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(allOrders);

        // Load users
        setUsers(allUsers);

        // Calculate stats
        const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
        const pendingSuppliers = supplierList.filter((s) => !s.isVerified).length;

        setStats({
            totalUsers: allUsers.length,
            totalOrders: allOrders.length,
            totalRevenue,
            pendingSuppliers,
        });
    };

    const verifySupplier = (supplierId) => {
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updated = allUsers.map((u) =>
            u.id === supplierId ? { ...u, isVerified: true } : u
        );
        localStorage.setItem("users", JSON.stringify(updated));
        loadData();
    };

    const rejectSupplier = (supplierId) => {
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updated = allUsers.filter((u) => u.id !== supplierId);
        localStorage.setItem("users", JSON.stringify(updated));
        loadData();
    };

    return (
        <div className="admin-dashboard">
            <div className="container">
                <h1>👑 Админ-панель</h1>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div>
                            <p>Пользователей</p>
                            <h3>{stats.totalUsers}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div>
                            <p>Заказов</p>
                            <h3>{stats.totalOrders}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div>
                            <p>Всего доходов</p>
                            <h3>₽{stats.totalRevenue.toFixed(0)}</h3>
                        </div>
                    </div>
                    <div className="stat-card stat-card--alert">
                        <div className="stat-icon">⏳</div>
                        <div>
                            <p>Ожидают верификации</p>
                            <h3>{stats.pendingSuppliers}</h3>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        📊 Обзор
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "suppliers" ? "active" : ""}`}
                        onClick={() => setActiveTab("suppliers")}
                    >
                        🏪 Поставщики ({suppliers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        📋 Заказы ({orders.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
                        onClick={() => setActiveTab("users")}
                    >
                        👥 Пользователи ({users.length})
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="tab-content">
                        <h2>Общая статистика</h2>
                        <div className="overview-grid">
                            <div className="overview-card">
                                <h3>Новых пользователей (30 дней)</h3>
                                <p className="big-number">+{Math.floor(stats.totalUsers * 0.3)}</p>
                            </div>
                            <div className="overview-card">
                                <h3>Средний чек</h3>
                                <p className="big-number">
                                    ₽{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0}
                                </p>
                            </div>
                            <div className="overview-card">
                                <h3>Завершено заказов</h3>
                                <p className="big-number">{Math.floor(stats.totalOrders * 0.7)}</p>
                            </div>
                            <div className="overview-card">
                                <h3>Активных поставщиков</h3>
                                <p className="big-number">{suppliers.filter((s) => s.isVerified).length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Suppliers Tab */}
                {activeTab === "suppliers" && (
                    <div className="tab-content">
                        <h2>Управление поставщиками</h2>

                        {/* Pending Verification */}
                        <div className="content-section">
                            <h3>⏳ На проверке ({suppliers.filter((s) => !s.isVerified).length})</h3>
                            {suppliers.filter((s) => !s.isVerified).length === 0 ? (
                                <p className="empty-text">Нет поставщиков на проверке</p>
                            ) : (
                                <div className="table">
                                    {suppliers
                                        .filter((s) => !s.isVerified)
                                        .map((supplier) => (
                                            <div key={supplier.id} className="table-row">
                                                <div className="table-cell">
                                                    <strong>{supplier.storeName}</strong>
                                                    <p>{supplier.email}</p>
                                                </div>
                                                <div className="table-cell">
                                                    <p>{supplier.storeCity}</p>
                                                </div>
                                                <div className="table-cell table-cell--actions">
                                                    <button
                                                        className="btn btn--small btn--success"
                                                        onClick={() => verifySupplier(supplier.id)}
                                                    >
                                                        ✓ Одобрить
                                                    </button>
                                                    <button
                                                        className="btn btn--small btn--danger"
                                                        onClick={() => rejectSupplier(supplier.id)}
                                                    >
                                                        ✕ Отклонить
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Verified Suppliers */}
                        <div className="content-section">
                            <h3>✓ Проверено ({suppliers.filter((s) => s.isVerified).length})</h3>
                            {suppliers.filter((s) => s.isVerified).length === 0 ? (
                                <p className="empty-text">Нет подтвержденных поставщиков</p>
                            ) : (
                                <div className="table">
                                    {suppliers
                                        .filter((s) => s.isVerified)
                                        .map((supplier) => (
                                            <div key={supplier.id} className="table-row">
                                                <div className="table-cell">
                                                    <strong>{supplier.storeName}</strong>
                                                    <p>{supplier.email}</p>
                                                </div>
                                                <div className="table-cell">
                                                    <p>{supplier.storeCity}</p>
                                                </div>
                                                <div className="table-cell">
                                                    <p className="verified-badge">✓ Верифицирован</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div className="tab-content">
                        <h2>Мониторинг заказов</h2>
                        {orders.length === 0 ? (
                            <p className="empty-text">Нет заказов</p>
                        ) : (
                            <div className="table">
                                {orders
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .slice(0, 20)
                                    .map((order) => (
                                        <div key={order.id} className="table-row">
                                            <div className="table-cell">
                                                <strong>#{order.id}</strong>
                                                <p>{new Date(order.date).toLocaleDateString("ru-RU")}</p>
                                            </div>
                                            <div className="table-cell">
                                                <p>₽{order.total.toFixed(2)}</p>
                                            </div>
                                            <div className="table-cell">
                                                <span className={`status status--${order.status}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="tab-content">
                        <h2>База пользователей</h2>
                        {users.length === 0 ? (
                            <p className="empty-text">Нет пользователей</p>
                        ) : (
                            <div className="table">
                                {users.slice(0, 20).map((u) => (
                                    <div key={u.id} className="table-row">
                                        <div className="table-cell">
                                            <strong>
                                                {u.firstName} {u.lastName}
                                            </strong>
                                            <p>{u.email}</p>
                                        </div>
                                        <div className="table-cell">
                                            <p>{getRoleLabel(u.role)}</p>
                                        </div>
                                        <div className="table-cell">
                                            <p className="date-text">
                                                {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusLabel(status) {
    const labels = {
        pending: "⏳ В ожидании",
        confirmed: "✅ Подтверждено",
        shipped: "🚚 Отправлено",
        delivered: "📦 Доставлено",
    };
    return labels[status] || status;
}

function getRoleLabel(role) {
    const labels = {
        customer: "👤 Покупатель",
        supplier: "🏪 Поставщик",
        admin: "👑 Администратор",
    };
    return labels[role] || role;
}
