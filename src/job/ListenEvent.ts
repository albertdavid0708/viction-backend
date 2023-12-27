import { ethers } from "ethers";
import { env } from "../config/config";
import sepoliaABI from "../../assets/sepoliaABI.json";
import Alphacado from "../../assets/Alphacado.json";
import { baseJob } from "./JobBase";
import { providerKlaytn } from "./provider";

const connectionUrl = "https://ethereum-sepolia.blockpi.network/v1/rpc/public";
const network = {
  name: "ETH",
  chainId: 11155111,
};

async function listenEventBridge(blockNumber: number): Promise<number> {
  console.log("currentblock", blockNumber);
  const provider = new ethers.providers.JsonRpcProvider(connectionUrl, network);

  const wallet = new ethers.Wallet(env.privateKey, providerKlaytn);

  const contract = new ethers.Contract(
    env.address.sepolia,
    sepoliaABI,
    provider
  );
  const contractKlaytn = new ethers.Contract(
    "0xf30D771D5D1940C3Bbc44d200E87fcce29318CaC",
    Alphacado,
    wallet
  );

  const eventName = "CrossChainRequest";
  const filter = contract.filters[eventName]();
  const currentBlockNumber = await provider.getBlockNumber();

  const fromBlock = currentBlockNumber - 1024;

  const logs = (
    await contract.queryFilter(filter, fromBlock, currentBlockNumber)
  ).reverse();
  if (logs.length === 0) {
    return blockNumber;
  }
  for (const l of logs) {
    if (l.blockNumber === blockNumber) {
      return logs[0].blockNumber;
    }
    const args: any = l.args;
    try {
      const tx = await contractKlaytn.receivePayloadAndTokens(
        args.payload,
        args.USDCAmount.toString(),
        {
          gasLimit: 500000,
        }
      );
      const receipt_2 = await tx.wait();
      console.log("Transaction mined:", receipt_2.transactionHash);
    } catch (error) {}
  }

  return logs[0].blockNumber;
}
async function JobBridge() {
  const INTERVAL = 5 * 1000;
  let blockNumber = 4789648;
  baseJob(
    () => {
      return false;
    },
    async () => {
      blockNumber = await listenEventBridge(blockNumber);
    },
    INTERVAL
  );
}

JobBridge().then();
