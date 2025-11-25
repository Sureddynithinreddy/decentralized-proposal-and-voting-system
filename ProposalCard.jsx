import { useReadContract, useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract";
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";

export default function ProposalCard({ id }) {
  const { address } = useAccount();

  // Read full proposal
  const { data: proposal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getProposal",
    args: [id],
  });

  // Check if user voted
  const { data: voted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasVoted",
    args: [id, address ?? "0x0000000000000000000000000000000000000000"],
  });

  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!proposal) return null;

  // Unpack proposal
  const name = proposal[0];
  const options = proposal[1];
  const votes = proposal[2];
  const finalized = proposal[3];
  const deadline = Number(proposal[4]);

  const expired = now >= deadline;
  const timeLeft = Math.max(deadline - now, 0);

  return (
    <div className="p-4 mb-4 bg-white shadow rounded-xl border">
      <h3 className="text-xl font-bold">{name}</h3>

      {/* TIME */}
      <p className="text-gray-600 mt-1">
        {expired ? (
          <span className="text-red-600">⏳ Voting ended</span>
        ) : (
          <span>⏳ Time left: {timeLeft}s</span>
        )}
      </p>

      {/* OPTIONS + VOTES */}
      <div className="mt-3">
        {options?.map((opt, index) => (
          <div
            key={index}
            className="flex justify-between p-2 bg-gray-100 rounded mb-2"
          >
            <span>{opt}</span>
            <span className="font-bold">{Number(votes[index])}</span>
          </div>
        ))}
      </div>

      {/* STATUS */}
      <p className="mt-2">
        Status:{" "}
        <span className={finalized ? "text-green-700" : "text-yellow-700"}>
          {finalized ? "Finalized" : "Active"}
        </span>
      </p>

      {/* VOTE BUTTONS */}
      {!finalized && !expired && !voted && (
        <VoteOptions id={id} options={options} />
      )}

      {voted && <p className="text-blue-600 mt-3">You already voted.</p>}

      {/* WINNER SECTION */}
      {finalized && (
        <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg">
          <h4 className="font-bold text-green-700 text-lg">🏆 Winner</h4>

          {(() => {
            const numericVotes = votes.map((v) => Number(v));
            const maxVotes = Math.max(...numericVotes);
            const winners = options.filter(
              (_, i) => numericVotes[i] === maxVotes
            );

            if (winners.length === 1) {
              return (
                <p className="text-green-800 mt-1">
                  ✔ <strong>{winners[0]}</strong> wins with {maxVotes} votes 🎉
                </p>
              );
            } else {
              return (
                <p className="text-green-800 mt-1">
                  🤝 It's a tie between:{" "}
                  <strong>{winners.join(", ")}</strong>
                </p>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
}

// MULTI OPTION VOTE BUTTONS
function VoteOptions({ id, options }) {
  const { writeContract, isPending } = useWriteContract();

  const castVote = (index) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "vote",
      args: [id, index],
    });
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Vote:</h4>

      {options.map((opt, index) => (
        <button
          key={index}
          onClick={() => castVote(index)}
          className="w-full p-2 mb-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          disabled={isPending}
        >
          {isPending ? "Voting..." : opt}
        </button>
      ))}
    </div>
  );
}
