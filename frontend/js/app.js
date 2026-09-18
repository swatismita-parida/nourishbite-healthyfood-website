/* ==========================================================
   NOURISHBITE — Single JavaScript File (FINAL)
   Location: frontend/js/app.js
   ========================================================== */

const PRODUCTS = [
  [1, "Berry Protein Bowl", "Bowls", 189, 320, 18, 7, "Protein",
    "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800",
    "Creamy yogurt topped with fresh berries, granola, seeds and banana.",
    ["Greek yogurt", "berries", "banana", "granola", "chia seeds", "pumpkin seeds"]],

  [2, "Avocado Egg Toast", "Toasts", 169, 340, 18, 6, "Balanced",
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800",
    "Creamy avocado, egg and herbs on toasted whole-grain bread.",
    ["Avocado", "egg", "whole-grain bread", "herbs"]],

  [3, "Peanut Butter Banana Toast", "Toasts", 129, 350, 12, 5, "Energy",
    "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800",
    "Toasted bread layered with peanut butter and ripe banana.",
    ["Whole-grain bread", "peanut butter", "banana", "cinnamon"]],

  [4, "Overnight Oats", "Breakfast", 149, 300, 11, 8, "Balanced",
    "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800",
    "Chilled oats with yogurt, fruit, seeds and honey.",
    ["Oats", "yogurt", "berries", "chia seeds", "honey"]],

  [5, "Roasted Makhana Mix", "Snacks", 99, 130, 4, 3, "Light",
    "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800",
    "Crispy roasted makhana with mild spices and seeds.",
    ["Makhana", "pumpkin seeds", "spices"]],

  [6, "Berry Yogurt Smoothie", "Smoothies", 159, 220, 10, 4, "Fresh",
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800",
    "Refreshing yogurt, berry and banana smoothie.",
    ["Yogurt", "berries", "banana", "oats"]],

  [7, "Rainbow Chickpea Bowl", "Bowls", 199, 390, 16, 11, "Balanced",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    "Chickpeas, grains and crunchy vegetables with dressing.",
    ["Chickpeas", "brown rice", "cucumber", "carrot", "greens"]],

  [8, "Mango Chia Fruit Bowl", "Fruit", 139, 210, 5, 6, "Light",
    "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800",
    "Seasonal fruit with chia, yogurt and toasted coconut.",
    ["Mango", "seasonal fruit", "chia", "yogurt"]],

  [9, "Paneer Power Wrap", "Wraps", 179, 410, 20, 7, "Protein",
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
    "Whole-wheat wrap with paneer, vegetables and herbs.",
    ["Paneer", "whole-wheat wrap", "lettuce", "tomato"]],

  [10, "Green Glow Smoothie", "Smoothies", 149, 180, 6, 5, "Fresh",
    "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800",
    "Bright blend of greens, fruit, yogurt and lime.",
    ["Spinach", "banana", "apple", "yogurt"]],

  [11, "Date Oat Energy Bites", "Snacks", 119, 190, 6, 4, "Energy",
    "https://images.unsplash.com/photo-1490567674331-72de84794694?w=800",
    "Soft oat and date bites with peanut butter and seeds.",
    ["Dates", "oats", "peanut butter", "seeds"]],

  [12, "Masala Egg Breakfast Bowl", "Breakfast", 189, 360, 21, 6, "Protein",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800",
    "Eggs, grains and vegetables with an Indian-inspired masala.",
    ["Eggs", "millet", "tomato", "spinach", "spices"]]
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let cart = JSON.parse(localStorage.getItem("nourishCart") || "[]");

function save() {
  localStorage.setItem("nourishCart", JSON.stringify(cart));
  count();
}

function count() {
  $$("#count").forEach((el) => {
    el.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  });
}

function toast(message) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function add(id, qty = 1, custom = {}) {
  const p = PRODUCTS.find((x) => x[0] === id);
  if (!p) return;
  cart.push({
    key: Date.now(),
    id,
    name: p[1],
    price: custom.price || p[3],
    qty,
    img: p[7],
    custom,
  });
  save();
  toast("✓ " + p[1] + " added to your cart.");
}

function card(p) {
  return `
    <article class="food">
      <div class="foodImg">
        <img
          class="foodPhoto"
          src="${p[7]}"
          alt="${p[1]}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';"
        >
        <button class="heart" aria-label="Favorite" onclick="this.classList.toggle('liked')">♡</button>
        <span class="pill">${p[4]} kcal</span>
      </div>
      <div class="foodBody">
        <div class="foodTitle">
          <h3>${p[1]}</h3>
          <b>₹${p[3]}</b>
        </div>
        <p>${p[8]}</p>
        <div class="metrics">
          <span>⚡ ${p[5]}g protein</span>
          <span>◌ ${p[6]}g fiber</span>
        </div>
        <div class="actions">
          <a class="btn green" href="food-detail.html?id=${p[0]}">Customize</a>
          <button class="btn pale" onclick="add(${p[0]})">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================
   HOME PAGE
   ========================================================== */
function initHome() {
  const foods = $("#homeFoods");
  if (foods) {
    foods.innerHTML = PRODUCTS.slice(0, 6).map(card).join("");
  }

  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.getElementById("heroDots");
  if (!slides.length) return;

  let current = 0;
  let autoplayTimer = null;
  const SLIDE_DURATION = 4500;

  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, k) => {
      const dot = document.createElement("i");
      if (k === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        goTo(k);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(index) {
    slides.forEach((s, k) => s.classList.toggle("active", k === index));
    if (dotsContainer) {
      dotsContainer.querySelectorAll("i").forEach((d, k) => {
        d.classList.toggle("active", k === index);
      });
    }
    current = index;
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, SLIDE_DURATION);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  goTo(0);
  startAutoplay();

  const heroSection = document.querySelector(".hero-full");
  if (heroSection) {
    heroSection.addEventListener("mouseenter", stopAutoplay);
    heroSection.addEventListener("mouseleave", startAutoplay);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
}

/* ==========================================================
   MENU PAGE — includes Reviews section
   ========================================================== */
function initMenu() {
  let cat = new URLSearchParams(location.search).get("cat") || "All";
  let q = "";
  let sort = "popular";

  function render() {
    let list = PRODUCTS.filter(
      (p) =>
        (cat === "All" || p[2] === cat) &&
        (!q || p[1].toLowerCase().includes(q.toLowerCase()))
    );

    if (sort === "low") list.sort((a, b) => a[3] - b[3]);
    if (sort === "high") list.sort((a, b) => b[3] - a[3]);

    const container = $("#menuFoods");
    if (!container) return;

    container.innerHTML = list.length
      ? list.map(card).join("")
      : "<div style='grid-column:1/-1;text-align:center;padding:60px'>No food found.</div>";
  }

  $$("#filters button").forEach((btn) => {
    btn.onclick = () => {
      cat = btn.dataset.cat;
      $$("#filters button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    };
  });

  const search = $("#search");
  if (search) {
    search.oninput = (e) => {
      q = e.target.value;
      render();
    };
  }

  const sortSelect = $("#sort");
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      sort = e.target.value;
      render();
    };
  }

  $$("#filters button").forEach((b) => {
    b.classList.toggle("active", b.dataset.cat === cat);
  });

  render();

  /* Reviews section */
  initReviews();
}

/* ==========================================================
   REVIEWS (inside Menu page)
   ========================================================== */
function initReviews() {
  const form = document.getElementById("reviewForm");
  const list = document.getElementById("reviewList");
  const starRating = document.getElementById("starRating");
  if (!form || !list) return;

  let rating = 5;

  if (starRating) {
    const stars = starRating.querySelectorAll("i");

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        rating = Number(star.dataset.value);
        stars.forEach((s) => {
          s.classList.toggle("active", Number(s.dataset.value) <= rating);
        });
      });
    });

    stars.forEach((s) => s.classList.add("active"));
  }

  let reviews = JSON.parse(localStorage.getItem("nourishReviews") || "[]");

  if (reviews.length === 0) {
    reviews = [
      {
        name: "Priya S.",
        rating: 5,
        text: "Berry Protein Bowl was so fresh and tasty! Loved the granola crunch.",
        date: "2 days ago",
      },
      {
        name: "Rahul M.",
        rating: 5,
        text: "Ordered the Power Breakfast combo. Great value, and the smoothie was delicious.",
        date: "1 week ago",
      },
      {
        name: "Ananya K.",
        rating: 4,
        text: "Avocado Egg Toast was perfect. Wish there were more vegan options!",
        date: "1 week ago",
      },
    ];
    localStorage.setItem("nourishReviews", JSON.stringify(reviews));
  }

  function render() {
    if (!reviews.length) {
      list.innerHTML =
        '<div style="text-align:center;padding:40px;color:#68756b;font-style:italic">No reviews yet. Be the first!</div>';
      return;
    }

    list.innerHTML = reviews
      .map(
        (r) => `
          <div class="review-card">
            <div class="review-head">
              <div class="review-name">${r.name}</div>
              <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
            </div>
            <p class="review-text">${r.text}</p>
            <div class="review-date">${r.date}</div>
          </div>
        `
      )
      .join("");
  }

  render();

  form.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    const newReview = {
      name: data.name,
      rating: rating,
      text: data.text,
      date: "Just now",
    };

    reviews.unshift(newReview);
    localStorage.setItem("nourishReviews", JSON.stringify(reviews));

    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    }).catch(() => {});

    form.reset();
    rating = 5;
    if (starRating) {
      starRating.querySelectorAll("i").forEach((s) => s.classList.add("active"));
    }
    render();
    toast("✓ Thanks for your review!");
  };
}

/* ==========================================================
   CART PAGE
   ========================================================== */
function initCart() {
  let disc = 0;

  function render() {
    const el = $("#items");
    if (!el) return;

    if (!cart.length) {
      el.innerHTML = `
        <div class="checkoutcard" style="text-align:center">
          <h2>Your cart is waiting.</h2>
          <p>Add something tasty from the menu.</p>
          <a class="btn green" href="menu.html">Browse Menu</a>
        </div>
      `;
      calc();
      return;
    }

    el.innerHTML = cart
      .map(
        (x, i) => `
          <div class="cartitem">
            <div class="thumb" style="background-image:url(${x.img})"></div>
            <div class="cartinfo">
              <h3>${x.name}</h3>
              <p>${x.custom && x.custom.addons && x.custom.addons.length ? x.custom.addons.join(" · ") : "Regular"}</p>
              <b>₹${x.price}</b>
            </div>
            <div class="qty">
              <button onclick="change(${i}, -1)">−</button>
              <span>${x.qty}</span>
              <button onclick="change(${i}, 1)">+</button>
            </div>
            <button class="remove" onclick="removeX(${i})">Remove</button>
          </div>
        `
      )
      .join("");

    calc();
  }

  function calc() {
    const sub = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
    const delivery = sub ? 30 : 0;

    const subEl = $("#sub");
    const delEl = $("#delivery");
    const discEl = $("#discount");
    const totEl = $("#total");

    if (subEl) subEl.textContent = "₹" + sub;
    if (delEl) delEl.textContent = "₹" + delivery;
    if (discEl) discEl.textContent = "−₹" + disc;
    if (totEl) totEl.textContent = "₹" + Math.max(0, sub + delivery - disc);
  }

  window.change = (i, n) => {
    cart[i].qty += n;
    if (cart[i].qty < 1) cart.splice(i, 1);
    save();
    render();
  };

  window.removeX = (i) => {
    cart.splice(i, 1);
    save();
    render();
  };

  render();

  const applyBtn = $("#apply");
  if (applyBtn) {
    applyBtn.onclick = () => {
      disc = $("#promo").value.trim().toUpperCase() === "NOURISH10" ? 50 : 0;
      toast(disc ? "✓ Promo applied" : "Try code NOURISH10");
      calc();
    };
  }
}

/* ==========================================================
   CHECKOUT PAGE
   ========================================================== */
function initCheckout() {
  const form = $("#checkoutForm");
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      toast("Your cart is empty.");
      return;
    }

    const order = {
      customer: Object.fromEntries(new FormData(e.target)),
      items: cart,
      total: cart.reduce((sum, x) => sum + x.price * x.qty, 0) + 30,
    };

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch (_) {}

    localStorage.removeItem("nourishCart");
    cart = [];
    count();

    const success = $("#success");
    if (success) success.classList.add("show");
  };
}

/* ==========================================================
   FOOD DETAIL PAGE
   ========================================================== */
function initDetail() {
  const photo = $("#detailPhoto");
  if (!photo) return;

  const p =
    PRODUCTS.find(
      (x) => x[0] === Number(new URLSearchParams(location.search).get("id"))
    ) || PRODUCTS[0];

  let extra = 0;
  let qty = 1;

  function price() {
    const total = (p[3] + extra) * qty;
    const priceEl = $("#price");
    if (priceEl) priceEl.textContent = "₹" + total;
  }

  photo.src = p[7];
  photo.alt = p[1];

  const catEl = $("#cat");
  if (catEl) catEl.textContent = p[2].toUpperCase();

  const nameEl = $("#name");
  if (nameEl) nameEl.textContent = p[1];

  const descEl = $("#desc");
  if (descEl) descEl.textContent = p[8];

  const nutEl = $("#nutrition");
  if (nutEl) {
    nutEl.innerHTML = `
      <div>${p[4]}<small>kcal</small></div>
      <div>${p[5]}g<small>Protein</small></div>
      <div>${p[6]}g<small>Fiber</small></div>
    `;
  }

  const ingEl = $("#ingredients");
  if (ingEl) {
    ingEl.innerHTML = p[9].map((x) => `<span>${x}</span>`).join("");
  }

  $$(".opt").forEach((opt) => {
    opt.onclick = () => {
      const group = opt.parentElement;
      group.querySelectorAll(".opt").forEach((x) => x.classList.remove("selected"));
      opt.classList.add("selected");
      recalc();
    };
  });

  $$(".extra").forEach((cb) => {
    cb.onchange = recalc;
  });

  function recalc() {
    extra = 0;
    $$(".opt.selected").forEach((x) => (extra += Number(x.dataset.extra || 0)));
    $$(".extra:checked").forEach((x) => (extra += Number(x.dataset.extra)));
    price();
  }

  const minus = $("#minus");
  const plus = $("#plus");
  const qtyEl = $("#qty");

  if (minus) {
    minus.onclick = () => {
      qty = Math.max(1, qty - 1);
      if (qtyEl) qtyEl.textContent = qty;
      price();
    };
  }

  if (plus) {
    plus.onclick = () => {
      qty++;
      if (qtyEl) qtyEl.textContent = qty;
      price();
    };
  }

  const addBtn = $("#add");
  if (addBtn) {
    addBtn.onclick = () => {
      const custom = {
        price: p[3] + extra,
        size: $(".opt.selected")?.textContent || "Regular",
        addons: [...$$(".extra:checked")].map((x) =>
          x.parentElement.textContent.trim()
        ),
      };
      add(p[0], qty, custom);
    };
  }

  recalc();
}

/* ==========================================================
   CONTACT PAGE
   ========================================================== */
function initContact() {
  const form = $("#contactForm");
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
      });
    } catch (_) {}

    e.target.reset();
    toast("✓ Thanks! Your message was received.");
  };
}

/* ==========================================================
   MAIN INIT
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const hamb = $("#hamb");
  if (hamb) {
    hamb.onclick = () => {
      const links = $("#links");
      if (links) links.classList.toggle("open");
    };
  }

  count();

  const page = document.body.dataset.page;

  if (page === "home") initHome();
  if (page === "menu") initMenu();
  if (page === "cart") initCart();
  if (page === "checkout") initCheckout();
  if (page === "detail") initDetail();
  if (page === "contact") initContact();
});