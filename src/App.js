import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const API = "http://localhost:8080";

// 🔹 COMMON STYLES
const containerStyle = {
  maxWidth: "700px",
  margin: "40px auto",
  padding: "20px",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const buttonStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  marginRight: "10px",
};

const inputStyle = {
  padding: "8px",
  marginRight: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

// 🔹 HOME PAGE
function Home() {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    const res = await fetch(`${API}/get_contacts`);
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    const res = await fetch(`${API}/del_contact/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message || data.error);
    fetchContacts();
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center" }}>📱 PhoneBook</h1>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Link to="/add_contact">
          <button style={{ ...buttonStyle, background: "#4CAF50", color: "white" }}>Add Contact</button>
        </Link>

        <Link to="/update_contact">
          <button style={{ ...buttonStyle, background: "#2196F3", color: "white" }}>Update Contact</button>
        </Link>
      </div>

      <h3>All Contacts</h3>

      {contacts.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>
          <span>{c.name} - {c.phone}</span>
          <button
            style={{ ...buttonStyle, background: "#f44336", color: "white" }}
            onClick={() => deleteContact(c.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// 🔹 ADD CONTACT PAGE
function AddContact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const createContact = async () => {
    const res = await fetch(`${API}/add_contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) navigate("/");
  };

  return (
    <div style={containerStyle}>
      <h2>Add Contact</h2>

      <div style={{ marginBottom: "15px" }}>
        <input style={inputStyle} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={inputStyle} placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <button style={{ ...buttonStyle, background: "#4CAF50", color: "white" }} onClick={createContact}>Save</button>
      <button style={{ ...buttonStyle, background: "#ccc" }} onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
}

// 🔹 UPDATE CONTACT PAGE
function UpdateContact() {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const fetchContacts = async () => {
    const res = await fetch(`${API}/get_contacts`);
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const startEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setPhone(c.phone);
  };

  const updateContact = async (id) => {
    const res = await fetch(`${API}/update_contact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, phone }),
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      setEditingId(null);
      navigate("/");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Update Contacts</h2>
      <button style={{ ...buttonStyle, background: "#ccc" }} onClick={() => navigate("/")}>Back</button>

      {contacts.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>
          {editingId === c.id ? (
            <>
              <div>
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <button style={{ ...buttonStyle, background: "#4CAF50", color: "white" }} onClick={() => updateContact(c.id)}>Save</button>
            </>
          ) : (
            <>
              <span>{c.name} - {c.phone}</span>
              <button style={{ ...buttonStyle, background: "#2196F3", color: "white" }} onClick={() => startEdit(c)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// 🔹 MAIN APP
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add_contact" element={<AddContact />} />
        <Route path="/update_contact" element={<UpdateContact />} />
      </Routes>
    </Router>
  );
}
