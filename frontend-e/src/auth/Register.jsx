import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = () => {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer"
  });

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      alert("Registered Successfully ✅");
      nav("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register
        </h2>

        <input
          name="name"
          placeholder="Name"
          onChange={change}
          className="w-full border p-2 mb-2"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={change}
          className="w-full border p-2 mb-2"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={change}
          className="w-full border p-2 mb-2"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={change}
          className="w-full border p-2 mb-2"
        />

        <textarea
          name="address"
          placeholder="Address"
          onChange={change}
          className="w-full border p-2 mb-2"
        />

        {/* Role Selection */}
        <select
          name="role"
          onChange={change}
          className="w-full border p-2 mb-3"
        >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
        </select>

        <button
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Register
        </button>

      </form>

    </div>
  );
};

export default Register;
