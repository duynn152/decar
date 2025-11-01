import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserManagementPage = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters')
      .notRequired(),
    role: Yup.string().oneOf(['member', 'admin', 'guest']).required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: 'member',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const dataToSend = values.password ? values : { ...values, password: undefined };

        if (currentUser) {
          await axios.put(`http://localhost:3001/users/${currentUser.id}`, { ...dataToSend, id: currentUser.id });
        } else {
          await axios.post('http://localhost:3001/users', dataToSend);
        }

        handleCloseUserModal();
        fetchUsers();
      } catch (error) {
        console.error('Error submitting user form:', error);
        alert('An error occurred while saving the user.');
      }
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data); // Removed filter, now displays all users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCloseUserModal = () => setShowUserModal(false);
  const handleShowUserModal = (userToEdit = null) => {
    setCurrentUser(userToEdit);
    if (userToEdit) {
      formik.setValues({
        username: userToEdit.username,
        email: userToEdit.email,
        password: userToEdit.password, // Set current password for editing
        role: userToEdit.role,
      });
    } else {
      formik.resetForm();
    }
    setShowUserModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3001/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
      }
    }
  };

  return (
    <Container data-bs-theme={theme} className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management - Members</h2>
        <Button variant="primary" onClick={() => handleShowUserModal()}>Add New Member</Button>
      </div>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowUserModal(user)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showUserModal} onHide={handleCloseUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.username && !!formik.errors.username}
                required
              />
              {formik.touched.username && formik.errors.username && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.username}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && !!formik.errors.email}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && !!formik.errors.password}
                placeholder="Leave blank to keep current password"
              />
              {formik.touched.password && formik.errors.password && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.role && !!formik.errors.role}
                required
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </Form.Control>
              {formik.touched.role && formik.errors.role && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.role}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Button variant="secondary" onClick={handleCloseUserModal} className="me-2">Cancel</Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
              {currentUser ? 'Update User' : 'Add User'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserManagementPage;
