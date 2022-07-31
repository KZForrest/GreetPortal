import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/GreetPortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const [allGreets, setAllGreets] = useState([]);
  const contractAddress = "0x58C8AC73F797880b4896225C53A5b6fc3c03e1fc";

  const contractABI = abi.abi;

  const [message, setMessage] = useState("");
  // const handleSubmit = (e) => setMessage(e.target.value);

  const getAllGreets = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const greetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const greets = await greetPortalContract.getAllGreets();

        let greetsCleaned = [];
        greets.forEach(greet => {
          greetsCleaned.push({
            address: greet.greeter,
            timestamp: new Date(greet.timestamp * 1000),
            message: greet.message
          });
        });
        setAllGreets(greetsCleaned);
      } else { console.log("Ethereum object doesn't exist!") }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllGreets();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])



  useEffect(() => {
    let greetPortalContract;

    const onNewGreet = (from, timestamp, message) => {
      console.log("NewGreet", from, timestamp, message);
      setAllGreets((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      greetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      greetPortalContract.on("NewGreet", onNewGreet);
    }


    return () => {
      if (greetPortalContract) {
        greetPortalContract.off("NewGreet", onNewGreet);
      }
    };
  }, []);

  const greet = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const greetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await greetPortalContract.getTotalGreets();
        console.log("Retrieved total greet count...", count.toNumber());
        const greetTxn = await greetPortalContract.greet(message, { gasLimit: 300000 });
        console.log("Mining...", greetTxn.hash);

        await greetTxn.wait();
        console.log("Mined -- ", greetTxn.hash);

        count = await greetPortalContract.getTotalGreets();
        console.log("Retrieved total greet count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hello!
        </div>

        <div className="bio">
          I'm Forrest and I work as a solidity developer. This is a website where anyone can send me a message saved on Ethereum network. Connect you wallet and leave me a message! (Rinkeby testnet)
        </div>




        {
          currentAccount ? (
            <button className="greetButton" onClick={greet}>
              Send the message
        </button>
          ) : null
        }


        {
          currentAccount ? (
            <textarea
              type="text"
              name="name"
              value={message}
              onChange={(e) => { setMessage(e.target.value) }}
            />
          ) : null
        }

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="greetButton" onClick={connectWallet}>
            Connect your wallet
          </button>
        )}

        {allGreets.map((greet, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {greet.address}</div>
              <div>Time: {greet.timestamp.toString()}</div>
              <div>Message: {greet.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App