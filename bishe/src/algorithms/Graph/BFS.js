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
    this.visited = new Set(); // 初始化为空，逐步添加
    this.queue = [this.startVertex]; // BFS 使用队列
    this.traversalOrder = []; // 存储遍历顺序
    this.edgeOrder = []; // 存储边的访问顺序
    this.allEdges = this.getAllEdges(); // 获取所有边，用于初始渲染
    this.stepIndex = 0;
  },
  reset() {
    this.visited.clear();
    this.queue = [this.startVertex];
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
    // 使用 BFS 算法，生成遍历顺序和边的访问顺序
    // let visitedEdge=[];
   while(this.queue.length>0){
    const start = this.queue.shift();
    this.traversalOrder.push(start)
    this.allEdges.forEach(edge=>{
      if(edge[0]===start && !this.traversalOrder.includes(edge[1]) && !this.queue.includes(edge[1])){
        this.queue.push(edge[1])
        this.edgeOrder.push([edge[0],edge[1]])
      }
    })
   }
  },
  step() {
    if (this.stepIndex <= this.traversalOrder.length) {
      const currentVertex = this.traversalOrder[this.stepIndex];
      this.stepIndex++;
      this.visited.add(currentVertex);
      const neighborhood = Object.values(this.graph.adjacencyList[currentVertex]); 
      return currentVertex ? `访问节点 ${currentVertex},与之邻近的节点有${neighborhood}\n`+`其中没有访问过的节点是${neighborhood.filter(nei=>{return this.traversalOrder.includes(nei)})}` : '遍历完成';
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