import EscrowContractABI from "./artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "ethers";
import server from "./server";
import { useState } from "react";
import { ImSpinner8 } from "react-icons/im";
export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  provider,
  signer,
  isApprove,
  setEscrows,
  account,
}) {
  const [isContractApproving, setIsContractApproving] = useState(false);
  const handleApprove = async () => {
    setIsContractApproving(true);
    if (!isApprove) {
      if (account.toLowerCase() === arbiter.toLowerCase()) {
        const escrowContract = new ethers.Contract(
          address,
          EscrowContractABI.abi,
          provider
        );

        escrowContract.on("Approved", () => {});
        await approve(escrowContract, signer);

        if (isApprove) {
          document.getElementById(address).className = "complete";
          document.getElementById(address).innerText = "✓ It's been approved!";
        }
        const body = { address: address };
        const res = await server.post("approve", body);
        setEscrows(res.data.contractDetails);
        setIsContractApproving(false);
      } else {
        alert("only Arbiter can approve the transaction");
      }
    } else {
      alert("Already approved");
    }
  };

  async function approve(escrowContract, signer) {
    const approveTxn = await escrowContract.connect(signer).approve();
    await approveTxn.wait();
  }

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>

        {!isApprove ? (
          <div
            className="button"
            id={address}
            onClick={(e) => {
              e.preventDefault();
              handleApprove();
            }}
          >
            {!isContractApproving && <span>Approve</span>}
            {isContractApproving && (
              <ImSpinner8 icon="spinner" className="spinner" />
            )}
            {isContractApproving && <span>Approving...</span>}
          </div>
        ) : (
          <div className="complete">✓ It's been approved!</div>
        )}
      </ul>
    </div>
  );
}
