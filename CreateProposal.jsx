import { useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract";

export default function CreateProposal({ onCreated }) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [options, setOptions] = useState([""]);

  const { writeContract, isPending, isSuccess, error } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setName("");
        setDuration("");
        setOptions([""]);
        onCreated?.();
      },
    },
  });

  const updateOption = (i, value) => {
    const copy = [...options];
    copy[i] = value;
    setOptions(copy);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (i) => {
    if (options.length <= 1) return;
    setOptions(options.filter((_, index) => index !== i));
  };

  const handleCreate = () => {
    if (!name.trim()) return alert("Please enter proposal name");
    if (options.some((o) => !o.trim()))
      return alert("All options must be filled");
    if (options.length < 2)
      return alert("Proposal must have at least 2 options");
    if (!duration || Number(duration) <= 0)
      return alert("Please enter valid duration");

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "createProposal",
      args: [name.trim(), options.map((o) => o.trim()), Number(duration)],
    });
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="
        w-full max-w-xl 
        p-8 rounded-3xl 
        shadow-2xl 
        backdrop-blur-2xl 
        bg-white/30 
        border border-white/40 
        relative
      ">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br 
            from-blue-400/40 to-purple-500/40 blur-xl -z-10"></div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm flex items-center">
          📝 Create Poll
        </h2>

        <div className="flex flex-col gap-6">

          {/* NAME */}
          <div>
            <label className="text-gray-700 font-semibold">Poll Question</label>
            <input
              type="text"
              value={name}
              placeholder="Eg: Which feature should be added?"
              onChange={(e) => setName(e.target.value)}
              className="
                w-full p-3 mt-2 
                rounded-xl bg-white/60 
                shadow-inner border border-gray-300 
                focus:border-purple-500 focus:ring-2 
                focus:ring-purple-400 outline-none
              "
            />
          </div>

          {/* OPTIONS */}
          <div>
            <label className="text-gray-700 font-semibold">Poll Options</label>

            <div className="flex flex-col gap-3 mt-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={opt}
                    placeholder={`Option ${i + 1}`}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="
                      flex-1 p-3 rounded-xl 
                      bg-white/60 shadow-inner 
                      border border-gray-300 
                      focus:border-purple-500 focus:ring-2 
                      focus:ring-purple-400 outline-none
                    "
                  />
                  {options.length > 1 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="
                        px-3 py-1 bg-red-600 text-white rounded-xl 
                        hover:bg-red-700 transition
                      "
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addOption}
                className="
                  w-full py-2 rounded-xl 
                  bg-green-600 text-white font-semibold 
                  shadow hover:bg-green-700 transition
                "
              >
                ➕ Add Option
              </button>
            </div>
          </div>

          {/* DURATION */}
          <div>
            <label className="text-gray-700 font-semibold">
              Duration (Seconds)
            </label>
            <input
              type="number"
              value={duration}
              placeholder="Eg: 60"
              onChange={(e) => setDuration(e.target.value)}
              className="
                w-full p-3 mt-2 rounded-xl bg-white/60 
                shadow-inner border border-gray-300 
                focus:border-purple-500 focus:ring-2 
                focus:ring-purple-400 outline-none
              "
            />
          </div>

          {/* CREATE BUTTON */}
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="
              w-full py-3 rounded-xl
              bg-gradient-to-r from-blue-600 to-purple-600
              text-white font-semibold shadow-lg 
              hover:shadow-xl transition-all 
              disabled:opacity-50
            "
          >
            {isPending ? "Creating..." : "Create Poll"}
          </button>

          {isSuccess && (
            <p className="text-green-700 font-semibold text-center">
              ✔ Poll created successfully!
            </p>
          )}
          {error && (
            <p className="text-red-600 text-center font-semibold">
              ⚠ {error.shortMessage || error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
