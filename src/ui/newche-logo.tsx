import { Orbitron } from "next/font/google";
const orbitron = Orbitron({
  weight: ["600"],
  subsets: ["latin"]
});

export default function NewcheLogo() {
  return (
    <div className={`${orbitron.className} mx-2 text-4xl text-teal-500 inline-block`}>
      Newche
    </div>
  );
}
