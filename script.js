/**
 * Lover Paint – Premium Art Portfolio Website
 * Vanilla JavaScript Engine
 * Author: Lover Paint Atelier
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Configurable Atelier Constants
  const ATELIER_PHONE = '15550192834'; // Configurable WhatsApp concierge number
  const INTRO_STORAGE_KEY = 'lover_paint_intro_seen_v1';

  /* ==========================================================================
     1. CUSTOM LUXURY ART CURSOR
     ========================================================================== */
  const initCustomCursor = () => {
    const cursor = document.getElementById('customCursor');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        cursor.style.opacity = '1';
        isMoving = true;
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    window.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      isMoving = false;
    });

    window.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });

    // Smooth lerp loop for the outer ring
    const renderCursorRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursorRing);
    };
    renderCursorRing();

    // Hover interactive state for clickable elements
    const interactiveSelectors = 'a, button, input, select, textarea, .gallery-card, .before-after-container, .pricing-card, .lightbox-frame-wrap, [role="tab"]';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.remove('cursor-hover');
      }
    });
  };

  /* ==========================================================================
     2. CINEMATIC INTRO EXPERIENCE
     ========================================================================== */
  const initCinematicIntro = () => {
    const introOverlay = document.getElementById('introOverlay');
    const exploreBtn = document.getElementById('exploreArtBtn');
    const skipBtn = document.getElementById('skipIntroBtn');
    const wipe = document.getElementById('cinematicWipe');
    const replayHeaderBtn = document.getElementById('replayIntroBtn');
    const replayMobileBtn = document.getElementById('mobileReplayIntro');
    const replayFooterBtn = document.getElementById('footerReplayIntro');
    const canvas = document.getElementById('introCanvas');

    if (!introOverlay) return;

    // Canvas Paint Particle System
    let ctx, animationFrameId;
    let particles = [];
    const colors = [
      'rgba(212, 175, 55, 0.45)', // Gold leaf
      'rgba(200, 90, 67, 0.40)',  // Terracotta
      'rgba(226, 149, 120, 0.35)', // Soft Rose
      'rgba(243, 229, 171, 0.50)', // Light Gold
      'rgba(15, 27, 53, 0.20)'    // Navy pigment
    ];

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3.5 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.alphaSpeed = (Math.random() - 0.5) * 0.008;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += this.alphaSpeed;

        if (this.alpha <= 0.1 || this.alpha >= 0.8) {
          this.alphaSpeed = -this.alphaSpeed;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const initParticles = () => {
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const count = Math.min(70, Math.floor(window.innerWidth / 20));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }

      const loopParticles = () => {
        if (!introOverlay.classList.contains('hidden')) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(p => {
            p.update();
            p.draw();
          });
          animationFrameId = requestAnimationFrame(loopParticles);
        }
      };
      loopParticles();
    };

    // Exit Intro Animation Function
    const exitIntro = (isCinematic = true) => {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');

      if (isCinematic && wipe) {
        wipe.classList.add('active');
        setTimeout(() => {
          introOverlay.classList.add('hidden');
          document.body.classList.remove('intro-active');
          if (animationFrameId) cancelAnimationFrame(animationFrameId);

          setTimeout(() => {
            wipe.classList.remove('active');
          }, 450);
        }, 500);
      } else {
        introOverlay.classList.add('hidden');
        document.body.classList.remove('intro-active');
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    };

    // Replay Intro Function
    const replayIntro = () => {
      // Close mobile drawer if open
      const mobileDrawer = document.getElementById('mobileDrawer');
      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      if (mobileDrawer) mobileDrawer.classList.remove('active');
      if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.classList.add('intro-active');
      introOverlay.classList.remove('hidden');

      // Restart stroke & logo animations by refreshing container
      const logoContainer = introOverlay.querySelector('.logo-brush-container');
      if (logoContainer) {
        const clone = logoContainer.cloneNode(true);
        logoContainer.parentNode.replaceChild(clone, logoContainer);
      }

      initParticles();
    };

    // Check session storage
    const hasSeenIntro = sessionStorage.getItem(INTRO_STORAGE_KEY);
    if (hasSeenIntro === 'true') {
      introOverlay.classList.add('hidden');
      document.body.classList.remove('intro-active');
    } else {
      document.body.classList.add('intro-active');
      initParticles();
    }

    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => exitIntro(true));
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => exitIntro(false));
    }

    [replayHeaderBtn, replayMobileBtn, replayFooterBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', (e) => {
        e.preventDefault();
        replayIntro();
      });
    });
  };

  /* ==========================================================================
     3. NAVIGATION HEADER & MOBILE DRAWER
     ========================================================================== */
  const initNavigation = () => {
    const header = document.getElementById('mainHeader');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileDrawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Sticky navbar backdrop on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    // Mobile Toggle & Backdrop
    const backdrop = document.getElementById('drawerBackdrop');
    const closeBtn = document.getElementById('drawerCloseBtn');

    const openDrawer = () => {
      drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        if (drawer.classList.contains('active')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });

      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      if (backdrop) backdrop.addEventListener('click', closeDrawer);

      mobileLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
      });
    }

    // Set dynamic current year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
  };

  /* ==========================================================================
     4. HERO SECTION PARALLAX
     ========================================================================== */
  const initHeroParallax = () => {
    const stage = document.getElementById('heroVisualStage');
    if (!stage || window.matchMedia('(pointer: coarse)').matches) return;

    const parallaxItems = stage.querySelectorAll('[data-parallax]');

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      parallaxItems.forEach(item => {
        const factor = parseFloat(item.getAttribute('data-parallax')) || 0.05;
        const moveX = relX * factor * 140;
        const moveY = relY * factor * 140;
        item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    stage.addEventListener('mouseleave', () => {
      parallaxItems.forEach(item => {
        item.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  };

  /* ==========================================================================
     5. ARTWORK GALLERY FILTERING & MASONRY
     ========================================================================== */
  const initGallery = () => {
    const filterButtons = document.querySelectorAll('.gallery-filter-bar .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCategories = item.getAttribute('data-category') || '';
          if (filterValue === 'all' || itemCategories.includes(filterValue)) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 60);
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  };

  /* ==========================================================================
     6. INTERACTIVE BEFORE & AFTER SLIDER
     ========================================================================== */
  const initBeforeAfterSlider = () => {
    const container = document.getElementById('beforeAfterSlider');
    const artLayer = document.getElementById('artLayerClip');
    const divider = document.getElementById('sliderDivider');
    const btnPhoto = document.getElementById('btnShowPhoto');
    const btnHalf = document.getElementById('btnShowHalf');
    const btnArt = document.getElementById('btnShowPainting');

    if (!container || !artLayer || !divider) return;

    let isDragging = false;

    const setSliderPosition = (percentage) => {
      // Clamp between 3% and 97% for smooth visibility
      const clamped = Math.max(3, Math.min(97, percentage));
      artLayer.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
      divider.style.left = `${clamped}%`;
    };

    const updateFromPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const pct = (offsetX / rect.width) * 100;
      setSliderPosition(pct);
    };

    // Mouse Events
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateFromPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateFromPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Events for Mobile & Tablet with directional check
    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        updateFromPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - touchStartX);
      const diffY = Math.abs(currentY - touchStartY);

      // If user is actively dragging horizontally across the comparison slider
      if (diffX > diffY) {
        updateFromPosition(currentX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Quick Action Buttons
    const clearQuickBtnActive = () => {
      [btnPhoto, btnHalf, btnArt].forEach(b => b && b.classList.remove('active'));
    };

    if (btnPhoto) {
      btnPhoto.addEventListener('click', () => {
        clearQuickBtnActive();
        btnPhoto.classList.add('active');
        setSliderPosition(5); // Show raw photo
      });
    }

    if (btnHalf) {
      btnHalf.addEventListener('click', () => {
        clearQuickBtnActive();
        btnHalf.classList.add('active');
        setSliderPosition(50); // 50 / 50
      });
    }

    if (btnArt) {
      btnArt.addEventListener('click', () => {
        clearQuickBtnActive();
        btnArt.classList.add('active');
        setSliderPosition(95); // Show painting
      });
    }

    // Initial position
    setSliderPosition(50);
  };

  /* ==========================================================================
     7. FULLSCREEN ART LIGHTBOX MODAL
     ========================================================================== */
  const initLightbox = () => {
    const modal = document.getElementById('artworkLightbox');
    const backdrop = document.getElementById('lightboxBackdrop');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');
    const imgEl = document.getElementById('lightboxImg');
    const frameWrap = modal ? modal.querySelector('.lightbox-frame-wrap') : null;
    const titleEl = document.getElementById('lightboxTitle');
    const specEl = document.getElementById('lightboxSpec');
    const descEl = document.getElementById('lightboxDesc');
    const categoryEl = document.getElementById('lightboxCategory');
    const commissionLink = document.getElementById('lightboxCommissionLink');

    if (!modal) return;

    // Gather all gallery cards
    const cards = Array.from(document.querySelectorAll('.gallery-card'));
    let currentIndex = 0;

    const getCardData = (index) => {
      const card = cards[index];
      if (!card) return null;
      const img = card.querySelector('.gallery-art-img');
      const title = card.querySelector('.art-title')?.textContent || 'Lover Paint Masterpiece';
      const spec = card.querySelector('.art-medium')?.textContent || 'Hand-Painted on Belgian Linen';
      const desc = card.querySelector('.art-story')?.textContent || '';
      const category = card.querySelector('.card-category-pill')?.textContent || 'Art Collection';

      return {
        src: img ? img.src : '',
        alt: img ? img.alt : '',
        title,
        spec,
        desc,
        category
      };
    };

    const updateLightboxContent = (index) => {
      const data = getCardData(index);
      if (!data) return;

      currentIndex = index;
      imgEl.src = data.src;
      imgEl.alt = data.alt;
      titleEl.textContent = data.title;
      specEl.textContent = data.spec;
      descEl.textContent = data.desc;
      categoryEl.textContent = data.category;

      if (commissionLink) {
        const text = encodeURIComponent(`Hello Lover Paint! I am captivated by "${data.title}" (${data.spec}). Could you share commission details for a custom portrait in this style?`);
        commissionLink.href = `https://wa.me/${ATELIER_PHONE}?text=${text}`;
      }

      // Reset zoom
      if (frameWrap) frameWrap.classList.remove('zoomed');
    };

    const openLightbox = (index) => {
      updateLightboxContent(index);
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (frameWrap) frameWrap.classList.remove('zoomed');
    };

    // Attach click triggers to cards
    cards.forEach((card, index) => {
      const triggerBtn = card.querySelector('.lightbox-trigger-btn');
      const imgWrap = card.querySelector('.art-img-wrapper');

      if (triggerBtn) {
        triggerBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(index);
        });
      }

      if (imgWrap) {
        imgWrap.addEventListener('click', () => {
          openLightbox(index);
        });
      }
    });

    // Close handlers
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    // Prev / Next Navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateLightboxContent(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % cards.length;
        updateLightboxContent(newIndex);
      });
    }

    // Toggle Zoom on click
    if (frameWrap) {
      frameWrap.addEventListener('click', () => {
        frameWrap.classList.toggle('zoomed');
      });
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
    });
  };

  /* ==========================================================================
     8. CUSTOM INQUIRY MODAL & WHATSAPP GENERATOR
     ========================================================================== */
  const initInquiryModal = () => {
    const modal = document.getElementById('inquiryModal');
    const openBtns = [
      document.getElementById('openInquiryBtn'),
      document.getElementById('footerOpenInquiryBtn')
    ];
    const closeBtn = document.getElementById('inquiryCloseBtn');
    const backdrop = document.getElementById('inquiryBackdrop');
    const form = document.getElementById('customInquiryForm');

    if (!modal) return;

    const openModal = () => {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    openBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Handle Form Submission -> WhatsApp
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const style = document.getElementById('artStyleSelect').value;
        const subjects = document.getElementById('subjectCount').value;
        const size = document.getElementById('preferredSize').value;
        const story = document.getElementById('memoryStory').value.trim();

        let messageLines;
        if (currentLang === 'ar') {
          messageLines = [
            `*طلب تفصيل لوحة فنية جديدة – لوفر بينت (Lover Paint)*`,
            `--------------------------------------`,
            `👤 *اسم العميل:* ${name}`,
            `📞 *رقم الهاتف / الواتساب:* ${phone}`,
            `🎨 *الأسلوب الفني المفضل:* ${style}`,
            `👥 *عدد الأشخاص باللوحة:* ${subjects}`,
            `🖼️ *المقاس المطلوب:* ${size}`,
          ];
          if (story) {
            messageLines.push(`📝 *تفاصيل وملاحظات الذكرى:* ${story}`);
          }
          messageLines.push(``, `مرحباً أتيليه لوفر بينت! أود مناقشة تفاصيل تحويل هذه الصورة إلى لوحة فنية يدوية فاخرة.`);
        } else {
          messageLines = [
            `*New Custom Painting Inquiry – Lover Paint*`,
            `--------------------------------------`,
            `👤 *Client Name:* ${name}`,
            `📞 *Contact Phone:* ${phone}`,
            `🎨 *Art Style:* ${style}`,
            `👥 *Subjects:* ${subjects}`,
            `🖼️ *Approximate Size:* ${size}`,
          ];
          if (story) {
            messageLines.push(`📝 *Occasion / Story Notes:* ${story}`);
          }
          messageLines.push(``, `Hello Lover Paint Atelier! I would love to discuss turning this memory into a fine art painting.`);
        }

        const encodedMsg = encodeURIComponent(messageLines.join('\n'));
        const whatsappUrl = `https://wa.me/${ATELIER_PHONE}?text=${encodedMsg}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        closeModal();
        form.reset();
      });
    }
  };

  /* ==========================================================================
     9. TESTIMONIALS CAROUSEL
     ========================================================================== */
  const initTestimonials = () => {
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const dots = Array.from(document.querySelectorAll('#carouselDots .dot'));
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const track = document.getElementById('testimonialTrack');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let timer = null;

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    const nextSlide = () => showSlide(currentIndex + 1);
    const prevSlide = () => showSlide(currentIndex - 1);

    const startAutoPlay = () => {
      stopAutoPlay();
      timer = setInterval(nextSlide, 7500);
    };

    const stopAutoPlay = () => {
      if (timer) clearInterval(timer);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startAutoPlay();
      });
    });

    if (track) {
      track.addEventListener('mouseenter', stopAutoPlay);
      track.addEventListener('mouseleave', startAutoPlay);

      // Touch swipe gestures
      let touchStartX = 0;
      track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) nextSlide();
          else prevSlide();
          startAutoPlay();
        }
      }, { passive: true });
    }

    startAutoPlay();
  };

  /* ==========================================================================
     10. SCROLL REVEAL OBSERVER (IntersectionObserver)
     ========================================================================== */
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => observer.observe(el));
  };

  /* ==========================================================================
     11. BILINGUAL INTERNATIONALIZATION (i18n: EN & AR)
     ========================================================================== */
  let currentLang = 'en';

  const translations = {
    en: {
      intro_skip: "Skip Intro",
      intro_tagline: "Every Face Has a Story.<br>Every Painting Keeps It Forever.",
      intro_sub: "Paint Your Memories",
      intro_explore: "Explore The Art",
      nav_brand_sub: "Fine Art Atelier",
      nav_gallery: "Gallery",
      nav_custom: "Custom Portraits",
      nav_process: "Our Process",
      nav_why: "Why Lover Paint",
      nav_stories: "Stories",
      nav_pricing: "Sizing & Pricing",
      nav_intro_btn: "Intro",
      nav_cta: "Turn Photo Into Art",
      mobile_drawer_title: "Menu",
      mobile_whatsapp_concierge: "WhatsApp Concierge",
      mobile_replay_intro: "Replay Cinematic Intro",
      hero_pill: "Fine Art Commissions Available",
      hero_headline: "Your Memories,<br>Turned Into <span class=\"gold-italic\">Art</span>.",
      hero_sub: "Transform your favorite moments into timeless hand-painted masterpieces. 100% human-crafted on museum-grade Belgian canvas.",
      hero_cta_gallery: "Explore Our Gallery",
      hero_cta_custom: "Create Your Portrait",
      hero_trust_handpainted: "100% Hand-Painted",
      hero_trust_linen: "Museum Belgian Linen",
      hero_trust_shipping: "Worldwide Insured Delivery",
      hero_scroll_hint: "Scroll to Explore",
      gallery_eyebrow: "The Atelier Collection",
      gallery_title: "Timeless Handcrafted Works",
      gallery_sub: "Each canvas is built stroke by stroke with premium oil and watercolor pigments, capturing the soul and emotion of every photograph.",
      filter_all: "All Works",
      filter_portraits: "Portraits",
      filter_couples: "Couples",
      filter_family: "Family",
      filter_watercolor: "Watercolor",
      filter_canvas: "Canvas Art",
      filter_gifts: "Custom Gifts",
      art_title_1: "Eternal Devotion",
      art_desc_1: "Couple portrait capturing warm golden hour light and soft romantic glaze.",
      art_title_2: "Generations of Grace",
      art_desc_2: "Multi-generational family portrait rendered in rich classical oil tones.",
      art_title_3: "Whispers in Rose",
      art_desc_3: "Fine watercolor painting on cold-press archival paper with luminous washes.",
      art_title_4: "The Matriarch's Legacy",
      art_desc_4: "Solo grandmother portrait painted with deep compassion and lifelike depth.",
      art_title_5: "Golden Symphony",
      art_desc_5: "Contemporary heavy impasto canvas created with metallic palette knife textures.",
      art_title_6: "The Promise Kept",
      art_desc_6: "Sentimental wedding anniversary keepsake with hand-applied gold leaf.",
      ba_eyebrow: "The Custom Portrait Experience",
      ba_title: "Your Photo. Our Art.<br><span class=\"rose-script\">A Memory Forever.</span>",
      ba_desc: "Slide to reveal how our master artists transform an everyday mobile photograph into a museum-worthy fine art masterpiece.",
      ba_tag_photo: "Original Customer Photo",
      ba_tag_art: "Hand-Painted Masterpiece",
      ba_drag_hint: "Drag slider or tap below",
      ba_btn_original: "Original Photo",
      ba_btn_split: "50/50 Comparison",
      ba_btn_painting: "Hand Painting",
      ba_feature_1: "No automated digital filters — 100% hand-painted by master artists",
      ba_feature_2: "Combine multiple photos into one cohesive, harmonious portrait",
      ba_feature_3: "Unlimited revisions until you are completely in love with the result",
      ba_cta_whatsapp: "Turn My Photo Into Art",
      ba_cta_estimate: "Get a Custom Estimate",
      process_eyebrow: "Our Master Process",
      process_title: "From Cherished Photo to Wall Masterpiece",
      process_sub: "Every commission follows our meticulous four-stage artisanal journey.",
      step_1_title: "Choose Your Photo",
      step_1_desc: "Send us your favorite personal photos. Even older or low-resolution pictures can be restored and enhanced by our artistic eye.",
      step_2_title: "Select Your Art Style",
      step_2_desc: "Choose between rich classical oil on canvas, luminous watercolor, textured palette knife impasto, or charcoal gold leaf.",
      step_3_title: "Our Artists Paint",
      step_3_desc: "Our master painters handcraft your canvas stroke by stroke. You receive high-resolution photo and video updates of the painting process.",
      step_4_title: "Receive Your Masterpiece",
      step_4_desc: "After your final approval, the canvas is cured, varnished, framed, and shipped insured in our signature presentation packaging.",
      why_eyebrow: "The Atelier Standard",
      why_title: "Why Lover Paint",
      why_sub: "We believe art should be deeply emotional, tangible, and built to survive generations.",
      pillar_1_title: "Handcrafted Artistic Work",
      pillar_1_desc: "Zero AI filters or automated prints. Every single brush stroke is placed with intention and emotion by seasoned portrait artists.",
      pillar_2_title: "Personalized Designs",
      pillar_2_desc: "Merge separate photos into one painting, change clothing or backgrounds, or restore departed loved ones into family gatherings.",
      pillar_3_title: "Premium Canvas & Pigment",
      pillar_3_desc: "We exclusively use triple-primed Belgian linen and lightfast European pigments tested to resist fading for over 100 years.",
      pillar_4_title: "Meaningful Luxury Gifts",
      pillar_4_desc: "Unforgettable for weddings, anniversaries, birthdays, and memorials. Arrives in bespoke silk-ribboned art packaging.",
      pillar_5_title: "Attention to Every Detail",
      pillar_5_desc: "From color grading to hand-stretched stretcher bars and custom gold-leaf floating frames, no detail is ever compromised.",
      pricing_eyebrow: "Commission Guide",
      pricing_title: "Select Your Canvas Dimension",
      pricing_sub: "Transparent atelier pricing with framing options, unlimited revisions, and worldwide insured packaging included.",
      pricing_tier1_name: "The Keepsake",
      pricing_tier1_dim: "12\" × 16\" (30 × 40 cm)",
      pricing_tier1_desc: "Perfect for bedroom side tables, romantic anniversaries, and personal desks.",
      pricing_tier2_name: "The Heirloom",
      pricing_tier2_dim: "20\" × 28\" (50 × 70 cm)",
      pricing_tier2_badge: "Most Requested",
      pricing_tier2_desc: "Our signature centerpiece size for living rooms, couple portraits, and mantle displays.",
      pricing_tier3_name: "The Estate",
      pricing_tier3_dim: "30\" × 40\" (75 × 100 cm)",
      pricing_tier3_desc: "Magnificent grand-scale gallery canvas designed to command grand walls and dining halls.",
      pricing_cta: "Commission This Size",
      testimonials_eyebrow: "Collector Stories",
      testimonials_title: "Loved by Families & Couples Worldwide",
      test_1_quote: "Seeing our wedding photograph transformed into this breathtaking oil painting moved my wife to tears. The texture of the canvas and warmth of our faces is something a printed photo could never capture. An heirloom for our children.",
      test_1_author: "Marcus & Elena Vance",
      test_1_loc: "Zurich, Switzerland • 20\" × 28\" Oil on Canvas",
      test_2_quote: "My grandfather passed away before meeting our daughter. The Lover Paint atelier combined two separate photos and painted him holding her in his arms. It brought our whole family unimaginable peace and joy.",
      test_2_author: "Dr. Sarah Thornton",
      test_2_loc: "London, UK • 24\" × 36\" Family Memorial",
      test_3_quote: "The customer concierge on WhatsApp was phenomenal. They sent photos while the artist was laying down the impasto highlights and adjusted the background tone exactly as I requested. Delivered in a stunning wooden crate.",
      test_3_author: "Arthur & Camille Dupuis",
      test_3_loc: "Paris, France • Watercolor Portrait",
      final_eyebrow: "Preserve What Matters Most",
      final_title: "Some Moments Deserve<br><span class=\"rose-gold-script\">More Than a Photo.</span>",
      final_sub: "Let us turn your favorite memories into something you can touch, cherish, and keep forever on real canvas.",
      final_cta_btn: "Create Your Custom Painting",
      final_whatsapp_btn: "Speak to an Artist",
      footer_bio: "An independent fine art atelier dedicated to translating personal photographic moments into timeless, hand-painted museum-grade oil and watercolor heirlooms.",
      footer_collections: "Collections",
      footer_atelier: "Atelier",
      footer_concierge: "Direct Concierge",
      concierge_sub: "Have a question regarding custom portraits, sizing, or photo combination?",
      btn_concierge: "WhatsApp Artist Concierge",
      studio_hours: "Studio Hours: Mon - Sat • 9am - 8pm CET",
      worldwide_ship: "Worldwide Insured Shipping",
      copyright_rights: "Fine Art Atelier. All rights reserved.",
      lightbox_zoom_hint: "Click image to toggle zoom",
      lightbox_commission_btn: "Commission Similar Painting",
      modal_title: "Begin Your Custom Painting",
      modal_sub: "Tell us about the memory you wish to paint. We will prepare style recommendations and a tailored estimate.",
      modal_name_label: "Your Name",
      modal_name_ph: "e.g. Julian Hayes",
      modal_phone_label: "WhatsApp / Phone",
      modal_phone_ph: "e.g. +1 555 123 4567",
      modal_style_label: "Preferred Art Style",
      modal_style_oil: "Classic Oil on Canvas (Rich & Textured)",
      modal_style_wc: "Fine Art Watercolor (Soft & Luminous)",
      modal_style_acrylic: "Modern Acrylic Palette Knife (Bold Impasto)",
      modal_style_charcoal: "Vintage Charcoal & Gold Accents",
      modal_style_recommend: "I Need Artist Recommendation",
      modal_subjects_label: "Number of Subjects",
      modal_subj_1: "1 Subject (Solo)",
      modal_subj_2: "2 Subjects (Couple)",
      modal_subj_3: "3-4 Subjects (Family)",
      modal_subj_5: "5+ Subjects (Extended Family)",
      modal_subj_pet: "Beloved Pet or Pet & Owner",
      modal_size_label: "Approximate Desired Size",
      modal_size_1: "The Keepsake — 12\" × 16\"",
      modal_size_2: "The Heirloom — 20\" × 28\" (Most Popular)",
      modal_size_3: "The Estate — 30\" × 40\" (Grand Wall Centerpiece)",
      modal_size_custom: "Custom Dimension",
      modal_story_label: "Tell Us About the Memory (Optional)",
      modal_story_ph: "Tell us about the occasion (anniversary, wedding, memorial, birthday) or special details you'd like our painter to focus on...",
      modal_submit_btn: "Send Details to WhatsApp Atelier",
      fab_chat: "Chat with Atelier"
    },
    ar: {
      intro_skip: "تخطي المقدمة",
      intro_tagline: "لكل وجهٍ حكاية ورواية.<br>ولكل لوحةٍ خلودٌ يحفظ الذكرى للأبد.",
      intro_sub: "خلّد ذكرياتك بالفن",
      intro_explore: "استكشف عالم اللوحات",
      nav_brand_sub: "أتيليه الفنون الراقية",
      nav_gallery: "معرض اللوحات",
      nav_custom: "لوحات مخصصة",
      nav_process: "خطوات العمل",
      nav_why: "لماذا لوفر بينت",
      nav_stories: "تجارب العملاء",
      nav_pricing: "المقاسات والأسعار",
      nav_intro_btn: "المقدمة",
      nav_cta: "حوّل صورتك للوحة",
      mobile_drawer_title: "القائمة",
      mobile_whatsapp_concierge: "محادثة الأتيليه واتساب",
      mobile_replay_intro: "إعادة تشغيل المقدمة",
      hero_pill: "الحجوزات الفنية مفتوحة للطلب",
      hero_headline: "ذكرياتك الثمينة،<br>تتحول إلى <span class=\"gold-italic\">تحفةٍ فنية</span>.",
      hero_sub: "حوّل لحظاتك المفضلة إلى روائع فنية مرسومة باليد. صناعة فنية أصيلة 100% بأنامل فنانين محترفين على قماش كانفاس بلجيكي فاخر.",
      hero_cta_gallery: "استكشف المعرض الفني",
      hero_cta_custom: "اصنع لوحتك الخاصة",
      hero_trust_handpainted: "رسم يدوي أصيل 100%",
      hero_trust_linen: "كانفاس كتاني بلجيكي فاخر",
      hero_trust_shipping: "شحن آمن ومؤمن عالمياً",
      hero_scroll_hint: "مرر للاستكشاف",
      gallery_eyebrow: "مجموعة أعمال الأتيليه",
      gallery_title: "روائع فنية خالدة رسمت باليد",
      gallery_sub: "كل لوحة تُبنى ضربة ريشة تلو الأخرى بأجود أصباغ الزيت والألوان المائية، لتخليد الروح والعاطفة الكامنة في كل صورة.",
      filter_all: "جميع الأعمال",
      filter_portraits: "بورتريه شخصي",
      filter_couples: "ثنائي وكبلز",
      filter_family: "عائلي وتذكاري",
      filter_watercolor: "ألوان مائية",
      filter_canvas: "كانفاس زيتي",
      filter_gifts: "هدايا فاخرة",
      art_title_1: "وفاء أبدي",
      art_desc_1: "بورتريه ثنائي يجسد ضوء الغروب الدافئ ولمسات رومانسية حالمة.",
      art_title_2: "أجيال من المحبة",
      art_desc_2: "بورتريه عائلي يجمع الأجيال بألوان زيتية كلاسيكية غنية.",
      art_title_3: "همسات وردية",
      art_desc_3: "لوحة مائية رقيقة على ورق أرشيفي قطني بإشراقة لونية ناعمة.",
      art_title_4: "وقار وسكينة",
      art_desc_4: "بورتريه فردي للجدة مرسوم بحميمية وعمق شاعري مفعم بالحياة.",
      art_title_5: "سيمفونية ذهبية",
      art_desc_5: "لوحة كانفاس معاصرة بضربات سكين بارزة ولمسات ميتاليك ساحرة.",
      art_title_6: "عهد المحبة",
      art_desc_6: "لوحة تذكارية لذكرى الزواج مطعّمة بورق الذهب الخالص.",
      ba_eyebrow: "تجربة اللوحة المخصصة",
      ba_title: "صورتك. فننا.<br><span class=\"rose-script\">ذكرى خالدة للأبد.</span>",
      ba_desc: "اسحب مؤشر المقارنة لتشاهد كيف يحول فنانونا المحترفون صورة هاتف عادية إلى تحفة فنية متحفية تليق بأفخم جدران منزلك.",
      ba_tag_photo: "الصورة الأصلية للعميل",
      ba_tag_art: "اللوحة الفنية اليدوية",
      ba_drag_hint: "اسحب المؤشر أو اضغط أدناه",
      ba_btn_original: "الصورة الأصلية",
      ba_btn_split: "مقارنة متوازنة",
      ba_btn_painting: "اللوحة الفنية",
      ba_feature_1: "رسم يدوي حقيقي 100% دون أي فلاتر رقمية أو طباعة مزيفة",
      ba_feature_2: "إمكانية دمج عدة صور منفصلة لأشخاص في لوحة واحدة متناسقة",
      ba_feature_3: "مراجعات وتعديلات غير محدودة حتى ترضى تماماً عن النتيجة",
      ba_cta_whatsapp: "حوّل صورتي لتحفة فنية",
      ba_cta_estimate: "طلب استشارة ومقاس مخصص",
      process_eyebrow: "خطوات إبداع لوحتك",
      process_title: "من صورتك المفضلة إلى لوحة فنية معلقة",
      process_sub: "تمر كل لوحة بـ 4 مراحل فنية دقيقة لضمان أعلى مستويات الفخامة والجودة.",
      step_1_title: "اختر صورتك المفضلة",
      step_1_desc: "أرسل صورك المفضلة عبر واتساب. حتى الصور القديمة أو منخفضة الجودة يستطيع فنانونا معالجتها وإبراز ملامحها بدقة.",
      step_2_title: "اختر النمط الفني",
      step_2_desc: "اختر الأسلوب المحبب إليك: زيتي كلاسيكي، ألوان مائية ناعمة، أكريليك بارز بالسكين، أو فحم بلمسات ذهبية.",
      step_3_title: "فنانونا يرسمون لوحتك",
      step_3_desc: "يبدأ فنانونا برسم اللوحة يدوياً بكل إتقان، مع إرسال صور وفيديوهات لمراحل تقدم العمل لمشاركتك لحظات الإبداع.",
      step_4_title: "استلم تحفتك الفنية",
      step_4_desc: "بعد موافقتك النهائية، تُعالج اللوحة بطبقة حماية ضد الزمن، وتؤطّر بعناية وتُشحن في تغليف ملكي فاخر ومؤمن.",
      why_eyebrow: "معايير الأتيليه",
      why_title: "لماذا تختار لوفر بينت؟",
      why_sub: "نؤمن أن الفن الحقيقي يحمل مشاعر حية، ويبقى إرثاً أصيلاً تتوارثه الأجيال.",
      pillar_1_title: "رسم يدوي خالص 100%",
      pillar_1_desc: "لا نستخدم الذكاء الاصطناعي أو الفلاتر الرقمية؛ كل خطوة ولمسة ريشة تُرسم بمشاعر فنان حقيقي.",
      pillar_2_title: "تصاميم مخصصة بالكامل",
      pillar_2_desc: "إمكانية دمج صور مختلفة، تغيير الخلفيات أو الملابس، ورسم من غابوا لجمع شمل العائلة في لوحة واحدة.",
      pillar_3_title: "أقمشة وألوان متحفية",
      pillar_3_desc: "نستخدم فقط قماش الكانفاس الكتاني البلجيكي مع أصباغ أوروبية مقاومة للضوء والتلاشي لأكثر من 100 عام.",
      pillar_4_title: "هدايا استثنائية لا تُنسى",
      pillar_4_desc: "الهدية الأرقى لذكرى الزواج، أعياد الميلاد، واللحظات الخاصة، تأتي بتغليف فاخر يليق بالمناسبة.",
      pillar_5_title: "عناية فائقة بأدق التفاصيل",
      pillar_5_desc: "من تدرج الألوان إلى شد القماش يدوياً والإطارات المذهبة العائمة، لا نساوم أبداً على الإتقان.",
      pricing_eyebrow: "دليل المقاسات والاستثمار",
      pricing_title: "اختر مقاس اللوحة المثالي",
      pricing_sub: "أسعار واضحة تشمل التعديلات غير المحدودة، التغليف الفاخر والشحن المؤمن حول العالم.",
      pricing_tier1_name: "المقاس الحميمي",
      pricing_tier1_dim: "30 × 40 سم",
      pricing_tier1_desc: "مثالي لطاولات النوم والمكاتب وهدايا المناسبات الرومانسية اللطيفة.",
      pricing_tier2_name: "مقاس الأثر التذكاري",
      pricing_tier2_dim: "50 × 70 سم",
      pricing_tier2_badge: "الأكثر طلباً",
      pricing_tier2_desc: "المقاس الأيقوني لصالونات الاستقبال وغرف المعيشة وبورتريهات الكبلز الفخمة.",
      pricing_tier3_name: "المقاس الملكي الفاخر",
      pricing_tier3_dim: "75 × 100 سم",
      pricing_tier3_desc: "لوحة جدارية كبرى مهيبة مصممة لبهو المنازل والصالات والقاعات الفارهة.",
      pricing_cta: "اطلب هذا المقاس",
      testimonials_eyebrow: "شهادات عملاء الأتيليه",
      testimonials_title: "ذكريات صنعت الفرح في قلوب الكثيرين",
      test_1_quote: "رؤية صورة زفافنا وهي تتحول إلى هذه اللوحة الزيتية الساحرة جعلت زوجتي تبكي من شدة التأثر. ملمس الكانفاس ودفء الملامح أمر لا يمكن لأي طباعة تحقيقه. تحفة سيتوارثها أطفالنا.",
      test_1_author: "ماركوس وإيلينا",
      test_1_loc: "زيورخ، سويسرا • 50×70 سم زيت على كانفاس",
      test_2_quote: "توفي جدي قبل أن يرى ابنتي الصغيرة. استطاع فنانو لوفر بينت دمج صورتين منفصلتين ورسموه وهو يحتضنها بين يديه. لقد أهدت هذه اللوحة لعائلتنا مشاعر سكينة وفرح لا توصف.",
      test_2_author: "د. سارة التميمي",
      test_2_loc: "لندن، بريطانيا • 60×90 سم لوحة تذكارية عائلية",
      test_3_quote: "خدمة العملاء عبر واتساب كانت راقية للغاية. كانوا يرسلون لي صور مراحل الرسم وتفاصيل ضربات الريشة وتعديل درجات الخلفية كما طلبت تماماً. وصل العمل بتغليف صندوق خشبي فخم.",
      test_3_author: "آرثر وكاميل",
      test_3_loc: "باريس، فرنسا • بورتريه ألوان مائية",
      final_eyebrow: "خلّد ما يستحق البقاء",
      final_title: "بعض اللحظات تستحق<br><span class=\"rose-gold-script\">أكثر من مجرد صورة.</span>",
      final_sub: "دعنا نحوّل ذكرياتك المفضلة إلى فن ملموس تفتخر به وتحتفظ به للأبد على قماش كانفاس حقيقي.",
      final_cta_btn: "ابدأ رسم لوحتك المخصصة",
      final_whatsapp_btn: "تحدث مع فنان الأتيليه",
      footer_bio: "أتيليه فني راقٍ متخصص في تحويل الصور الشخصية إلى لوحات فنية يدوية خالدة بجودة المتاحف بالألوان الزيتية والمائية.",
      footer_collections: "المجموعات الفنية",
      footer_atelier: "عن الأتيليه",
      footer_concierge: "المستشار الفني",
      concierge_sub: "هل لديك استفسار عن مقاسات اللوحات، الأسلوب أو دمج الصور؟",
      btn_concierge: "تواصل واتساب مع المستشار",
      studio_hours: "أوقات الأتيليه: الإثنين - السبت • 9 ص - 8 م",
      worldwide_ship: "شحن دولي مؤمن ومغلف بعناية",
      copyright_rights: "أتيليه الفنون الراقية. جميع الحقوق محفوظة.",
      lightbox_zoom_hint: "انقر على الصورة لتكبير العرض",
      lightbox_commission_btn: "اطلب لوحة مشابهة",
      modal_title: "ابدأ لوحتك الفنية المخصصة",
      modal_sub: "أخبرنا عن ذكراك التي ترغب بتحويلها إلى لوحة. سنقوم بإعداد التوصيات الفنية والتقدير المخصص لك.",
      modal_name_label: "الاسم الكامل",
      modal_name_ph: "مثال: عبد الله بن فهد",
      modal_phone_label: "رقم الهاتف / الواتساب",
      modal_phone_ph: "مثال: 966501234567+",
      modal_style_label: "الأسلوب الفني المفضل",
      modal_style_oil: "زيتي كلاسيكي على قماش الكانفاس (غني وبارز الملمس)",
      modal_style_wc: "ألوان مائية ناعمة (مضيئة وانسيابية)",
      modal_style_acrylic: "أكريليك عصري بسكين الرسم (ضربات جريئة)",
      modal_style_charcoal: "فحم كلاسيكي مع لمسات ذهبية",
      modal_style_recommend: "أرغب باستشارة واقتراح الفنان",
      modal_subjects_label: "عدد الأشخاص باللوحة",
      modal_subj_1: "شخص واحد (بورتريه فردي)",
      modal_subj_2: "شخصان (بورتريه ثنائي / كبلز)",
      modal_subj_3: "3 - 4 أشخاص (عائلي)",
      modal_subj_5: "5 أشخاص فما فوق (عائلة كبيرة)",
      modal_subj_pet: "حيوان أليف أو مع صاحبه",
      modal_size_label: "المقاس المقترح",
      modal_size_1: "المقاس الحميمي — 30×40 سم",
      modal_size_2: "مقاس الأثر التذكاري — 50×70 سم (الأكثر طلباً)",
      modal_size_3: "المقاس الملكي الفاخر — 75×100 سم (لقلب الصالون)",
      modal_size_custom: "مقاس مخصص آخر",
      modal_story_label: "أخبرنا عن مناسبة اللوحة (اختياري)",
      modal_story_ph: "أخبرنا عن مناسبة اللوحة (ذكرى زواج، تخرج، هدية، ذكرى عزيزة) أو أي تفاصيل خاصة تود من الفنان التركيز عليها...",
      modal_submit_btn: "إرسال التفاصيل إلى واتساب الأتيليه",
      fab_chat: "محادثة الأتيليه"
    }
  };

  const applyLanguage = (lang) => {
    currentLang = lang;
    const dict = translations[lang] || translations.en;

    // Set document level attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // Update all text elements with data-i18n
    const translatables = document.querySelectorAll('[data-i18n]');
    translatables.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        if (dict[key].includes('<') && dict[key].includes('>')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update all input placeholders with data-i18n-ph
    const placeholderElements = document.querySelectorAll('[data-i18n-ph]');
    placeholderElements.forEach(el => {
      const phKey = el.getAttribute('data-i18n-ph');
      if (dict[phKey] !== undefined) {
        el.setAttribute('placeholder', dict[phKey]);
      }
    });

    // Update active state on toggle buttons
    const optEnDesktop = document.getElementById('langOptEn');
    const optArDesktop = document.getElementById('langOptAr');
    const optEnMobile = document.getElementById('mobileLangOptEn');
    const optArMobile = document.getElementById('mobileLangOptAr');

    if (lang === 'ar') {
      if (optEnDesktop) optEnDesktop.classList.remove('active');
      if (optArDesktop) optArDesktop.classList.add('active');
      if (optEnMobile) optEnMobile.classList.remove('active');
      if (optArMobile) optArMobile.classList.add('active');
    } else {
      if (optEnDesktop) optEnDesktop.classList.add('active');
      if (optArDesktop) optArDesktop.classList.remove('active');
      if (optEnMobile) optEnMobile.classList.add('active');
      if (optArMobile) optArMobile.classList.remove('active');
    }

    try {
      localStorage.setItem('lover_paint_lang', lang);
    } catch (e) {
      // Storage access blocked or private mode
    }
  };

  const initBilingualSupport = () => {
    const desktopToggle = document.getElementById('langToggleBtn');
    const mobileToggle = document.getElementById('mobileLangToggleBtn');

    let savedLang = 'en';
    try {
      savedLang = localStorage.getItem('lover_paint_lang') || 'en';
    } catch (e) {
      savedLang = 'en';
    }

    // Initialize with saved or default language
    applyLanguage(savedLang);

    const toggleLanguage = () => {
      const nextLang = (currentLang === 'en') ? 'ar' : 'en';
      applyLanguage(nextLang);
    };

    if (desktopToggle) {
      desktopToggle.addEventListener('click', toggleLanguage);
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleLanguage);
    }
  };

  // Launch all modules
  initCustomCursor();
  initCinematicIntro();
  initNavigation();
  initHeroParallax();
  initGallery();
  initBeforeAfterSlider();
  initLightbox();
  initInquiryModal();
  initTestimonials();
  initScrollReveal();
  initBilingualSupport();
});
