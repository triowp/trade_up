import "./Loader.css";

export function Loader({ text = "Загружаем..." }) {
  return (
    <div className="loader">
      <div className="loader__leaf">🌿</div>
      <p>{text}</p>
    </div>
  );
}

export function ErrorMsg({ message }) {
  return (
    <div className="error-msg">
      <span>⚠️</span>
      <p>{message}</p>
    </div>
  );
}
