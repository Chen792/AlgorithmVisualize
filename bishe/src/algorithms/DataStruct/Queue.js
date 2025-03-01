export default {
    type: 'datastruct',
    initialize() {
      this.maxSize = 10; // 最大队列大小
      this.reset();
    },
    reset() {
      this.array = [];
      this.count=0;
      this.baseComment='数从右侧进入从左侧弹出\n';
    },
    push(element) {
      if (this.array.length >= this.maxSize) {
        this.count=1;
        return this.baseComment+'队列已满，无法入队';
      }
      this.count=0;
      this.array.push(element);
      return this.baseComment+`元素 ${element} 已入队`;
    },
    pop() {
      if (this.array.length === 0) {
        this.count=-1;
        return this.baseComment+'队列为空，无法出队';
      }
      this.count=0;
      const element = this.array.shift();
      return this.baseComment+`元素 ${element} 已出队`;
    },
    isFull() {
      return this.array.length === this.maxSize && this.count===1;
    },
    isEmpty() {
      return this.array.length === 0 && this.count===-1;
    },
    getData() {
      return this.array;
    }
  };