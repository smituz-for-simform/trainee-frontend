import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const API = "http://localhost:8080";

// 🔹 STYLES
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
    if (!window.confirm("Delete this contact?")) return;

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
        <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={c.image_url ? `${API}${c.image_url}` : `${API}/uploads/default.jpeg`}
              alt="profile"
              width="40"
              height="40"
              style={{ borderRadius: "50%", marginRight: "10px" }}
            />
            <span>{c.name} - {c.phone}</span>
          </div>

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

// 🔹 ADD CONTACT
function AddContact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const createContact = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (image) formData.append("image", image);

    const res = await fetch(`${API}/add_contact`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) navigate("/");
  };

  return (
    <div style={containerStyle}>
      <h2>Add Contact</h2>

      <input style={inputStyle} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input style={inputStyle} placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <div style={{ marginTop: "10px" }}>
        <button style={{ ...buttonStyle, background: "#4CAF50", color: "white" }} onClick={createContact}>Save</button>
        <button style={{ ...buttonStyle, background: "#ccc" }} onClick={() => navigate("/")}>Cancel</button>
      </div>
    </div>
  );
}

// 🔹 UPDATE CONTACT
function UpdateContact() {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
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
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("phone", phone);
    if (image) formData.append("image", image);

    const res = await fetch(`${API}/update_contact`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) navigate("/");
  };

  return (
    <div style={containerStyle}>
      <h2>Update Contacts</h2>
      <button style={{ ...buttonStyle, background: "#ccc" }} onClick={() => navigate("/")}>Back</button>

      {contacts.map((c) => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>

          {editingId === c.id ? (
            <>
              <div>
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
              </div>
              <button style={{ ...buttonStyle, background: "#4CAF50", color: "white" }} onClick={() => updateContact(c.id)}>Save</button>
            </>
          ) : (
            <>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={c.image_url ? `${API}${c.image_url}` : `${API}/uploads/default.jpeg`}
                    alt={c.name}
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%", marginRight: "10px", objectFit: "cover" }}
                  />
                  <span>{c.name} - {c.phone}</span>
                </div>

              <button style={{ ...buttonStyle, background: "#2196F3", color: "white" }} onClick={() => startEdit(c)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// 🔹 MAIN
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