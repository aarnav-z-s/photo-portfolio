export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#070707] flex items-center justify-center z-50">
      <div className="flex items-end gap-1 h-8">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="audio-bar w-[2px] bg-[#bfa882]"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${0.8 + i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
