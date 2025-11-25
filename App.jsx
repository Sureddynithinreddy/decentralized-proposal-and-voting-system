import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import CreateProposal from "./components/CreateProposal";
import ProposalList from "./components/ProposalList";

function App() {
  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => setRefresh((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20">

      {/* 🔥 Top-Right Wallet Button */}
      <div className="absolute top-5 right-5">
        <ConnectWallet />
      </div>

      {/* Page Header */}
      <header className="pt-16 px-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          Decentralized Voting System
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Create proposals, vote, and finalize — all on the blockchain.
        </p>
      </header>

      {/* Create Proposal Section */}
      <section className="mt-10 px-10">
        <CreateProposal onCreated={triggerRefresh} />
      </section>

      {/* Proposal List */}
      <section className="mt-12 px-10">
        <ProposalList key={refresh} onChange={triggerRefresh} />
      </section>
    </div>
  );
}

export default App;
