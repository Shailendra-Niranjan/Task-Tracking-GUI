import React, { useState } from "react";
import axios from 'axios'
function SignUpForm() {
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        email: "",
        contact: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        password: "",
      });
      

      const handleChange = (e) =>{
           const{name,value} = e.target;
           setFormData({
             ...formData,
             [name]:value,
           })
      }
       
      const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://task-racker.onrender.com/auth/register',{
            email:formData.email,
            password:formData.password,
            role:formData.role,
            name:formData.name,
            address:formData.address,
            contact:formData.contact,
            city:formData.city,
            state:formData.state,
            pincode:formData.pincode
        }).then((response)=>{
           console.log(response)
        }).catch((error)=>console.log(error.message))
      };

  return (
     <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-3xl w-full b rounded-lg shadow-lg p-8">
        
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-black">Sign Up</h2>
          <p className="text-sm text-gray-600">
            Create your account and join us today.
          </p>
        </div>

       
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-black text-sm mb-2 block">Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-black text-sm mb-2 block">Role</label>
              <input
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="Enter your role"
              />
            </div>
          </div>

          {/* Row 2: Email & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-black text-sm mb-2 block">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-black text-sm mb-2 block">Contact</label>
              <input
                name="contact"
                type="tel"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="Enter your contact number"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-black text-sm mb-2 block">Address</label>
            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              placeholder="Enter your address"
            ></textarea>
          </div>

          {/* Row 4: City, State, Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-black text-sm mb-2 block">City</label>
              <input
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="City"
              />
            </div>
            <div>
              <label className="text-black text-sm mb-2 block">State</label>
              <input
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="State"
              />
            </div>
            <div>
              <label className="text-black text-sm mb-2 block">Pincode</label>
              <input
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="Pincode"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-black text-sm mb-2 block">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-black rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-black font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
