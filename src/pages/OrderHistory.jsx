import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { fetchOrdersByUser } from "../api/orders";
import "./OrderHistory.css";

export default function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user?.id) {
            setOrders([]);
            return;
        }

        fetchOrdersByUser(user.id)
            .then((data) => {
                setOrders(
                    Array.isArray(data)
                        ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
                        : []
                );
            })
            .catch(() => {
                setOrders([]);
            });
    }, [user]);

    return (
        <div className="order-history">
            <div className="container">
                <h1>История заказов</h1>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <p>📦</p>
                        <h2>Нет заказов</h2>
                        <p>Вы еще не оформляли заказы</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Заказ #{order.id}</h3>
                                        <p className="order-date">
                                            {new Date(order.date).toLocaleDateString("ru-RU", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <span className={`status status--${order.status}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="item">
                                            <span>{item.title}</span>
                                            <span>x{item.qty}</span>
                                            <span>₽{(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div>
                                        <p>Общая стоимость</p>
                                        <h3>₽{order.total.toFixed(2)}</h3>
                                    </div>
                                    <button className="btn btn--ghost">Подробнее</button>
                                </div>
                            </div>
                        ))}
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
        cancelled: "❌ Отменено",
    };
    return labels[status] || status;
}
