import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const API = "http://localhost:8080";

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
    <div>
      <h1>📱 PhoneBook</h1>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/add_contact">
          <button>Add a Contact</button>
        </Link>

        <Link to="/update_contact" style={{ marginLeft: "10px" }}>
          <button>Update a Contact</button>
        </Link>
      </div>

      <h3>All Contacts</h3>

      {contacts.map((c) => (
        <div key={c.id} style={{ marginBottom: "10px" }}>
          {c.name} - {c.phone}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => deleteContact(c.id)}
          >
            🗑️
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
    <div>
      <h2>Add Contact</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <div>
        <button onClick={createContact}>Save</button>
        <button onClick={() => navigate("/")}>Cancel</button>
      </div>
    </div>
  );
}

// 🔹 UPDATE CONTACT PAGE (INLINE EDIT)
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
    <div>
      <h2>Update Contacts</h2>
      <button onClick={() => navigate("/")}>⬅ Back</button>

      {contacts.map((c) => (
        <div key={c.id} style={{ marginBottom: "10px" }}>
          {editingId === c.id ? (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button onClick={() => updateContact(c.id)}>✔ Save</button>
            </>
          ) : (
            <>
              {c.name} - {c.phone}
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => startEdit(c)}
              >
                ✏️
              </button>
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
