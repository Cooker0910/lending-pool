import React, {useState} from 'react';
import './dashboard.css';
import {HiPlusSm, HiMinusSm} from 'react-icons/hi'
import { Navbar, Nav, Container, Form, Button, InputGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SignUp from '../Account/SignUp';
import Login from '../Account/LogIn';
import icon from '../../assets/usdc-coin.png';

const Dashboard = () => {

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositWallet, setDepositWallet] = useState('')
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [publicKey, setPublicKey] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);
  const [selectWallet, setSelectWallet] = useState('')
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
  const showSignUpModal = () => { 
    setShowLogIn(false);
    setShowSignUp(true);
  }
  const showLogInModal = () => { 
    setShowSignUp(false);
    setShowLogIn(true);
  }

  const successedLogin = () => {
    setShowNavbar(false)
    setLoginStatus(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(value === 'crypto') {
      console.log('selected cryto')
    } else {
      console.log('selected ramp')
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

  const onDeposit = () => {
    if(!loginStatus) {
      alert('Please log in first')
      return;
    } else {
      console.log('OK, wait')
    }
  }

  const getPublicKey = (e) => { setPublicKey(e) }

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
              { showNavbar ?
                <Form className="d-flex">
                  <main>
                    <a  onClick={() => setShowLogIn(true)}>Log In</a>
                    <a onClick={() => setShowSignUp(true)}>Sign Up</a>
                  </main>
                </Form>
              : <></>
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
              <p>$2,212.14</p>
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
                <div className="flex-row" role="cell">0.04484529 USDC</div>
                <div className="flex-row" role="cell">0.00066222 USDC</div>
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
                  {/* <option hidden value="">
                    Select...
                  </option> */}
                  <option value="crypto">Deposit from Crypto address</option>
                  <option value="ramp">Deposit from Ramp Network</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control type="text" placeholder="ROC wallet address" value={publicKey} onChange={(e) => setDepositWallet(e.target.value)} />
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
              <Form.Control type="text" placeholder="ROC wallet address" />
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
        getPublicKey={getPublicKey}
      />
      <Login 
        showModal={showLogIn}
        hideModal={hideLogInModal}
        signUpModal={showSignUpModal}
        successLog={successedLogin}
      />
    </>
  )
}

export default Dashboard;