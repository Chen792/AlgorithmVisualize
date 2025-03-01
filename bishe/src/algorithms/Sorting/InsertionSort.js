export default {
    type:'sorting',
    initialize(array) {
      this.array = array;
      this.reset();
    },
    reset() {
        this.stepIndex = 1;
        this.innerLoopIndex = 0;
        this.currentValue = null;
      },
    step() {
      const n = this.array.length;
      if (this.stepIndex < n) {
        this.currentValue = this.array[this.stepIndex];
        this.innerLoopIndex = this.stepIndex - 1;
  
        // 找到插入位置
        while (this.innerLoopIndex >= 0 && this.array[this.innerLoopIndex] > this.currentValue) {
          this.array[this.innerLoopIndex + 1] = this.array[this.innerLoopIndex];
          this.innerLoopIndex--;
        }
  
        // 插入当前值
        this.array[this.innerLoopIndex + 1] = this.currentValue;
  
        // 准备下一步
        this.stepIndex++;
  
        // 返回注释
        return `前${this.stepIndex-1}个数已经排好序，现将 ${this.currentValue} 插入到正确的位置,此时前${this.stepIndex}个数有序`;
      }
      return '本次排序结束';
    },
    canStep() {
      return this.stepIndex < this.array.length;
    },
    getData() {
      return this.array;
    }
  };