import { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contractABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_message", "type": "string" }],
    "name": "submitFeedback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllFeedbacks",
    "outputs": [{ "internalType": "struct FeedbackDApp.Feedback[]", "type": "tuple[]" }],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function fetchFeedbacks() {
      if (!contract) return;

      try {
        const feedbackList = await contract.getAllFeedbacks();

        // Fix: Convert array of tuples into an array of objects
        const formattedFeedbacks = feedbackList.map(fb => ({
          user: fb[0],   // First element (address)
          message: fb[1] // Second element (feedback message)
        }));

        setFeedbacks(formattedFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    }

    fetchFeedbacks();
  }, [contract]);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found! Please install it.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      console.log("Connected account:", await signer.getAddress());

      setSigner(signer);
      setContract(contract);
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        console.log("User rejected the wallet connection.");
        alert("You rejected the wallet connection. Please try again.");
      } else {
        console.error("Error connecting wallet:", error);
        alert("Something went wrong. Check the console for details.");
      }
    }
  }

  async function submitFeedback() {
    if (!contract) return alert("Connect wallet first!");

    try {
      const tx = await contract.submitFeedback(message);
      await tx.wait();
      setMessage("");
      alert("Feedback submitted!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Feedback DApp</h1>
      <button onClick={connectWallet}>
        {signer ? "Wallet Connected" : "Connect Wallet"}
      </button>

      <div>
        <h2>Submit Your Feedback</h2>
        <input
          type="text"
          placeholder="Write your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={submitFeedback}>Submit</button>
      </div>

      <div>
        <h2>All Feedback</h2>
        {feedbacks.length > 0 ? (
          feedbacks.map((fb, index) => (
            <p key={index}><strong>{fb.user}:</strong> {fb.message}</p>
          ))
        ) : (
          <p>No feedbacks yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
