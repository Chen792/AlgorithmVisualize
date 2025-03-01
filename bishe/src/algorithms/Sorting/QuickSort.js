export default {
  type: 'sorting',
  initialize(array) {
    this.array = array;
    this.reset();
  },
  reset() {
    this.stack = [];
    this.pushToStack(0, this.array.length - 1);
  },
  step() {
    if (this.stack.length > 0) {
      const { start, end } = this.popFromStack();
      if (start < end) {
        const pivotIndex = this.partition(start, end);
        const subArray = this.array.slice(start, end + 1);
        const pivotValue = this.array[pivotIndex];
        const leftSubArray = this.array.slice(start, pivotIndex);
        const rightSubArray = this.array.slice(pivotIndex + 1, end + 1);

        this.pushToStack(start, pivotIndex - 1);
        this.pushToStack(pivotIndex + 1, end);

        return `索引${start}到${end}的数组排序，子数组为${subArray}，基准元素为${pivotValue}，划分后基准元素索引为${pivotIndex}。\n`+
        `左子数组为${leftSubArray}，右子数组为${rightSubArray}。`;
      } else {
        return `子数组索引${start}到${end}无需排序（已有序或范围无效）`;
      }
    } else {
      return '快速排序完成';
    }
  },
  canStep() {
    return this.stack.length > 0;
  },
  getData() {
    return this.array;
  },
  partition(start, end) {
    const pivot = this.array[end];
    let i = start - 1;
    for (let j = start; j < end; j++) {
      if (this.array[j] < pivot) {
        i++;
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
      }
    }
    [this.array[i + 1], this.array[end]] = [this.array[end], this.array[i + 1]];
    return i + 1;
  },
  pushToStack(start, end) {
    if (start < end) {
      this.stack.push({ start, end });
    }
  },
  popFromStack() {
    return this.stack.pop();
  }
};