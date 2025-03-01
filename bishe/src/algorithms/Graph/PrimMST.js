export default {
    type: 'graphAlgo',
    initialize() {
      this.graph = {
        adjacencyList: {
            A: { B: 1, C: 4 },
            B: { A: 1, D: 2 },
            C: { A: 4, D: 3, E: 5 },
            D: { B: 2, C: 3, E: 6 },
            E: { C: 5, D: 6 }
        }
      };
      this.visited=new Set();
      this.allEdges = this.getAllEdges();
      this.minSpanningTree = []; // 存储最小生成树的边
      this.activeEdges = []; // 存储当前激活的边
      this.stepIndex = 0;
      this.totalWeight = 0;
      this.mstEdgesOrder = []; // 存储最小生成树边的访问序列
      this.reset();
      this.vertices = Object.keys(this.graph.adjacencyList)
    },
    getAllEdges() {
        let edges = [];
       for (let start in this.graph.adjacencyList) {
            const allEnd = Object.entries(this.graph.adjacencyList[start]);
            allEnd.forEach(allend=>{
                edges.push([start,allend[0]])
            })   
       }
        return edges;
      },
    reset() {
        this.visited = new Set();
        this.selectedVertices = new Set();
        this.minSpanningTree = [];
        this.activeEdges = [];
        this.stepIndex = 0;
        this.totalWeight = 0;
        this.mstEdgesOrder = [];
        this.selectedVertices.add('A'); // 从顶点A开始
    },
    step() {
        if (this.stepIndex < this.vertices.length - 1) {
          const minEdge = this.findMinEdge();
          if (minEdge) {
            this.activeEdges.push(minEdge); // 激活当前边
            this.minSpanningTree.push(minEdge); // 添加到最小生成树
            this.totalWeight += minEdge.weight;
            this.selectedVertices.add(minEdge[1]);
            this.mstEdgesOrder.push(minEdge); // 记录最小生成树边的访问序列
            this.stepIndex++;
            this.visited.add(minEdge[0]);
            this.visited.add(minEdge[1]);
      
            // 返回详细的信息
            return `步骤 ${this.stepIndex}: 选择边 ${minEdge[0]} - ${minEdge[1]}，权重 ${minEdge[2]}。\n` +
                   `当前最小生成树包含的边：${this.minSpanningTree.map(e => `${e[0]} - ${e[1]}`).join(', ')}。\n` +
                   `当前已访问的节点：${Array.from(this.visited).join(', ')}。`;
          }
        } else {
          this.stepIndex++;
          return '最小生成树构建完成';
        }
        return '找不到更多的边';
      },
    canStep() {
      return this.stepIndex < this.vertices.length
    },
    findMinEdge() {
      let minEdge = null;
      let minWeight = Infinity;
  
      for (const [startVertex, neighbors] of Object.entries(this.graph.adjacencyList)) {
        if (this.selectedVertices.has(startVertex)) {
          for (const [endVertex, weight] of Object.entries(neighbors)) {
            if (!this.selectedVertices.has(endVertex) && weight < minWeight) {
              minEdge = [startVertex, endVertex, weight];
              minWeight = weight;
            }
          }
        }
      }
  
      return minEdge;
    },
    getData() {
      return {
        allEdges: this.allEdges,
        adjacencyList: this.graph.adjacencyList,
        minSpanningTree: this.minSpanningTree,
        activeEdges: this.activeEdges,
        totalWeight: this.totalWeight,
        edgeOrder: this.mstEdgesOrder, // 返回最小生成树边的访问序列
        visited: Array.from(this.visited)
      };
    }
  };