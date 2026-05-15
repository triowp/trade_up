import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

export default function UserProfile() {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        ...(user?.role === "supplier" && {
            storeName: user?.storeName || "",
            storeCity: user?.storeCity || "",
        }),
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            updateProfile(formData);
            setSuccess("Профиль обновлен успешно!");
            setIsEditing(false);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="profile-container">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div>
                        <h1>
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="role-badge">
                            {getRoleLabel(user?.role)} {user?.role === "supplier" && !user?.isVerified && "⏳ На проверке"}
                        </p>
                    </div>
                </div>

                {error && <div className="alert alert--error">{error}</div>}
                {success && <div className="alert alert--success">{success}</div>}

                <div className="profile-content">
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Личная информация</h2>
                            <button
                                className="btn btn--ghost btn--sm"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? "Отмена" : "Изменить"}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Имя</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Фамилия</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={formData.email} disabled />
                                </div>

                                <div className="form-group">
                                    <label>Телефон</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                {user?.role === "supplier" && (
                                    <>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Название магазина</label>
                                                <input
                                                    type="text"
                                                    name="storeName"
                                                    value={formData.storeName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Город</label>
                                                <input
                                                    type="text"
                                                    name="storeCity"
                                                    value={formData.storeCity}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button type="submit" className="btn btn--primary">
                                    Сохранить изменения
                                </button>
                            </form>
                        ) : (
                            <div className="profile-info">
                                <div className="info-row">
                                    <span>Email:</span>
                                    <strong>{user?.email}</strong>
                                </div>
                                <div className="info-row">
                                    <span>Телефон:</span>
                                    <strong>{user?.phone || "Не указан"}</strong>
                                </div>
                                {user?.role === "supplier" && (
                                    <>
                                        <div className="info-row">
                                            <span>Магазин:</span>
                                            <strong>{user?.storeName}</strong>
                                        </div>
                                        <div className="info-row">
                                            <span>Город:</span>
                                            <strong>{user?.storeCity}</strong>
                                        </div>
                                    </>
                                )}
                                <div className="info-row">
                                    <span>Дата регистрации:</span>
                                    <strong>
                                        {new Date(user?.createdAt).toLocaleDateString("ru-RU")}
                                    </strong>
                                </div>
                            </div>
                        )}
                    </div>

                    {user?.role === "supplier" && (
                        <div className="profile-section">
                            <h2>Баланс счета</h2>
                            <div className="balance-card">
                                <p>Текущий баланс</p>
                                <h1>₽{(user?.balance || 0).toFixed(2)}</h1>
                            </div>
                        </div>
                    )}

                    <div className="profile-section">
                        <h2>Быстрые ссылки</h2>
                        <div className="quick-links">
                            {user?.role === "customer" && (
                                <a href="/orders" className="link-card">
                                    <span>📦</span>
                                    <p>Мои заказы</p>
                                </a>
                            )}
                            {user?.role === "supplier" && (
                                <a href="/supplier-dashboard" className="link-card">
                                    <span>🏪</span>
                                    <p>Панель управления</p>
                                </a>
                            )}
                            {user?.role === "admin" && (
                                <a href="/admin" className="link-card">
                                    <span>👑</span>
                                    <p>Администрация</p>
                                </a>
                            )}
                            <a href="/" className="link-card">
                                <span>🛍️</span>
                                <p>Перейти в магазин</p>
                            </a>
                        </div>
                    </div>

                    <div className="profile-section">
                        <button className="btn btn--danger btn--full" onClick={handleLogout}>
                            Выйти из аккаунта
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getRoleLabel(role) {
    const labels = {
        customer: "👤 Покупатель",
        supplier: "🏪 Поставщик",
        admin: "👑 Администратор",
    };
    return labels[role] || role;
}
