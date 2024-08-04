import { useEffect, useState } from 'react'
import './App.css'
import Login from './components/Login'
import { ethers } from 'ethers'
import Connected from './components/Connected'
import { contractAddress, contractABI } from './constants/constants'

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [voteStatus, setVoteStatus] = useState(true);

  useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }

  }, []);

  const getCurrentStatus = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const status = await contractInstance.getVotingStatus();
        console.log('status: ', status);
        setVotingStatus(status);
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      alert('Install Metamask');
    }
  }

  const getRemainingTime = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const timeRemaining = await contractInstance.getRemainingTime();
        setRemainingTime(parseInt(timeRemaining, 16));
        console.log('timeRemaining: ', parseInt(timeRemaining, 16));
      }
      catch (err) {
        console.log(err);
      }
    }
  }

  const getCandidates = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();

        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

        const candidates = await contractInstance.getAllVotesOfCandiates();
        const formattedCandidates = candidates.map((candidate, index) => {
          return {
            index: index,
            name: candidate.name,
            voteCount: candidate.voteCount.toNumber()
          }
        })
        console.log('candidates: ', formattedCandidates);
        setCandidates(formattedCandidates);
      }
      catch (err) {
        console.log(err);
      }
    } else {
      alert('Install Metamask');
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      canVote();
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      canVote();
    }
  }

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        console.log('provider: ', provider);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log('Metamask connected + ', address);
        setAccount(address);
        setIsConnected(true);
        canVote();
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Install Metamask');
    }
  }
  const handleChangeNumber = (e) => {
    setNumber(e.target.value);
  }
  const voteFunction = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const transaction = await contractInstance.vote(parseInt(number));
        await transaction.wait();
        console.log('voted');
        canVote();
        getCandidates();
      }
    } catch (error) {
      console.log(error);
    }
  }
  const canVote = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const voteStatus = !(await contractInstance.voters(await signer.getAddress()));
        console.log('voteStatus: ', voteStatus);
        setVoteStatus(voteStatus);
      } else {
        alert('Install Metamask');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='App'>
      {isConnected ? <Connected account={account}
        candidates={candidates}
        remainingTime={remainingTime}
        handleChangeNumber={handleChangeNumber}
        voteFunction={voteFunction}
        votingStatus={votingStatus}
        number={number}
        voteStatus={voteStatus}
      /> : <Login connectToMetamask={connectToMetamask} />}
    </div>
  )
}

export default App
