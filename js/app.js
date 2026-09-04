document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initSmoothScroll();
  initFilterTabs();
  initO2CCarousel();
  initExpandableNews();
  initAvatarModal();
});

/* ==================== 1. SCROLL-SPY ==================== */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-links a.nav-link');
  const sections = document.querySelectorAll('section.page-section');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==================== 2. SMOOTH SCROLL ==================== */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-links a.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==================== 3. FILTER TABS (INFORMATION) ==================== */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pipelineSection = document.getElementById('pipeline-section');
  const newsSection = document.getElementById('news-section');
  const docSolSection = document.getElementById('doc-sol-section');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.getAttribute('data-target');

      if (filterType === 'pipeline') {
        pipelineSection.style.display = 'block';
        newsSection.style.display = 'none';
        docSolSection.style.display = 'none';
      } else if (filterType === 'news') {
        pipelineSection.style.display = 'none';
        newsSection.style.display = 'grid';
        docSolSection.style.display = 'none';
      } else if (filterType === 'doc-sol') {
        pipelineSection.style.display = 'none';
        newsSection.style.display = 'none';
        docSolSection.style.display = 'grid';
      }

      updateExpandableNews();
    });
  });
}

/* ==================== 4. EXPANDABLE NEWS ==================== */
function initExpandableNews() {
  const descriptions = document.querySelectorAll('.news-grid .news-desc');

  descriptions.forEach((description) => {
    const expandButton = document.createElement('button');
    expandButton.type = 'button';
    expandButton.className = 'expand-news-btn';
    expandButton.textContent = 'แสดงเพิ่มเติม';

    expandButton.addEventListener('click', () => {
      const isExpanded = description.classList.toggle('is-expanded');
      expandButton.textContent = isExpanded ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม';
    });

    description.parentElement.appendChild(expandButton);
  });

  updateExpandableNews();
  window.addEventListener('resize', updateExpandableNews);
}

function updateExpandableNews() {
  const descriptions = document.querySelectorAll('.news-grid .news-desc');

  descriptions.forEach((description) => {
    const expandButton = description.parentElement.querySelector('.expand-news-btn');
    if (!expandButton || description.closest('[style*="display: none"]')) return;

    const isOverflowing = description.scrollHeight > description.clientHeight;
    expandButton.classList.toggle('is-visible', isOverflowing || description.classList.contains('is-expanded'));
  });
}

/* ==================== 5. AVATAR IMAGE MODAL ==================== */
function initAvatarModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('imageModalImage');
  const closeButton = document.getElementById('imageModalClose');
  const avatars = document.querySelectorAll('.profile-avatar, .team-card-avatar');

  if (!modal || !modalImage || !closeButton) return;

  const closeModal = () => {
    modal.classList.remove('is-open');
    modalImage.src = '';
    document.body.style.overflow = '';
  };

  avatars.forEach((avatar) => {
    avatar.setAttribute('tabindex', '0');
    avatar.addEventListener('click', () => {
      modalImage.src = avatar.src;
      modalImage.alt = avatar.alt;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    avatar.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        avatar.click();
      }
    });
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

/* ==================== 6. O2C CAROUSEL NAVIGATION ==================== */
function initO2CCarousel() {
  const pipelineTrack = document.getElementById('pipelineTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const wrapper = document.querySelector('.carousel-outer-wrapper');

  if (!pipelineTrack || !prevBtn || !nextBtn) return;

  const getStepWidth = () => {
    const firstCard = pipelineTrack.querySelector('.pipeline-step-card');
    return firstCard ? firstCard.offsetWidth + 16 : 240; // ความกว้างการ์ด + gap
  };

  // ฟังก์ชันเลื่อนไปข้างหน้า (เมื่อถึงท้ายสุด จะวนกลับไปเริ่มที่ 1)
  const slideNext = () => {
    const maxScrollLeft = pipelineTrack.scrollWidth - pipelineTrack.clientWidth;
    // ถ้าใกล้ถึงปลายทาง (เผื่อ margin 5px) ให้กลับไปเริ่มต้น
    if (pipelineTrack.scrollLeft >= maxScrollLeft - 5) {
      pipelineTrack.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      pipelineTrack.scrollBy({ left: getStepWidth(), behavior: 'smooth' });
    }
  };

  // ฟังก์ชันเลื่อนย้อนกลับ (เมื่ออยู่หน้าสุด จะวนไปท้ายสุด)
  const slidePrev = () => {
    if (pipelineTrack.scrollLeft <= 5) {
      const maxScrollLeft = pipelineTrack.scrollWidth - pipelineTrack.clientWidth;
      pipelineTrack.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    } else {
      pipelineTrack.scrollBy({ left: -getStepWidth(), behavior: 'smooth' });
    }
  };

  // ปุ่มกด Next / Prev
  nextBtn.addEventListener('click', slideNext);
  prevBtn.addEventListener('click', slidePrev);

  // Auto-play: หมุนช้าๆ ต่อเนื่องทุก 3 วินาที
  let autoPlayTimer = setInterval(slideNext, 3000);

  // นำเมาส์เข้าใกล้ให้หยุดหมุน (Pause on Hover) เพื่อให้อ่านสะดวก
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    wrapper.addEventListener('mouseleave', () => {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(slideNext, 3000);
    });
  }
}