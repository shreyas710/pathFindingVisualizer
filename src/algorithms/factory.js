import Dijkstra from "./Dijkstra";
import AStar from "./AStar";
import BreadthFirstSearch from "./BreadthFirstSearch";
import DepthFirstSearch from "./DepthFirstSearch";
import BidirectionalSwarm from "./BidirectionalSwarm";
import { DIJKSTRA, A_STAR, BFS, DFS, BI_BFS } from "../constants";

const PATHFINDER_MAPPING = {
	[DIJKSTRA]: Dijkstra,
	[A_STAR]: AStar,
	[BFS]: BreadthFirstSearch,
	[DFS]: DepthFirstSearch,
	[BI_BFS]: BidirectionalSwarm,
};

export default PATHFINDER_MAPPING;
