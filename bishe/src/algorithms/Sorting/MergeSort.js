export default {
    type: 'sorting',
    initialize(array) {
        this.array = array;
        this.reset();
    },
    reset() {
        this.stack = [];
        this.mergeStack = [];
        this.pushToStack(0, this.array.length - 1);
    },
    step() {
        if (this.stack.length > 0) {
            const { start, end } = this.popFromStack();
            if (start < end) {
                const mid = Math.floor((start + end) / 2);
                const leftArray = this.array.slice(start, mid + 1);
                const rightArray = this.array.slice(mid + 1, end + 1);
                this.pushToStack(start, mid);
                this.pushToStack(mid + 1, end);
                this.mergeStack.push({ start, mid, end });
                return `将索引${start}到${end}的子数组分为两部分：${start}到${mid}(${leftArray})和${mid + 1}到${end}(${rightArray})`;
            } else {
                return `子数组索引${start}到${end}无需进一步分割（已是一个元素：${[this.array[start]]}）`;
            }
        } else if (this.mergeStack.length > 0) {
            const { start, mid, end } = this.mergeStack.pop();
            this.merge(start, mid, end);
            const mergedArray = this.array.slice(start, end + 1);
            return `合并索引${start}到${mid}和${mid + 1}到${end}的子数组，合并后的结果为：${mergedArray}`;
        } else {
            return '归并排序完成';
        }
    },
    canStep() {
        return this.stack.length > 0 || this.mergeStack.length > 0;
    },
    getData() {
        return this.array;
    },
    pushToStack(start, end) {
        if (start < end) {
            this.stack.push({ start, end });
        }
    },
    popFromStack() {
        return this.stack.pop();
    },
    merge(start, mid, end) {
        const left = this.array.slice(start, mid + 1);
        const right = this.array.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                this.array[k] = left[i];
                i++;
            } else {
                this.array[k] = right[j];
                j++;
            }
            k++;
        }
        while (i < left.length) {
            this.array[k] = left[i];
            i++;
            k++;
        }
        while (j < right.length) {
            this.array[k] = right[j];
            j++;
            k++;
        }
    },
    mergeStack: []
};