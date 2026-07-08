document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  const sectionLinks = Array.from(document.querySelectorAll('.navbar-menu a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('.home-section[id]'));

  if (toggleButton && menu) {
    toggleButton.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('is-open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });

    sectionLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 768) {
          menu.classList.remove('is-open');
          toggleButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  const setActiveSection = function (activeId) {
    sectionLinks.forEach(function (link) {
      const targetId = link.getAttribute('href').slice(1);
      link.classList.toggle('active', targetId === activeId);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        const visibleEntries = entries.filter(function (entry) {
          return entry.isIntersecting;
        });

        if (!visibleEntries.length) {
          return;
        }

        visibleEntries.sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });

        setActiveSection(visibleEntries[0].target.id);
      },
      {
        root: null,
        threshold: [0.18, 0.32, 0.5, 0.68],
        rootMargin: '-18% 0px -58% 0px',
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  const revealItems = document.querySelectorAll('.content-card');

  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealItems.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(18px)';
      item.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      revealObserver.observe(item);
    });
  }
});