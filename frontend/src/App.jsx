import { useMemo, useState } from 'react';
import { Search, ShoppingBag, X, Plus, Minus, MessageCircle, ArrowLeft, Sparkles, Flower2, Menu } from 'lucide-react';
import { products } from './data/products';
import { WHATSAPP_NUMBER, STORE_NAME } from './config';
import { GlassAiButton } from './effects/glass-ai-button/GlassAiButton';
import { AnimatedTopDock } from './effects/animated-top-dock/AnimatedTopDock';

const money = n => `₹${Number(n).toLocaleString('en-IN')}`;
const categories = ['All', ...new Set(products.map(p => p.category))];

function App() {
  const [welcome, setWelcome] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = useMemo(() => products.filter(p =>
    (category === 'All' || p.category === category) &&
    `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  ), [category, search]);

  const addToCart = product => {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      return found
        ? current.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        : [...current, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };
  const changeQty = (id, delta) => setCart(current => current
    .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
    .filter(item => item.qty > 0));
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const sendWhatsApp = () => {
    if (!cart.length) return;
    const lines = cart.map((item, i) => `${i + 1}. ${item.name}\n   ${money(item.price)} × ${item.qty} = ${money(item.price * item.qty)}`);
    const message = `Hello ${STORE_NAME}! I would like to enquire about these products:\n\n${lines.join('\n\n')}\n\nTotal: ${money(total)}\n\nPlease share availability and delivery details. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const openProduct = product => { setSelected(product); setGalleryIndex(0); };
  const imageSrc = (product, index = 0) => product.images?.[index] || '';

  return <div className="app-shell">
    {welcome && <div className="welcome-screen">
      <GlassAiButton onEnter={() => setWelcome(false)} />
      <span className="eyebrow">HANDCRAFTED WITH LOVE</span>
      <h1>Where Every Petal<br/><em>Tells a Story.</em></h1>
      <p>A little beauty, made by hand.</p>
      <button className="gold-button" onClick={() => setWelcome(false)}>Explore collection <span>→</span></button>
      <button className="skip-button" onClick={() => setWelcome(false)}>Skip intro</button>
    </div>}

    <header className="site-header">
      <button className="icon-button mobile-only" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open menu"><Menu/></button>
      <a className="brand" href="#" onClick={() => {setSelected(null); window.scrollTo(0,0);}}>
        <span className="brand-mark"><Flower2 size={23}/></span><span>{STORE_NAME}<small>FLORAL ATELIER</small></span>
      </a>

      <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={18}/><span>Bag</span><b>{cartCount}</b></button>
    </header>
    <AnimatedTopDock />

    <main id="home">
      {selected ? <section className="detail-page">
        <button className="back-link" onClick={() => setSelected(null)}><ArrowLeft size={17}/> Back to collection</button>
        <div className="detail-grid">
          <div className="gallery">
            <div className="main-image">{imageSrc(selected, galleryIndex) ? <img src={imageSrc(selected, galleryIndex)} alt={selected.name} onError={e => {e.currentTarget.style.display='none';}}/> : <div className="image-placeholder"><Flower2 size={58}/><span>Add product photos</span></div>}</div>
            <div className="thumbnails">{selected.images.map((src, i) => <button key={src} className={galleryIndex === i ? 'thumb active' : 'thumb'} onClick={() => setGalleryIndex(i)}><img src={src} alt={`${selected.name} view ${i+1}`} onError={e => {e.currentTarget.style.opacity=0;}}/><span>{i+1}</span></button>)}</div>
          </div>
          <div className="detail-copy">
            <span className="eyebrow">{selected.category}</span><h1>{selected.name}</h1>
            <p className="detail-description">{selected.description}</p>
            <div className="price-line"><strong>{money(selected.price)}</strong><del>{money(selected.originalPrice)}</del><span className="discount">{Math.round((1-selected.price/selected.originalPrice)*100)}% OFF</span></div>
            <p className="detail-note">Handcrafted with care. Each piece is made to bring a little more beauty to your space.</p>
            <button className="gold-button wide" onClick={() => addToCart(selected)}>Add to bag <ShoppingBag size={17}/></button>
            <button className="whatsapp-outline wide" onClick={() => {addToCart(selected); setCartOpen(true);}}>Enquire on WhatsApp <MessageCircle size={17}/></button>
            <div className="detail-meta"><span>✦ Handmade floral art</span><span>✦ Made with care</span></div>
          </div>
        </div>
      </section> : <>
        <section className="hero" id="home-hero">
          <div className="hero-content"><span className="eyebrow"><Sparkles size={14}/> THE ART OF GIVING</span>
            <h1>Flowers that<br/><em>last forever.</em></h1>
            <p>Thoughtfully handcrafted floral art for life's most beautiful moments.</p>
            <a href="#collection" className="gold-button">Discover the collection <span>→</span></a>
          </div>
          <div className="hero-art"><div className="hero-circle"><Flower2 size={104} strokeWidth={0.8}/></div><span className="hero-caption">CRAFTED TO BE TIMELESS</span></div>
        </section>
        <section className="collection-section" id="collection">
          <div className="section-heading"><div><span className="eyebrow">OUR SIGNATURE PIECES</span><h2>The collection</h2></div><span className="product-count">{filtered.length} pieces</span></div>
          <div className="toolbar" id="categories"><div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search flowers, bouquets..." aria-label="Search products"/></div>
            <div className="category-list">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? 'category active' : 'category'}>{c}</button>)}</div>
          </div>
          <div className="product-grid">{filtered.map(product => <article className="product-card" key={product.id}>
            <button className="product-image" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}>
              {imageSrc(product) ? <img src={imageSrc(product)} alt={product.name} onError={e => {e.currentTarget.style.display='none';}}/> : <div className="image-placeholder"><Flower2 size={42}/><span>Flower {String(product.id).padStart(3,'0')}</span></div>}
              <span className="image-count">{product.images.length} photos</span><span className="view-label">View details ↗</span>
            </button>
            <div className="product-info"><span className="product-category">{product.category}</span><button className="product-name" onClick={() => openProduct(product)}>{product.name}</button>
              <div className="price-line"><strong>{money(product.price)}</strong><del>{money(product.originalPrice)}</del><span className="discount">{Math.round((1-product.price/product.originalPrice)*100)}% OFF</span></div>
              <button className="add-button" onClick={() => addToCart(product)}>Add to bag <Plus size={15}/></button>
            </div>
          </article>)}</div>
          {filtered.length === 0 && <div className="empty-state">No flowers found. Try another search.</div>}
        </section>
        <section className="story-section" id="about"><span className="eyebrow">MADE BY HAND, MADE WITH HEART</span><h2>Beauty in every little detail.</h2><p>Each creation is thoughtfully made to celebrate moments, memories and the people you love.</p></section>
      </>}
    </main>

    <footer id="contact"><div className="brand"><span className="brand-mark"><Flower2 size={21}/></span><span>{STORE_NAME}<small>FLORAL ATELIER</small></span></div><p>Handcrafted beauty, delivered with love.</p><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> Chat with us</a><small>© {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</small></footer>

    {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={e => e.stopPropagation()}>
      <div className="drawer-header"><div><span className="eyebrow">YOUR SELECTION</span><h2>Shopping bag ({cartCount})</h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X/></button></div>
      {cart.length === 0 ? <div className="empty-state">Your bag is waiting for something beautiful.</div> : <>
        <div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><div className="cart-thumb">{item.images[0] && <img src={item.images[0]} alt=""/>}</div><div className="cart-item-info"><strong>{item.name}</strong><span>{money(item.price)}</span><div className="quantity"><button onClick={() => changeQty(item.id,-1)}><Minus size={13}/></button><b>{item.qty}</b><button onClick={() => changeQty(item.id,1)}><Plus size={13}/></button></div></div><button className="remove-item" onClick={() => changeQty(item.id,-item.qty)} aria-label="Remove item"><X size={16}/></button></div>)}</div>
        <div className="cart-total"><span>Enquiry total</span><strong>{money(total)}</strong></div><p className="cart-disclaimer">Delivery charges and availability will be confirmed on WhatsApp.</p>
        <button className="gold-button wide" onClick={sendWhatsApp}>Proceed to WhatsApp <MessageCircle size={18}/></button>
      </>}
    </aside></div>}
    <button className="floating-cart" onClick={() => setCartOpen(true)}><ShoppingBag size={19}/><span>{cartCount}</span></button>
  </div>;
}
export default App;
