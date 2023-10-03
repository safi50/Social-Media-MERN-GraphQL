import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [dbErrors, setDbErrors] = useState('');
  const navigate = useNavigate();

  const [addUser , {loading}] = useMutation(REGISTER_USER , {
    update(_ , result){
      console.log(result)
    },  onError(err) {
      if (err.graphQLErrors[0].extensions.errors['username']) {
        console.log(err.graphQLErrors[0].extensions.errors['username'].message);
        setDbErrors(err.graphQLErrors[0].extensions.errors['username'].message);
        
      } else if (err.graphQLErrors[0].extensions.errors['email']) {
        console.log(err.graphQLErrors[0].extensions.errors['email'].message);
        setDbErrors(err.graphQLErrors[0].extensions.errors['email'].message);
      } else if (err.graphQLErrors[0].extensions.errors['password']) {
        console.log(err.graphQLErrors[0].extensions.errors['password'].message);
        setDbErrors(err.graphQLErrors[0].extensions.errors['password'].message);
      }
    
    },
    variables: formData
  })

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
      console.log("Form submitted:", formData);
       await addUser()
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      //redirect to home
      navigate("/");  // Redirect to home


    } else {
      setErrors(newErrors);
    }
  };

  const validate = (data) => {
    const newErrors = {};
    if (!data.username) newErrors.username = "Username cannot be blank";
    if (!data.email) newErrors.email = "Email cannot be blank";
    if (!data.password) newErrors.password = "Password cannot be blank";
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords must match";
    return newErrors;
  };

  // Calling Mutation




  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Register for Y</h1>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit} style={{ width: '40%' }}>
          <div className="form-group ">
            <label>Username</label>
            <input
              type="text"
              className={`form-control ${errors.username && "is-invalid"}`}
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{ padding: '15px' }}
            />
            {errors.username && <small className="text-danger">{errors.username}</small>}
          </div>
          <div className="form-group mt-4">
            <label>Email</label>
            <input
              type="email"
              className={`form-control ${errors.email && "is-invalid"}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ padding: '15px'  }}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>
          <div className="form-group mt-4">
            <label>Password</label>
            <input
              type="password"
              className={`form-control ${errors.password && "is-invalid"}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ padding: '15px' }}
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword && "is-invalid"}`}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ padding: '15px'  }}
            />
            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-4"
          style={{ padding: '10px 40px'  , fontSize: '20px' }}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Register'}

          </button>
          {dbErrors && <p className="text-danger">{dbErrors}</p>}
        </form>
      </div>
    </div>
  );
};


const REGISTER_USER = gql `
mutation register(
  $username: String!
  $email: String!
  $password: String!
  $confirmPassword: String!
) {
  register(
    registerInput: {
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    }
  ) {
    id
    email
    username
    createdAt
    token
  }
}
`


export default RegisterPage;
