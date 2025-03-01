export default {
    type: 'searching',
    initialize(array, target) {
      this.array = array;
      this.target = target;
      this.reset();

    },
    reset() {
      this.currentIndex = 0;
      this.found = false;
      this.started=false;
    },
    step() {
    this.started=true
      if (this.currentIndex < this.array.length) {
        const currentElement = this.array[this.currentIndex];
        const comment = `检查索引${this.currentIndex}的元素：${currentElement}，目标值为：${this.target}`;
        if (currentElement === this.target) {
          this.found = true;
          this.currentIndex++
          return comment + `\n找到目标值${this.target}，位置为${this.currentIndex}`;
        }
        this.currentIndex++;
        return comment + `\n未找到目标值，继续搜索`;
      } else {
        this.currentIndex++
        if (this.found) {
          return `搜索完成，目标值${this.target}已找到，位置为${this.currentIndex - 1}`;
        } else {
          return `搜索完成，目标值${this.target}未找到`;
        }
      }
    },
    canStep() {
      return this.currentIndex <= this.array.length && !this.found;
    },
    getData() {
      return {
        array: this.array,
        target: this.target,
        currentIndex: this.currentIndex-1,
        found: this.found,
        started:this.started
      };
    }
  };