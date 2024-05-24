import { Orbitron } from "next/font/google";
const orbitron = Orbitron({
  weight: ["600"],
  subsets: ["latin"]
});

export default function NewcheLogo() {
  return (
    <div className="mx-2">
      <p className={`${orbitron.className} text-4xl text-teal-500`}>Newche</p>
    </div>
  );
}
