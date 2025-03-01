<template>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1', '2', '3','4']">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-sort"></i>排序算法</template>
        <el-menu-item-group>
          <el-menu-item index="1-1" @click="goToAlgorithm('BubbleSort')">冒泡排序</el-menu-item>
          <el-menu-item index="1-2" @click="goToAlgorithm('QuickSort')">快速排序</el-menu-item>
          <el-menu-item index="1-3" @click="goToAlgorithm('MergeSort')">归并排序</el-menu-item>
          <el-menu-item index="1-4" @click="goToAlgorithm('InsertionSort')">插入排序</el-menu-item>
          <el-menu-item index="1-5" @click="goToAlgorithm('SelectionSort')">选择排序</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-search"></i>搜索算法</template>
        <el-menu-item-group>
          <el-menu-item index="2-1" @click="goToAlgorithm('LinearSearch')">顺序搜索</el-menu-item>
          <el-menu-item index="2-2" @click="goToAlgorithm('BinarySearch')">二分搜索</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-picture"></i>图相关算法</template>
        <el-menu-item-group>
          <el-menu-item index="3-1" @click="goToAlgorithm('DFS')">深度优先搜索</el-menu-item>
          <el-menu-item index="3-2" @click="goToAlgorithm('BFS')">广度优先搜索</el-menu-item>
          <el-menu-item index="3-3" @click="goToAlgorithm('PrimMST')">最小生成树 (Prim)</el-menu-item>
          <el-menu-item index="3-4" @click="goToAlgorithm('Dijkstra')">最短路径 (Dijkstra)</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title"><i class="el-icon-s-data"></i>数据结构</template>
        <el-menu-item-group>
          <el-menu-item index="4-1" @click="goToAlgorithm('Queue')">队列</el-menu-item>
          <el-menu-item index="4-2" @click="goToAlgorithm('Stack')">栈</el-menu-item>
          <el-menu-item index="4-3" @click="goToAlgorithm('Tree')">树</el-menu-item>
          <el-menu-item index="4-4" @click="goToAlgorithm('Graph')">图</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  methods: {
    goToAlgorithm(algorithmName) {
      this.$router.push({ path: `/main/algorithm/${algorithmName}` }).catch(()=>{
        this.$router.go(0)
      });
    }
  }
};
</script>