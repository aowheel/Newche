import NewcheLogo from "@/ui/newche-logo";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
	return(
    <main>
      <NewcheLogo />
      <div className="p-4 leading-loose">
        <h1 className="text-xl font-medium py-2">😊アプリとして使えるようになりました</h1>
        <div className="p-2">
          <p>iOSの場合は共有のボタンから&quot;ホーム画面に追加&quot;でインストールできます。</p>
          <Image
            src="/image/iOS.jpg"
            alt="iOSの場合の追加方法"
            width={300}
            height={0}
            className="border-2"
          />
          <p>Androidの場合はページ上部の&quot;⁝&quot;のボタンから&quot;ホーム画面に追加&quot;でインストールできます。</p>
          <Image
            src="/image/Android.png"
            alt="iOSの場合の追加方法"
            width={300}
            height={0}
            className="border-2"
          />
        </div>
        <h1 className="text-xl font-medium py-2">🎈個人の日程は参加、不参加、未定のすべて入力後、全体の表が見れるようになります</h1>
        <h1 className="text-xl font-medium py-2">🙇‍♂️名前の入力が再度必要になると思いますが、今後は名前の入力はスキップされると思います</h1>
        <h1 className="text-xl font-medium py-2">😎名前を間違えて入ってしまった場合は各ページ右上の名前をタップで変更できます</h1>
      </div>
      <div className="flex justify-center p-4">
        <Link href="/entry" className="animate-pulse px-2 rounded text-2xl text-white bg-teal-300">👉Newche</Link>
      </div>
    </main>
  );
}
