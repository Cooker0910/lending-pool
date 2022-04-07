import React from 'react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

const startRamp = () => {
  new RampInstantSDK({
    hostAppName: 'Ramp Demo',
    hostLogoUrl: 'https://rampnetwork.github.io/assets/misc/test-logo.png',
    swapAmount: '100000000',
    swapAsset: 'MATIC_USDC',
    userAddress: '0xe2E0256d6785d49eC7BadCD1D44aDBD3F6B0Ab58',
    url: 'https://widget-instant.ramp.network/', // only specify the url if you want to use testnet widget versions,
    // use variant: 'auto' for automatic mobile / desktop handling,
    // 'hosted-auto' for automatic mobile / desktop handling in new window,
    // 'mobile' to force mobile version
    // 'desktop' to force desktop version (default)
    variant: 'auto', 
  })
    .on('*', console.log)
    .show();
}

// That's it!

const RAMPSDK = () => {

  return (
    <>
      <div onClick={startRamp}>Buy with Ramp</div>
    </>
  )
}

export default RAMPSDK;