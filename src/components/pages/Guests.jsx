import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import guestService from "@/services/api/guestService";

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [deletingGuest, setDeletingGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    name_c: "",
    email_c: "",
    phone_c: "",
    nationality_c: "",
    check_in_c: "",
    check_out_c: "",
    room_id_c: "",
    status_c: "reserved"
  });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      setLoading(true);
      const data = await guestService.getAll();
      setGuests(data);
      setError(null);
    } catch (err) {
      setError("Failed to load guests");
      console.error("Error loading guests:", err);
      toast.error("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = () => {
    setEditingGuest(null);
    setFormData({
      name_c: "",
      email_c: "",
      phone_c: "",
      nationality_c: "",
      check_in_c: "",
      check_out_c: "",
      room_id_c: "",
      status_c: "reserved"
    });
    setShowModal(true);
  };

  const handleEditGuest = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name_c: guest.name_c || "",
      email_c: guest.email_c || "",
      phone_c: guest.phone_c || "",
      nationality_c: guest.nationality_c || "",
      check_in_c: guest.check_in_c || "",
      check_out_c: guest.check_out_c || "",
      room_id_c: guest.room_id_c?.Id || guest.room_id_c || "",
      status_c: guest.status_c || "reserved"
    });
    setShowModal(true);
  };

  const handleSaveGuest = async (e) => {
    e.preventDefault();
    
    if (!formData.name_c || !formData.email_c) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setLoading(true);
      
      const guestData = {
        ...formData,
        room_id_c: formData.room_id_c ? parseInt(formData.room_id_c) : null
      };

      if (editingGuest) {
        await guestService.update(editingGuest.Id, guestData);
        toast.success("Guest updated successfully");
      } else {
        await guestService.create(guestData);
        toast.success("Guest created successfully");
      }

      setShowModal(false);
      await loadGuests();
    } catch (err) {
      console.error("Error saving guest:", err);
      toast.error(err.message || "Failed to save guest");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = (guest) => {
    setDeletingGuest(guest);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingGuest) return;

    try {
      setLoading(true);
      await guestService.delete(deletingGuest.Id);
      toast.success("Guest deleted successfully");
      setShowDeleteModal(false);
      setDeletingGuest(null);
      await loadGuests();
    } catch (err) {
      console.error("Error deleting guest:", err);
      toast.error("Failed to delete guest");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (guest) => {
    try {
      await guestService.checkIn(guest.Id);
      toast.success(`${guest.name_c} checked in successfully`);
      await loadGuests();
    } catch (err) {
      console.error("Error checking in guest:", err);
      toast.error("Failed to check in guest");
    }
  };

  const handleCheckOut = async (guest) => {
    try {
      await guestService.checkOut(guest.Id);
      toast.success(`${guest.name_c} checked out successfully`);
      await loadGuests();
    } catch (err) {
      console.error("Error checking out guest:", err);
      toast.error("Failed to check out guest");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "checked-in":
        return "success";
      case "checked-out":
        return "secondary";
      case "reserved":
        return "warning";
      default:
        return "default";
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || guest.status_c === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading && guests.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading guests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="text-center py-8">
              <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Guests</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadGuests}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Management</h1>
          <p className="text-gray-600">Manage guest profiles, check-ins, and services</p>
        </div>
        <Button onClick={handleAddGuest} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={20} />
          Add New Guest
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="reserved">Reserved</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
        </select>
      </div>

      {/* Guest List */}
      {filteredGuests.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <ApperIcon name="Users" size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {guests.length === 0 ? "No Guests Yet" : "No Matching Guests"}
            </h3>
            <p className="text-gray-600 mb-6">
              {guests.length === 0 
                ? "Start by adding your first guest"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {guests.length === 0 && (
              <Button onClick={handleAddGuest}>Add Your First Guest</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <Card key={guest.Id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{guest.name_c || guest.Name}</h3>
                      <Badge variant={getStatusBadgeVariant(guest.status_c)}>
                        {guest.status_c || "unknown"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Mail" size={16} />
                    <span className="truncate">{guest.email_c || "No email"}</span>
                  </div>
                  {guest.phone_c && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="Phone" size={16} />
                      <span>{guest.phone_c}</span>
                    </div>
                  )}
                  {guest.nationality_c && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="Globe" size={16} />
                      <span>{guest.nationality_c}</span>
                    </div>
                  )}
                  {guest.room_id_c && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="Home" size={16} />
                      <span>Room: {guest.room_id_c?.Name || guest.room_id_c}</span>
                    </div>
                  )}
                  {guest.check_in_c && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="Calendar" size={16} />
                      <span>Check-in: {guest.check_in_c}</span>
                    </div>
                  )}
                  {guest.check_out_c && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="Calendar" size={16} />
                      <span>Check-out: {guest.check_out_c}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  {guest.status_c === "reserved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCheckIn(guest)}
                      className="flex items-center gap-1 flex-1"
                    >
                      <ApperIcon name="LogIn" size={16} />
                      Check In
                    </Button>
                  )}
                  {guest.status_c === "checked-in" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCheckOut(guest)}
                      className="flex items-center gap-1 flex-1"
                    >
                      <ApperIcon name="LogOut" size={16} />
                      Check Out
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditGuest(guest)}
                    className="flex items-center gap-1"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteGuest(guest)}
                    className="flex items-center gap-1 text-error hover:text-error"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingGuest ? "Edit Guest" : "Add New Guest"}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGuest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name_c"
                      value={formData.name_c}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email_c"
                      value={formData.email_c}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone_c"
                      value={formData.phone_c}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality_c"
                      value={formData.nationality_c}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      name="check_in_c"
                      value={formData.check_in_c}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      name="check_out_c"
                      value={formData.check_out_c}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room ID
                    </label>
                    <input
                      type="number"
                      name="room_id_c"
                      value={formData.room_id_c}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status_c"
                      value={formData.status_c}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="reserved">Reserved</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Guest"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete guest{" "}
                <strong>{deletingGuest?.name_c || deletingGuest?.Name}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingGuest(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  disabled={loading}
                  className="bg-error hover:bg-red-600"
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Guests;