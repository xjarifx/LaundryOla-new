import { useState, useEffect } from "react";
import axios from "axios";
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CurrencyRupeeIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    service_name: "",
    price: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/services");
      setServices(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/services", {
        service_name: formData.service_name,
        price: parseFloat(formData.price),
      });

      // Reset form and refresh services
      setFormData({ service_name: "", price: "" });
      setShowAddForm(false);
      fetchServices();
      alert("Service added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add service");
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/services/${editingService.service_id}`, {
        service_name: formData.service_name,
        price: parseFloat(formData.price),
      });

      // Reset form and refresh services
      setFormData({ service_name: "", price: "" });
      setEditingService(null);
      fetchServices();
      alert("Service updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update service");
    }
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${serviceName}"? This action cannot be undone.`
      )
    ) {
      try {
        await axios.delete(`/services/${serviceId}`);
        fetchServices();
        alert("Service deleted successfully!");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete service");
      }
    }
  };

  const startEdit = (service) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name,
      price: service.price_per_item.toString(),
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingService(null);
    setFormData({ service_name: "", price: "" });
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setFormData({ service_name: "", price: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Services Management
            </h1>
            <p className="text-gray-600">Manage laundry services and pricing</p>
          </div>
          {!showAddForm && !editingService && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add New Service</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Service
          </h2>
          <form
            onSubmit={handleAddService}
            className="grid md:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="service_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Name
              </label>
              <input
                id="service_name"
                name="service_name"
                type="text"
                required
                value={formData.service_name}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Wash & Fold, Dry Cleaning"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price per Item (₹)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 50.00"
              />
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Add Service</span>
              </button>
              <button
                type="button"
                onClick={cancelAdd}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Service Form */}
      {editingService && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Edit Service
          </h2>
          <form
            onSubmit={handleUpdateService}
            className="grid md:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="edit_service_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Name
              </label>
              <input
                id="edit_service_name"
                name="service_name"
                type="text"
                required
                value={formData.service_name}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="edit_price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price per Item (₹)
              </label>
              <input
                id="edit_price"
                name="price"
                type="number"
                min="1"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Update Service</span>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Current Services
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total Services: {services.length}
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <WrenchScrewdriverIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No services yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first service to get started
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Your First Service</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {services.map((service) => (
              <div
                key={service.service_id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <WrenchScrewdriverIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.service_name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <CurrencyRupeeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          ₹{service.price_per_item} per item
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{service.price_per_item}
                      </div>
                      <div className="text-sm text-gray-500">per item</div>
                    </div>

                    <button
                      onClick={() => startEdit(service)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit Service"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteService(
                          service.service_id,
                          service.service_name
                        )
                      }
                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Service"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Service Preview */}
                <div className="mt-4 ml-16">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">
                      <strong>Service Details:</strong> Professional{" "}
                      {service.service_name.toLowerCase()} service with quality
                      guarantee
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Management Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Service Management Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Pricing Guidelines</h4>
            <ul className="space-y-1">
              <li>• Research competitor prices</li>
              <li>• Consider quality and time required</li>
              <li>• Factor in material costs</li>
              <li>• Update prices based on market demand</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Service Management</h4>
            <ul className="space-y-1">
              <li>• Keep service names clear and descriptive</li>
              <li>• Regularly review and update services</li>
              <li>• Remove services you can't fulfill</li>
              <li>• Add seasonal or specialty services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;
