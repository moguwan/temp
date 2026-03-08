/* 横向滑动 SPA - 导航固定，内容区左右平移 */
(function() {
  var pageOrder = [
    '首页/index.html',
    '项目介绍/description.html',
    '项目设计/engineering.html',
    '线路与元件/result.html',
    '实验设计/experiment.html',
    '人类实践/hp.html',
    '建模/model.html',
    '成员介绍/personal.html',
    '联系我们/contact.html'
  ];

  var pageTitles = {
    '首页/index.html': '首页',
    '项目介绍/description.html': '项目介绍',
    '项目设计/engineering.html': '项目设计',
    '线路与元件/result.html': '线路与元件',
    '实验设计/experiment.html': '实验设计',
    '人类实践/hp.html': '人类实践',
    '建模/model.html': '建模',
    '成员介绍/personal.html': '成员介绍',
    '联系我们/contact.html': '联系我们'
  };

  var currentIndex = 0;
  var track = document.getElementById('slide-track');
  var slides = document.querySelectorAll('.slide-page');

  function getPageIndex(page) {
    var i = pageOrder.indexOf(page);
    return i >= 0 ? i : 0;
  }

  function setActiveNav(page) {
    document.querySelectorAll('.app-nav-fixed .home-btn, .app-nav-fixed .logo-link').forEach(function(el) {
      el.classList.remove('nav-active');
      if (el.getAttribute('data-page') === page) {
        el.classList.add('nav-active');
      }
    });
  }

  function hideIframeNav(iframe) {
    try {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      var menu = doc.querySelector('.menu-area');
      if (menu) menu.style.display = 'none';
    } catch (e) {}
  }

  function slideTo(index) {
    if (index < 0 || index >= pageOrder.length) return;
    currentIndex = index;
    var offset = -index * 100;
    track.style.transform = 'translateX(' + offset + 'vw)';
    setActiveNav(pageOrder[index]);
    document.title = (pageTitles[pageOrder[index]] || 'MediSyn') + ' - 制药工程';
  }

  function navigateTo(page) {
    var index = getPageIndex(page);
    slideTo(index);
  }

  document.querySelectorAll('.app-nav-fixed .home-btn, .app-nav-fixed .logo-link').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var page = el.getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'app-navigate' && e.data.page) {
      navigateTo(e.data.page);
    }
  });

  slides.forEach(function(slide, i) {
    var iframe = slide.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('load', function() {
        hideIframeNav(iframe);
      });
    }
  });

  slideTo(0);
})();
