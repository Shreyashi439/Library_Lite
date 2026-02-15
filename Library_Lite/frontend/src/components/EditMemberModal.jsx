import { useState } from "react";
import { updateMember } from "../api/members.api";

function EditMemberModal({ member, onClose, onSuccess }) {
  const [form, setForm] = useState({
    first_name: member.first_name,
    last_name: member.last_name,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim()) {
      alert("First and last name are required");
      return;
    }

    try {
      await updateMember(member.id, form);
      onSuccess();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update member"
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 8,
          width: 320,
        }}
      >
        <h3>Edit Member</h3>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) =>
              setForm({ ...form, first_name: e.target.value })
            }
            style={{ width: "100%", marginBottom: 10 }}
          />

          <input
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) =>
              setForm({ ...form, last_name: e.target.value })
            }
            style={{ width: "100%", marginBottom: 16 }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#6B7280",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                background: "#2563EB",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMemberModal;
