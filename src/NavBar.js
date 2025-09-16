

export default function NavBar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-[#23234f] bg-opacity-80 shadow-lg fixed top-0 left-0 z-20">
      <div className="flex items-center gap-2">
        {/* Replace with your logo/icon */}
        <span className="font-mono font-bold text-xl text-pink-400">MedLoop</span>
      </div>
      <div className="flex gap-6 font-mono text-lg">
        <a href="#" className="hover:text-pink-400 transition">Analyze</a>
        <a href="#" className="hover:text-pink-400 transition">Records</a>
        <a href="#" className="hover:text-pink-400 transition">About</a>
      </div>
      <button className="bg-pink-400 text-white font-bold px-5 py-2 rounded-lg shadow hover:bg-pink-500 transition">Connect Wallet</button>
    </nav>
  );
}