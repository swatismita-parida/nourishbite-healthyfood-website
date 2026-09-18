# NourishBite V4

Modern multi-page healthy food ordering demo using HTML5, CSS3, vanilla JavaScript and a small Node HTTP API.

## Pages
Home, Categories, Menu, Food Details/Customization, Healthy Tips, About, Contact, Cart, Checkout.

## UX updates
- Fixed Home hero headline: “Good Food. Good Mood.”
- Automatic food-photo carousel with no next/previous controls.
- New heart-shaped NourishBite logo.
- New green/lime/coral/cream visual system.
- Subtle 3D fruit stickers float across pages without sitting on top of the hero photography.
- Home includes animated floating healthy-tip notes; the full Healthy Tips page remains available.
- Food cards use real `<img>` elements, so raw image URLs never appear as visible text.
- Product customization with dynamic price, quantity and add-ons.
- Cart persists in localStorage.
- Basic Node endpoints: GET /api/products, POST /api/orders, POST /api/contact.

## Run
`node server.js` then open `http://localhost:3000`.
Nutrition values are illustrative/demo values.
