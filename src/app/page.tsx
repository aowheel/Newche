import { SignIn } from "@/components/sign-in";
import NewcheLogo from "@/ui/newche-logo";

export default async function Home() {
	return(
    <main>
      <NewcheLogo />
      <SignIn />
    </main>
  );
}
