import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema, type ReservationFormValues } from '../lib/validation';
import { createReservation } from '../lib/api';
import { toast } from 'sonner';

// ===== MENU DATA =====
const menuData = [
  // Boissons Chaudes
  { id:1, cat:'chaud', name:'Thé à la Menthe', desc:'Thé vert traditionnel marocain, fraîche menthe de saison, sucre à volonté', price:'15', emoji:'🫖', tags:['vegan','bio'], img:'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=75' },
  { id:2, cat:'chaud', name:'Espresso', desc:'Café arabica d\'exception, torréfaction artisanale, crème dorée', price:'18', emoji:'☕', tags:['vegan'], img:'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=75' },
  { id:3, cat:'chaud', name:'Cappuccino', desc:'Espresso intense, lait entier micro-moussé, cacao pur', price:'28', emoji:'☕', tags:['vege'], img:'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=75' },
  { id:4, cat:'chaud', name:'Nous Nous', desc:'Le café marocain par excellence – moitié espresso, moitié lait chaud', price:'22', emoji:'☕', tags:['vege'], img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=75' },
  { id:5, cat:'chaud', name:'Latte Noisette', desc:'Espresso doux, lait crémeux, sirop de noisette artisanal', price:'32', emoji:'☕', tags:['vege'], img:'https://images.unsplash.com/photo-1582932215517-98dab7248e78?w=400&q=75' },
  { id:6, cat:'chaud', name:'Chocolat Chaud', desc:'Cacao premium, lait entier, touche de cannelle et fleur d\'oranger', price:'28', emoji:'🍫', tags:['vege','bio'], img:'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=75' },
  // Boissons Fraîches
  { id:7, cat:'frais', name:'Thé Glacé Hibiscus', desc:'Karkadé marocain infusé à froid, zeste de citron, sirop de gingembre', price:'25', emoji:'🌺', tags:['vegan','bio'], img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=75' },
  { id:8, cat:'frais', name:'Jus d\'Orange Frais', desc:'Oranges pressées du jour, 100% pur jus sans ajout de sucre', price:'22', emoji:'🍊', tags:['vegan','bio'], img:'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=75' },
  { id:9, cat:'frais', name:'Smoothie Avocat', desc:'Avocat crémeux, lait d\'amande, miel naturel, graines de chia', price:'38', emoji:'🥑', tags:['vege','bio'], img:'https://images.unsplash.com/photo-1638176066959-e9b94bd46b64?w=400&q=75' },
  { id:10, cat:'frais', name:'Citronnade Marocaine', desc:'Citrons de Mohammedia, eau de rose, menthe fraîche, sucre canne', price:'20', emoji:'🍋', tags:['vegan','bio'], img:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=75' },
  // Petit Déjeuner
  { id:11, cat:'petit-dej', name:'Toast Avocat & Œufs', desc:'Pain au levain local, avocat écrasé, œufs pochés, zaatar, tomates cerises', price:'55', emoji:'🥑', tags:['vege'], img:'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=75' },
  { id:12, cat:'petit-dej', name:'Shakshuka', desc:'Œufs en sauce tomate épicée maison, poivrons, cumin, coriandre fraîche', price:'65', emoji:'🍳', tags:['vege','halal','spicy'], img:'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400&q=75' },
  { id:13, cat:'petit-dej', name:'Msemen au Miel', desc:'Galettes feuilletées faites maison, miel d\'abeilles du Moyen Atlas, beurre', price:'30', emoji:'🫓', tags:['vege','bio'], img:'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&q=75' },
  { id:14, cat:'petit-dej', name:'Baghrir aux Fruits', desc:'Crêpes aux mille trous traditionnelles, coulis de fruits rouges, crème fraîche', price:'35', emoji:'🥞', tags:['vege'], img:'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=75' },
  { id:15, cat:'petit-dej', name:'Yaourt Granola Bio', desc:'Yaourt fermier nature, granola maison, fruits frais de saison, miel', price:'40', emoji:'🍓', tags:['vege','bio'], img:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=75' },
  // Plats Légers
  { id:16, cat:'legers', name:'Salade Marocaine', desc:'Tomates, poivrons grillés, concombre, olives noires, huile d\'argan, citron', price:'45', emoji:'🥗', tags:['vegan','bio'], img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=75' },
  { id:17, cat:'legers', name:'Bowl Quinoa Légumes', desc:'Quinoa bio, légumes rôtis de saison, houmous maison, vinaigrette tahini', price:'70', emoji:'🥣', tags:['vegan','bio'], img:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=75' },
  { id:18, cat:'legers', name:'Wrap Poulet Grillé', desc:'Poulet mariné chermoula, crudités croquantes, sauce yaourt-citron, frites', price:'75', emoji:'🌯', tags:['halal'], img:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=75' },
  { id:19, cat:'legers', name:'Falafel Bowl', desc:'Falafels croustillants maison, taboulé, houmous, pain pita, sauce tahini', price:'68', emoji:'🧆', tags:['vegan'], img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=75' },
  // Spécialités Marocaines
  { id:20, cat:'marocain', name:'Harira', desc:'Soupe traditionnelle marocaine, lentilles, tomates, coriandre, citron confit', price:'35', emoji:'🍲', tags:['vegan','halal'], img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=75' },
  { id:21, cat:'marocain', name:'Pastilla au Poulet', desc:'Feuilleté marocain, poulet confit, amandes grillées, cannelle, sucre glace', price:'95', emoji:'🥧', tags:['halal'], img:'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=75' },
  { id:22, cat:'marocain', name:'Couscous Légumes', desc:'Semoule fine, légumes du jardin, bouillon de safran, raisins secs, pois chiches', price:'85', emoji:'🫕', tags:['vegan','bio'], img:'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=75' },
  { id:23, cat:'marocain', name:'Brochettes Kefta', desc:'Viande hachée épicée façon marocaine, pain marocain, harissa, salade', price:'90', emoji:'🍢', tags:['halal','spicy'], img:'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=75' },
  // Desserts
  { id:24, cat:'dessert', name:'Chebakia', desc:'Pâtisserie marocaine au miel et sésame, eau de rose, parfumée à la cannelle', price:'25', emoji:'🍯', tags:['vege','bio'], img:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=75' },
  { id:25, cat:'dessert', name:'Baklava aux Pistaches', desc:'Feuilles filo croustillantes, pistaches de Liban, sirop miel-fleur d\'oranger', price:'35', emoji:'🥐', tags:['vege'], img:'https://images.unsplash.com/photo-1571167330149-a1c86ab3e07b?w=400&q=75' },
  { id:26, cat:'dessert', name:'Fondant Chocolat', desc:'Cœur coulant au chocolat noir 70%, glace vanille maison, coulis framboise', price:'55', emoji:'🍫', tags:['vege'], img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=75' },
  { id:27, cat:'dessert', name:'Kunafa', desc:'Vermicelles croustillants, fromage à la crème, sirop fleur d\'oranger, pistaches', price:'45', emoji:'🍮', tags:['vege'], img:'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=75' },
  { id:28, cat:'dessert', name:'Crêpes Oranges & Miel', desc:'Crêpes légères, marmelade d\'oranges Mohammedia, miel Bio, amandes effilées', price:'38', emoji:'🥞', tags:['vege','bio'], img:'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=400&q=75' },
];

const tagMap: Record<string, {cls: string, label: string}> = {
  vegan: { cls: 'tag-vegan', label: '🌱 Vegan' },
  vege:  { cls: 'tag-vege',  label: '🥬 Végé' },
  halal: { cls: 'tag-halal', label: '✓ Halal' },
  bio:   { cls: 'tag-bio',   label: '🌿 Bio' },
  spicy: { cls: 'tag-spicy', label: '🌶️ Épicé' },
};

export function HomePage() {
  const logoSrc = `${import.meta.env.BASE_URL}cafe-logo.svg`;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [currentSearch, setCurrentSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [lightboxCaption, setLightboxCaption] = useState('');

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, (Number((entry.target as HTMLElement).dataset.delay) || 0));
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up, .fade-in').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String((i % 4) * 80);
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredMenu = menuData.filter(item => {
    const matchTab = currentTab === 'all' || item.cat === currentTab;
    const matchSearch = !currentSearch || item.name.toLowerCase().includes(currentSearch.toLowerCase()) || item.desc.toLowerCase().includes(currentSearch.toLowerCase());
    return matchTab && matchSearch;
  });

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
    document.body.style.overflow = !mobileOpen ? 'hidden' : '';
  };

  const openModal = () => {
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      language: 'fr',
    },
  });

  const onSubmitReservation = async (data: ReservationFormValues) => {
    try {
      await createReservation(data);
      setFormSuccess(true);
      reset();
      toast.success("Réservation envoyée avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la réservation");
    }
  };

  const resetForm = () => {
    setFormSuccess(false);
    reset();
  };

  const openLightbox = (src: string, caption: string) => {
    setLightboxSrc(src);
    setLightboxCaption(caption);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
        closeModal();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div>
      {/* ===== NAVBAR ===== */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="home-navbar-shell" style={{maxWidth:'1280px', margin:'0 auto', padding:'0 20px'}}>
          <div className="home-navbar-inner" style={{display:'flex', alignItems:'center', justifyContent:'space-between', height:'72px', gap:'16px'}}>
            
            {/* Logo */}
            <a href="#hero" className="home-navbar-brand" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'12px', flexShrink:0}}>
              <img
                src={logoSrc}
                alt="Club 5 Octobre"
                className="home-navbar-logo"
                style={{ height: '64px', width: 'auto', objectFit: 'contain' }}
              />
              <div className="home-navbar-brand-text">
                <div className="nav-logo-text" style={{fontSize:'1.05rem', lineHeight:1.2}}>Club 5 Octobre</div>
                <div className="nav-logo-sub">Mohammedia · Espace 5 Octobre</div>
              </div>
            </a>

            {/* Desktop Nav */}
            <div style={{alignItems:'center', gap:'20px'}} id="desktopNav" className="hidden lg:flex">
              <a href="#hero" className="nav-link" style={{display:'none'}} id="navAccueil">Accueil</a>
              <a href="#menu" className="nav-link">Menu</a>
              <a href="#espace" className="nav-link">Espace Rencontres</a>
              <a href="#apropos" className="nav-link">À propos</a>
              <a href="#durabilite" className="nav-link">Durabilité</a>
              <a href="#galerie" className="nav-link">Galerie</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>

            {/* Right actions */}
            <div className="home-navbar-actions" style={{display:'flex', alignItems:'center', gap:'10px', flexShrink:0}}>
              <div style={{gap:'6px'}} className="hidden lg:flex">
                <a href="#" className="social-icon" title="Instagram" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </a>
                <a href="#" className="social-icon" title="Facebook" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://wa.me/212600000000" className="social-icon" title="WhatsApp" aria-label="WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
              <button
                id="hamburger"
                onClick={toggleMobile}
                className="home-hamburger flex flex-col lg:hidden"
                style={{
                  gap:'5px',
                  cursor:'pointer',
                  width:'44px',
                  height:'44px',
                  padding:'10px',
                  borderRadius:'12px',
                  border: scrolled ? '1px solid rgba(15,23,42,0.12)' : '1px solid rgba(255,255,255,0.45)',
                  background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(15,23,42,0.38)',
                  boxShadow: scrolled ? '0 8px 18px rgba(15,23,42,0.12)' : '0 8px 18px rgba(0,0,0,0.22)',
                  backdropFilter:'blur(10px)',
                  WebkitBackdropFilter:'blur(10px)',
                  zIndex:1001,
                  justifyContent:'center',
                  alignItems:'center',
                  flexShrink:0,
                }}
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
              >
                <span
                  id="hb1"
                  style={{
                    display:'block',
                    width:'22px',
                    height:'2.5px',
                    background: scrolled ? '#0f172a' : '#ffffff',
                    transition:'all 0.3s ease',
                    borderRadius:'999px',
                    transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none'
                  }}
                ></span>
                <span
                  id="hb2"
                  style={{
                    display:'block',
                    width:'22px',
                    height:'2.5px',
                    background: scrolled ? '#0f172a' : '#ffffff',
                    transition:'all 0.25s ease',
                    borderRadius:'999px',
                    opacity: mobileOpen ? 0 : 1
                  }}
                ></span>
                <span
                  id="hb3"
                  style={{
                    display:'block',
                    width:'22px',
                    height:'2.5px',
                    background: scrolled ? '#0f172a' : '#ffffff',
                    transition:'all 0.3s ease',
                    borderRadius:'999px',
                    transform: mobileOpen ? 'translateY(-8px) rotate(-45deg)' : 'none'
                  }}
                ></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      <div id="mobileMenu" className={mobileOpen ? 'open' : ''}>
        <button onClick={toggleMobile} style={{position:'absolute', top:'24px', right:'24px', fontSize:'1.5rem', border:'none', background:'none', cursor:'pointer', color:'#1f2937'}}>✕</button>
        <div style={{textAlign:'center', marginBottom:'20px'}}>
          <div className="font-playfair" style={{fontSize:'1.4rem', fontWeight:700, color:'var(--dark)'}}>Club 5 Octobre</div>
          <div style={{fontSize:'0.75rem', color:'var(--teal)', letterSpacing:'0.1em'}}>Mohammedia</div>
        </div>
        <a href="#hero" className="mobile-nav-link" onClick={toggleMobile}>Accueil</a>
        <a href="#menu" className="mobile-nav-link" onClick={toggleMobile}>Menu</a>
        <a href="#espace" className="mobile-nav-link" onClick={toggleMobile}>Espace Rencontres</a>
        <a href="#apropos" className="mobile-nav-link" onClick={toggleMobile}>À propos</a>
        <a href="#durabilite" className="mobile-nav-link" onClick={toggleMobile}>Durabilité</a>
        <a href="#galerie" className="mobile-nav-link" onClick={toggleMobile}>Galerie</a>
        <a href="#contact" className="mobile-nav-link" onClick={toggleMobile}>Contact</a>
        <div style={{marginTop:'20px'}}>
          <button onClick={() => { openModal(); toggleMobile(); }} className="btn-primary">Réserver l'Espace Rencontres</button>
        </div>
        <a
          href="https://fm6e.org"
          target="_blank"
          rel="noreferrer"
          className="fm6e-badge fm6e-badge-dark"
          style={{marginTop:'14px', textDecoration:'none', display:'inline-flex', fontSize:'0.72rem'}}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Partenaire FM6E
        </a>
        <div style={{display:'flex', gap:'12px', marginTop:'20px'}}>
          <a href="#" className="social-icon social-icon-dark" title="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round"/></svg>
          </a>
          <a href="#" className="social-icon social-icon-dark" title="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://wa.me/212600000000" className="social-icon social-icon-dark" title="WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="hero-pattern"></div>
        <div style={{position:'absolute', top:'15%', left:'5%', width:'200px', height:'200px', borderRadius:'50%', border:'1px solid rgba(212,175,119,0.15)', zIndex:1}}></div>
        <div style={{position:'absolute', bottom:'20%', right:'5%', width:'150px', height:'150px', borderRadius:'50%', border:'1px solid rgba(62,160,74,0.2)', zIndex:1}}></div>

        <div className="hero-content" style={{padding:'20px', maxWidth:'860px'}}>
          <div className="hero-badge-wrap" style={{marginBottom:'24px'}}>
            <a href="https://fm6e.org" target="_blank" rel="noreferrer" className="fm6e-badge hero-fm6e-badge" style={{background:'rgba(62,160,74,0.15)', borderColor:'rgba(62,160,74,0.4)', color:'#86efac', fontSize:'0.72rem', textDecoration:'none'}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Fier Partenaire de la Fondation Mohammed VI pour la Protection de l'Environnement
            </a>
          </div>
          <h1 className="font-playfair hero-title" style={{fontSize:'clamp(2.4rem,6vw,4.2rem)', fontWeight:700, color:'#fff', lineHeight:1.15, marginBottom:'16px', textShadow:'0 2px 20px rgba(0,0,0,0.4)'}}>
            Club 5 Octobre<br/>
            <span style={{color:'var(--gold)', fontStyle:'italic'}}>Mohammedia</span>
          </h1>
          <p className="hero-subtitle" style={{fontSize:'clamp(1rem,2.5vw,1.25rem)', color:'rgba(255,255,255,0.85)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'14px', fontWeight:300}}>
            Café &nbsp;·&nbsp; Restaurant &nbsp;·&nbsp; Espace de Rencontres
          </p>
          <p className="font-amiri hero-tagline" style={{fontSize:'clamp(1.1rem,2.5vw,1.4rem)', color:'var(--gold)', marginBottom:'36px', fontStyle:'italic', opacity:0.95}}>
            Un lieu convivial et engagé pour l'environnement
          </p>
          <div className="hero-rating" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'36px'}}>
            <div style={{display:'flex', gap:'2px'}}>
              <span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span>
            </div>
            <span className="hero-rating-text" style={{color:'rgba(255,255,255,0.7)', fontSize:'0.82rem'}}>Cadre exceptionnel à Mohammedia</span>
          </div>
          <div className="hero-cta" style={{display:'flex', flexWrap:'wrap', gap:'12px', justifyContent:'center'}}>
            <a href="#menu" className="btn-primary" style={{fontSize:'0.9rem', padding:'14px 32px'}}>🍽️ Découvrir le Menu</a>
            <button onClick={openModal} className="btn-teal" style={{fontSize:'0.9rem', padding:'14px 32px'}}>📅 Réserver l'Espace</button>
            <a href="#durabilite" className="btn-outline" style={{fontSize:'0.9rem', padding:'14px 32px'}}>🌿 Notre Engagement</a>
          </div>
          <div className="hero-scroll-indicator" style={{marginTop:'50px', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', opacity:0.5}}>
            <span style={{color:'#fff', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase'}}>Défiler</span>
            <div style={{width:'1px', height:'40px', background:'linear-gradient(to bottom,rgba(255,255,255,0.6),transparent)'}}></div>
          </div>
        </div>
      </section>

      {/* ===== À PROPOS ===== */}
      <section id="apropos" style={{background:'var(--cream)', padding:'80px 20px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
            <div className="fade-up">
              <div className="section-tag">Notre Histoire</div>
              <h2 className="font-playfair" style={{fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:700, color:'var(--dark)', marginBottom:'20px', lineHeight:1.3}}>
                Un espace de vie,<br/><em style={{color:'var(--primary)'}}>de saveurs & de sens</em>
              </h2>
              <p style={{color:'#4b5563', lineHeight:1.9, marginBottom:'16px', fontSize:'0.95rem'}}>
                Niché au cœur de Mohammedia, le <strong>Club 5 Octobre</strong> est bien plus qu'un café-restaurant. C'est un lieu de vie pensé pour réunir les amateurs de bonne cuisine, les professionnels en quête d'un cadre calme, et tous ceux qui partagent notre amour pour l'environnement.
              </p>
              <p style={{color:'#4b5563', lineHeight:1.9, marginBottom:'16px', fontSize:'0.95rem'}}>
                Notre café propose des cafés d'exception, des thés à la menthe frais, et une carte de plats marocains et méditerranéens préparés avec des ingrédients locaux et de saison. Chaque assiette raconte une histoire — celle de notre terroir et de nos producteurs.
              </p>
              <p style={{color:'#4b5563', lineHeight:1.9, marginBottom:'28px', fontSize:'0.95rem'}}>
                L'<strong style={{color:'var(--teal)'}}>Espace Rencontres</strong> est particulièrement plébiscité par les enseignants, équipes pédagogiques, étudiants et associations. Dans une ambiance feutrée et conviviale, il accueille réunions, ateliers et séances de travail en petit groupe.
              </p>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'28px'}}>
                <div style={{textAlign:'center', padding:'16px', background:'#fff', borderRadius:'12px', border:'1px solid #f0ebe1'}}>
                  <div className="font-playfair" style={{fontSize:'1.8rem', fontWeight:700, color:'var(--primary)'}}>8+</div>
                  <div style={{fontSize:'0.72rem', color:'#6b7280', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em'}}>Années d'expérience</div>
                </div>
                <div style={{textAlign:'center', padding:'16px', background:'#fff', borderRadius:'12px', border:'1px solid #f0ebe1'}}>
                  <div className="font-playfair" style={{fontSize:'1.8rem', fontWeight:700, color:'var(--primary)'}}>200+</div>
                  <div style={{fontSize:'0.72rem', color:'#6b7280', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em'}}>Clients / jour</div>
                </div>
                <div style={{textAlign:'center', padding:'16px', background:'#fff', borderRadius:'12px', border:'1px solid #f0ebe1'}}>
                  <div className="font-playfair" style={{fontSize:'1.8rem', fontWeight:700, color:'var(--primary)'}}>100%</div>
                  <div style={{fontSize:'0.72rem', color:'#6b7280', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em'}}>Produits locaux</div>
                </div>
              </div>
              <div style={{background:'linear-gradient(135deg,rgba(62,160,74,0.08),rgba(0,93,109,0.08))', border:'1px solid rgba(62,160,74,0.2)', borderRadius:'12px', padding:'16px', display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),var(--teal))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <div>
                  <div style={{fontSize:'0.78rem', fontWeight:700, color:'var(--teal)', marginBottom:'2px'}}>Partenaire Officiel</div>
                  <div style={{fontSize:'0.8rem', color:'#374151'}}>Fier partenaire de la <a href="https://fm6e.org" target="_blank" rel="noreferrer" style={{color:'var(--primary)', fontWeight:600, textDecoration:'none'}}>Fondation Mohammed VI pour la Protection de l'Environnement</a></div>
                </div>
              </div>
            </div>
            <div className="fade-up" style={{position:'relative'}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                <div style={{borderRadius:'16px', overflow:'hidden', height:'220px', gridRow:'span 2'}}>
                  <img src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80" alt="Intérieur café Club 5 Octobre" style={{width:'100%', height:'100%', objectFit:'cover'}} loading="lazy"/>
                </div>
                <div style={{borderRadius:'16px', overflow:'hidden', height:'104px'}}>
                  <img src="https://images.unsplash.com/photo-1507914997125-b8f2f7ee8290?w=400&q=80" alt="Café marocain" style={{width:'100%', height:'100%', objectFit:'cover'}} loading="lazy"/>
                </div>
                <div style={{borderRadius:'16px', overflow:'hidden', height:'104px'}}>
                  <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80" alt="Espace de rencontres" style={{width:'100%', height:'100%', objectFit:'cover'}} loading="lazy"/>
                </div>
              </div>
              <div style={{position:'absolute', bottom:'-16px', right:'-8px', background:'var(--primary)', color:'#fff', padding:'12px 20px', borderRadius:'12px', boxShadow:'0 8px 20px rgba(62,160,74,0.35)', fontSize:'0.78rem', fontWeight:700, textAlign:'center', maxWidth:'130px'}}>
                🌿 Éco-responsable<br/><span style={{fontWeight:400, opacity:0.85, fontSize:'0.7rem'}}>certifié FM6E</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MENU ===== */}
      <section id="menu" style={{background:'#fff', padding:'80px 20px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:'48px'}} className="fade-up">
            <div className="section-tag" style={{justifyContent:'center'}}>Notre Carte</div>
            <h2 className="font-playfair" style={{fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:700, color:'var(--dark)', marginBottom:'12px'}}>Menu Interactif</h2>
            <p style={{color:'#6b7280', maxWidth:'500px', margin:'0 auto', fontSize:'0.95rem', lineHeight:1.7}}>Des saveurs authentiques préparées avec des produits locaux et de saison</p>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'20px', marginBottom:'36px'}} className="fade-up">
            <div style={{position:'relative', width:'100%', maxWidth:'380px'}}>
              <input type="text" id="menuSearch" placeholder="Rechercher un plat..." value={currentSearch} onChange={(e) => setCurrentSearch(e.target.value)} />
              <svg style={{position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', color:'#9ca3af'}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div className="tabs-scroll" style={{width:'100%'}}>
              <div style={{display:'flex', gap:'8px', padding:'4px 0', width:'max-content', margin:'0 auto'}}>
                <button className={`menu-tab ${currentTab === 'all' ? 'active' : ''}`} onClick={() => setCurrentTab('all')}>Tout</button>
                <button className={`menu-tab ${currentTab === 'chaud' ? 'active' : ''}`} onClick={() => setCurrentTab('chaud')}>☕ Boissons Chaudes</button>
                <button className={`menu-tab ${currentTab === 'frais' ? 'active' : ''}`} onClick={() => setCurrentTab('frais')}>🧃 Boissons Fraîches</button>
                <button className={`menu-tab ${currentTab === 'petit-dej' ? 'active' : ''}`} onClick={() => setCurrentTab('petit-dej')}>�� Petit Déjeuner</button>
                <button className={`menu-tab ${currentTab === 'legers' ? 'active' : ''}`} onClick={() => setCurrentTab('legers')}>🥗 Plats Légers</button>
                <button className={`menu-tab ${currentTab === 'marocain' ? 'active' : ''}`} onClick={() => setCurrentTab('marocain')}>🫕 Spécialités Marocaines</button>
                <button className={`menu-tab ${currentTab === 'dessert' ? 'active' : ''}`} onClick={() => setCurrentTab('dessert')}>🍮 Desserts</button>
              </div>
            </div>
          </div>

          <div id="menuGrid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'20px'}}>
            {filteredMenu.length > 0 ? filteredMenu.map((item) => (
              <div key={item.id} className="menu-card fade-up visible">
                <div style={{height:'160px', overflow:'hidden', position:'relative'}}>
                  <img src={item.img} alt={item.name} style={{width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s'}} loading="lazy" />
                  <div style={{position:'absolute', top:'10px', left:'10px', fontSize:'1.5rem', background:'rgba(255,255,255,0.9)', width:'38px', height:'38px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>{item.emoji}</div>
                </div>
                <div style={{padding:'16px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px', gap:'8px'}}>
                    <h3 style={{fontWeight:700, fontSize:'0.95rem', color:'var(--dark)', lineHeight:1.3}}>{item.name}</h3>
                    <div style={{fontWeight:700, color:'var(--primary)', fontSize:'1rem', whiteSpace:'nowrap', flexShrink:0}}>{item.price} <span style={{fontSize:'0.72rem', fontWeight:500}}>MAD</span></div>
                  </div>
                  <p style={{color:'#6b7280', fontSize:'0.8rem', lineHeight:1.6, marginBottom:'12px'}}>{item.desc}</p>
                  <div style={{display:'flex', flexWrap:'wrap', gap:'5px'}}>
                    {item.tags.map(t => (
                      <span key={t} className={`diet-tag ${tagMap[t].cls}`}>{tagMap[t].label}</span>
                    ))}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{textAlign:'center', padding:'40px', color:'#9ca3af', gridColumn:'1 / -1'}}>
                <div style={{fontSize:'2.5rem', marginBottom:'12px'}}>🔍</div>
                <p style={{fontSize:'1rem'}}>Aucun résultat trouvé. Essayez un autre terme.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== ESPACE RENCONTRES ===== */}
      <section id="espace" style={{background:'linear-gradient(135deg,#0a2540 0%,#003d4a 100%)', padding:'80px 20px', position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', inset:0, background:'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80) center/cover no-repeat', opacity:0.12}}></div>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(10,37,64,0.92),rgba(0,61,74,0.92))'}}></div>
        <div style={{maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:1}}>
          <div style={{textAlign:'center', marginBottom:'56px'}} className="fade-up">
            <div style={{display:'inline-flex', alignItems:'center', gap:'8px', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'12px'}}>
              <span style={{width:'30px', height:'1px', background:'var(--gold)', opacity:0.5}}></span>
              Réservations Exclusives
              <span style={{width:'30px', height:'1px', background:'var(--gold)', opacity:0.5}}></span>
            </div>
            <h2 className="font-playfair" style={{fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:700, color:'#fff', marginBottom:'16px'}}>Espace Rencontres</h2>
            <p style={{color:'rgba(255,255,255,0.75)', maxWidth:'600px', margin:'0 auto', fontSize:'0.98rem', lineHeight:1.8}}>
              Un espace privatisable dédié aux réunions professionnelles, séances de travail pédagogique, ateliers associatifs et rencontres en petit groupe.
            </p>
            <div style={{marginTop:'16px', display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(212,175,119,0.15)', border:'1px solid rgba(212,175,119,0.35)', borderRadius:'20px', padding:'6px 16px', color:'var(--gold)', fontSize:'0.78rem', fontWeight:600}}>
              ⚠️ Les réservations sont exclusivement disponibles pour cet espace
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] items-start">
            <div className="fade-up">
              <h3 className="font-playfair" style={{fontSize:'1.4rem', color:'#fff', marginBottom:'24px', fontWeight:600}}>Ce que nous offrons</h3>
              <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                <div style={{display:'flex', alignItems:'flex-start', gap:'14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'18px'}}>
                  <div style={{width:'42px', height:'42px', background:'rgba(62,160,74,0.2)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'20px'}}>📶</div>
                  <div>
                    <div style={{color:'#fff', fontWeight:600, marginBottom:'4px', fontSize:'0.92rem'}}>Wi-Fi Haut Débit</div>
                    <div style={{color:'rgba(255,255,255,0.6)', fontSize:'0.82rem', lineHeight:1.6}}>Connexion rapide et stable pour vos présentations et visioconférences</div>
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'flex-start', gap:'14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', padding:'18px'}}>
                  <div style={{width:'42px', height:'42px', background:'rgba(62,160,74,0.2)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'20px'}}>🖥️</div>
                  <div>
                    <div style={{color:'#fff', fontWeight:600, marginBottom:'4px', fontSize:'0.92rem'}}>Tableau / Projecteur (sur demande)</div>
                    <div style={{color:'rgba(255,255,255,0.6)', fontSize:'0.82rem', lineHeight:1.6}}>Équipement disponible sur réservation préalable</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade-up" style={{display:'flex', flexDirection:'column', gap:'24px'}}>
              <div style={{borderRadius:'16px', overflow:'hidden', height:'240px'}}>
                <img src="https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=700&q=80" alt="Espace de réunion Club 5 Octobre" style={{width:'100%', height:'100%', objectFit:'cover'}} loading="lazy"/>
              </div>
              <button onClick={openModal} className="btn-primary" style={{width:'100%', padding:'16px', fontSize:'0.95rem', borderRadius:'12px', textAlign:'center', display:'block'}}>
                📅 Réserver l'Espace Rencontres
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DURABILITÉ ===== */}
      <section id="durabilite" style={{background:'var(--beige)', padding:'80px 20px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:'56px'}} className="fade-up flex flex-col items-center">
            <div className="section-tag" style={{justifyContent:'center'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)"><path d="M17 8C8 10 5.9 16.17 3.82 19.09L5.71 21 7 19.7A12.39 12.39 0 0 0 17 8z"/><path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10c0-5.52-4.48-10-10-10z" fill="none" stroke="var(--primary)" strokeWidth="1.5"/></svg>
              Durabilité & Engagement
            </div>
            <h2 className="font-playfair" style={{fontSize:'clamp(2.5rem,4vw,3.5rem)', fontWeight:700, color:'var(--dark)', marginBottom:'16px'}}>
              Notre Engagement <em style={{color:'var(--primary)', fontStyle: 'italic'}}>Vert</em>
            </h2>
            <p style={{color:'#6b7280', maxWidth:'700px', margin:'0 auto', fontSize:'1.1rem', lineHeight:1.8}}>
              En partenariat avec la <strong>Fondation Mohammed VI pour la Protection de l'Environnement</strong>, nous plaçons la durabilité au cœur de chacune de nos actions.
            </p>
            <a href="https://fm6e.org" target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 hover:bg-green-700 transition" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '0.9rem'}}>
              ⭐ Découvrir la Fondation Mohammed VI ↗
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 fade-up">
            {/* Card 1 */}
            <div className="bg-[#edece4] rounded-2xl p-8 border border-gray-200/50 transition-all hover:bg-[#e8e6db]">
              <div style={{fontSize:'2.5rem', marginBottom:'20px'}} className="leaf-float">🌱</div>
              <h3 className="font-sans font-bold text-[#1f2937] text-lg mb-4 leading-tight">Approvisionnement Local & Bio</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Nos ingrédients proviennent de producteurs locaux marocains. Nous favorisons l'agriculture biologique et les circuits courts pour réduire notre empreinte carbone.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#edece4] rounded-2xl p-8 border border-gray-200/50 transition-all hover:bg-[#e8e6db]">
              <div style={{fontSize:'2.5rem', marginBottom:'20px'}}>♻️</div>
              <h3 className="font-sans font-bold text-[#1f2937] text-lg mb-4 leading-tight">Zéro Plastique à Usage Unique</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
                Soutien actif à la campagne <strong className="text-teal-700">#B7arBlaPlastic</strong> de la FM6E. Pailles réutilisables, verres en verre, emballages compostables uniquement.
              </p>
              <span className="inline-block bg-teal-100/50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full">#B7arBlaPlastic</span>
            </div>

            {/* Card 3 */}
            <div className="bg-[#edece4] rounded-2xl p-8 border border-gray-200/50 transition-all hover:bg-[#e8e6db]">
              <div style={{fontSize:'2.5rem', marginBottom:'20px'}}>💡</div>
              <h3 className="font-sans font-bold text-[#1f2937] text-lg mb-4 leading-tight">Efficacité Énergétique</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Éclairage LED dans tout l'espace, appareils basse consommation, et sensibilisation continue de notre équipe aux bonnes pratiques énergétiques.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#edece4] rounded-2xl p-8 border border-gray-200/50 transition-all hover:bg-[#e8e6db]">
              <div style={{fontSize:'2.5rem', marginBottom:'20px'}}>🎓</div>
              <h3 className="font-sans font-bold text-[#1f2937] text-lg mb-4 leading-tight">Éducation Environnementale</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Notre Espace Rencontres accueille régulièrement des ateliers de sensibilisation à l'environnement, en collaboration avec la FM6E et ses programmes éducatifs.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#edece4] rounded-2xl p-8 border border-gray-200/50 transition-all hover:bg-[#e8e6db]">
              <div style={{fontSize:'2.5rem', marginBottom:'20px'}}>🌊</div>
              <h3 className="font-sans font-bold text-[#1f2937] text-lg mb-4 leading-tight">Protection du Littoral</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Participation aux actions de nettoyage des plages de Mohammedia organisées par la FM6E. Chaque achat dans notre café contribue à ces initiatives.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#edece4] rounded-2xl p-8 border border-gray-200/50 transition-all hover:bg-[#e8e6db]">
              <div style={{fontSize:'2.5rem', marginBottom:'20px'}}>🍃</div>
              <h3 className="font-sans font-bold text-[#1f2937] text-lg mb-4 leading-tight">Gestion des Déchets</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Tri sélectif rigoureux, compostage des déchets organiques, et partenariat avec des filières de recyclage locales pour minimiser notre impact.
              </p>
            </div>
          </div>

          {/* Large Deep Green Banner */}
          <div className="bg-[#0b3b42] rounded-[2rem] p-12 text-center text-white relative overflow-hidden fade-up">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div style={{fontSize:'3rem', marginBottom:'16px'}}>🌊</div>
              <h3 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                <span className="text-teal-400 font-sans text-2xl mr-1">#</span>B7arBlaPlastic
              </h3>
              <p className="max-w-2xl mx-auto text-cyan-50 mb-8 leading-relaxed">
                Nous soutenons activement la campagne phare de la Fondation Mohammed VI pour des plages et mers sans plastique. <strong>Ensemble, protégeons le littoral marocain.</strong>
              </p>
              <a href="https://fm6e.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors font-medium text-sm">
                En savoir plus sur FM6E →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALERIE ===== */}
      <section id="galerie" style={{background:'#fff', padding:'80px 20px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:'48px'}} className="fade-up">
            <div className="section-tag" style={{justifyContent:'center'}}>Galerie</div>
            <h2 className="font-playfair" style={{fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:700, color:'var(--dark)', marginBottom:'12px'}}>
              Notre Univers en Images
            </h2>
          </div>
          <div className="gallery-grid fade-up" id="galleryGrid">
            <div className="gallery-item g1" style={{height:'100%', minHeight:'300px'}} onClick={() => openLightbox('https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1000&q=90','Intérieur café')}>
              <img src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80" alt="Intérieur" />
              <div className="overlay"><span style={{color:'#fff', fontSize:'0.82rem', fontWeight:500}}>Intérieur Café</span></div>
            </div>
            <div className="gallery-item" style={{height:'180px'}} onClick={() => openLightbox('https://images.unsplash.com/photo-1481833761820-0509d3217039?w=1000','Thé')}>
              <img src="https://images.unsplash.com/photo-1481833761820-0509d3217039?w=500&q=80" alt="Thé" />
            </div>
            {/* Add more as needed */}
          </div>
        </div>
      </section>

      {/* ===== CONTACT & FOOTER ===== */}
      <section id="contact" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-xl">
            {/* Contact Info */}
            <div className="bg-[#1f2937] text-white p-12 flex flex-col justify-center">
              <h2 className="font-playfair text-4xl font-bold mb-8">Informations Pratiques</h2>
              
              <div className="space-y-6 text-gray-300 font-sans">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 mt-1 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Notre Adresse</h3>
                    <p className="mb-2">4 Rue Brahim Roudani<br/>Mohammedia</p>
                    <a 
                      href="https://maps.app.goo.gl/5gy7x55PCZZGT8i16" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
                    >
                      Ouvrir dans Google Maps
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 mt-1 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Contact</h3>
                    <p>+212 523-324220</p>
                    <p>contact@club5octobre.ma</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 mt-1 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Horaires</h3>
                    <p>Lundi - Dimanche : 12:00 - 00:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="min-h-[400px] lg:min-h-full w-full bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1657.901509177197!2d-7.391219803157297!3d33.70779904294025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7b70744040975%3A0xe53be0307ee4c4e7!2sClub%205%20Octobre!5e0!3m2!1sen!2sma!4v1716912345678!5m2!1sen!2sma" 
                width="100%" 
                height="100%" 
                style={{border: 0, minHeight: '400px'}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location - Club 5 Octobre"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <div id="lightbox" className={lightboxOpen ? 'open' : ''} onClick={closeLightbox}>
        <button onClick={closeLightbox} style={{position:'absolute', top:'20px', right:'24px', color:'#fff', fontSize:'2rem', border:'none', background:'none', cursor:'pointer', zIndex:10}}>✕</button>
        <img id="lightboxImg" src={lightboxSrc} alt="" />
        <div id="lightboxCaption" style={{position:'absolute', bottom:'20px', color:'rgba(255,255,255,0.8)', fontSize:'0.85rem', letterSpacing:'0.05em'}}>{lightboxCaption}</div>
      </div>

      {/* RESERVATION MODAL */}
      <div id="reservationModal" className={modalOpen ? 'open' : ''}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <button onClick={closeModal} style={{position:'absolute', top:'16px', right:'20px', fontSize:'1.4rem', border:'none', background:'none', cursor:'pointer', color:'#9ca3af', lineHeight:1}}>✕</button>
          
          <div style={{textAlign:'center', marginBottom:'28px'}}>
            <div style={{width:'56px', height:'56px', background:'linear-gradient(135deg,var(--primary),var(--teal))', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:'24px'}}>📅</div>
            <h2 className="font-playfair" style={{fontSize:'1.6rem', fontWeight:700, color:'var(--dark)', marginBottom:'6px'}}>Réserver l'Espace Rencontres</h2>
          </div>

          <div id="formSuccess" className={formSuccess ? 'show' : ''} style={{background:'linear-gradient(135deg,rgba(62,160,74,0.1),rgba(0,93,109,0.1))', border:'2px solid rgba(62,160,74,0.3)', borderRadius:'16px', padding:'32px', textAlign:'center'}}>
            <div style={{fontSize:'3rem', marginBottom:'12px'}}>✅</div>
            <h3 className="font-playfair" style={{fontSize:'1.4rem', fontWeight:700, color:'var(--primary)', marginBottom:'8px'}}>Demande envoyée !</h3>
            <button type="button" onClick={resetForm} className="btn-primary" style={{fontSize:'0.85rem'}}>Nouvelle réservation</button>
          </div>

          <form id="reservationForm" onSubmit={handleSubmit(onSubmitReservation)} style={{display: formSuccess ? 'none' : 'block'}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px'}}>
              <div style={{gridColumn: '1 / -1'}}>
                <label className="form-label" style={{display:'block', marginBottom:'4px', fontSize:'0.9rem', fontWeight:600}}>Nom complet *</label>
                <input type="text" className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} placeholder="Votre nom complet" {...register('full_name')} />
                {errors.full_name && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.full_name.message}</p>}
              </div>
              <div style={{gridColumn: '1 / -1'}}>
                <label className="form-label" style={{display:'block', marginBottom:'4px', fontSize:'0.9rem', fontWeight:600}}>Email *</label>
                <input type="email" className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} placeholder="votre@email.com" {...register('email')} />
                {errors.email && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.email.message}</p>}
              </div>
              <div>
                <label className="form-label" style={{display:'block', marginBottom:'4px', fontSize:'0.9rem', fontWeight:600}}>Téléphone *</label>
                <input type="tel" className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} placeholder="+212 6XX XX XX XX" {...register('phone')} />
                {errors.phone && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.phone.message}</p>}
              </div>
              <div>
                <label className="form-label" style={{display:'block', marginBottom:'4px', fontSize:'0.9rem', fontWeight:600}}>Date *</label>
                <input type="date" className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} {...register('reservation_date')} />
                {errors.reservation_date && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.reservation_date.message}</p>}
              </div>
              <div>
                <label className="form-label" style={{display:'block', marginBottom:'4px', fontSize:'0.9rem', fontWeight:600}}>Horaires *</label>
                <div style={{display:'flex', gap:'8px'}}>
                  <div style={{flex:1}}>
                    <input type="time" className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} placeholder="Début" {...register('start_time')} />
                  </div>
                  <div style={{flex:1}}>
                    <input type="time" className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} placeholder="Fin" {...register('end_time')} />
                  </div>
                </div>
                {(errors.start_time || errors.end_time) && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>Horaires requis</p>}
              </div>
              <div>
                <label className="form-label" style={{display:'block', marginBottom:'4px', fontSize:'0.9rem', fontWeight:600}}>Nombre de personnes *</label>
                <input type="number" min="1" max="50" className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} {...register('guests', { valueAsNumber: true })} />
                {errors.guests && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.guests.message}</p>}
              </div>
              <div>
                <label className="form-label" style={{display:'block', marginBottom:'4px', fontSize:'0.9rem', fontWeight:600}}>Langue d'échange</label>
                <select className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} {...register('language')}>
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="ar">Arabe</option>
                </select>
              </div>
              <div style={{gridColumn: '1 / -1'}}>
                <label className="form-label" style={{display:'block', marginBottom:'4px', fontSize:'0.9rem', fontWeight:600}}>Besoins spécifiques</label>
                <textarea className="form-input" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} placeholder="Rétroprojecteur, tableau blanc, etc." {...register('notes')} rows={2}></textarea>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{width:'100%', padding:'14px', fontSize:'0.95rem', borderRadius:'12px', border:'none', cursor:'pointer', opacity: isSubmitting ? 0.7 : 1}}>
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande de réservation ✓'}
            </button>
          </form>
        </div>
      </div>

      <button onClick={openModal} id="floatBtn" style={{display: scrolled ? 'flex' : 'none', position:'fixed', bottom:'24px', right:'24px', zIndex:500, background:'linear-gradient(135deg,var(--primary),var(--teal))', color:'#fff', border:'none', padding:'14px 20px', borderRadius:'50px', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', boxShadow:'0 8px 25px rgba(62,160,74,0.4)', transition:'all 0.3s', alignItems:'center', gap:'8px'}} aria-label="Réserver l'Espace Rencontres">
        📅 Réserver
      </button>

    </div>
  );
}
