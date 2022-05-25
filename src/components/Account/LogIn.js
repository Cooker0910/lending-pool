import React, { useState } from 'react'
import axios from 'axios';
import {Form, Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

const Login = (props) => {

  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser({
      ...user,
      [name]: value
    })
  }

  const login = () => {
    props.showSpinner()
    axios.post("https://rocfi.info/api/users/login", user)
    .then((res) => {
      console.log(res)
      props.userInfo(res)
      props.successLog();
      props.hideModal();
      props.hideSpinner();
    })
    .catch(err => {
      console.log(err)
      props.hideSpinner();
      if (err.response.data) props.errors(err.response.data);
      else console.log("error", err)
    });
  }

  return (
    <Modal
      show={props.showModal}
      onHide={props.hideModal}
    >
      <Modal.Header>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className='deposit'>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name='email' value={user.email} onChange={handleChange} placeholder="Input your user name" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='password' value={user.password} onChange={handleChange} placeholder="password" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={login}>Log In</Button>
        <Button bsstyle='danger' onClick={props.signUpModal}>Sign Up</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Login;

