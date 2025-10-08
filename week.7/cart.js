export class Cart {
  constructor() {
    this.items = [];
  }

  add(book) {
    this.items.push(book);
  }

  remove(index) {
    this.items.splice(index, 1);
  }

  getTotal() {
    return this.items.reduce((sum, b) => sum + b.price, 0);
  }
}
