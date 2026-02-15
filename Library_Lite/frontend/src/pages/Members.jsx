import { useEffect, useState } from "react";
import { getMembers, createMember, deleteMember } from "../api/members.api";
import { returnBook } from "../api/lending.api";
import EditMemberModal from "../components/EditMemberModal";

function Members() {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null); // ✅ added
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
  });

  const fetchMembers = async () => {
    const res = await getMembers();
    setMembers(res.data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await createMember(form);
      setForm({ first_name: "", last_name: "" });
      fetchMembers();
    } catch (err) {
      alert("Error adding member");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    await deleteMember(id);
    fetchMembers();
  };

  const handleReturn = async (loanId) => {
    try {
      const res = await returnBook({ loan_id: loanId });
      alert(res.data.message);
      fetchMembers();
    } catch (err) {
      alert("Error returning book");
    }
  };

  return (
    <div>
      <h2>Members</h2>

      {/* Add Member Form */}
      <form onSubmit={handleAddMember} style={{ marginBottom: 30 }}>
        <input
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
          }
          required
        />
        <input
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) =>
            setForm({ ...form, last_name: e.target.value })
          }
          required
        />
        <button type="submit">Add Member</button>
      </form>

      {/* Members List */}
      {members.map((member) => (
        <div
          key={member.id}
          style={{
            background: "white",
            padding: 16,
            marginBottom: 15,
            borderRadius: 8,
          }}
        >
          <h3>
            {member.first_name} {member.last_name}
          </h3>

          <strong>Active Loans:</strong>

          {member.active_loans.length === 0 ? (
            <p>No active loans</p>
          ) : (
            <ul>
              {member.active_loans.map((loan) => (
                <li key={loan.id} style={{ marginBottom: 8 }}>
                  {loan.book.title} — Due: {loan.due_date}
                  <button
                    style={{
                      marginLeft: 10,
                      background: "#DC2626",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => handleReturn(loan.id)}
                  >
                    Return
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Actions */}
          <div style={{ marginTop: 10 }}>
            <button
              style={{ marginRight: 10 }}
              disabled={member.active_loans.length > 0}
              title={
                member.active_loans.length > 0
                  ? "Cannot edit member with active loans"
                  : ""
              }
              onClick={() => setEditingMember(member)}
            >
              Edit
            </button>

            <button onClick={() => handleDelete(member.id)}>
              Delete Member
            </button>
          </div>
        </div>
      ))}

      {/* ✅ Edit Member Modal */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSuccess={() => {
            fetchMembers();
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
}

export default Members;
