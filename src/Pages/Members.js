import React, { useState, useEffect } from "react";
import axios from "axios";

function Members() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  const backendUrl = "https://library-eight-liart.vercel.app/api/members";

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try { const res = await axios.get(backendUrl); setMembers(res.data); }
    catch (err) { console.error(err); }
  };

  const handleAddOrUpdate = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) return alert("All fields are required.");

    try {
      const data = { name: trimmedName, email: trimmedEmail };
      if (editId) await axios.put(`${backendUrl}/${editId}`, data);
      else await axios.post(backendUrl, data);

      setName(""); setEmail(""); setEditId(null);
      fetchMembers();
    } catch (err) {
      console.error("Add/Update failed:", err.response?.data || err);
      alert("Failed to add/update member. Check console.");
    }
  };

  const handleEdit = (member) => {
    setName(member.name); setEmail(member.email); setEditId(member._id);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${backendUrl}/${id}`); fetchMembers(); } 
    catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2>Members</h2>
      <div style={formStyle}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button onClick={handleAddOrUpdate} style={editId ? updateBtnStyle : addBtnStyle}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member._id}>
              <td style={tdStyle}>{member.name}</td>
              <td style={tdStyle}>{member.email}</td>
              <td style={tdStyle}>
                <button style={updateBtnStyle} onClick={() => handleEdit(member)}>Edit</button>
                <button style={deleteBtnStyle} onClick={() => handleDelete(member._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const formStyle = { display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"20px" };
const tableStyle = { width:"100%", borderCollapse:"collapse" };
const theadStyle = { backgroundColor:"#f2f2f2" };
const thStyle = { textAlign:"left", padding:"10px", borderBottom:"2px solid #ddd" };
const tdStyle = { padding:"10px", borderBottom:"1px solid #ddd" };
const addBtnStyle = { backgroundColor:"#4CAF50", color:"white", border:"none", padding:"6px 12px", borderRadius:"4px", cursor:"pointer" };
const updateBtnStyle = { backgroundColor:"#FFA500", color:"white", border:"none", padding:"6px 12px", borderRadius:"4px", cursor:"pointer", marginRight:"5px" };
const deleteBtnStyle = { backgroundColor:"#f44336", color:"white", border:"none", padding:"6px 12px", borderRadius:"4px", cursor:"pointer" };

export default Members;
