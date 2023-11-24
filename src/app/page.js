import styles from "./page.module.css";

export default function Home() {
	return (
		<main className={styles.main}>
			<div>
				<h1 className={styles.title}>
					Andrii
					<br />
					Kostetskyi
				</h1>

				<p className={styles.description}>Javascript Fullstack developer</p>
			</div>

			<div className={styles.more}>
				<a href="https://www.linkedin.com/in/andrew-kostetskyi-4803ab82/" className={styles.card}>
					LinkedIn &rarr;
				</a>
				<p>Get more info about me on LinkedIn</p>
			</div>
		</main>
	);
}
