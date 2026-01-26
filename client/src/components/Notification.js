export default function Notification({ message }) {
  if (!message) return null;

  return (
    <div style={{
      background: "#222",
      color: "white",
      padding: 10,
      borderRadius: 5,
      marginBottom: 10
    }}>
      {message}
    </div>
  );
}
