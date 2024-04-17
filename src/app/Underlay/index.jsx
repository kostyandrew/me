"use client";

import styles from "./styles.module.css";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import classnames from "classnames";

const width = 40 + 2;
const height = 40 + 2;

export default function UnderlayWrapper({ children }) {
	return (
		<>
			<Underlay />
			<div className={styles.main}>{children}</div>
		</>
	);
}

const useStateRef = (value) => {
	const [state, setState] = useState(value);
	const ref = useRef(value);
	ref.current = value;

	const updatableState = useCallback(
		(value) => {
			setState(value);
			ref.current = value;
		},
		[ref, setState]
	);

	return { ref, value: state, set: updatableState };
};

function Underlay() {
	const [columns, setColumns] = useState(0);
	const [rows, setRows] = useState(0);
	const activesRS = useStateRef([]);

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

	useEffect(() => {
		const points = Array.from({ length: 40 }).map((el, i, arr) => {
			let degree = (360 / arr.length) * i;
			return { x: window.innerWidth / 2, y: window.innerHeight / 2, degree };
		});

		const degToRad = (deg) => deg * (Math.PI / 180);

		const movingPoint = () => {
			const actives = points.map((point) => {
				point.x += Math.cos(degToRad(point.degree)) * 10;
				point.y += Math.sin(degToRad(point.degree)) * 10;
				if (point.x < 0 || point.x > window.innerWidth) {
					point.degree = 180 - point.degree;
				}
				if (point.y < 0 || point.y > window.innerHeight) {
					point.degree = 360 - point.degree;
				}

				const element = document
					.elementsFromPoint(point.x, point.y)
					.find((element) => element.classList.contains(styles.box));
				if (element) {
					const column = element.getAttribute("data-column");
					const row = element.getAttribute("data-row");
					return [+column, +row];
				}
				return null;
			});

			activesRS.set(actives.filter(Boolean));
			requestAnimationFrame(movingPoint);
		};
		requestAnimationFrame(movingPoint);
	}, []);

	return (
		<div className={styles.underlayWrapper}>
			<div className={styles.underlay} style={{ "--columns": columns, width: width * columns }}>
				{Array.from({ length: rows }).map((_, indexR) => (
					<Fragment key={indexR}>
						{Array.from({ length: columns }).map((_, indexC) => (
							<Box key={indexC} column={indexC} row={indexR} activesRS={activesRS.value} />
						))}
					</Fragment>
				))}
			</div>
		</div>
	);
}

function Box({ column, row, activesRS }) {
	const [highlight, setHighlight] = useState(() => {
		const random = Math.random();
		return random > 0.7;
	});

	useEffect(() => {
		if (highlight) {
			window.setTimeout(() => setHighlight(false), Math.random() * 4000);
		}

		const randomInterval = 3000 + Math.floor(Math.random() * 10000);

		const interval = window.setInterval(() => {
			setHighlight(true);
			window.setTimeout(() => setHighlight(false), 2000);
		}, randomInterval);

		return () => window.clearInterval(interval);
	}, []);

	const calculateActive = (activesRS) => {
		return activesRS.reduce((acc, [Acolumn, Arow]) => {
			return acc || (Acolumn === column && Arow === row);
		}, false);
	};
	const active = calculateActive(activesRS);

	const classes = classnames(styles.box, {
		[styles.active]: active,
		[styles.highlight]: highlight
	});

	return <div className={classes} data-column={column} data-row={row} />;
}
