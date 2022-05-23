import React, {useEffect, useState} from 'react';
import {HiPlusSm, HiMinusSm} from 'react-icons/hi'
import { Navbar, Nav, Container, Form, Button, InputGroup } from "react-bootstrap";
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
let usdcValue = 0, realtValue = 0, gnosisValue = 0, gcValue;
let allocation1 = 0, depositAmount1 = 0, _currenctBalance1 = 0, _interest1Earned1 = 0, _interest1 = 0, _withdrawAmount1 = 0;
let allocation2 = 0, depositAmount2 = 0, _currenctBalance2 = 0, _interest1Earned2 = 0, _interest2 = 0, _withdrawAmount2 = 0;
let withdrawAmount = 0, currentBalance = 0;

const Dashboard = (props) => {
  
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
        setEmail(res['data']['data']['email'])
        allocation1 = res['data']['data']['allocation1'] === undefined ? 0 : res['data']['data']['allocation1'];
        allocation2 = res['data']['data']['allocation2'] === undefined ? 0 : res['data']['data']['allocation2'];
        usdcValue = res['data']['totalValue']['usdcValue'] + res['data']['totalValue']['investAmount']
        realtValue = res['data']['totalValue']['realtValue']
        gnosisValue = res['data']['totalValue']['gnosisValue']
        gcValue = realtValue + gnosisValue
        depositAmount1 = res['data']['data']['depositAmount1'] === undefined ? 0 : res['data']['data']['depositAmount1']
        depositAmount2 = res['data']['data']['depositAmount2'] === undefined ? 0 : res['data']['data']['depositAmount2']
        _withdrawAmount1 = res['data']['data']['withdrawnAmount1'] === undefined ? 0: res['data']['data']['withdrawnAmount1']
        _withdrawAmount2 = res['data']['data']['withdrawnAmount2'] === undefined ? 0: res['data']['data']['withdrawnAmount2']
        _currenctBalance1 = (usdcValue * allocation1).toFixed(2) < (depositAmount1 - _withdrawAmount1) ? (depositAmount1 - _withdrawAmount1) : (usdcValue * allocation1).toFixed(2)
        _currenctBalance2 = (gcValue * allocation2).toFixed(2) < (depositAmount2 - _withdrawAmount2) ? (depositAmount2 - _withdrawAmount2) : (gcValue * allocation2).toFixed(2)
        _interest1Earned1 = (_currenctBalance1 - depositAmount1 + _withdrawAmount1).toFixed(2)
        _interest1Earned2 = (_currenctBalance2 - depositAmount2 + _withdrawAmount2).toFixed(2)
        if(_currenctBalance1 > (depositAmount1 - _withdrawAmount1).toFixed(2)) _interest1 = depositAmount1 === 0 ? 0 : ((_currenctBalance1 - depositAmount1) * 100 / depositAmount1).toFixed(2);
        else _interest1 = 0
        if(_currenctBalance2 > (depositAmount2 - _withdrawAmount2).toFixed(2)) _interest2 = depositAmount2 === 0 ? 0 : ((_currenctBalance2 - depositAmount2) * 100 / depositAmount2).toFixed(2);
        else _interest2 = 0
        setCurrecntBalance1(_currenctBalance1)
        setCurrecntBalance2(_currenctBalance2)
        setInterestEarned1(_interest1Earned1);
        setInterestEarned2(_interest1Earned2);
        setInterest((Number(_interest1) + Number(_interest2)).toFixed(2))
        setWithdrawAmount1(_withdrawAmount1)
        setWithdrawAmount2(_withdrawAmount2)
        setWithdrawStatus1(res['data']['data']['withdrawStatus1'])
        setWithdrawStatus2(res['data']['data']['withdrawStatus2'])
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
  const [currentBalance1, setCurrecntBalance1] = useState(0);
  const [currentBalance2, setCurrecntBalance2] = useState(0);
  const [interestEarned1, setInterestEarned1] = useState(0)
  const [interestEarned2, setInterestEarned2] = useState(0)
  const [interest, setInterest] = useState(0)
  const [withdrawStatus1, setWithdrawStatus1] = useState(true)
  const [withdrawStatus2, setWithdrawStatus2] = useState(true)
  const [withdrawAmount1, setWithdrawAmount1] = useState(0)
  const [withdrawAmount2, setWithdrawAmount2] = useState(0)
  const [withdrawType, setWithdrawType] = useState(true)
  const [depositType, setDepositType] = useState(false);
  const [withdrawWallet, setWithdrawWallet] = useState('')
  const [amountForWithdraw, setAmountForWithdraw] = useState(0)
  const [mainAddr, setMainAddr] = useState('')
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
      if (withdrawType) currentBalance = currentBalance1
      else currentBalance = currentBalance2
      if(Number(amountForWithdraw) === 0) {
        alert('Please enter amount to withdraw.')
        return
      } else if(Number(amountForWithdraw) > currentBalance) {
        alert('Please enter correct amount') 
        return 
      } else {
        var prefix = withdrawWallet.substring(0, 2)
        if (prefix !== '0x' || withdrawWallet.length !== 42) {
          alert('Please enter correct wallet address')
          return;
        } else {
          if((withdrawStatus1 && withdrawType) || (withdrawStatus2 && !withdrawType)) {
            if (withdrawType) withdrawAmount = withdrawAmount1
            else withdrawAmount = withdrawAmount2
            var data = {
              userID: localStorage.getItem('user_id'),
              email: email,
              amount: amountForWithdraw,
              balance1: currentBalance1,
              balance2: currentBalance2,
              wallet: withdrawWallet,
              withdraw: withdrawAmount,
              withdrawType: withdrawType
            }
            axios.post('http://localhost:5000/api/users/withdraw', data)
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
    if(withdrawType) currentBalance = currentBalance1
    else currentBalance = currentBalance2
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
    usdcValue = userData['data']['user']['totalValue']['usdcValue'] + userData['data']['user']['totalValue']['investAmount']
    realtValue = userData['data']['user']['totalValue']['realtValue']
    gnosisValue = userData['data']['user']['totalValue']['gnosisValue']
    gcValue = realtValue + gnosisValue
    allocation1 = userData['data']['user']['allocation1'] === undefined ? 0 : userData['data']['user']['allocation1']
    allocation2 = userData['data']['user']['allocation2'] === undefined ? 0 : userData['data']['user']['allocation2']
    depositAmount1 = userData['data']['user']['depositAmount1'] === undefined ? 0 : userData['data']['user']['depositAmount1']
    depositAmount2 = userData['data']['user']['depositAmount2'] === undefined ? 0 : userData['data']['user']['depositAmount2']
    _withdrawAmount1 = userData['data']['user']['withdrawnAmount1'] === undefined ? 0: userData['data']['user']['withdrawnAmount1']
    _withdrawAmount2 = userData['data']['user']['withdrawnAmount2'] === undefined ? 0: userData['data']['user']['withdrawnAmount2']
    _currenctBalance1 = (usdcValue * allocation1).toFixed(2) < (depositAmount1 - _withdrawAmount1) ? (depositAmount1 - _withdrawAmount1) : (usdcValue * allocation1).toFixed(2)
    _currenctBalance2 = (gcValue * allocation1).toFixed(2) < (depositAmount2 - _withdrawAmount2) ? (depositAmount2 - _withdrawAmount2) : (gcValue * allocation2).toFixed(2)
    _interest1Earned1 = (_currenctBalance1 - depositAmount1 + _withdrawAmount1).toFixed(2)
    _interest1Earned2 = (_currenctBalance2 - depositAmount2 + _withdrawAmount2).toFixed(2)
    if(_currenctBalance1 > (depositAmount1 - _withdrawAmount1).toFixed(2)) _interest1 = depositAmount1 === 0 ? 0 : ((_currenctBalance1 - depositAmount1) * 100 / depositAmount1).toFixed(2);
    else _interest1 = 0
    if(_currenctBalance2 > (depositAmount2 - _withdrawAmount2).toFixed(2)) _interest2 = depositAmount2 === 0 ? 0 : ((_currenctBalance2 - depositAmount2) * 100 / depositAmount2).toFixed(2);
    else _interest2 = 0
    setCurrecntBalance1(_currenctBalance1)
    setCurrecntBalance2(_currenctBalance2)
    setInterestEarned1(_interest1Earned1);
    setInterestEarned2(_interest1Earned2);
    setInterest((Number(_interest1) + Number(_interest2)).toFixed(2))
    setWithdrawAmount1(_withdrawAmount1)
    setWithdrawAmount2(_withdrawAmount2)
    setWithdrawStatus1(userData['data']['user']['withdrawStatus1'])
    setWithdrawStatus2(userData['data']['user']['withdrawStatus2'])
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
              <p>${Number(currentBalance1) + Number(currentBalance2)}</p>
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
                <div className="flex-row balance1" role="columnheader">Balance</div>
                <div className="flex-row interest" role="columnheader">Total Interest earned</div>
                <div className="flex-row type" role="columnheader">Deposit / Withdraw</div>
              </div>
              <div className="flex-table row" role="rowgroup">
                <div className="flex-row first" role="cell">
                  <img src={icon} alt="usdc icon" /> Stable Strategy</div>
                <div className="flex-row balance1" role="cell">{currentBalance1} USDC</div>
                <div className="flex-row interest" role="cell">{interestEarned1} USDC</div>
                <div className='flex-row type' role='columnheader'>
                  <button className='btn' onClick={() => {showDepositModal(); setMainAddr('0x0102b5296D12327111c231C864Af078FdEef2Ade')}}><HiPlusSm /></button>
                  <button className='btn' onClick={() => {showWithdrawModal(); setWithdrawType(true); currentBalance = currentBalance1}}><HiMinusSm /></button>
                </div>
              </div>
              <div className="flex-table row" role="rowgroup">
                <div className="flex-row first" role="cell">
                  <img src={estate} alt="usdc icon" /> Real Estate Strategy</div>
                <div className="flex-row balance1" role="cell">{currentBalance2} USDC</div>
                <div className="flex-row interest" role="cell">{interestEarned2} USDC</div>
                <div className='flex-row type' role='columnheader'>
                  <button className='btn' onClick={() => {showDepositModal(); setMainAddr('0x85A4602B2248745148e453Aa28fcD6f7d8d80674')}}><HiPlusSm /></button>
                  <button className='btn' onClick={() => {showWithdrawModal(); setWithdrawType(false); currentBalance = currentBalance2}}><HiMinusSm /></button>
                </div>
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