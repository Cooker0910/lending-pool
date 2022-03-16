import React, { useState } from "react";
import axios from "axios";
import {Form, Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Web3 from 'web3';

const SignUp = (props) => {

  const web3 = new Web3('http://localhost:8545');

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    publicKey: "",
    privateKey: ""
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser({
      ...user,
      [name]: value
    })
  }

  const register = () => {
    const {name, email, password} = user;
    if(name && email && password) {
      let account = web3.eth.accounts.create();
      axios.post("http://localhost:5000/api/users/register", {
        ...user,
        ['publicKey']: account.address,
        ['privateKey']: account.privateKey
      })
      .then(res => {
        props.getPublicKey(JSON.parse(res.config.data)['publicKey']);
        props.logInModal()
      }
      )
    } else {
      alert("invalide input");
    }
  }

  return (
    <Modal
      show={props.showModal}
      onHide={props.hideModal}
    >
      <Modal.Header>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className='deposit'>
          <Form.Group>
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" name='name' value={user.name} onChange={handleChange} placeholder="Input your user name" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name='email' value={user.email} onChange={handleChange} placeholder="Input your user name" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='password' value={user.password} onChange={handleChange} placeholder="password" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Repassword</Form.Label>
            <Form.Control type="password" placeholder="re-password" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button bsstyle='danger' onClick={props.logInModal}>Log In</Button>
        <Button onClick={register}>Sign Up</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SignUp;