export default {
    type: 'searching',
    count:0,
    initialize(array, target) {
      this.array = array;
      this.target = target;
      this.reset();
    },
    reset() {
      this.low = 0;
      this.high = this.array.length - 1;
      this.found = false;
      this.stepIndex = 1; // 用于记录当前步骤
      this.count=0;
      this.started=false
    },
    step() {
        if(this.count===0){
            //第一次点击step，先进行排序
            this.array=this.array.sort((a,b)=>a-b)
            this.count++;
            return '二分搜索适用于已经排好序的数组,因此先对数组进行排序'
        }
      if (this.low <= this.high) {
        this.started=true
        this.currentIndex = Math.floor((this.low + this.high) / 2);
        const midValue = this.array[this.currentIndex];
        const comment = `步骤${this.stepIndex}：检查索引${this.currentIndex}的元素：${midValue}，目标值为：${this.target}`;
  
        if (midValue === this.target) {
          this.found = true;
          return comment + `\n找到目标值${this.target}，位置为${this.currentIndex+1}`;
        } else if (midValue < this.target) {
          this.low = this.currentIndex + 1;
          this.stepIndex++;
          return comment + `\n${midValue}小于目标值，搜索右半部分`;
        } else {
          this.high = this.currentIndex - 1;
          this.stepIndex++;
          return comment + `\n${midValue}大于目标值，搜索左半部分`;
        }
      } else {
        if (this.found) {
          return `搜索完成，目标值${this.target}已找到，位置为${this.low - 1}`;
        } else {
          return `搜索完成，目标值${this.target}未找到`;
        }
      }
    },
    canStep() {
      return this.low <= this.high && !this.found;
    },
    getData() {
      return {
        array: this.array,
        target: this.target,
        low: this.low,
        high: this.high,
        found: this.found,
        currentIndex:this.currentIndex,
        started:this.started
      };
    }
  };