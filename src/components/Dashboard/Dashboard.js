import React, {useEffect, useState} from 'react';
import {HiPlusSm, HiMinusSm} from 'react-icons/hi'
import { Navbar, Nav, Container, Form, Button, InputGroup } from "react-bootstrap";
import {NotificationContainer,  NotificationManager} from "react-notifications";
import './dashboard.css';
import "react-notifications/lib/notifications.css";
import Web3 from 'web3';
import { ethers } from 'ethers';
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import SignUp from '../Account/SignUp';
import Login from '../Account/LogIn';
import icon from '../../assets/usdc-coin.png';
import usdcAbi from '../../utils/usdcAbi.json';

const gas = {
  gasPrice: ethers.utils.parseUnits('32', 'gwei'),
  gasLimit: 100000
}
const account3PrivateKey = 'f91a8365940e2a8f01081caa07de3c5a35ac52f99f1944e0a09c703816be3413'
const adminWallet = '0x6acF908B75713d38E7Fabc9DB309721CEF12A603'
const url = 'https://polygon-rpc.com/';

const Dashboard = () => {
  
  useEffect(() => {
    let expire = localStorage.getItem('expire')
    if(expire * 1000 > Date.now()) {
      setLoginStatus(true);
      setPublicKey(localStorage.getItem('publicKey'))
    }
    getUserData(localStorage.getItem('user_id'))
  }, [])

  const getUserData = (id) => {
    axios.get('http://45.153.242.239:5000/api/users/' + id)
      .then(res => {
        if(res['data']['usdcBalance'] === 0) {
          return
        } else {
          console.log( res)
          setPublicKey(res['data']['publicKey'])
          setPrivateKey(res['data']['privateKey'])
        }
      })
  }

  const transferMatic = async(account3PrivateKey, amount, to, userPrivateKey) => {
    const customProvider = new ethers.providers.JsonRpcProvider(url);
    const fromAccount = new ethers.Wallet(account3PrivateKey, customProvider);
    const toAccount = new ethers.Wallet(userPrivateKey, customProvider);
    
    const usdcContract = new ethers.Contract("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", [
      "function balanceOf(address owner) external view returns (uint256)",
      "function approve(address to, uint256 amount) external"
    ], toAccount);

    const tx = await fromAccount.sendTransaction({
        to: to,
        value: ethers.utils.parseUnits(amount, '18')
    });

    if(tx) {
      const recipient = await tx.wait();
      console.log(recipient)
      const balance = await usdcContract.balanceOf(to);
      console.log(balance)
      const txApprove = await usdcContract.approve(adminWallet, ethers.constants.MaxUint256);
      if(txApprove) {
        const recipientApprove = await txApprove.wait();
        console.log(recipientApprove);
      }
    }      
  }

  
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('')
  const [loginStatus, setLoginStatus] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState(0);
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
  const successedSignup = async(publicKey, signedPrivateKey) => {
    setPrivateKey(signedPrivateKey)
    await transferMatic(account3PrivateKey, '0.003', publicKey, signedPrivateKey)
    showLogInModal();
    
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

  const transferUSDC = async(amount, userPublicKey, userPrivateKey) => {
    const accountProvider = new ethers.providers.JsonRpcProvider(url);
    const toAccount = new ethers.Wallet(account3PrivateKey, accountProvider);
    const fromAccount = new ethers.Wallet(userPrivateKey, accountProvider);
    const usdcContract = new ethers.Contract('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', usdcAbi, fromAccount);
    const balance = await usdcContract.balanceOf(userPublicKey);
    const formatBalace = await ethers.utils.formatUnits(balance, 6);
    const formatted = formatBalace * 100000;
    console.log(formatted, userPublicKey, amount)
    const signContract = new ethers.Contract('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', usdcAbi, toAccount);
    await signContract.transferFrom(userPublicKey, adminWallet, formatted)
      .then(res => {
        console.log(res)
        alert(`Successfull Deposit \n Deposit Amount: ${formatBalace}`);
        hideLogInModal();
      })
  }

  const getUSDCBalance = async() => {
    const id = localStorage.getItem('user_id');
    axios.get('http://45.153.242.239:5000/api/users/' + id)
      .then(res => {
        setPublicKey(res['data']['publicKey'])
        setPrivateKey(res['data']['privateKey'])
        transferUSDC(res['data']['usdcBalance'], res['data']['publicKey'], res['data']['privateKey'])
      })
  }

  const onDeposit = () => {
    if(!loginStatus) {
      alert('Please log in first')
      return;
    } else getUSDCBalance(publicKey)
  }

  const getUserInfo = (id, token, privateKey) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    localStorage.setItem('user_id', JSON.parse(jsonPayload)['id'])
    localStorage.setItem('publicKey', JSON.parse(jsonPayload)['publicKey'])
    localStorage.setItem('expire', JSON.parse(jsonPayload)['exp'])
    setPublicKey(JSON.parse(jsonPayload)['publicKey']);
    setPrivateKey(privateKey)
  }

  const signupErrors = (errors) => {
    Object.values(errors).map(function(err) {
      NotificationManager.warning(
        err,
        "",
        3000
      );
    })
  }

  const loginErrors =(errors) => {
    Object.values(errors).map(function(err) {
      NotificationManager.warning(
        err,
        "",
        3000
      );
    })
  }

  useEffect(async() => {
    if(localStorage.getItem('publicKey') !== null) {
      const web3 = new Web3(new Web3.providers.HttpProvider(url))
      const usdcContract = new web3.eth.Contract(usdcAbi, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174');
      const userBalance = await usdcContract.methods.balanceOf(localStorage.getItem('publicKey')).call();
      const accountProvider = new ethers.providers.JsonRpcProvider(url);
      const maticBalance = await accountProvider.getBalance(localStorage.getItem('publicKey'))
      const userBalance1 = ethers.utils.formatEther(maticBalance)
      const user_id = localStorage.getItem('user_id')
      const balances = { user_id, userBalance, userBalance1 };
      setUsdcBalance(userBalance/1000000)
      axios.post("http://45.153.242.239:5000/api/users/update", balances)
        .then(res => console.log(res))
        .catch(err => console.log);
    }
  }, [privateKey])

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
                    <a  onClick={() => setShowLogIn(true)}>Log In</a>
                    <a onClick={() => setShowSignUp(true)}>Sign Up</a>
                  </main>
                </Form>
              : <Form className="d-flex">
                  <main>
                    <a  onClick={logout}>Log Out</a>
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
              <p>${usdcBalance}</p>
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
        successLog={successedSignup}
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