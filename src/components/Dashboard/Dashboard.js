import React, {useEffect, useState} from 'react';
import {HiPlusSm, HiMinusSm} from 'react-icons/hi'
import { Navbar, Nav, Container, Form, Button, InputGroup } from "react-bootstrap";
import {NotificationContainer,  NotificationManager} from "react-notifications";
import './dashboard.css';
import "react-notifications/lib/notifications.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import SignUp from '../Account/SignUp';
import Login from '../Account/LogIn';
import icon from '../../assets/usdc-coin.png';

const Dashboard = () => {
  
  useEffect(() => {
    let expire = localStorage.getItem('expire')
    if(expire * 1000 > Date.now()) {
      setLoginStatus(true);
      setPublicKey(localStorage.getItem('publicKey'))
    }
    if(localStorage.getItem('user_id') != null) {
      getUserData(localStorage.getItem('user_id'))
    }
  }, [])

  const getUserData = (id) => {
    axios.get('http://localhost:5000/api/users/' + id)
      .then(res => {
        if(res['data']['userBalance'] === 0) {
          return
        } else {
          console.log( res)
          setCurrentBalance(res['data']['totalBalance'])
        }
      })
  }

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);
  const [depoistAmount, setDepositAmount] = useState(0)
  const [currentBalance, setCurrentBalance] = useState(0)
  const [depositType, setDepositType] = useState(false)
  const [data, setData] = useState({
    to: "",
    from: ""
  })

  const showDepositModal = () => { setIsDepositOpen(true); };
  const showWithdrawModal = () => { setIsWithdrawOpen(true); }
  const hideDepositModal = () => { setIsDepositOpen(false); };
  const hideWithdrawModal = () => { setIsWithdrawOpen(false) };
  const hideSignUpModal = () => { setShowSignUp(false) };
  const hideLogInModal = () => { setShowLogIn(false) };
  const showSignUpModal = () => { setShowLogIn(false); setShowSignUp(true); }
  const successedLogin = () => { setLoginStatus(true) }
  const showLogInModal = () => { setShowSignUp(false); setShowLogIn(true); }


  const handleChange = (e) => {
    const { name, value } = e.target;
    if(value === 'crypto') {
      setDepositType(false)
    } else {
      setDepositType(true)
    }
    if(name === 'to' && data.from){
      setData((prevState) => ({
        ...prevState,
        [name]: value,
        from: ''
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const onDeposit = async() => {
    if(!loginStatus) {
      alert('Please log in first')
      return;
    } else {
      if(!depositType) {
        alert('ok')
        return;
      }
      else {
        console.log(1)

      }
    }
  }

  const getUserInfo = (id, token, userPublicKey, userBalance, user_depositAmount, user_balance) => {
    console.log(id, userPublicKey,'=======')
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    localStorage.setItem('user_id', id);
    localStorage.setItem('publicKey', userPublicKey)
    localStorage.setItem('expire', JSON.parse(jsonPayload)['exp'])
    setPublicKey(userPublicKey);
    setDepositAmount(user_depositAmount)
    setCurrentBalance(user_balance)
  }

  const signupErrors = (errors) => {
    Object.values(errors).map(function(err) {
      return NotificationManager.warning(
        err,
        "",
        3000
      );
    })
  }

  const loginErrors =(errors) => {
    Object.values(errors).map(function(err) {
      return NotificationManager.warning(
        err,
        "",
        3000
      );
    })
  }

  const logout = () => {
    localStorage.clear();
    setLoginStatus(false)
  }

  const changePublicKey = () => {
    console.log(1)
  }

  return (
    <>
      <div>
        <Navbar>
          <Container fluid>
            <Navbar.Brand href="#">
              {/* <img
                alt="logo"
              /> */}
              ROC Finance
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                styles={{ maxHeight: '100px' }}
                navbarScroll
              >
              </Nav>
              { !loginStatus ?
                <Form className="d-flex">
                  <main>
                    <a onClick={() => setShowLogIn(true)}>Log In</a>
                    <a onClick={() => setShowSignUp(true)}>Sign Up</a>
                  </main>
                </Form>
              : <Form className="d-flex">
                  <main>
                    <a onClick={logout}>Log Out</a>
                  </main>
                </Form>
              }
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <div className='d-flex flex-column-fluid content-Center'>
        <div className="container-fluid">
          <div className="row balance">
            <div className="col-lg-6 col-md-6">
              <p>Return</p>
              <p>31.68%</p>
            </div>
            <div className="col-lg-6 col-md-6">
              <p>Balance</p>
              <p>${currentBalance}</p>
              <div className="dropdown"><HiPlusSm /><span className='button' onClick={showDepositModal}>Deposit </span></div>
              <div className="dropdown"><HiMinusSm /><span className='button' onClick={showWithdrawModal}>Withdraw</span></div>
            </div>
          </div>
          <div className="row assets col-xl-12">
            <p>Assets you own</p>
            <div className="table-container" role="table" aria-label="Destinations">
              <div className="flex-table header" role="rowgroup">
                <div className="flex-row first" role="columnheader">Asset/Currency</div>
                <div className="flex-row" role="columnheader">Price</div>
                <div className="flex-row" role="columnheader">APY</div>
                <div className="flex-row" role="columnheader">Balance</div>
                <div className="flex-row" role="columnheader">Total Interest earned</div>
              </div>
              <div className="flex-table row" role="rowgroup">
                <div className="flex-row first" role="cell">
                  <img src={icon} alt="usdc icon" /> stablecoin</div>
                <div className="flex-row" role="cell">$1</div>
                <div className="flex-row" role="cell">6%</div>
                <div className="flex-row" role="cell">{currentBalance} USDC</div>
                <div className="flex-row" role="cell">{currentBalance-depoistAmount} USDC</div>
              </div>
            </div>
          </div>
          <div className="row assets col-xl-12">
            <p>Risk strategies</p>
            <div className="table-container" role="table" aria-label="Destinations">
              <div className="flex-table header" role="rowgroup">
                <div className="flex-row-1 first" role="columnheader">Asset/Currency</div>
                <div className="flex-row-1" role="columnheader">APY</div>
                <div className="flex-row-1" role="columnheader">Balance</div>
              </div>
              <div className="flex-table row" role="rowgroup">
                <div className="flex-row-1 first" role="cell">
                  <img src={icon} alt="usdc icon" /> Stable Strategy</div>
                <div className="flex-row-1" role="cell">8~12%</div>
                <div className="flex-row-1" role="cell">0.04484529 USDC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={isDepositOpen}
        onHide={hideDepositModal}
      >
        <Modal.Header>
          <Modal.Title>Deposit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='deposit'>
            <Form.Group>
              <Form.Label>Select Cryptocurrency</Form.Label>
              <Form.Control
                  required
                  name="to"
                  as="select"
                  placeholder="to"
                  value={data.to} // add this prop
                  onChange={handleChange}
                >
                  <option value="crypto">Deposit from Crypto address</option>
                  <option value="ramp">Deposit from Ramp Network</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control type="text" placeholder="ROC wallet address" value={publicKey} onChange={changePublicKey} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsstyle='danger' onClick={hideDepositModal}>Cancel</Button>
          <Button onClick={onDeposit}>Deposit</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isWithdrawOpen}
        onHide={hideWithdrawModal}
      >
        <Modal.Header>
          <Modal.Title>Withdraw</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='deposit'>
            <Form.Group>
              <Form.Label>Current Cryptocurrency</Form.Label><br></br>
              <Form.Label><img src={icon} alt='icon'/> USDC</Form.Label>
            </Form.Group>
            <Form.Group>
              <Form.Label>Current Balance</Form.Label><br></br>
              <Form.Label style={{fontSize: "25px"}}>3948 USDC</Form.Label>
            </Form.Group>
            <InputGroup>
              <Form.Control aria-label="Dollar amount (with dot and two decimal places)" />
              <InputGroup.Text>USDC</InputGroup.Text>
              <Button variant="outline-secondary">MAX</Button>
            </InputGroup>
            <Form.Group>
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control type="text" value={publicKey} placeholder="ROC wallet address" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsstyle='danger' onClick={hideWithdrawModal}>Cancel</Button>
          <Button>Withdraw</Button>
        </Modal.Footer>
      </Modal>
      <SignUp 
        showModal={showSignUp}
        hideModal={hideSignUpModal}
        logInModal={showLogInModal}
        errors={signupErrors}
      />
      <Login 
        showModal={showLogIn}
        hideModal={hideLogInModal}
        signUpModal={showSignUpModal}
        successLog={successedLogin}
        userInfo={getUserInfo}
        errors={loginErrors}
      />
      <NotificationContainer />
    </>
  )
}

export default Dashboard;