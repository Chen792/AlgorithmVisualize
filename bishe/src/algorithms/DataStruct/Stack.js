export default {
    type: 'datastruct',
    initialize() {
      this.maxSize = 10; // 最大栈大小
      this.reset();
    },
    reset() {
      this.array = [];
      this.count=0;
      this.baseComment='数从右侧进入从右侧弹出\n';
    },
    push(element) {
      if (this.array.length >= this.maxSize) {
        this.count=1;
        return this.baseComment+'栈已满，无法入栈';
      }
      this.count=0;
      this.array.push(element);
      return this.baseComment+`元素 ${element} 已入栈`;
    },
    pop() {
      if (this.array.length === 0) {
        this.count=-1;
        return this.baseComment+'栈为空，无法出栈';
      }
      this.count=0;
      const element = this.array.pop();
      return this.baseComment+`元素 ${element} 已出栈`;
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