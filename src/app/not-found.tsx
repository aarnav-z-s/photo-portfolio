import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="caption-text text-[#bfa882] mb-6">404</p>
      <h1 className="font-display italic font-light text-[clamp(3rem,10vw,9rem)] leading-[0.9] text-[#eeeae3] mb-4">
        Not found
      </h1>
      <p className="font-display italic text-[#7a746e] text-lg mb-10">
        This frame was left unexposed.
      </p>
      <Link href="/" className="caption-text text-[#bfa882] hover:text-[#eeeae3] transition-colors">
        ← Return home
      </Link>
    </div>
  );
}
