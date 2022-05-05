import React, {useEffect, useState} from 'react';
import {HiPlusSm, HiMinusSm} from 'react-icons/hi'
import { Navbar, Nav, Container, Form, Button, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";
import {NotificationContainer,  NotificationManager} from "react-notifications";
import './dashboard.css';
import "react-notifications/lib/notifications.css";
import axios from "axios";
import copy from "copy-to-clipboard";  
import Modal from "react-bootstrap/Modal";
import SignUp from '../Account/SignUp';
import Login from '../Account/LogIn';
import icon from '../../assets/usdc-coin.png';
import logo from '../../assets/logo.jpg'
import estate from '../../assets/estate.png'
let poolValue = 0 ,allocation = 0, depositAmount = 0, _currenctBalance = 0, _interestEarned = 0, _interest = 0, _withdrawAmount = 0;

const Dashboard = (props) => {
  
  useEffect(() => {
    console.log(11)
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
    axios.get('https://rocfi.info/api/users/' + id)
      .then(res => {
        setEmail(res['data']['data']['email'])
        allocation = res['data']['data']['allocation'] === undefined ? 0 : res['data']['data']['allocation'];
        poolValue = res['data']['totalValue']
        depositAmount = res['data']['data']['depositAmount'] === undefined ? 0 : res['data']['data']['depositAmount']
        _withdrawAmount = res['data']['data']['withdrawnAmount'] === undefined ? 0: res['data']['data']['withdrawnAmount']
        _currenctBalance = (poolValue * allocation).toFixed(2) < (depositAmount - _withdrawAmount) ? (depositAmount - _withdrawAmount) : (poolValue * allocation).toFixed(2)
        _interestEarned = (_currenctBalance - depositAmount + _withdrawAmount).toFixed(2)
        if(_currenctBalance > (depositAmount - _withdrawAmount).toFixed(2)) _interest = depositAmount === 0 ? 0 : ((_currenctBalance - depositAmount) * 100 / depositAmount).toFixed(2);
        else _interest = 0
        setCurrecntBalance(_currenctBalance)
        setInterestEarned(_interestEarned);
        setInterest(_interest)
        setWithdrawAmount(_withdrawAmount)
        setWithdrawStatus(res['data']['data']['withdrawStatus'])
        console.log(poolValue)
      })
  }

  const log = (arg) => console.log(arg);

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [email, setEmail] = useState('')
  const [loginStatus, setLoginStatus] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState(true)
  const [currentBalance, setCurrecntBalance] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0)
  const [interest, setInterest] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [depositType, setDepositType] = useState(false);
  const [withdrawWallet, setWithdrawWallet] = useState('')
  const [amountForWithdraw, setAmountForWithdraw] = useState(0)
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
  const successedLogin = () => { setLoginStatus(true) }
  const showSignUpModal = () => { 
    setShowLogIn(false); 
    setShowSignUp(true); 
    props.spinner(false)
  }
  const showLogInModal = () => { 
    setShowSignUp(false); 
    setShowLogIn(true); 
    props.spinner(false)
  }

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
        hideDepositModal();
        window.open('https://ramp.network/buy/?defaultAsset=USDC', '_blank');
      }
    }
  }

  const Withdraw = () => {
    if(!loginStatus) {
      alert('Please log in first')
      return;
    } else {
      if(amountForWithdraw === 0) {
        alert('Please enter amount to withdraw.')
        return
      } else if(amountForWithdraw > currentBalance) {
        alert('Please enter correct amount') 
        return 
      } else {
        var prefix = withdrawWallet.substring(0, 2)
        if (prefix !== '0x' || withdrawWallet.length !== 42) {
          alert('Please enter correct wallet address')
          return;
        } else {
          if(withdrawStatus) {
            var data = {
              userID: localStorage.getItem('user_id'),
              email: email,
              amount: amountForWithdraw,
              balance: currentBalance,
              wallet: withdrawWallet,
              withdraw: withdrawAmount
            }
            axios.post('https://rocfi.info/api/users/withdraw', data)
              .then(res => {
                alert('Your withdrawal request has been sent.')
                hideWithdrawModal();
                log(res)
              })
          } else {
            alert(`${amountForWithdraw}USDC is pending withdrawing.\n you can submit further withdrawals once processed`);
            return
          }
        }
      }
    }
  }

  const maxWithdraw = () => {
    setAmountForWithdraw(currentBalance)
  }

  const getUserInfo = (userData) => {
    var base64Url = userData['data']['token'].split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    localStorage.setItem('user_id', userData['data']['user']['id']);
    localStorage.setItem('publicKey', userData['data']['user']['publicKey'])
    localStorage.setItem('expire', JSON.parse(jsonPayload)['exp'])
    setEmail(userData['data']['user']['email'])
    setPublicKey(userData['data']['user']['publicKey']);
    poolValue = userData['data']['user']['totalValue']
    allocation = userData['data']['user']['allocation'] === undefined ? 0 : userData['data']['user']['allocation']
    depositAmount = userData['data']['user']['depositAmount'] === undefined ? 0 : userData['data']['user']['depositAmount']
    _withdrawAmount = userData['data']['user']['withdrawnAmount'] === undefined ? 0: userData['data']['user']['withdrawnAmount']
    _currenctBalance = (poolValue * allocation).toFixed(2) < (depositAmount - _withdrawAmount) ? (depositAmount - _withdrawAmount) : (poolValue * allocation).toFixed(2)
    _interestEarned = (_currenctBalance - depositAmount + _withdrawAmount).toFixed(2)
    console.log(depositAmount, _withdrawAmount, _currenctBalance, _interestEarned)
    if(_currenctBalance > (depositAmount - _withdrawAmount).toFixed(2)) _interest = depositAmount === 0 ? 0 : ((_currenctBalance - depositAmount) * 100 / depositAmount).toFixed(2);
    else _interest = 0
    setCurrecntBalance(_currenctBalance)
    setInterestEarned(_interestEarned);
    setInterest(_interest)
    setWithdrawAmount(_withdrawAmount)
    setWithdrawStatus(userData['data']['user']['withdrawStatus'])
  } 

  const showSpinner = () => { props.spinner(true) }
  const hideSpinner = () => { props.spinner(false) }

  const NotificateErrors = (errors) => {
    Object.values(errors).map(function(err) {
      return NotificationManager.warning(
        err,
        "",
        3000
      );
    })
    props.spinner(false)
  }

  const logout = () => {
    localStorage.clear();
    setLoginStatus(false)
  }

  const copyPublickKey = () => {
    copy(localStorage.getItem('publicKey'))
    return NotificationManager.warning(
      'Copied',
      "",
      3000
    );
  }

  const changePublicKey = (e) => {
    setWithdrawWallet(e.target.value)
  }

  const [value,setValue]=useState('');
  const handleSelect=(e)=>{
    console.log(e);
    setValue(e)
  }

  return (
    <>
      <div className='left'>
        <Container>
          <Navbar.Brand>
            <img src={logo} alt="logo" className='logo' />
            ROC
          </Navbar.Brand>
        </Container>
      </div>
      <div className='top'>
        <Navbar>
          <Container fluid>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                styles={{ maxHeight: '100px' }}
                navbarScroll
              >
              </Nav>
              { !loginStatus ?
                <div className="d-flex">
                  <main>
                    <button onClick={() => setShowLogIn(true)}>Log In</button>
                    <button onClick={() => setShowSignUp(true)}>Sign Up</button>
                  </main>
                </div>
              : <div className="d-flex">
                  <main>
                    <button onClick={logout}>Log Out</button>
                  </main>
                </div>
              }
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <div className="content-one">
        <div className='container'>
          <div className="row balance">
            <div className="col-lg-6 col-md-6">
              <p>Return</p>
              <p>{interest}%</p>
            </div>
            <div className="col-lg-6 col-md-6">
              <p>Balance</p>
              <p>${currentBalance}</p>
              <div className="dropdown"><HiPlusSm /><span className='button' onClick={showDepositModal}>Deposit </span></div>
              <div className="dropdown"><HiMinusSm /><span className='button' onClick={showWithdrawModal}>Withdraw</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className='details'>
        <div className='container'>
          <div className="row assets">
            <p>Assets you own</p>
            <div className="table-container" role="table" aria-label="Destinations">
              <div className="flex-table header" role="rowgroup">
                <div className="flex-row first" role="columnheader">Asset/Currency</div>
                <div className="flex-row price" role="columnheader">Price</div>
                <div className="flex-row" role="columnheader">Balance</div>
                <div className="flex-row" role="columnheader">Total Interest earned</div>
              </div>
              <div className="flex-table row" role="rowgroup">
                <div className="flex-row first" role="cell">
                  <img src={icon} alt="usdc icon" /> Stable Strategy</div>
                <div className="flex-row price" role="cell">$1</div>
                <div className="flex-row" role="cell">{currentBalance} USDC</div>
                <div className="flex-row" role="cell">{interestEarned} USDC</div>
              </div>
              <div className="flex-table row" role="rowgroup">
                <div className="flex-row first" role="cell">
                  <img src={estate} alt="usdc icon" /> Real Estate Strategy</div>
                <div className="flex-row price" role="cell"></div>
                <div className="flex-row" role="cell">{currentBalance} USDC</div>
                <div className="flex-row" role="cell">{interestEarned} USDC</div>
              </div>
            </div>
          </div>
          <div className="row assets">
            <p>Risk strategies</p>
            <div className="table-container" role="table" aria-label="Destinations">
              <div className="flex-table header" role="rowgroup">
                <div className="flex-row-1 first" role="columnheader">Asset/Currency</div>
                <div className="flex-row-1" role="columnheader">APY</div>
                <div className="flex-row-1" role="columnheader">Balance</div>
              </div>
              <div className="flex-table row" role="rowgroup">
                <div className="flex-row-1 first" role="cell">
                  <img src={icon} alt="usdc icon" /> Stable Strategies</div>
                <div className="flex-row-1" role="cell">8~12%</div>
                <div className="flex-row-1" role="cell">{currentBalance} USDC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="App container">
        <DropdownButton
          alignRight
          title="Deposit Type"
          id="dropdown-menu-align-right"
          onSelect={handleSelect}
          >
            <Dropdown.Item eventKey="0x0102b5296D12327111c231C864Af078FdEef2Ade">Polygon</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="0x85A4602B2248745148e453Aa28fcD6f7d8d80674">Gnosis</Dropdown.Item>
        </DropdownButton>
        <span> Main Pool Address: {value}</span>
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
              <InputGroup>
                <Form.Control type="text" placeholder="ROC wallet address" value={publicKey} onChange={changePublicKey} />
                <Button variant="outline-dark" onClick={copyPublickKey}>Copy</Button>
              </InputGroup>
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
              <Form.Label style={{fontSize: "25px"}}>{currentBalance} USDC</Form.Label>
            </Form.Group>
            <InputGroup>
              <Form.Control aria-label="Dollar amount (with dot and two decimal places)" value={amountForWithdraw} onChange={(e) => setAmountForWithdraw(e.target.value)} />
              <InputGroup.Text>USDC</InputGroup.Text>
              <Button variant="outline-secondary" onClick={maxWithdraw}>MAX</Button>
            </InputGroup>
            <Form.Group>
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control type="text" onChange={changePublicKey}/>
              <Form.Label>Withdraw fee is 0.2 USDC</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsstyle='danger' onClick={hideWithdrawModal}>Cancel</Button>
          <Button onClick={Withdraw}>Withdraw</Button>
        </Modal.Footer>
      </Modal>
      <SignUp 
        showModal={showSignUp}
        hideModal={hideSignUpModal}
        logInModal={showLogInModal}
        errors={NotificateErrors}
        showSpinner={showSpinner}
        hideSpinner={hideSpinner}
      />
      <Login 
        showModal={showLogIn}
        hideModal={hideLogInModal}
        signUpModal={showSignUpModal}
        successLog={successedLogin}
        userInfo={getUserInfo}
        errors={NotificateErrors}
        showSpinner={showSpinner}
        hideSpinner={hideSpinner}
      />
      <NotificationContainer />
    </>
  )
}

export default Dashboard;