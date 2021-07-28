/* eslint-disable consistent-return */
import Denque from "denque";
import Pathfinder from "./Pathfinder";
import { NODE_WALL } from "../constants";

let flag = 0;
let interSect = {};
let startInter = {};

export default class BidirectionalSwarm extends Pathfinder {
	constructor(...args) {
		super(...args);
		this.sQueue = new Denque();
		this.tQueue = new Denque();
		this.sVisited = [];
		this.tVisited = [];
		this.sParent = new Map();
		this.tParent = new Map();
		this.path = [];
		this.BFS1 = this.BFS1.bind(this);
		this.BFS2 = this.BFS2.bind(this);
	}

	BFS1() {
		const { sQueue, visited, sVisited, tVisited, sParent, prev, board } = this;
		let current = sQueue.shift();
		for (let i = 0; i < Pathfinder.dx.length; ++i) {
			const nextX = current.x + Pathfinder.dx[i];
			const nextY = current.y + Pathfinder.dy[i];
			if (
				nextX < 0 ||
				nextX >= board[0].length ||
				nextY < 0 ||
				nextY >= board.length
			) {
				continue;
			}
			if (board[nextY][nextX].type === NODE_WALL) {
				continue;
			}
			if (tVisited.includes(JSON.stringify({ x: nextX, y: nextY }))) {
				startInter = current;
				interSect = {
					x: nextX,
					y: nextY,
				};
				flag = 1;
				return;
			}
			if (visited[nextY][nextX]) {
				continue;
			}

			visited[nextY][nextX] = true;
			sVisited.push(JSON.stringify({ x: nextX, y: nextY }));
			prev[nextY][nextX] = { x: current.x, y: current.y };
			sParent.set({ x: nextX, y: nextY }, current);
			sQueue.push({ x: nextX, y: nextY });
		}
	}

	BFS2() {
		const { tQueue, visited, sVisited, tVisited, tParent, prev, board } = this;
		let current = tQueue.shift();

		for (let i = 0; i < Pathfinder.dx.length; ++i) {
			const nextX = current.x + Pathfinder.dx[i];
			const nextY = current.y + Pathfinder.dy[i];
			if (
				nextX < 0 ||
				nextX >= board[0].length ||
				nextY < 0 ||
				nextY >= board.length
			) {
				continue;
			}
			if (board[nextY][nextX].type === NODE_WALL) {
				continue;
			}

			if (sVisited.includes(JSON.stringify({ x: nextX, y: nextY }))) {
				interSect = current;
				startInter = {
					x: nextX,
					y: nextY,
				};
				flag = 1;
				return;
			}
			if (visited[nextY][nextX]) {
				continue;
			}

			visited[nextY][nextX] = true;
			tVisited.push(JSON.stringify({ x: nextX, y: nextY }));
			prev[nextY][nextX] = { x: current.x, y: current.y };
			tParent.set({ x: nextX, y: nextY }, current);

			tQueue.push({ x: nextX, y: nextY });
		}
	}

	run() {
		const {
			sQueue,
			tQueue,
			sVisited,
			tVisited,
			sParent,
			tParent,
			start,
			finish,
			updateNodeIsVisited,
			delayedIteration,
			prev,
			visited,
		} = this;

		let counter = 0;
		flag = 0;
		interSect = {};
		startInter = {};

		if (start.x === finish.x && start.y === finish.y) {
			return counter;
		}

		sQueue.push(start);
		sVisited.push(JSON.stringify(start));
		sParent.set(start, -1);
		tQueue.push(finish);
		tVisited.push(JSON.stringify(finish));
		tParent.set(finish, -1);
		visited[start.y][start.x] = true;
		visited[finish.y][finish.x] = true;
		while (sQueue.length && tQueue.length) {
			this.BFS1();
			this.BFS2();

			if (flag === 1) {
				break;
			}
		}

		for (
			let i = 0;
			i <= Math.max(sVisited.length - 1, tVisited.length - 1);
			i++
		) {
			if (i <= sVisited.length - 1) {
				let obj = JSON.parse(sVisited[i]);
				if (
					(obj.x === start.x && obj.y === start.y) ||
					(obj.x === finish.x && obj.y === finish.y)
				)
					continue;
				updateNodeIsVisited(
					obj.y,
					obj.x,
					true,
					counter * delayedIteration,
					delayedIteration
				);
				counter += 1;
			}
			if (i <= tVisited.length - 1) {
				let obj = JSON.parse(tVisited[i]);
				if (
					(obj.x === start.x && obj.y === start.y) ||
					(obj.x === finish.x && obj.y === finish.y)
				)
					continue;
				updateNodeIsVisited(
					obj.y,
					obj.x,
					true,
					counter * delayedIteration,
					delayedIteration
				);
				counter += 1;
			}
		}

		if (flag === 0) return counter;
		let prevArray = [];

		let st = interSect;
		while (st.x !== -1) {
			prevArray.push(st);
			st = prev[st.y][st.x];
		}

		st = finish;
		let i = prevArray.length - 2;
		while (!(st.x === interSect.x && st.y === interSect.y)) {
			prev[st.y][st.x] = prevArray[i];
			i--;
			st = prev[st.y][st.x];
		}
		prev[interSect.y][interSect.x] = startInter;

		return this.traceShortestPath(counter);
	}
}
