export default {
  type: 'graphAlgo',
  initialize() {
    this.graph = {
      adjacencyList: {
        A: ['B', 'C'],
        B: ['D'],
        C: ['D', 'E'],
        D: ['E'],
        E: []
      }
    };
    this.startVertex = 'A';
    this.visited = new Set();
    this.stack = [this.startVertex];
    this.traversalOrder = []; // 存储遍历顺序
    this.edgeOrder = []; // 存储边的访问顺序
    this.allEdges = this.getAllEdges(); // 获取所有边，用于初始渲染
    this.stepIndex = 0;
    this.generateTraversalOrder();
  },
  reset() {
    this.visited.clear();
    this.stack = [this.startVertex];
    this.traversalOrder = [];
    this.edgeOrder = [];
    this.stepIndex = 0;
    this.generateTraversalOrder();
  },
  // 获取图中所有边
  getAllEdges() {
    const edges = [];
    for (const [vertex, neighbors] of Object.entries(this.graph.adjacencyList)) {
      neighbors.forEach(neighbor => {
        edges.push([vertex, neighbor]);
      });
    }
    return edges;
  },
  generateTraversalOrder() {
    // 使用递归实现 DFS，生成遍历顺序和边的访问顺序
    const visited = new Set();
    const traversalOrder = [];
    const edgeOrder = [];

    const dfs = (currentVertex) => {
      if (!visited.has(currentVertex)) {
        visited.add(currentVertex);
        traversalOrder.push(currentVertex);
        const neighbors = this.graph.adjacencyList[currentVertex];
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            edgeOrder.push([currentVertex, neighbor]);
            dfs(neighbor);
          }
        });
      }
    };

    dfs(this.startVertex);
    this.traversalOrder = traversalOrder;
    this.edgeOrder = edgeOrder;
  },
  step() {
    if (this.stepIndex <= this.traversalOrder.length) {
      const currentVertex = this.traversalOrder[this.stepIndex];
      this.visited.add(currentVertex);
      this.stepIndex++;
      const nextVertex = this.traversalOrder[this.stepIndex];
      return currentVertex ? `访问节点${currentVertex},根据深度优先遍历，下一个要访问的节点是:${nextVertex ? nextVertex : ''}` : '遍历完成'
    } else {
      return '遍历完成';
    }
  },
  canStep() {
    return this.stepIndex <= this.traversalOrder.length;
  },
  getData() {
    return {
      traversalOrder: this.traversalOrder,
      edgeOrder: this.edgeOrder,
      allEdges: this.allEdges, // 返回所有边
      visited: Array.from(this.visited),
      adjacencyList: this.graph.adjacencyList
    };
  }
};