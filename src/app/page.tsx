import { Metadata } from "next";
import App from "./app";

const appUrl = "https://gmgmm.vercel.app";  


const frame = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  isEmbeddable: true,
  button: {
    title: "say gm",
    action: {
      type: "launch_frame",
      name: "gm onchain",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Say gm onchain",
    openGraph: {
      title: "Say gm onchain",
      description: "A Farcaster gm app.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (
    <App />
  );
}
