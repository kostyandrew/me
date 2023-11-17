"use client";

import styles from "./styles.module.css";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import throttle from "lodash/throttle";
import classnames from "classnames";

const width = 80 + 10;
const height = 80 + 10;

export default function UnderlayWrapper({ children }) {
	return (
		<>
			<Underlay />
			<div className={styles.main}>{children}</div>
		</>
	);
}

function Underlay() {
	const [columns, setColumns] = useState(0);
	const [rows, setRows] = useState(0);

	useEffect(() => {
		const calculate = () => {
			const columns = Math.floor(window.innerWidth / width) + 3;
			const rows = Math.floor(window.innerHeight / height) + 3;

			setColumns(columns);
			setRows(rows);
		};

		calculate();

		window.addEventListener("resize", calculate);

		return () => window.removeEventListener("resize", calculate);
	}, []);

	return (
		<div className={styles.underlayWrapper}>
			<div className={styles.underlay} style={{ "--columns": columns, width: width * columns }}>
				{Array.from({ length: rows }).map((_, index) => (
					<Fragment key={index}>
						{Array.from({ length: columns }).map((_, index) => (
							<Box key={index} />
						))}
					</Fragment>
				))}
			</div>
		</div>
	);
}

function Box() {
	const [active, setActive] = useState(() => {
		const random = Math.random();
		return random > 0.7;
	});

	useEffect(() => {
		if (active) {
			window.setTimeout(() => setActive(false), Math.random() * 4000);
		}

		const randomInterval = 3000 + Math.floor(Math.random() * 10000);

		const interval = window.setInterval(() => {
			setActive(true);
			window.setTimeout(() => setActive(false), 2000);
		}, randomInterval);

		return () => window.clearInterval(interval);
	}, []);

	const classes = classnames(styles.box, {
		[styles.active]: active
	});

	return <div className={classes} />;
}
