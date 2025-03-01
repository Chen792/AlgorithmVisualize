
<template>
  <div>
    <h3>{{ algorithmName }} Visualization</h3>
    <div v-if="algorithm.type === 'sorting' || algorithm.type === 'searching' || algorithm.type==='graphAlgo' || algorithm.type==='graphMin'">
      <button @click="stepAlgorithm" :disabled="!canStep">下一步</button>
    </div>
    <div v-else-if="algorithm.type === 'datastruct'">
      <button @click="pushElement" :disabled="isFull">入队/入栈</button>
      <button @click="popElement" :disabled="isEmpty">出队/出栈</button>
    </div>
    <div v-else-if="algorithm.type==='tree'">
      <button @click="addNode">添加节点</button>
    </div>
    <div class="fatherDiv">
      <div ref="chartContainer" class="leftDiv" style="height: 350px;"></div>
      <div ref="textContainer" class="rightDiv"> {{ AlgoBrief }} </div>
    </div>
  </div>
</template>

<script>
import bus from '../bus.js'
import * as d3 from 'd3';
import { algorithms } from '@/algorithms/index.js';
import axios from 'axios'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      algorithmName: this.$route.params.algorithmName,
      array: [5, 3, 8, 4, 2, 1, 6],
      canStep: true,
      canEnqueue: true,
      canDequeue: true,
      algorithm: null,
      comment: '',
      algorithmText: '',
      nextElement: 0, // 用于存储下一个要入队/入栈的元素
      isFull:false,
      isEmpty:true,
      traversalOrder: [], // 存储遍历顺序
      edgesOrder:[],
      currentStep: -1, // 当前步骤
      minSpanningTree:[],
      activeEdges:[],
      AlgoBrief:''
    };
  },
  computed:{
    ...mapState(['userInfo'])
  },
  methods: {
    //初始化算法
    
    async initializeAlgorithm() {
      this.array=[5,3,8,4,2,1,6]
      this.comment=''
      this.nextElement = 0
      this.algorithm = algorithms[this.algorithmName];
      this.canStep=true;
      this.isEmpty = true;
      this.isFull = false;
      this.traversalOrder = []; // 重置遍历顺序
      this.edgesOrder=[];
      this.currentStep = -1; // 重置当前步骤
      this.visitedNodes = new Set(); // 重置已访问节点
      bus.$emit('algoName',this.algorithmName)
      if (this.algorithm) {
        if (this.algorithm.type === 'sorting') {
          this.array = [5, 3, 8, 4, 2, 1, 6 ]; // 初始化排序算法的数组
          this.comment='';
        } else if (this.algorithm.type === 'searching') {
          this.array = [5, 3, 8, 4, 2, 1, 6 ]; // 初始化搜索算法的数组
          this.comment='';
        } else if (this.algorithm.type === 'graph') {//初始化图相关算法
          this.array = []; 
        } else if(this.algorithm.type === 'datastruct'){//初始化数据结构的算法
          this.array = [5, 3, 8, 4, 2, 1, 6 ]; // 初始化数据结构的数组
          this.comment='';
        } else if(this.algorithm.type === 'tree'){
          this.comment='';
        }
        await axios({
          url:'http://localhost:3000/algorithm',
          params:{
            algoname:this.algorithmName
          }
        }).then(res=>{
          this.AlgoBrief = res.data
        })
        .catch(err=>{
          console.log(err);
        })
        this.algorithm.initialize(this.array,2);
        this.algorithm.reset();
        this.updateVisualization();
      } else {
        console.error(`Algorithm ${this.algorithmName} not found`);
      }
    },
    //队列/栈 加入元素
    pushElement() {
      const comment = this.algorithm.push(this.nextElement);
      this.isFull = this.algorithm.isFull();
      this.isEmpty = this.algorithm.isEmpty();
      this.comment = comment;
      this.nextElement++;
      this.updateVisualization();
    },
    //队列/栈 删除元素
    popElement() {
      const comment = this.algorithm.pop();
      this.isEmpty = this.algorithm.isEmpty();
      this.isFull = this.algorithm.isFull()
      this.comment = comment;
      this.updateVisualization();
    },
    //算法进行一步
    stepAlgorithm() {
      if (this.algorithm && this.algorithm.step) {
        this.comment = this.algorithm.step();
        this.currentStep++;
        this.updateVisualization();
        this.canStep = this.algorithm.canStep();

      }
    },
    //更新页面(总)+规定画布范围
    updateVisualization() {
      const container = d3.select(this.$refs.chartContainer);
      let svg = container.select('svg');

      if (!svg.node()) {
        svg = container.append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', '0 0 800 600')
          .attr('preserveAspectRatio', 'xMinYMax meet');
      }

      if (this.algorithm.type === 'sorting') {
        this.updateSortingVisualization(svg);
      } else if (this.algorithm.type === 'searching') {
        this.updateSearchingVisualization(svg);
      } else if (this.algorithm.type === 'graph') {
        this.updateGraphVisualization(svg);
      } else if(this.algorithm.type === 'datastruct') {
        this.updateDataStructVisualization(svg)
      } else if(this.algorithm.type === 'tree'){
        this.updateTreeVisualization(svg)
      } else if(this.algorithm.type==='graphAlgo'){
        this.updateGraphAlgoVisualization(svg)
      }
    },
    //排序算法更新页面
    updateSortingVisualization(svg) {
    const data = this.algorithm.getData();
    const bars = svg.selectAll('rect').data(data);

    const barWidth = 120; // 逐步减小柱子宽度
    const spacing = 150; // 逐步减小柱子间距

    bars.enter().append('rect')
        .attr('x', (_, i) => i * spacing)
        .attr('y', 400)
        .attr('width', barWidth)
        .attr('height', 0)
        .attr('fill', 'steelblue')
        .attr('y', (d) => 600 - d * 60) // 逐步减小高度系数
        .attr('height', (d) => d * 60);

    bars.attr('x', (d, i) => i * spacing)
        .attr('y', (d) => 600 - d * 60)
        .attr('width', barWidth)
        .attr('height', (d) => d * 60)
        .attr('fill', 'steelblue');

    bars.exit().remove();

    const labels = svg.selectAll('text').data(data);

    const labelsEnter = labels.enter().append('text')
        .attr('x', (d, i) => i * spacing + barWidth / 2)
        .attr('y', (d) => 600 - d * 60 - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '24px') // 逐步减小字体大小
        .attr('fill', 'black')
        .text((d) => d);

    labels.merge(labelsEnter)
        .attr('x', (d, i) => i * spacing + barWidth / 2)
        .attr('y', (d) => 600 - d * 60 - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '24px')
        .attr('fill', 'black')
        .text((d) => d);

    labels.exit().remove();

    const commentText = svg.selectAll('text.comment').data([this.comment]);

    // 进入选择集
    const textEnter = commentText.enter().append('text')
        .attr('class', 'comment')
        .attr('x', 700)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .attr('font-size', '25px')
        .attr('fill', 'red');

    // 合并进入和更新选择集
    const textMerge = commentText.merge(textEnter);

    // 移除旧的 tspan 元素
    textMerge.selectAll('tspan').remove();

    // 分割字符串并创建 tspan 元素
    const lines = this.comment.split('\n');
    lines.forEach((line, index) => {
      textMerge.append('tspan')
          .attr('x', 700)
          .attr('dy', index * 30) // 使用 dy 属性来递增 y 坐标
          .text(line);
    });

    // 退出选择集
    commentText.exit().remove();
    },
    //搜索算法更新页面
    updateSearchingVisualization(svg) {
      // 实现搜索算法的可视化
      const data = this.algorithm.getData();
      const bars = svg.selectAll('rect').data(data.array);

      const barWidth = 120; // 逐步减小柱子宽度
      const spacing = 150; // 逐步减小柱子间距

      bars.enter().append('rect')
        .attr('x', (_, i) => i * spacing)
        .attr('y', 400)
        .attr('width', barWidth)
        .attr('height', 0)
        .attr('fill', 'steelblue')
        .attr('y', (d) => 600 - d * 60) // 逐步减小高度系数
        .attr('height', (d) => d * 60);

      bars.attr('x', (d, i) => i * spacing)
        .attr('y', (d) => 600 - d * 60)
        .attr('width', barWidth)
        .attr('height', (d) => d * 60)
        .attr('fill', (d, i) => data.started && i === data.currentIndex ? 'red' : 'steelblue');

      bars.exit().remove();

      const labels = svg.selectAll('text').data(data.array);

      const labelsEnter = labels.enter().append('text')
        .attr('x', (d, i) => i * spacing + barWidth / 2)
        .attr('y', (d) => 600 - d * 60 - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '24px') // 逐步减小字体大小
        .attr('fill', 'black')
        .text((d) => d);

      labels.merge(labelsEnter)
        .attr('x', (d, i) => i * spacing + barWidth / 2)
        .attr('y', (d) => 600 - d * 60 - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '24px')
        .attr('fill', 'black')
        .text((d) => d);

      labels.exit().remove();

      const commentText = svg.selectAll('text.comment').data([this.comment]);
      const textEnter = commentText.enter().append('text')
    .attr('class', 'comment')
    .attr('x', 700)
    .attr('y', 60)
    .attr('text-anchor', 'middle')
    .attr('font-size', '25px')
    .attr('fill', 'red');

    // 合并进入和更新选择集
    const textMerge = commentText.merge(textEnter);

    // 移除旧的 tspan 元素
    textMerge.selectAll('tspan').remove();

    // 分割字符串并创建 tspan 元素
    const lines = this.comment.split('\n');
    lines.forEach((line, index) => {
      textMerge.append('tspan')
          .attr('x', 700)
          .attr('dy', index * 30) // 使用 dy 属性来递增 y 坐标
          .text(line);
    });

    // 退出选择集
    commentText.exit().remove();
    },
    //图数据结构展示页面
    updateGraphVisualization(svg) {
      let data = this.algorithm.getData();
      this.updateIsDirectedGraph(svg,data,false)//画一个无向图
      this.algorithm.changeDirection();
      this.algorithm.reset()
      data=this.algorithm.getData();
      this.updateIsDirectedGraph(svg,data,true) //画一个有向图
    },
    //画有向图，画无向图
    updateIsDirectedGraph(svg,data,isDirected){
      //isDirected为真，画有向图
      //isDirected为假，画无向图
      const vertices = data.vertices;
      const edges = data.edges;
      const adjacencyMatrix = data.adjacencyMatrix;
      const adjacencyList = data.adjacencyList;
      const dy = isDirected ? 1 : 0;
      // 清除之前的 SVG 内容
      // svg.selectAll('*').remove();

      // 设置图的布局参数
      const width = 800;
      const height = 600;
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const graphWidth = width - margin.left - margin.right;
      const graphHeight = height - margin.top - margin.bottom;

      // 静态布局：将节点均匀分布在圆周上
      const centerX = graphWidth / 4;
      const centerY = graphHeight / 4+dy*300;
      const radius = Math.min(graphWidth, graphHeight) / 2 - 175;
      const angleStep = (2 * Math.PI) / vertices.length;

      const nodes = vertices.map((vertex, index) => ({
        id: vertex,
        x: centerX + radius * Math.cos(angleStep * index),
        y: centerY + radius * Math.sin(angleStep * index)
      }));

      //设计箭头
      svg.append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10') // 定义箭头的大小
      .attr('refX', 30) // 箭头的参考点（末端）
      .attr('refY', 0)
      .attr('orient', 'auto') // 自动调整方向
      .attr('markerWidth', 10) // 箭头的宽度
      .attr('markerHeight', 10) // 箭头的高度
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5') // 箭头的路径
      .attr('fill', 'black')

      // 绘制边
      const link = svg.append('g')
        .selectAll('line')
        .data(edges)
        .enter().append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('x1', d => nodes.find(n => n.id === d[0]).x)
        .attr('y1', d => nodes.find(n => n.id === d[0]).y)
        .attr('x2', d => nodes.find(n => n.id === d[1]).x)
        .attr('y2', d => nodes.find(n => n.id === d[1]).y);
      if(isDirected){
        //如果是有向图，每条边要加箭头
        link.attr('marker-end','url(#arrow)')
      }
      link.exit().remove()
      // 绘制节点
      const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 20)
        .attr('fill', 'steelblue')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
        node.exit().remove()

      // 添加节点标签
      const label = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .text(d => d.id);
        label.exit().remove()

      // 邻接矩阵可视化
      const matrixSvg = svg.append('g')
        .attr('transform', `translate(${width - 200}, 10)`);

      const matrixCellSize = 30;
      const matrixPadding = 5;

      matrixSvg.selectAll('rect')
        .data(adjacencyMatrix.flat())
        .enter().append('rect')
        .attr('x', (d, i) => (i % adjacencyMatrix.length) * (matrixCellSize + matrixPadding))
        .attr('y', (d, i) => Math.floor(i / adjacencyMatrix.length) * (matrixCellSize + matrixPadding)+50+dy*300)
        .attr('width', matrixCellSize)
        .attr('height', matrixCellSize)
        .attr('fill', d => d ? 'lightblue' : 'white')
        .attr('stroke', 'black');

      matrixSvg.selectAll('text')
        .data(adjacencyMatrix.flat())
        .enter().append('text')
        .attr('x', (d, i) => (i % adjacencyMatrix.length) * (matrixCellSize + matrixPadding) + matrixCellSize / 2)
        .attr('y', (d, i) => Math.floor(i / adjacencyMatrix.length) * (matrixCellSize + matrixPadding) + matrixCellSize / 2+50+dy*300)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(d => d);

      // 邻接表可视化
      const listSvg = svg.append('g')
        .attr('transform', `translate(${width+100}, ${height-600})`);

      const listCellSize = 30;
      const listPadding = 10;

      Object.keys(adjacencyList).forEach((vertex, index) => {
        listSvg.append('text')
          .attr('x', 0)
          .attr('y', index * (listCellSize + listPadding) + listCellSize / 2+50 + dy*300)
          .attr('text-anchor', 'start')
          .attr('font-size', '14px')
          .text(vertex);

        adjacencyList[vertex].forEach((edge, edgeIndex) => {
          listSvg.append('rect')
            .attr('x', 50 + edgeIndex * (listCellSize + listPadding))
            .attr('y', index * (listCellSize + listPadding)+50+300*dy)
            .attr('width', listCellSize)
            .attr('height', listCellSize)
            .attr('fill', 'lightblue')
            .attr('stroke', 'black');

          listSvg.append('text')
            .attr('x', 50 + edgeIndex * (listCellSize + listPadding) + listCellSize / 2)
            .attr('y', index * (listCellSize + listPadding) + listCellSize / 2+50 + dy*300)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(edge.vertex);
            });
          });
    },
    //实现BFS,DFS的更新
    updateGraphAlgoVisualization(svg){
      const data = this.algorithm.getData();
      const vertices = Object.keys(data.adjacencyList);
      this.edgesOrder= data.edgeOrder
      this.traversalOrder = data.traversalOrder;
      const width = 800;
      const height = 600;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3;
      console.log('egs',this.edgesOrder);
      const nodes = vertices.map((vertex, index) => ({
        id: vertex,
        x: centerX + radius * Math.cos((2 * Math.PI / vertices.length) * index)-40,
        y: centerY + radius * Math.sin((2 * Math.PI / vertices.length) * index)+40
      }));
      svg.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 30)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'black');

      // 绘制边
      const links = svg.selectAll('line')
      .data(data.allEdges, d => {
        d.join('-')
      }) // 使用边的字符串表示作为键值
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('x1', d => nodes.find(n => n.id === d[0]).x)
      .attr('y1', d => nodes.find(n => n.id === d[0]).y)
      .attr('x2', d => nodes.find(n => n.id === d[1]).x)
      .attr('y2', d => nodes.find(n => n.id === d[1]).y)
      .merge(svg.selectAll('line'));
      // 更新边的颜色
      if (this.algorithmName==='BFS'||this.algorithmName==='DFS')
      links.attr('stroke', d => {
        //d->每一条边
        if (this.currentStep >= 0 && this.currentStep < this.traversalOrder.length) {
          if (this.edgesOrder[this.nextElement-2]) {
            if (this.edgesOrder[this.nextElement-2][0]===d[0] && this.edgesOrder[this.nextElement-2][1]===d[1]) {
              return 'red'; // 当前访问的边用红色高亮
            }        
          }
        }
        return 'black'; // 其他边保持默认颜色
      })
      .attr('marker-end', 'url(#arrow)');
      else if(this.algorithmName==='PrimMST'){
        this.minSpanningTree=data.minSpanningTree;
        this.activeEdges = data.activeEdges;
        links.attr('stroke', d => {
          // d -> 每一条边
          if (this.minSpanningTree.some(edge => (edge[0] === d[0] && edge[1] === d[1]) || (edge[1] === d[0] && edge[0] === d[1]))) {
            return 'red'; // 最小生成树的边用红色高亮
          } else if (this.activeEdges.some(edge => edge[0] === d[0] && edge[1] === d[1])) {
            return 'blue'; // 当前激活的边用蓝色高亮
          }
          return 'black'; // 其他边保持默认颜色
        });
        svg.selectAll('text.edge-weight')
        .data(data.allEdges)
        .enter()
        .append('text')
        .attr('x', d => (nodes.find(n => n.id === d[0]).x + nodes.find(n => n.id === d[1]).x) / 2-5)
        .attr('y', d => (nodes.find(n => n.id === d[0]).y + nodes.find(n => n.id === d[1]).y) / 2)
        .attr('dy', '-.25em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', 'black')
        .text(d => {
          const edge = data.adjacencyList[d[0]][d[1]];
          return edge ? edge : '';
        });

      }
      else if(this.algorithmName === 'Dijkstra'){
        const uniqueEdges = Array.from(data.allEdges).filter((edge, index, self) => self.indexOf(edge) === index);
        links.attr('stroke', d=>{
          console.log('edges',this.edgesOrder);
          console.log('d is',[d[0],d[1]]);
          if (this.edgesOrder && (this.edgesOrder.some(edge => (edge[0] === d[0] && edge[1] === d[1]) || (edge[1] === d[0] && edge[0] === d[1])))) {
            return 'red'
          }
          return 'black'
        });
        svg.selectAll('text.edge-weight')
        .data(uniqueEdges)
        .enter()
        .append('text')
        .attr('x', d => {
          const x1 = nodes.find(n => n.id === d[0]).x
          const x2 = nodes.find(n => n.id === d[1]).x
          let x = (x1+x2)/2-5;
          if (d[0]==='B'&&d[1]==='E' || d[0]==='E'&&d[1]==='B') {
            x-=60
          }
          else if(d[0]==='C'&&d[1]==='D' ||d[0]==='D'&&d[1]==='C'){
            x+=60
          }
          return x
        })
        .attr('y', d => {
          const y1 = nodes.find(n => n.id === d[0]).y
          const y2 = nodes.find(n => n.id === d[1]).y
          let y = (y1+y2)/2;
          if (d[0]==='B'&&d[1]==='E' || d[0]==='E'&&d[1]==='B' || d[0]==='C'&&d[1]==='D' ||d[0]==='D'&&d[1]==='C') {
            y-=80
          }
          return y
        })
        .attr('dy', '-.25em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', 'black')
        .text(d => {
          const edge = data.adjacencyList[d[0]][d[1]];
          return edge ? edge : '';
        });
      }
      this.nextElement++;
      // 绘制节点
      svg.selectAll('circle')
    .data(nodes, d => d.id) // 使用节点的 id 作为键值
    .enter()
    .append('circle')
    .attr('r', 20)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .merge(svg.selectAll('circle')) // 合并新节点和旧节点
    .attr('fill', d => {
      if (this.currentStep >= 0 && this.traversalOrder && this.traversalOrder[this.currentStep] === d.id) {
        return 'green'; // 当前访问的节点用绿色
      } else if (data.visited.includes(d.id)) {
        return 'red'; // 已访问的节点用红色
      } else {
        return 'steelblue'; // 未访问的节点用默认颜色
      }
    });

      // 添加节点标签
      svg.selectAll('text.node-label')
        .data(nodes)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', 'white')
        .text(d => d.id);


      const commentText = svg.selectAll('text.comment').data([this.comment]);

      // 进入选择集
      const textEnter = commentText.enter().append('text')
          .attr('class', 'comment')
          .attr('x', 700)
          .attr('y', 60)
          .attr('text-anchor', 'middle')
          .attr('font-size', '25px')
          .attr('fill', 'red');

      // 合并进入和更新选择集
      const textMerge = commentText.merge(textEnter);

      // 移除旧的 tspan 元素
      textMerge.selectAll('tspan').remove();

      // 分割字符串并创建 tspan 元素
      const lines = this.comment.split('\n');
      lines.forEach((line, index) => {
        textMerge.append('tspan')
            .attr('x', 700)
            .attr('dy', index * 30) // 使用 dy 属性来递增 y 坐标
            .text(line);
      });

      // 退出选择集
      commentText.exit().remove();
    },
    //更新队列和栈的页面
    updateDataStructVisualization(svg) {
      const data = this.algorithm.getData();
      const barWidth = 100; // 每个方块的宽度
      const barHeight = 100; // 每个方块的高度
      const startX = 50; // 起始 X 坐标
      const startY = 200; // 起始 Y 坐标

      // 根据算法类型选择动画方向
      const isQueue = this.algorithmName === 'Queue';
      const animationDirection = isQueue ? -1 : 1; // 队列：从右到左 (-1)，栈：从左到右 (1)

      // 计算初始位置和最终位置
      const initialX = () => {
          return 4*startX + data.length * barWidth;
        };

      const finalX = (i) => startX + i * barWidth;

      // 绘制方块
      const bars = svg.selectAll('rect').data(data, (d) => d);
      const barsEnter = bars.enter().append('rect')
        .attr('x', (d, i) => initialX(i)) // 初始位置
        .attr('y', startY)
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

      // 合并进入和更新选择集
      bars.merge(barsEnter)
        .transition()
        .duration(500)
        .attr('x', (d, i) => finalX(i)); // 最终位置

      bars.exit().transition()
        .duration(500)
        .attr('x', (d, i) => (initialX(i) + barWidth / 2)*animationDirection) // 退出时的动画方向
        .remove();

      // 绘制方块上的文本
      const labels = svg.selectAll('text.label').data(data, (d) => d);
      const labelsEnter = labels.enter().append('text')
        .attr('class', 'label')
        .attr('x', (d, i) => initialX(i) + barWidth / 2) // 初始位置
        .attr('y', startY + barHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '20px')
        .attr('fill', 'white')
        .text((d) => d);

      // 合并进入和更新选择集
      labels.merge(labelsEnter)
        .transition()
        .duration(500)
        .attr('x', (d, i) => finalX(i) + barWidth / 2); // 最终位置

      labels.exit().transition()
        .duration(500)
        .attr('x', (d, i) => (initialX(i) + barWidth)*animationDirection) // 退出时的动画方向
        .remove();

      // 更新评论文本
      const commentText = svg.selectAll('text.comment').data([this.comment]);
      const textEnter = commentText.enter().append('text')
        .attr('class', 'comment')
        .attr('x', 700)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .attr('font-size', '25px')
        .attr('fill', 'red');

      const textMerge = commentText.merge(textEnter);
      textMerge.selectAll('tspan').remove();

      // 分割字符串并创建 tspan 元素
      const lines = this.comment.split('\n');
      lines.forEach((line, index) => {
        textMerge.append('tspan')
            .attr('x', 700)
            .attr('dy', index * 30) // 使用 dy 属性来递增 y 坐标
            .text(line);
      });
      commentText.exit().remove();
    },
    //树添加一个节点
    addNode() {
        // 添加节点到树中
        const value = this.nextElement; // 使用 nextElement 作为节点值
        const comment = this.algorithm.addNode(value);
        this.comment = comment;
        this.nextElement++; // 准备下一个节点值
        this.updateVisualization();
    },
    //树转变格式
    convertToD3Format(node) {
    if (!node) return null;
    const newNode = {
        value: node.value,
        children: []
    };
    if (node.left) {
        newNode.children.push(this.convertToD3Format(node.left));
    }
    if (node.right) {
        newNode.children.push(this.convertToD3Format(node.right));
    }
    return newNode;
    },
    //树更新页面
    updateTreeVisualization(svg){
      const data = this.algorithm.getData();
      if(data===null)
        return ;
      const convertedData = this.convertToD3Format(data);

      // 设置树布局的大小
      const tree = d3.tree().size([600, 400]); // 高度 600，宽度 400
      const root = d3.hierarchy(convertedData);

      // 计算树布局
      tree(root);

      // 调整根节点位置
      const rootX = 350; // 根节点的水平位置
      const rootY = 50;  // 根节点的垂直位置
      const offsetX = rootX - root.x;
      const offsetY = rootY - root.y;

      // 更新所有节点的位置
      root.each(node => {
          node.x += offsetX;
          node.y += offsetY;
      });

      // 获取节点和连接线数据
      const nodes = root.descendants();
      const links = root.links();

      // 清除之前的 SVG 内容
      svg.selectAll('*').remove();

      // 绘制连接线
      const link = svg.selectAll('path.link')
          .data(links, d => d.target.id); // 使用 target.id 作为 key

      // Enter 阶段：添加新的连接线
      link.enter().append('path')
          .attr('class', 'link')
          .attr('fill', 'none')
          .attr('stroke', '#ccc')
          .attr('stroke-width', 2)
          .attr('d', d => {
              const source = { x: d.source.x, y: d.source.y };
              const target = { x: d.target.x, y: d.target.y };
              return `M${source.x},${source.y}L${target.x},${target.y}`;
          });

      // Update 阶段：更新现有连接线
      link.attr('d', d => {
          const source = { x: d.source.x, y: d.source.y };
          const target = { x: d.target.x, y: d.target.y };
          return `M${source.x},${source.y}L${target.x},${target.y}`;
      });

      // Exit 阶段：移除多余的连接线
      link.exit().remove();

      // 绘制节点
      const node = svg.selectAll('g.node')
          .data(nodes, d => d.id); // 使用节点的 id 作为 key

      // Enter 阶段：添加新的节点
      const nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr('transform', d => `translate(${d.x},${d.y})`);

      nodeEnter.append('circle')
          .attr('r', 30) // 增大节点大小
          .attr('fill', 'steelblue');

      nodeEnter.append('text')
          .attr('y', 15) // 调整文本位置
          .attr('text-anchor', 'middle')
          .attr('font-size', '16px') // 调整字体大小
          .text(d => d.data.value);

      // Update 阶段：更新现有节点
      node.merge(nodeEnter).transition().duration(500)
          .attr('transform', d => `translate(${d.x},${d.y})`);

      // Exit 阶段：移除多余的节点
      node.exit().remove();

      // 更新评论文本
      const commentText = svg.selectAll('text.comment').data([this.comment]);
      const textEnter = commentText.enter().append('text')
          .attr('class', 'comment')
          .attr('x', this.algorithm.type==='tree'?700:1000)
          .attr('y', 60)
          .attr('text-anchor', 'middle')
          .attr('font-size', '25px')
          .attr('fill', 'red');

      const textMerge = commentText.merge(textEnter);
      textMerge.selectAll('tspan').remove();

      // 分割字符串并创建 tspan 元素
      const lines = this.comment.split('\n');
      lines.forEach((line, index) => {
          textMerge.append('tspan')
              .attr('x', 700)
              .attr('dy', index * 30) // 使用 dy 属性来递增 y 坐标
              .text(line);
      });

      commentText.exit().remove();
    }
  },
  mounted() {
    //挂载完毕后马上初始化一次
    this.initializeAlgorithm();
  },
  watch: {
    '$route.params.algorithmName': {
      immediate: true,
      handler(newAlgorithmName) {
        this.algorithmName = newAlgorithmName;
        this.comment='';
        const container = d3.select(this.$refs.chartContainer);
        let svg = container.select('svg');
        //清空当前页面所有可能存在的元素，重新初始化
        svg.selectAll('*').remove();
        svg.selectAll('text').remove();
        // svg.selectAll('g').remove();
        // svg.selectAll('path.link').remove();
        this.initializeAlgorithm();
      }
    }
  },
};
</script>

<style>
.fatherDiv {
  display: flex;
  justify-content: center;
  flex-direction: row;
}
.leftDiv {
  flex: 2;
}
.rightDiv {
  flex: 1;
  margin-right:50px;
  max-height:360px;
  overflow-y: auto;
  margin-bottom: 10px;
}
</style>