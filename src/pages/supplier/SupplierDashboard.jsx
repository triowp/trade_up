import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./SupplierDashboard.css";

export default function SupplierDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newProduct, setNewProduct] = useState({
        title: "",
        price: "",
        category: "electronics",
        description: "",
        image: "",
    });
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Load products from supplier
        const allProducts = JSON.parse(localStorage.getItem("supplierProducts") || "[]");
        const supplierProducts = allProducts.filter((p) => p.supplierId === user.id);
        setProducts(supplierProducts);

        // Load orders for this supplier
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const supplierOrders = allOrders.filter((o) => o.supplierId === user.id);
        setOrders(supplierOrders);

        // Calculate stats
        const totalRevenue = supplierOrders
            .filter((o) => o.status === "delivered")
            .reduce((sum, o) => sum + o.total, 0);
        const pendingOrders = supplierOrders.filter((o) => o.status === "pending").length;

        setStats({
            totalProducts: supplierProducts.length,
            totalOrders: supplierOrders.length,
            totalRevenue,
            pendingOrders,
        });
    };

    const addProduct = (e) => {
        e.preventDefault();
        if (!newProduct.title || !newProduct.price) {
            alert("Заполните обязательные поля");
            return;
        }

        const product = {
            id: Date.now().toString(),
            ...newProduct,
            price: parseFloat(newProduct.price),
            supplierId: user.id,
            createdAt: new Date().toISOString(),
        };

        const allProducts = JSON.parse(localStorage.getItem("supplierProducts") || "[]");
        allProducts.push(product);
        localStorage.setItem("supplierProducts", JSON.stringify(allProducts));

        setNewProduct({
            title: "",
            price: "",
            category: "electronics",
            description: "",
            image: "",
        });
        loadData();
    };

    const deleteProduct = (productId) => {
        const allProducts = JSON.parse(localStorage.getItem("supplierProducts") || "[]");
        const updated = allProducts.filter((p) => p.id !== productId);
        localStorage.setItem("supplierProducts", JSON.stringify(updated));
        loadData();
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const updated = allOrders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
        );
        localStorage.setItem("orders", JSON.stringify(updated));
        loadData();
    };

    return (
        <div className="supplier-dashboard">
            <div className="container">
                <h1>🏪 Панель управления поставщика</h1>

                {!user.isVerified && (
                    <div className="alert alert--warning">
                        ⏳ Ваш аккаунт ожидает верификации администратором.
                    </div>
                )}

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div>
                            <p>Товаров в каталоге</p>
                            <h3>{stats.totalProducts}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div>
                            <p>Всего заказов</p>
                            <h3>{stats.totalOrders}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div>
                            <p>Заработано</p>
                            <h3>₽{stats.totalRevenue.toFixed(0)}</h3>
                        </div>
                    </div>
                    <div className="stat-card stat-card--alert">
                        <div className="stat-icon">⏳</div>
                        <div>
                            <p>Требуют обработки</p>
                            <h3>{stats.pendingOrders}</h3>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="supplier-tabs">
                    <button
                        className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        📊 Обзор
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
                        onClick={() => setActiveTab("products")}
                    >
                        📦 Товары ({products.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        📋 Заказы ({orders.length})
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="tab-content">
                        <h2>Общая статистика</h2>
                        <div className="overview-grid">
                            <div className="overview-card">
                                <h3>Магазин</h3>
                                <p className="big-text">{user.storeName}</p>
                                <p className="desc-text">📍 {user.storeCity}</p>
                            </div>
                            <div className="overview-card">
                                <h3>Средняя цена товара</h3>
                                <p className="big-number">
                                    ₽{products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0) : 0}
                                </p>
                            </div>
                            <div className="overview-card">
                                <h3>Выполнено заказов</h3>
                                <p className="big-number">{orders.filter((o) => o.status === "delivered").length}</p>
                            </div>
                            <div className="overview-card">
                                <h3>Средний рейтинг</h3>
                                <p className="big-number">⭐ 4.8</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div className="tab-content">
                        <h2>Управление товарами</h2>

                        {/* Add Product Form */}
                        <div className="add-product-form">
                            <h3>➕ Добавить новый товар</h3>
                            <form onSubmit={addProduct}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Название товара</label>
                                        <input
                                            type="text"
                                            value={newProduct.title}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, title: e.target.value })
                                            }
                                            placeholder="Название"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Цена (₽)</label>
                                        <input
                                            type="number"
                                            value={newProduct.price}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, price: e.target.value })
                                            }
                                            placeholder="0.00"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Категория</label>
                                        <select
                                            value={newProduct.category}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, category: e.target.value })
                                            }
                                        >
                                            <option value="electronics">Электроника</option>
                                            <option value="jewelery">Украшения</option>
                                            <option value="men's clothing">Мужская одежда</option>
                                            <option value="women's clothing">Женская одежда</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Ссылка на изображение</label>
                                        <input
                                            type="url"
                                            value={newProduct.image}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, image: e.target.value })
                                            }
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Описание</label>
                                    <textarea
                                        value={newProduct.description}
                                        onChange={(e) =>
                                            setNewProduct({ ...newProduct, description: e.target.value })
                                        }
                                        placeholder="Описание товара"
                                        rows="3"
                                    />
                                </div>

                                <button type="submit" className="btn btn--primary">
                                    + Добавить товар
                                </button>
                            </form>
                        </div>

                        {/* Products List */}
                        <div className="products-section">
                            <h3>📦 Ваши товары ({products.length})</h3>
                            {products.length === 0 ? (
                                <p className="empty-text">Вы еще не добавили товары</p>
                            ) : (
                                <div className="products-table">
                                    {products.map((product) => (
                                        <div key={product.id} className="product-row">
                                            <div className="product-info">
                                                <strong>{product.title}</strong>
                                                <p>{product.category}</p>
                                            </div>
                                            <div className="product-price">
                                                <strong>₽{product.price.toFixed(2)}</strong>
                                            </div>
                                            <div className="product-actions">
                                                <button className="btn btn--ghost btn--sm">✏️</button>
                                                <button
                                                    className="btn btn--danger btn--sm"
                                                    onClick={() => deleteProduct(product.id)}
                                                >
                                                    🗑️
                                                </button>
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
                            <div className="orders-section">
                                {orders
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map((order) => (
                                        <div key={order.id} className="order-item">
                                            <div className="order-header">
                                                <h4>Заказ #{order.id}</h4>
                                                <span className={`status status--${order.status}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                            <div className="order-details">
                                                <p>
                                                    <strong>Дата:</strong>{" "}
                                                    {new Date(order.date).toLocaleDateString("ru-RU")}
                                                </p>
                                                <p>
                                                    <strong>Сумма:</strong> ₽{order.total.toFixed(2)}
                                                </p>
                                                <p>
                                                    <strong>Товаров:</strong> {order.items.length} шт.
                                                </p>
                                            </div>
                                            <div className="order-actions">
                                                {order.status === "pending" && (
                                                    <button
                                                        className="btn btn--small btn--primary"
                                                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                                                    >
                                                        ✓ Подтвердить
                                                    </button>
                                                )}
                                                {order.status === "confirmed" && (
                                                    <button
                                                        className="btn btn--small btn--primary"
                                                        onClick={() => updateOrderStatus(order.id, "shipped")}
                                                    >
                                                        🚚 Отправить
                                                    </button>
                                                )}
                                                {order.status === "shipped" && (
                                                    <button
                                                        className="btn btn--small btn--success"
                                                        onClick={() => updateOrderStatus(order.id, "delivered")}
                                                    >
                                                        📦 Доставлено
                                                    </button>
                                                )}
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
