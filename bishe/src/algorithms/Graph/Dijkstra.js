export default {
    type: 'graphAlgo',
    initialize() {
      this.graph = {
        adjacencyList: {
          F: { C: 5, E: 12 },
          E: { C: 1, B: 6, D: 6, F:12 },
          D: { B: 2, E: 6, C: 15,A: 4 },
          A: { B: 10, D: 4},
          B: { D: 2, C: 8, E: 6, A: 10 },
          C: { B: 8, D: 15, E: 1, F: 5 }
        }
      };
      this.allEdges = this.getAllEdges();
      this.startVertex = 'A';
      this.vertices = Object.keys(this.graph.adjacencyList);
      this.distances = {}; // 存储起点到每个顶点的最短距离
      this.visited = new Set(); // 存储已访问的节点
      this.unvisited = new Set(this.vertices); // 未访问的顶点集合
      this.stepIndex = 0;
      this.edgesOrder = [];
      this.previousVertex=[];
      this.reset();
    },
    reset() {
      this.visited.clear();
      this.unvisited = new Set(this.vertices);
      this.distances = this.vertices.reduce((acc, vertex) => {
        acc[vertex] = Infinity;
        return acc;
      }, {});
      this.distances[this.startVertex] = 0;
      this.stepIndex = 0;
    },
    getAllEdges() {
      let edges = [];
      for (let start in this.graph.adjacencyList) {
        const allEnd = Object.entries(this.graph.adjacencyList[start]);
        allEnd.forEach(([neighbor]) => {
          edges.push([start, neighbor]);
        });
      }
      return edges;
    },
    calculateShortestPath() {
        const smallestVertex = this.findSmallestVertex();
        this.visited.add(smallestVertex);
        this.unvisited.delete(smallestVertex)
        const neighbors = this.graph.adjacencyList[smallestVertex];
        for (const neighbor in neighbors) {
          if (this.unvisited.has(neighbor)) {
            const alt = this.distances[smallestVertex] + neighbors[neighbor];
            if (alt < this.distances[neighbor]) {
              this.distances[neighbor] = alt;
              this.previousVertex[neighbor] = smallestVertex;
            }
          }
        }
        return smallestVertex
    },
    findSmallestVertex() {
      let smallest = Infinity;
      let smallestVertex = null;
      for (const vertex of this.unvisited) {
        const distance = this.distances[vertex];
        if (distance < smallest) {
          smallest = distance;
          smallestVertex = vertex;
        }
      }
      this.edgesOrder.push([this.previousVertex[smallestVertex],smallestVertex])
      return smallestVertex;
    },
    step() {
      if (this.stepIndex < this.vertices.length) {
        this.calculateShortestPath()
        this.stepIndex++;
        const nextVertex = this.findNextVertex();
        let otherDistances = '';
        for (const vertex in this.distances) {
            otherDistances+=`从A到${vertex}的距离是${this.distances[vertex]},`;
          }
        return `起始节点是:${this.startVertex},\n${otherDistances},\n${nextVertex ? '\n因此,选择'+nextVertex+'为下一个节点' : '遍历完成'}`
      }
      return '最短路径计算完成';
    },
    canStep() {
      return this.stepIndex < this.vertices.length;
    },
    getDistances() {
      return this.distances;
    },
    findNextVertex() {
      let nextVertex = null;
      let minDistance = Infinity;
      for (const vertex of this.unvisited) {
        const distance = this.distances[vertex];
        if (distance < minDistance) {
          minDistance = distance;
          nextVertex = vertex;
        }
      }
      return nextVertex;
    },
    getData() {
      return {
        vertices: this.vertices,
        adjacencyList: this.graph.adjacencyList,
        distances: this.distances,
        visited: Array.from(this.visited),
        unvisited: Array.from(this.unvisited),
        edgeOrder:this.edgesOrder,
        allEdges: this.allEdges
      };
    }
  };