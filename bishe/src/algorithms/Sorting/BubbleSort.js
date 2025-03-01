export default {
    type:'sorting',
    initialize(array) {
      this.array = array;
      this.reset()
    },
    reset() {
      this.stepIndex = 0;
      this.innerLoopIndex = 0;
    },
    step() {
        const n = this.array.length;
        if (this.stepIndex < n - 1) {
          if (this.innerLoopIndex < n -this.stepIndex-1) {
            const comment = this.array[this.innerLoopIndex] < this.array[this.innerLoopIndex + 1] ?
              `由于 ${this.array[this.innerLoopIndex]} < ${this.array[this.innerLoopIndex + 1]}，所以不需要交换` :
              `由于 ${this.array[this.innerLoopIndex]} > ${this.array[this.innerLoopIndex + 1]}，所以需要交换`;
            if (this.array[this.innerLoopIndex] > this.array[this.innerLoopIndex + 1]) {
              [this.array[this.innerLoopIndex], this.array[this.innerLoopIndex + 1]] = [
                this.array[this.innerLoopIndex + 1],
                this.array[this.innerLoopIndex]
              ];
            }
            this.innerLoopIndex++;
            return comment;
          } else {
            this.stepIndex++;
            this.innerLoopIndex = 0;
            if(this.stepIndex<n-1)
            return `本趟排序结束,此时第${this.stepIndex}大的数已经确定位置,下面进行第${this.stepIndex+1}趟排序`
            else
            return '本次排序结束'
          }
        }
        return ''; // 返回空字符串表示没有注释
      },
    canStep() {
      return this.stepIndex < this.array.length - 1;
    },
    getData() {
      return this.array;
    }
  };