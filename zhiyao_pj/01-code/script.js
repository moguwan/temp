/* 制药工程 - 通用脚本 */

/* 嵌入 app 壳层时：隐藏顶部导航，消除顶部空白，并将导航点击转发给父窗口 */
if (window.self !== window.top) {
  document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('embedded-in-app');
    var menu = document.querySelector('.menu-area');
    if (menu) menu.style.display = 'none';
    document.querySelectorAll('.home-btn, .footer-btn, .logo-link').forEach(function(el) {
      var page = el.getAttribute('href');
      if (!page) {
        var m = (el.getAttribute('onclick') || '').match(/['"]([^'"]+\.html)['"]/);
        page = m ? m[1] : null;
      }
      if (page && page.indexOf('.html') !== -1) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.parent.postMessage({ type: 'app-navigate', page: page }, '*');
        });
        if (el.tagName === 'BUTTON' && el.getAttribute('onclick')) el.removeAttribute('onclick');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // 折叠菜单
  const toggleBtn = document.querySelector('.toggle-btn');
  const collapseContent = document.querySelector('.collapse-content');
  const sideNav = document.querySelector('.side-nav');
  const backToTopWrapper = document.querySelector('.back-to-top-wrapper');

  if (toggleBtn && collapseContent) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      collapseContent.classList.toggle('active');
    });
    document.addEventListener('click', () => collapseContent.classList.remove('active'));
    if (collapseContent) collapseContent.addEventListener('click', e => e.stopPropagation());
  }

  // 子菜单展开时隐藏返回顶部
  if (document.querySelectorAll('.nav-item').length) {
    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        if (item.querySelector('.sub-nav') && backToTopWrapper) {
          backToTopWrapper.classList.add('hide');
        }
      });
      item.addEventListener('mouseleave', () => {
        if (item.querySelector('.sub-nav') && backToTopWrapper) {
          backToTopWrapper.classList.remove('hide');
        }
      });
    });
  }

  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const offset = window.innerHeight * 0.12;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    });
  });

  // 侧边导航：滚动时显示/隐藏 + 精准滚动监听 (Scroll Spy)
  const allNavLinks = document.querySelectorAll('.nav-link, .sub-nav-link');
  function updateOnScroll() {
    const currentScroll = window.scrollY;

    // 1. 控制侧边栏弹入/弹出
    if (sideNav) {
      if (currentScroll > window.innerHeight * 0.4) {
        sideNav.classList.add('show-nav');
      } else {
        sideNav.classList.remove('show-nav');
      }
    }

    // 2. 精准的滚动监听 (支持大模块和子标题，使用 getBoundingClientRect)
    let currentActiveId = '';
    allNavLinks.forEach(link => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId.startsWith('http') || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        if (rect.top <= 350) {
          currentActiveId = targetId;
        }
      }
    });

    // 防止在最顶部时没有高亮
    if (currentScroll < 100) {
      currentActiveId = document.getElementById('background') ? '#background' : (allNavLinks[0]?.getAttribute('href') || '');
    }

    // 更新左侧导航栏的高亮状态
    if (currentActiveId) {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('expanded'));
      allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentActiveId) {
          link.classList.add('active');
          const parentNav = link.closest('.nav-item');
          if (parentNav) parentNav.classList.add('expanded');
        }
      });
    }
  }
  window.addEventListener('scroll', updateOnScroll);
  updateOnScroll(); // 初始执行

  // 返回顶部显示
  if (backToTopWrapper) {
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;
      const threshold = scrollPosition > windowHeight * 0.75 &&
        scrollPosition < documentHeight - windowHeight - 335;
      backToTopWrapper.classList.toggle('visible', threshold);
    });
  }

  // 实验折叠框
  document.querySelectorAll('.experiment-box').forEach((box) => {
    box.addEventListener('click', () => box.classList.toggle('active'));
  });

  // 人类实践：手风琴式 PDF 展开
  document.querySelectorAll('.hp-accordion-item').forEach((item) => {
    const title = item.querySelector('.hp-accordion-title');
    if (title) {
      title.addEventListener('click', () => item.classList.toggle('active'));
    }
  });

  // 弹窗功能（personal 页）
  window.openModal = function() {
    const modal = document.getElementById('awardModal');
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      modal.offsetHeight;
      modal.classList.add('show');
    }
  };
  window.closeModal = function() {
    const modal = document.getElementById('awardModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
      setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
  };
  document.getElementById('awardModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // URL hash 滚动
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      const target = document.querySelector(hash);
      if (target) {
        const offset = window.innerHeight * 0.16;
        const pos = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: pos - offset, behavior: 'smooth' });
      }
    }, 100);
  }

  // 首页：左侧圆形导航 - 点击滚动 + 滚动高亮
  const indexNav = document.querySelector('.index-section-nav');
  if (indexNav) {
    const navBtns = indexNav.querySelectorAll('.index-nav-btn');
    const sections = ['section1', 'section2', 'section3', 'section4', 'section5'];

    navBtns.forEach((btn, i) => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.getElementById(sections[i]);
        if (target) {
          const offset = window.innerHeight * 0.12;
          const pos = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: pos - offset, behavior: 'smooth' });
        }
      });
    });

    function updateIndexNavActive() {
      const scrollY = window.scrollY;
      const viewportMid = window.innerHeight * 0.4;
      let activeIdx = -1;
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportMid && rect.bottom > viewportMid) activeIdx = i;
          else if (rect.top < viewportMid && activeIdx === -1) activeIdx = i;
        }
      });
      if (activeIdx === -1 && scrollY > 100) activeIdx = 0;
      navBtns.forEach((b, i) => b.classList.toggle('active', i === activeIdx));
    }
    window.addEventListener('scroll', updateIndexNavActive);
    updateIndexNavActive();
  }
});
