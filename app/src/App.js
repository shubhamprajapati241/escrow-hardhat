import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import server from "./server";
import Escrow from "./Escrow";
import { ImSpinner8 } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
    getContractDetails();
  }, [account]);

  const getContractDetails = async () => {
    try {
      const res = await server.get(`getAddresses`);
      console.log("Details found on Server");
      console.log(res.data.contractDetails);
      setEscrows(res.data.contractDetails);
    } catch (err) {
      console.log("Oops, Contract details not found");
      console.log(err);
    }
  };

  async function newContract() {
    setIsDeploying(true);
    console.log("Deploy initiated....");
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseEther(
      document.getElementById("ether").value
    );

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    await escrowContract.deployed();

    try {
      const body = {
        address: escrowContract.address,
        arbiter: arbiter,
        beneficiary: beneficiary,
        value: value.toString(),
      };

      await server.post(`store`, body);
      console.log("Details Stored on Server");

      getContractDetails();
      setIsDeploying(false);
      toast.success("Contract Deployed");
    } catch (err) {
      console.log("Oops, Contract Details Not Store");
      console.log(err);
    }
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETHER)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          {!isDeploying && <span>Deploy</span>}
          {isDeploying && <ImSpinner8 icon="spinner" className="spinner" />}
          {isDeploying && <span>Deploying...</span>}
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow, id) => {
            return (
              <Escrow
                key={id}
                address={escrow.address}
                arbiter={escrow.arbiter}
                beneficiary={escrow.beneficiary}
                value={escrow.value}
                isApprove={escrow.isApprove}
                setEscrows={setEscrows}
                provider={provider}
                signer={signer}
                account={account}
              />
            );
          })}
        </div>

        <ToastContainer />
      </div>
    </>
  );
}

export default App;
