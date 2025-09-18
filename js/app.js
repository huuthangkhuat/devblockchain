// app.js

// Contract details
const contractAddress = '0xd00d798b53c0ef8b0a76b7a0faf8110cf9d3a64c';
const contractABI = [
    [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"}],"name":"ResultsRevealed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"},{"indexed":false,"internalType":"string","name":"_topic","type":"string"},{"indexed":false,"internalType":"string[]","name":"_options","type":"string[]"}],"name":"SessionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"_voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"_optionIndex","type":"uint256"}],"name":"VoteCasted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"voter","type":"address"}],"name":"VoterExcluded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"voter","type":"address"}],"name":"VoterReinstated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"sessionId","type":"uint256"}],"name":"VotingEnded","type":"event"},{"inputs":[{"internalType":"uint256","name":"_optionIndex","type":"uint256"}],"name":"castVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coordinator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentSessionId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"endVoting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_voter","type":"address"}],"name":"excludeVoter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getExcludedVoters","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOptions","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPhase","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getResults","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTopic","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_voter","type":"address"}],"name":"hasUserVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hasUserVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_voter","type":"address"}],"name":"isVoterExcluded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_voter","type":"address"}],"name":"reinstateVoter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_topic","type":"string"},{"internalType":"string[]","name":"_options","type":"string[]"}],"name":"startSession","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"viewMyVote","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
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