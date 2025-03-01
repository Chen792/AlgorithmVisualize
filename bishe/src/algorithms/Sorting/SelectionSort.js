// algorithms/SelectionSort.js
export default {
    type: 'sorting',
    initialize(array) {
      this.array = array;
      this.stepIndex = 0;
      this.minIndex = 0;
    },
    reset() {
      this.stepIndex = 0;
      this.minIndex = 0;
    },
    step() {
      const n = this.array.length;
      if (this.stepIndex < n - 1) {
        this.minIndex = this.stepIndex;
        //找最小的数对应的下标
        for (let i = this.stepIndex + 1; i < n; i++) {
          if (this.array[i] < this.array[this.minIndex]) {
            this.minIndex = i;
          }
        }
        //交换两个数
        if (this.minIndex !== this.stepIndex) {
          [this.array[this.stepIndex], this.array[this.minIndex]] = [
            this.array[this.minIndex],
            this.array[this.stepIndex]
          ];
        }
        console.log(this.stepIndex);
        this.stepIndex++;
        return `在后${this.array.length-this.stepIndex+1}个数中找最小的，为${this.array[this.stepIndex-1]},将其与${this.array[this.minIndex]}交换`;
      }
      return '本次排序结束';
    },
    canStep() {
      return this.stepIndex < this.array.length - 1;
    },
    getData() {
      return this.array;
    }
  };