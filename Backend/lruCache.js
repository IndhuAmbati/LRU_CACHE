// LRU Cache (Node backend)
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.head = new Node(-1, -1);
        this.tail = new Node(-1, -1);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.mp = new Map();
    }

    get(key) {
        if (!this.mp.has(key)) return -1;
        const node = this.mp.get(key);
        this.delete(node);
        this.insert(node);
        return node.value;
    }

    put(key, value) {
    if (this.mp.has(key)) {
        const node = this.mp.get(key);
        node.value = value;
        this.delete(node);
        this.insert(node);
    } else {
        if (this.mp.size === this.capacity) {
            const toDelete = this.tail.prev;
            this.delete(toDelete);
            this.mp.delete(toDelete.key);
        }
        const node = new Node(key, value);
        this.insert(node);
        this.mp.set(key, node);
    }
}

    delete(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    insert(node) {
        const first = this.head.next;
        node.next = first;
        node.prev = this.head;
        first.prev = node;
        this.head.next = node;
    }

    getCacheState() {
        const result = [];
        let curr = this.head.next;
        while (curr !== this.tail) {
            result.push({ key: curr.key, value: curr.value });
            curr = curr.next;
        }
        return result;
    }
}

module.exports = LRUCache;
