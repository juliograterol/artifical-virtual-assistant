export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video
        className="w-full h-full object-cover bg-loop"
        src="/bg-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
