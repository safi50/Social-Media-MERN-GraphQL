import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      console.log(result);
      navigate('/');  // Redirect to home
    },
    onError(err) {
      console.log(err.graphQLErrors[0]);
      setErrors({ error: "Some Error Occured! Try Again" });
    },
    variables: formData,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      await loginUser();
      setFormData({
        email: '',
        password: '',
      });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const validate = (data) => {
    const newErrors = {};
    if (!data.email) newErrors.email = 'Email cannot be blank';
    if (!data.password) newErrors.password = 'Password cannot be blank';
    return newErrors;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Login to Y</h1>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit} style={{ width: '40%' }}>
          <div className="form-group mt-4">
            <label>Email</label>
            <input
              type="email"
              className={`form-control ${errors.email && 'is-invalid'}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ padding: '15px' }}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>
          <div className="form-group mt-4">
            <label>Password</label>
            <input
              type="password"
              className={`form-control ${errors.password && 'is-invalid'}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ padding: '15px' }}
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4"
            style={{ padding: '10px 40px', fontSize: '20px' }}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Login'}
          </button>
          {errors.error && <small className="text-danger">{errors.error}</small>}
        </form>
      </div>
    </div>
  );
};

const LOGIN_USER = gql`
mutation login(
  $email: String!
  $password: String!
) {
  login(
      email: $email
      password: $password
  ) {
    id
    email
    username
    createdAt
    token
  }
}
`;

export default LoginPage;
