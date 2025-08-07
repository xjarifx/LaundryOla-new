import React, { useEffect, useState } from "react";
import { serviceApi } from "../utils/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import Breadcrumbs from "../components/Breadcrumbs";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({ service_name: "", price: "" });
  const [editForm, setEditForm] = useState({ service_name: "", price: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const breadcrumbs = [
    { label: "Dashboard", href: "/employee-dashboard" },
    { label: "Services" },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceApi.getServices();
      if (response.success) {
        setServices(response.data || []);
      } else {
        setError(response.message || "Failed to fetch services");
      }
    } catch (err) {
      console.error("Fetch services error:", err);
      setError(err.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const validateServiceForm = (form) => {
    const errors = {};

    if (!form.service_name.trim()) {
      errors.service_name = "Service name is required";
    } else if (form.service_name.trim().length < 2) {
      errors.service_name = "Service name must be at least 2 characters";
    }

    const price = parseFloat(form.price);
    if (!form.price.trim()) {
      errors.price = "Price is required";
    } else if (isNaN(price) || price <= 0) {
      errors.price = "Price must be a positive number";
    } else if (price > 10000) {
      errors.price = "Price cannot exceed $10,000";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateService = async (e) => {
    e.preventDefault();

    if (!validateServiceForm(createForm)) {
      setError("Please fix the errors below");
      return;
    }

    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await serviceApi.createService({
        service_name: createForm.service_name.trim(),
        price: parseFloat(createForm.price),
      });

      if (response.success) {
        setSuccess("Service created successfully!");
        setShowCreateModal(false);
        setCreateForm({ service_name: "", price: "" });
        setFormErrors({});
        await fetchServices();
      } else {
        setError(response.message || "Failed to create service");
      }
    } catch (err) {
      console.error("Create service error:", err);
      setError(err.response?.data?.message || "Failed to create service");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();

    if (!validateServiceForm(editForm)) {
      setError("Please fix the errors below");
      return;
    }

    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await serviceApi.updateService(
        selectedService.service_id,
        {
          service_name: editForm.service_name.trim(),
          price: parseFloat(editForm.price),
        }
      );

      if (response.success) {
        setSuccess("Service updated successfully!");
        setShowEditModal(false);
        setSelectedService(null);
        setEditForm({ service_name: "", price: "" });
        setFormErrors({});
        await fetchServices();
      } else {
        setError(response.message || "Failed to update service");
      }
    } catch (err) {
      console.error("Update service error:", err);
      setError(err.response?.data?.message || "Failed to update service");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await serviceApi.deleteService(
        selectedService.service_id
      );

      if (response.success) {
        setSuccess("Service deleted successfully!");
        setShowDeleteModal(false);
        setSelectedService(null);
        await fetchServices();
      } else {
        setError(response.message || "Failed to delete service");
      }
    } catch (err) {
      console.error("Delete service error:", err);
      setError(err.response?.data?.message || "Failed to delete service");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setEditForm({
      service_name: service.service_name,
      price: service.price_per_item.toString(),
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const columns = [
    {
      key: "service_id",
      label: "Service ID",
      render: (value) => `#${value}`,
    },
    {
      key: "service_name",
      label: "Service Name",
    },
    {
      key: "price_per_item",
      label: "Price per Item",
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
  ];

  const serviceActions = (service) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => openEditModal(service)}
      >
        Edit
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => openDeleteModal(service)}
      >
        Delete
      </Button>
    </div>
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services 🧺</h1>
          <p className="text-gray-600 mt-2">
            Manage laundry services and pricing
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setCreateForm({ service_name: "", price: "" });
            setFormErrors({});
            setShowCreateModal(true);
          }}
        >
          Add New Service
        </Button>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <Card>
        <Table
          columns={columns}
          data={services}
          actions={serviceActions}
          searchable={true}
          sortable={true}
          emptyMessage="No services available. Create your first service to get started!"
        />
      </Card>

      {/* Create Service Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateForm({ service_name: "", price: "" });
          setFormErrors({});
        }}
        title="Create New Service"
        size="md"
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          <FormInput
            label="Service Name"
            name="service_name"
            value={createForm.service_name}
            onChange={(e) =>
              setCreateForm({ ...createForm, service_name: e.target.value })
            }
            placeholder="e.g., Wash & Fold"
            required
            error={formErrors.service_name}
            disabled={formLoading}
          />

          <FormInput
            label="Price per Item ($)"
            name="price"
            type="number"
            min="0.01"
            max="10000"
            step="0.01"
            value={createForm.price}
            onChange={(e) =>
              setCreateForm({ ...createForm, price: e.target.value })
            }
            placeholder="0.00"
            required
            error={formErrors.price}
            disabled={formLoading}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                setCreateForm({ service_name: "", price: "" });
                setFormErrors({});
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
              disabled={formLoading}
            >
              Create Service
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedService(null);
          setEditForm({ service_name: "", price: "" });
          setFormErrors({});
        }}
        title="Edit Service"
        size="md"
      >
        <form onSubmit={handleEditService} className="space-y-4">
          <FormInput
            label="Service Name"
            name="service_name"
            value={editForm.service_name}
            onChange={(e) =>
              setEditForm({ ...editForm, service_name: e.target.value })
            }
            placeholder="e.g., Wash & Fold"
            required
            error={formErrors.service_name}
            disabled={formLoading}
          />

          <FormInput
            label="Price per Item ($)"
            name="price"
            type="number"
            min="0.01"
            max="10000"
            step="0.01"
            value={editForm.price}
            onChange={(e) =>
              setEditForm({ ...editForm, price: e.target.value })
            }
            placeholder="0.00"
            required
            error={formErrors.price}
            disabled={formLoading}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setSelectedService(null);
                setEditForm({ service_name: "", price: "" });
                setFormErrors({});
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
              disabled={formLoading}
            >
              Update Service
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedService(null);
        }}
        title="Delete Service"
        size="md"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete this service? This action cannot be
            undone.
          </p>

          {selectedService && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm">
                <div>
                  <strong>Service Name:</strong> {selectedService.service_name}
                </div>
                <div>
                  <strong>Price:</strong> $
                  {parseFloat(selectedService.price_per_item).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedService(null);
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteService}
              loading={formLoading}
              disabled={formLoading}
            >
              Delete Service
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Services;
