import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract";
import ProposalCard from "./ProposalCard";

export default function ProposalList({ onChange }) {
  const { data: count } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getProposalCount",
  });

  const total = count ? Number(count) : 0;

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        📊 All Proposals
      </h2>

      {total === 0 ? (
        <p className="text-gray-500 text-lg bg-white/60 p-4 rounded-xl shadow">
          No proposals found. Create one to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: total }).map((_, index) => (
            <ProposalCard key={index} id={index} onChange={onChange} />
          ))}
        </div>
      )}
    </div>
  );
}
