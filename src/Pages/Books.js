import React, { useState, useEffect } from "react";
import axios from "axios";

function Books() {
  const [books, setBooks] = useState([]);
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [copies, setCopies] = useState("");
  const [editId, setEditId] = useState(null);

  const backendUrl = "https://library-eight-liart.vercel.app/api/books";

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try { const res = await axios.get(backendUrl); setBooks(res.data); }
    catch (err) { console.error(err); }
  };

  const handleAddOrUpdate = async () => {
    const trimmedIsbn = isbn.trim();
    const trimmedTitle = title.trim();
    const trimmedAuthors = authors.trim();
    const copiesNumber = Number(copies);

    if (!trimmedIsbn || !trimmedTitle || !trimmedAuthors || !copiesNumber) {
      return alert("All fields are required and copies must be a number.");
    }

    try {
      const data = { isbn: trimmedIsbn, title: trimmedTitle, authors: trimmedAuthors, copies: copiesNumber };
      if (editId) await axios.put(`${backendUrl}/${editId}`, data);
      else await axios.post(backendUrl, data);

      setIsbn(""); setTitle(""); setAuthors(""); setCopies(""); setEditId(null);
      fetchBooks();
    } catch (err) {
      console.error("Add/Update failed:", err.response?.data || err);
      alert("Failed to add/update book. Check console.");
    }
  };

  const handleEdit = (book) => {
    setIsbn(book.isbn); setTitle(book.title); setAuthors(book.authors); setCopies(book.copies); setEditId(book._id);
  };
  const handleDelete = async (id) => {
    try { await axios.delete(`${backendUrl}/${id}`); fetchBooks(); } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2>Books</h2>
      <div style={formStyle}>
        <input placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Authors" value={authors} onChange={e => setAuthors(e.target.value)} />
        <input placeholder="Copies" type="number" value={copies} onChange={e => setCopies(e.target.value)} />
        <button onClick={handleAddOrUpdate} style={editId ? updateBtnStyle : addBtnStyle}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>ISBN</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Authors</th>
            <th style={thStyle}>Copies</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book._id}>
              <td style={tdStyle}>{book.isbn}</td>
              <td style={tdStyle}>{book.title}</td>
              <td style={tdStyle}>{book.authors}</td>
              <td style={tdStyle}>{book.copies}</td>
              <td style={tdStyle}>
                <button style={updateBtnStyle} onClick={() => handleEdit(book)}>Edit</button>
                <button style={deleteBtnStyle} onClick={() => handleDelete(book._id)}>Delete</button>
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

export default Books;
