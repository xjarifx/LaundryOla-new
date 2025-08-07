import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { customerApi, employeeApi } from "../utils/api";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Breadcrumbs from "../components/Breadcrumbs";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

const Profile = () => {
  const { user, isCustomer, isEmployee } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "", // Only for customers
  });
  const [formErrors, setFormErrors] = useState({});

  const breadcrumbs = [
    {
      label: "Dashboard",
      href: isCustomer() ? "/dashboard" : "/employee-dashboard",
    },
    { label: "Profile" },
  ];

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = isCustomer()
        ? await customerApi.getProfile()
        : await employeeApi.getProfile();

      if (response.success) {
        setProfile(response.data);
        setEditForm({
          name: response.data.name || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          address: response.data.address || "",
        });
      } else {
        setError(response.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!editForm.name.trim()) {
      errors.name = "Name is required";
    } else if (editForm.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!editForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(editForm.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!editForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (isCustomer() && !editForm.address.trim()) {
      errors.address = "Address is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the errors below");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        email: editForm.email.trim().toLowerCase(),
      };

      if (isCustomer()) {
        updateData.address = editForm.address.trim();
      }

      const response = isCustomer()
        ? await customerApi.updateProfile(updateData)
        : await employeeApi.updateProfile(updateData);

      if (response.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        await fetchProfile();
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
    setError("");
    if (profile) {
      setEditForm({
        name: profile.name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        address: profile.address || "",
      });
    }
  };

  const formatFieldName = (key) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatFieldValue = (key, value) => {
    if (key.includes("date") && value) {
      return new Date(value).toLocaleDateString();
    }
    if (key.includes("balance") || (key.includes("spent") && value !== null)) {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    return value?.toString() || "N/A";
  };

  if (loading) return <Loader />;

  const displayFields = profile
    ? Object.entries(profile).filter(([key, value]) => {
        // Skip certain fields that we don't want to display
        const skipFields = ["customer_id", "employee_id", "password"];
        return !skipFields.includes(key);
      })
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile 👤</h1>
          <p className="text-gray-600 mt-2">
            View and manage your account information
          </p>
        </div>

        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card title={isEditing ? "Edit Profile" : "Profile Information"}>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Full Name"
                name="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Enter your full name"
                required
                error={formErrors.name}
                disabled={saving}
              />

              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                required
                error={formErrors.phone}
                disabled={saving}
              />

              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Enter your email address"
                required
                error={formErrors.email}
                disabled={saving}
              />

              {isCustomer() && (
                <FormInput
                  label="Address"
                  name="address"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  placeholder="Enter your full address"
                  required
                  error={formErrors.address}
                  disabled={saving}
                />
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  disabled={saving}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {profile?.name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profile?.name}
                  </h3>
                  <p className="text-gray-600 capitalize">
                    {user?.role?.toLowerCase() || "User"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.email}
                  </dd>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.phone}
                  </dd>
                </div>

                {profile?.address && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile?.address}
                    </dd>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Account Statistics */}
        {!isEditing && profile && (
          <Card title="Account Statistics">
            <div className="grid grid-cols-1 gap-4">
              {isCustomer() && (
                <>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
                    </div>
                    <div className="text-green-800 text-sm">Wallet Balance</div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.total_orders || 0}
                    </div>
                    <div className="text-blue-800 text-sm">Total Orders</div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${parseFloat(profile.lifetime_spent || 0).toFixed(2)}
                    </div>
                    <div className="text-purple-800 text-sm">
                      Lifetime Spent
                    </div>
                  </div>
                </>
              )}

              {isEmployee() && (
                <>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${parseFloat(profile.earnings_balance || 0).toFixed(2)}
                    </div>
                    <div className="text-green-800 text-sm">
                      Earnings Balance
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.total_orders_handled || 0}
                    </div>
                    <div className="text-blue-800 text-sm">Orders Handled</div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {profile.completed_orders || 0}
                    </div>
                    <div className="text-purple-800 text-sm">
                      Completed Orders
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Additional Profile Details */}
      {!isEditing && profile && (
        <div className="mt-8">
          <Card title="Detailed Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayFields.map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 pb-4">
                  <dt className="text-sm font-medium text-gray-500">
                    {formatFieldName(key)}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatFieldValue(key, value)}
                  </dd>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
