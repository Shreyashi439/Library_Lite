import { useState } from "react";
import { lendBook } from "../api/lending.api";

function LendBookModal({ book, members, onClose, onSuccess }) {
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMemberId) {
      alert("Please select a member");
      return;
    }

    const selectedMember = members.find(
      (m) => m.id === parseInt(selectedMemberId)
    );

    // 🔒 Prevent same member from re-loaning or re-waitlisting
    const memberAlreadyHasBook = selectedMember?.active_loans.some(
      (loan) => loan.book.id === book.id
    );

    if (memberAlreadyHasBook) {
      alert("This member already has this book on loan");
      return;
    }

    try {
      const res = await lendBook({
        book_id: book.id,
        member_id: selectedMemberId,
      });

      alert(res.data.message);
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Error processing request");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 8,
          width: 350,
        }}
      >
        <h3>
          {book.status === "AVAILABLE"
            ? "Lend Book"
            : "Join Waitlist"}
        </h3>

        <p>
          <strong>{book.title}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            style={{ width: "100%", marginBottom: 16 }}
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                background:
                  book.status === "AVAILABLE"
                    ? "#16A34A"
                    : "#F59E0B",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
              }}
            >
              {book.status === "AVAILABLE"
                ? "Confirm Lend"
                : "Join Waitlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LendBookModal;
