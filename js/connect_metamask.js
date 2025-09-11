async function connect_to_metamask(){
    if(!window.ethereum){
        document.getElementById('error').innerHTML = "No injected wallet. Please install Metamask";
    } else {
        document.getElementById('error').innerHTML = '';

        try{

            var user_address = await get_current_eth_address();
            document.getElementById('metamask_address').innerHTML = user_address;
            var user_balance = await get_user_balance(user_address);
            document.getElementById('metamask_balance').innerHTML = user_balance;
            var eth_network = await get_current_network();
            document.getElementById('metamask_network').innerHTML = eth_network;
        }
        catch(error){
            document.getElementById('error').innerHTML = error;
        }
    }
}

async function get_current_eth_address(){
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        console.log(accounts);
        return accounts[0]
    }
    else{
        console.error("Metamask is not installed!");
        return null;
    }
}

async function get_user_balance(eth_address){
    if (typeof window.ethereum !== 'undefined') {
        const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [eth_address],
        })
        console.log(balance);
        return (parseInt(balance, 16) / Math.pow(10,18)).toFixed(10);
    }
    else{
        console.error("Metamask is not installed!");
        return null;
    }
}

async function get_current_network(){
    // get current eth network
    const eth_network = await window.ethereum.request({
        method: 'eth_chainId',
        params: []
    });
    var current_network = parseInt(eth_network, 16);
    // console.log(typeof(current_network));
    var result;
    switch (current_network) {
                    case 1:
                    result = "Mainnet";
                    break
                    case 5:
                    result = "Goerli";
                    break
                    case 11155111:
                    result =  "Sepolia";
                    break
                    case 2018:
                    result =  "Dev";
                    break
                    case 63:
                    result =  "Mordor";
                    break
                    case 61:
                    result =  "Classic";
                    break
                    default:
                    result =  "unknow";
            }
    return result;
}
