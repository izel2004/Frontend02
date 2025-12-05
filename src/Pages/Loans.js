import React, { useState, useEffect } from "react";
import axios from "axios";

function Loans() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [loanDate, setLoanDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [editId, setEditId] = useState(null);

  const backendUrlLoans = "https://library-eight-liart.vercel.app/api/loans";
  const backendUrlBooks = "https://library-eight-liart.vercel.app/api/books";
  const backendUrlMembers = "https://library-eight-liart.vercel.app/api/members";

  useEffect(() => {
    fetchLoans();
    fetchBooks();
    fetchMembers();
  }, []);

  const fetchLoans = async () => {
    try { const res = await axios.get(backendUrlLoans); setLoans(res.data); }
    catch (err) { console.error("Failed to fetch loans:", err); }
  };

  const fetchBooks = async () => {
    try { const res = await axios.get(backendUrlBooks); setBooks(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchMembers = async () => {
    try { const res = await axios.get(backendUrlMembers); setMembers(res.data); }
    catch (err) { console.error(err); }
  };

  const handleAddOrUpdate = async () => {
    if (!selectedBook || !selectedMember || !loanDate) {
      return alert("Book, Member, and Loan Date are required.");
    }

    const data = {
      bookId: selectedBook,
      memberId: selectedMember,
      loanDate,
      returnDate: returnDate || null
    };

    try {
      if (editId) await axios.put(`${backendUrlLoans}/${editId}`, data);
      else await axios.post(backendUrlLoans, data);

      setSelectedBook(""); setSelectedMember(""); setLoanDate(""); setReturnDate(""); setEditId(null);
      fetchLoans();
    } catch (err) {
      console.error("Failed to add/update loan:", err.response?.data || err);
      alert("Failed to add/update loan. Check console.");
    }
  };

  const handleEdit = (loan) => {
    setSelectedBook(loan.bookId); setSelectedMember(loan.memberId);
    setLoanDate(loan.loanDate?.slice(0,10)); // format YYYY-MM-DD
    setReturnDate(loan.returnDate?.slice(0,10) || "");
    setEditId(loan._id);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${backendUrlLoans}/${id}`); fetchLoans(); }
    catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2>Loans</h2>
      <div style={formStyle}>
        <select value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
          <option value="">Select Book</option>
          {books.map(book => <option key={book._id} value={book._id}>{book.title}</option>)}
        </select>
        <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
          <option value="">Select Member</option>
          {members.map(member => <option key={member._id} value={member._id}>{member.name}</option>)}
        </select>
        <input type="date" value={loanDate} onChange={e => setLoanDate(e.target.value)} />
        <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
        <button onClick={handleAddOrUpdate} style={editId ? updateBtnStyle : addBtnStyle}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Book</th>
            <th style={thStyle}>Member</th>
            <th style={thStyle}>Loan Date</th>
            <th style={thStyle}>Return Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => (
            <tr key={loan._id}>
              <td style={tdStyle}>{books.find(b => b._id === loan.bookId)?.title || "Deleted Book"}</td>
              <td style={tdStyle}>{members.find(m => m._id === loan.memberId)?.name || "Deleted Member"}</td>
              <td style={tdStyle}>{loan.loanDate?.slice(0,10)}</td>
              <td style={tdStyle}>{loan.returnDate?.slice(0,10) || "-"}</td>
              <td style={tdStyle}>
                <button style={updateBtnStyle} onClick={() => handleEdit(loan)}>Edit</button>
                <button style={deleteBtnStyle} onClick={() => handleDelete(loan._id)}>Delete</button>
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

export default Loans;
