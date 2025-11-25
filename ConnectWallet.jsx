import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut } from "lucide-react"; // icons

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Format wallet address
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  if (isConnected)
    return (
      <div className="p-4 bg-white border rounded-xl shadow flex items-center justify-between w-[360px]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Wallet className="text-blue-700" size={20} />
          </div>
          <span className="font-semibold text-gray-800">{shortAddress}</span>
        </div>

        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all"
        >
          <LogOut size={18} />
          Disconnect
        </button>
      </div>
    );

  return (
    <div className="flex flex-col gap-3 w-[300px]">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all disabled:opacity-50"
        >
          {/* Dynamic wallet icon names */}
          {connector.name.includes("MetaMask") && (
            <img
              src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
              className="w-5 h-5"
            />
          )}
          {connector.name.includes("WalletConnect") && (
            <img
              src="https://walletconnect.com/_next/static/media/logo_mark.8f773939.svg"
              className="w-6 h-6"
            />
          )}

          {isPending ? "Connecting..." : `Connect with ${connector.name}`}
        </button>
      ))}
    </div>
  );
}
