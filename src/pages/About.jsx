import "./About.css";

export default function About() {
  return (
    <div className="about">
      <div className="about__hero">
        <h1>О нас</h1>
        <p>
          FreshMarket — это современный онлайн-магазин, где мы объединяем
          лучших поставщиков с покупателями по всей стране.
        </p>
      </div>

      <div className="about__values">
        {[
          { emoji: "🌱", title: "Качество", text: "Только проверенные бренды и сертифицированные товары." },
          { emoji: "🚚", title: "Быстрая доставка", text: "Доставим ваш заказ за 1–2 дня прямо до двери." },
          { emoji: "💚", title: "Экология", text: "Минимум упаковки, максимум заботы о природе." },
          { emoji: "🔒", title: "Безопасность", text: "Защищённые платежи и конфиденциальность данных." },
        ].map((v) => (
          <div key={v.title} className="about__card">
            <span>{v.emoji}</span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
