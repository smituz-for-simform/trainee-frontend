import React, { useEffect, useState } from "react";

const API = "http://localhost:8080";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);

  // 🔹 GET contacts
  const fetchContacts = async () => {
    const res = await fetch(`${API}/get_contacts`);
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 🔹 POST contact
  const createContact = async () => {
    const res = await fetch(`${API}/add_contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    setName("");
    setPhone("");
    fetchContacts();
  };

  // 🔹 PUT contact
  const updateContact = async (id) => {
    const res = await fetch(`${API}/update_contact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, phone }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    setEditingId(null);
    setName("");
    setPhone("");
    fetchContacts();
  };

  // 🔹 DELETE contact
  const deleteContact = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const res = await fetch(`${API}/del_contact/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message || data.error);
    fetchContacts();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📱 Phonebook</h1>

      {/* 🔹 Create Contact */}
      <div className="mb-6 border p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">Create Contact</h2>
        <input
          className="border p-2 mr-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          onClick={createContact}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* 🔹 Contact List (GET) */}
      <div className="border p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">All Contacts</h2>

        {contacts.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border-b py-2"
          >
            {editingId === c.id ? (
              <>
                <input
                  className="border p-1 mr-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="border p-1 mr-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button
                  onClick={() => updateContact(c.id)}
                  className="text-green-600 mr-2"
                >
                  ✔
                </button>
              </>
            ) : (
              <>
                <span>
                  {c.name} - {c.phone}
                </span>
                <div>
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setName(c.name);
                      setPhone(c.phone);
                    }}
                    className="mr-2 text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteContact(c.id)}
                    className="text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
