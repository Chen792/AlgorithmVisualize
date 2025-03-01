export default {
    type: 'tree',
    initialize() {
        this.reset()
        this.baseComment = '二叉树结构，节点按层次顺序自动添加\n';
    },
    reset() {
        this.root = null;
        this.nextNodeId = 1;
    },
    addNode(value) {
        const newNode = {
            id: this.nextNodeId++,
            value: value,
            left: null,
            right: null
        };

        if (!this.root) {
            // 如果树为空，直接添加根节点
            this.root = newNode;
            return this.baseComment + `根节点 ${value} 已添加`;
        }

        // 按层次顺序找到第一个可以添加子节点的位置
        const queue = [this.root];
        while (queue.length > 0) {
            const current = queue.shift();
            if (!current.left) {
                current.left = newNode;
                return this.baseComment + `节点 ${value} 已添加到父节点 ${current.value} 的左子节点`;
            } else if (!current.right) {
                current.right = newNode;
                return this.baseComment + `节点 ${value} 已添加到父节点 ${current.value} 的右子节点`;
            } else {
                // 如果当前节点已满，将其子节点加入队列
                queue.push(current.left);
                queue.push(current.right);
            }
        }
    },
    getData() {
        // 序列化树结构为 JSON 格式
        return this.serialize(this.root);
    },
    serialize(node) {
        // 递归序列化树结构
        if (!node) return null;
        return {
            id: node.id,
            value: node.value,
            left: this.serialize(node.left),
            right: this.serialize(node.right)
        };
    }
};