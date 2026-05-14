/**
 * Initialize demo data on first app load
 */
export function initializeDemoData() {
    // Check if demo data already exists
    if (localStorage.getItem("demoDataInitialized")) {
        return;
    }

    // Create demo users
    const demoUsers = [
        {
            id: "1",
            email: "customer@demo.com",
            password: "demo123",
            firstName: "Иван",
            lastName: "Петров",
            phone: "+7 (900) 111-11-11",
            role: "customer",
            createdAt: new Date().toISOString(),
            isVerified: true,
        },
        {
            id: "2",
            email: "supplier@demo.com",
            password: "demo123",
            firstName: "Сергей",
            lastName: "Соколов",
            phone: "+7 (900) 222-22-22",
            role: "supplier",
            storeName: "Fresh Fruits Market",
            storeCity: "Москва",
            createdAt: new Date().toISOString(),
            isVerified: true,
            balance: 15000,
        },
        {
            id: "3",
            email: "admin@demo.com",
            password: "demo123",
            firstName: "Анна",
            lastName: "Админова",
            phone: "+7 (900) 333-33-33",
            role: "admin",
            createdAt: new Date().toISOString(),
            isVerified: true,
        },
    ];

    localStorage.setItem("users", JSON.stringify(demoUsers));

    // Create demo products for supplier
    const demoProducts = [
        {
            id: "p1",
            title: "Органические яблоки",
            price: 150,
            category: "vegetables",
            description: "Свежие органические яблоки с собственного сада",
            image: "https://via.placeholder.com/200?text=Яблоки",
            supplierId: "2",
            createdAt: new Date().toISOString(),
        },
        {
            id: "p2",
            title: "Спелые помидоры",
            price: 120,
            category: "vegetables",
            description: "Томаты высшего качества",
            image: "https://via.placeholder.com/200?text=Помидоры",
            supplierId: "2",
            createdAt: new Date().toISOString(),
        },
        {
            id: "p3",
            title: "Молодая морковь",
            price: 100,
            category: "vegetables",
            description: "Свежая морковь урожая этого сезона",
            image: "https://via.placeholder.com/200?text=Морковь",
            supplierId: "2",
            createdAt: new Date().toISOString(),
        },
        {
            id: "p4",
            title: "Спелые бананы",
            price: 180,
            category: "fruits",
            description: "Желтые спелые бананы",
            image: "https://via.placeholder.com/200?text=Бананы",
            supplierId: "2",
            createdAt: new Date().toISOString(),
        },
        {
            id: "p5",
            title: "Клубника свежая",
            price: 300,
            category: "fruits",
            description: "Сладкая клубника",
            image: "https://via.placeholder.com/200?text=Клубника",
            supplierId: "2",
            createdAt: new Date().toISOString(),
        },
    ];

    localStorage.setItem("supplierProducts", JSON.stringify(demoProducts));

    // Create some demo orders
    const demoOrders = [
        {
            id: "o1",
            userId: "1",
            supplierId: "2",
            items: [
                { id: "p1", title: "Органические яблоки", price: 150, qty: 2 },
                { id: "p3", title: "Молодая морковь", price: 100, qty: 1 },
            ],
            total: 400,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: "delivered",
            address: "ул. Пушкина, 10",
            city: "Москва",
            phone: "+7 (900) 111-11-11",
        },
    ];

    localStorage.setItem("orders", JSON.stringify(demoOrders));

    // Mark as initialized
    localStorage.setItem("demoDataInitialized", "true");
}
