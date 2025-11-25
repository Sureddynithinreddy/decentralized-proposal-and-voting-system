import { useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract";

export default function VoteButtons({ id, options, disabled }) {
  const {
    writeContract,
    isPending,
    isSuccess,
    error,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("Vote recorded successfully!");
      },
      onError: (err) => {
        alert(err.shortMessage || err.message);
      },
    },
  });

  const vote = (index) => {
    if (disabled) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "vote",
      args: [id, index], // 👈 vote for a specific option
    });
  };

  return (
    <div className="mt-4 space-y-3">
      {options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => vote(idx)}
          disabled={disabled || isPending}
          className="
            w-full py-3 px-4 text-left
            bg-gradient-to-r from-blue-500 to-purple-500
            text-white font-semibold rounded-xl
            shadow-md hover:shadow-xl transition-all
            disabled:opacity-50
          "
        >
          {isPending ? "Voting..." : `Vote for: ${opt}`}
        </button>
      ))}

      {isSuccess && (
        <p className="text-green-600 text-sm font-semibold mt-2">
          ✔ Your vote has been recorded!
        </p>
      )}

      {error && (
        <p className="text-red-600 text-sm font-semibold mt-2">
          ⚠ {error.shortMessage || error.message}
        </p>
      )}
    </div>
  );
}
