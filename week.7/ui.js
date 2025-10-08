export class UI {
  constructor(cart) {
    this.cart = cart;
    this.bookGrid = document.getElementById("bookGrid");
    this.cartItemsDiv = document.getElementById("cartItems");
    this.cartTotalDiv = document.getElementById("cartTotal");
  }

  displayBook(book, index) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div>
        <h3>${book.title}</h3>
        <small>by ${book.author}</small>
        <span>₹${book.price}</span>
      </div>
      <div>
        ${book.availability === "in stock" 
          ? `<button data-index="${index}">Add to Cart</button>` 
          : `<span style="color:red;">Out of Stock</span>`}
      </div>
    `;
    this.bookGrid.appendChild(card);

    // Event listener
    const btn = card.querySelector("button");
    if (btn) {
      btn.addEventListener("click", () => {
        this.cart.add(book);
        this.updateCart();
      });
    }
  }

  updateCart() {
    this.cartItemsDiv.innerHTML = "";
    this.cart.items.forEach((book, idx) => {
      const item = document.createElement("div");
      item.classList.add("cart-item");
      item.innerHTML = `
        <span>${book.title} - ₹${book.price}</span>
        <button data-index="${idx}">Remove</button>
      `;
      this.cartItemsDiv.appendChild(item);

      item.querySelector("button").addEventListener("click", () => {
        this.cart.remove(idx);
        this.updateCart();
      });
    });

    this.cartTotalDiv.textContent = `Total: ₹${this.cart.getTotal()}`;
  }
}
