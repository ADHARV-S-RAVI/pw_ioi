import { useState } from "react";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    venue: "",
    price: "",
    supply: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Created:", form);
    alert("Event created (UI only for now)");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Create Event</h2>

        <input
          name="name"
          placeholder="Event Name"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-800"
        />

        <input
          type="date"
          name="date"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-800"
        />

        <input
          name="venue"
          placeholder="Venue"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-800"
        />

        <input
          name="price"
          placeholder="Ticket Price (ALGO)"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-800"
        />

        <input
          name="supply"
          placeholder="Total Tickets"
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-800"
        />

        <button className="w-full bg-blue-600 py-2 rounded">
          Create Event
        </button>
      </form>
    </div>
  );
}
