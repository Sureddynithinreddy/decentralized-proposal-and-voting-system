import { useReadContract, useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract";
import VoteButtons from "./VoteButtons";
import FinalizeButton from "./FinalizeButton";
import { useEffect, useState } from "react";

export default function ProposalCard({ id, onChange }) {
  const { address } = useAccount();

  // Load proposal
  const { data: proposal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "proposals",
    args: [id],
  });

  // hasVoted check
  const { data: voted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasVoted",
    args: [id, address ?? "0x0000000000000000000000000000000000000000"],
  });

  // Timer state
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!proposal) {
    return (
      <div className="p-6 border rounded-xl shadow bg-white mb-6">
        Loading poll...
      </div>
    );
  }

  // Extract proposal fields
  const name = proposal.name;
  const options = proposal.options;
  const votes = proposal.votes;
  const finalized = proposal.finalized;
  const deadline = Number(proposal.deadline);

  const expired = now >= deadline;
  const timeLeft = Math.max(deadline - now, 0);

  // Winner (if finalized)
  let winner = null;
  if (finalized) {
    const maxVotes = Math.max(...votes.map(Number));
    const wIndex = votes.findIndex(v => Number(v) === maxVotes);
    winner = options[wIndex];
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mb-6 border hover:shadow-xl transition">
      <h3 className="text-2xl font-bold">{name}</h3>

      {/* Timer */}
      <p className="mt-2 text-gray-700">
        {expired ? (
          <span className="text-red-600 font-semibold">⏳ Voting ended</span>
        ) : (
          <span className="text-blue-600 font-semibold">
            ⏳ Time left: {timeLeft}s
          </span>
        )}
      </p>

      {/* Poll Options */}
      <div className="mt-4 space-y-3">
        {options.map((opt, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-3 rounded-xl border bg-gray-50"
          >
            <span className="font-medium text-gray-800">{opt}</span>
            <span className="font-bold text-purple-700">
              {Number(votes[i])}
            </span>
          </div>
        ))}
      </div>

      {/* Status */}
      <p className="mt-3">
        Status:{" "}
        <span className={finalized ? "text-green-700" : "text-yellow-700"}>
          {finalized ? "Finalized" : "Active"}
        </span>
      </p>

      {/* Already voted */}
      {voted && (
        <p className="text-blue-600 text-sm mt-1">
          ✔ You have already voted on this poll.
        </p>
      )}

      {/* Voting Buttons */}
      {!finalized ? (
        <>
          <VoteButtons
            id={id}
            options={options}
            disabled={!address || voted || expired}
          />
          <FinalizeButton
            id={id}
            disabled={!address}
            expired={expired}
            finalized={finalized}
            onFinalized={onChange}
          />
        </>
      ) : (
        <p className="mt-4 text-xl font-bold text-green-700">
          🏆 Winner: {winner}
        </p>
      )}
    </div>
  );
}
