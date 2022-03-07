import './dashboard.css';

const Dashboard = () => {
  return (
    <div className='d-flex flex-column-fluid'>
      <div className='container-fluid'>
        <div className='row balance'>
          <div className='col-lg-6 col-xxl-12'>
            <p>Return</p>
            <p>31.68%</p>
          </div>
          <div className='col-lg-6 col-xxl-12'>
            <p>Your total Balance:</p>
            <p>$2,212.14</p>
            <p style={{fontSize: '14px'}}>Withdraw</p>
          </div>
        </div>  
        <div className='row'>
          <dv className='card card-custom card-stretch gutter-b'>
            <div className='card-header border-0 py-5'>
                <h3 className='card-title aligh-item-start flex-column'>
                  <span className='card-label font-weight-bolder'>Assets you own</span>
                </h3>
            </div>
            <div className='card-body pt-0 pb-3'>
              <div className='tab-content'>
                <div className='table-responsive'>
                  <table className='table table-head-custom table-head-bg table-vertical-center'>
                    <thead>
                      <tr>
                        <th>Aseet/currency</th>
                        <th>Price</th>
                        <th>APY</th>
                        <th>Balance</th>
                        <th>Total Interest earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='usdc-buy' colSpan={5}>+ USDC  + BUY</td>
                      </tr>
                      <tr>
                        <td><span style={{backgroundImage: "url('https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png')"}}></span><span className="text-dark-75 font-weight-bolder d-block font-size-lg">stablecoin</span></td>
                        <td><span className="text-dark-75 font-weight-bolder d-block font-size-lg">$1</span></td>
                        <td><span className="text-dark-75 font-weight-bolder d-block font-size-lg">6%</span></td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">0.04484529 USDC</span>
                          <span className="text-muted font-weight-bold">$1,989.90</span>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">0.04484529 USDC</span>
                          <span className="text-muted font-weight-bold">$1,989.90</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>  
                </div>
              </div>
            </div>
          </dv>
        </div>
        <div className='row'>
          <dv className='card card-custom card-stretch gutter-b'>
            <div className='card-header border-0 py-5'>
                <h3 className='card-title aligh-item-start flex-column'>
                  <span className='card-label font-weight-bolder'>Risk strategies</span>
                </h3>
            </div>
            <div className='card-body pt-0 pb-3'>
              <div className='tab-content'>
                <div className='table-responsive'>
                  <table className='table table-head-custom table-head-bg table-vertical-center'>
                    <thead>
                      <tr>
                        <th>Aseet/currency</th>
                        <th>Price</th>
                        <th>APY</th>
                        <th>Balance</th>
                        <th>Total Interest earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="text-dark-75 font-weight-bolder d-block font-size-lg">stablecoin</span></td>
                        <td><span className="text-dark-75 font-weight-bolder d-block font-size-lg">$1</span></td>
                        <td><span className="text-dark-75 font-weight-bolder d-block font-size-lg">8~12%</span></td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">0.04484529 USDC</span>
                          <span className="text-muted font-weight-bold">$1,989.90</span>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">0.00066222 USDC</span>
                          <span className="text-muted font-weight-bold">$29.44</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>  
                </div>
              </div>
            </div>
          </dv>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;