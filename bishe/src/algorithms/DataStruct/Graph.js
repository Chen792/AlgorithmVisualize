export default {
    type: 'graph',
    initialize() {
      this.vertices = ['A', 'B', 'C', 'D', 'E']; // 顶点集合
      this.edges = [
        ['A', 'B'], // [起点, 终点]
        ['A', 'C'],
        ['B', 'D'],
        ['C', 'D'],
        ['C', 'E'],
        ['D', 'E']
      ];
      this.isDirected = false; // 是否是有向图
      this.reset();
    },
    reset() {
      this.adjacencyMatrix = this.createAdjacencyMatrix();
      this.adjacencyList = this.createAdjacencyList();
    },
    changeDirection(){
        this.isDirected = !this.isDirected
    },
    //邻接矩阵
    createAdjacencyMatrix() {
      const matrix = Array(this.vertices.length).fill(0).map(() => Array(this.vertices.length).fill(0));
      this.edges.forEach(([start, end]) => {
        const startIndex = this.vertices.indexOf(start);
        const endIndex = this.vertices.indexOf(end);
        matrix[startIndex][endIndex] = 1;
        if (!this.isDirected) {
          matrix[endIndex][startIndex] = 1;
        }
      });
      return matrix;
    },
    //邻接表
    createAdjacencyList() {
      const list = {};
      this.vertices.forEach(vertex => {
        list[vertex] = [];
      });
      this.edges.forEach(([start, end]) => {
        list[start].push({ vertex: end});
        if (!this.isDirected) {
          list[end].push({ vertex: start});
        }
      });
      return list;
    },
    getData() {
      return {
        vertices: this.vertices,
        edges: this.edges,
        adjacencyMatrix: this.adjacencyMatrix,
        adjacencyList: this.adjacencyList,
      };
    }
  };