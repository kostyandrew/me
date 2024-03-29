import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import Underlay from "@/app/Underlay";

const inter = Nunito_Sans({ subsets: ["latin"] });

export const metadata = {
	title: "Andrii Kostetskyi",
	description: "Javascript Fullstack developer"
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="apple-touch-icon" href="/logo192.png" />
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f0f0f0" />
				<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1c1c1c" />
			</head>
			<body className={inter.className}>
				<Underlay>{children}</Underlay>
			</body>
		</html>
	);
}
