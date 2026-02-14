export default function Modal({ title, children, onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{title}</h3>
        {children}
        <button onClick={onClose} style={{ marginTop: 10 }}>
          Close
        </button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "white",
  padding: 20,
  borderRadius: 8,
  minWidth: 300
};
