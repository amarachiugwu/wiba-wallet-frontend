import React, { useEffect, useState } from "react";
import { config } from "../wagmi";
import { getEthersSigner } from "../providers/getEthersSigner";
import { ethers } from "ethers";
import { walletAbi } from "../abis/walletAbi";

export default function wallet() {
  const contractAddress = "0xd2aFa1353e506c36A0347346298641BBc2801227";
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0')

  const depositEther = async () => {
    const signer = await getEthersSigner(config);
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.parseEther(amount),
    });

    await tx.wait();
    getBalance()
  };

  useEffect(() => {
    console.log(balance);

  }, [balance])

  const getBalance = async () => {
    const signer = await getEthersSigner(config);
    const contract = new ethers.Contract(contractAddress, walletAbi, signer)

    const balance = await contract.getBalance(await signer.getAddress());
    setBalance(ethers.formatEther(balance))
  }


  return (
    <div>
      <p>Balance: {balance}</p>
      <p>Enter Amount</p>
      <input
        type="text"
        step="5"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={depositEther}>Deposit</button>
    </div>
  );
}
