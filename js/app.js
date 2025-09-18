// app.js

// Contract details (replace with your deployed contract's details)
const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
const contractABI = [
    // Paste your full ABI here after deployment
];

// Global variables for Web3 and contract instances
let web3;
let votingContract;
let userAccount;

// DOM elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const userAddressSpan = document.getElementById('userAddress');
const userRoleSpan = document.getElementById('userRole');
const networkNameSpan = document.getElementById('networkName');
const currentStatusSpan = document.getElementById('currentStatus');

// Connect to MetaMask
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            web3 = new Web3(window.ethereum);
            votingContract = new web3.eth.Contract(contractABI, contractAddress);
            updateUI();
        } catch (error) {
            console.error("User denied account access or another error occurred:", error);
            alert("Connection failed. Please check MetaMask.");
        }
    } else {
        alert("MetaMask is not installed. Please install it to use this app.");
    }
}

// Update UI with user info and contract status
async function updateUI() {
    if (!userAccount) {
        userAddressSpan.textContent = "Not connected";
        userRoleSpan.textContent = "N/A";
        networkNameSpan.textContent = "N/A";
        currentStatusSpan.textContent = "Please connect your wallet.";
        return;
    }

    userAddressSpan.textContent = userAccount;

    const networkId = await web3.eth.getChainId();
    let networkName;
    switch (networkId) {
        case 1: networkName = "Mainnet"; break;
        case 5: networkName = "Goerli"; break;
        case 11155111: networkName = "Sepolia"; break;
        default: networkName = "Unknown";
    }
    networkNameSpan.textContent = networkName;

    // Call a view function to get the coordinator address
    const coordinatorAddress = await votingContract.methods.coordinator().call();
    if (userAccount.toLowerCase() === coordinatorAddress.toLowerCase()) {
        userRoleSpan.textContent = "Coordinator";
    } else {
        userRoleSpan.textContent = "Participant";
    }

    // Simple Read Function
    const phase = await votingContract.methods.getPhase().call();
    currentStatusSpan.textContent = phase;
    console.log("Current contract phase:", phase);

}

// Add event listener to the connect button
connectWalletBtn.addEventListener('click', connectWallet);

// Initial call to check for existing connection
window.addEventListener('load', () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
        connectWallet();
    }
});