import { useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract";

export default function FinalizeButton({ id, disabled, expired, finalized, onFinalized }) {
  const {
    writeContract,
    isPending,
    error,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("Proposal finalized!");
        onFinalized?.(); // refresh UI
      },
      onError: (err) => {
        console.error("Finalize failed:", err);
        alert(err.shortMessage || err.message);
      }
    }
  });

  const finalize = () => {
    if (disabled || isPending || !expired || finalized) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "finalize",
      args: [id],
    });
  };

  // If finalized already → hide button
  if (finalized) return null;

  return (
    <button
      onClick={finalize}
      disabled={isPending || disabled || !expired}
      className="mt-3 px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      {isPending ? "Finalizing..." : expired ? "Finalize Proposal" : "Waiting for deadline..."}
    </button>
  );
}
