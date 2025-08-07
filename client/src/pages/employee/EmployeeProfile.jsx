import { useState, useEffect } from "react";
import axios from "axios";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/employees/profile");
      const profileData = response.data.data;
      setProfile(profileData);
      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
        email: profileData.email || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      await axios.put("/employees/profile", formData);

      // Refresh profile data
      fetchProfile();
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cancelEdit = () => {
    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
      email: profile.email || "",
    });
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your account information and track performance
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {profile?.name}
              </h2>
              <p className="text-gray-600 mb-4">Employee</p>

              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{profile?.earnings_balance || 0}
                  </div>
                  <div className="text-sm text-gray-600">Current Earnings</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {profile?.total_orders_handled || 0}
                    </div>
                    <div className="text-xs text-gray-600">Total Orders</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">
                      {profile?.completed_orders || 0}
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {profile?.total_orders_handled > 0
                    ? `${Math.round(
                        (profile?.completed_orders /
                          profile?.total_orders_handled) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width:
                      profile?.total_orders_handled > 0
                        ? `${
                            (profile?.completed_orders /
                              profile?.total_orders_handled) *
                            100
                          }%`
                        : "0%",
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Orders in Progress
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {profile?.in_progress_orders || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Avg. Earnings per Order
                </span>
                <span className="text-sm font-semibold text-green-600">
                  ₹
                  {profile?.completed_orders > 0
                    ? Math.round(
                        profile?.earnings_balance / profile?.completed_orders
                      )
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h3>
                {editMode && (
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {updateLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Full Name</div>
                      <div className="text-lg font-medium text-gray-900">
                        {profile?.name}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Email Address</div>
                      <div className="text-lg font-medium text-gray-900">
                        {profile?.email}
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Phone Number</div>
                      <div className="text-lg font-medium text-gray-900">
                        {profile?.phone}
                      </div>
                    </div>
                  </div>

                  {/* Employee ID */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Employee ID</div>
                      <div className="text-lg font-medium text-gray-900">
                        EMP-{profile?.employee_id}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Earnings & Activity Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Earnings & Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-3">
                    Financial Overview
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Current Balance:</span>
                      <span className="font-medium text-green-900">
                        ₹{profile?.earnings_balance || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Completed Orders:</span>
                      <span className="font-medium text-green-900">
                        {profile?.completed_orders || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Avg. per Order:</span>
                      <span className="font-medium text-green-900">
                        ₹
                        {profile?.completed_orders > 0
                          ? Math.round(
                              profile?.earnings_balance /
                                profile?.completed_orders
                            )
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-3">
                    Order Statistics
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Total Handled:</span>
                      <span className="font-medium text-blue-900">
                        {profile?.total_orders_handled || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">In Progress:</span>
                      <span className="font-medium text-blue-900">
                        {profile?.in_progress_orders || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Success Rate:</span>
                      <span className="font-medium text-blue-900">
                        {profile?.total_orders_handled > 0
                          ? `${Math.round(
                              (profile?.completed_orders /
                                profile?.total_orders_handled) *
                                100
                            )}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips for Better Performance */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  Tips for Better Performance
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>
                    • Accept orders promptly to improve customer satisfaction
                  </li>
                  <li>
                    • Complete orders quickly to handle more orders per day
                  </li>
                  <li>• Maintain high completion rates for better earnings</li>
                  <li>
                    • Keep your profile updated with accurate contact
                    information
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
