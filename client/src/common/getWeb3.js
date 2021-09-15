import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    const injectWeb3 = async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://192.168.99.100:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    };
    if (document.readyState === 'complete') {
      // If the document loading is completed, inject web3
      injectWeb3();
    } else {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", injectWeb3);
    }
  });

export default getWeb3;
