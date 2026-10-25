async function loadPage(pageId) {
  const mainContainer = document.getElementById('mainContainer');
  try {
    const res = await fetch(`pages/${pageId}.html`);
    if (!res.ok) throw new Error("Page not found");
    const html = await res.text();
    mainContainer.innerHTML = html;

    document.querySelectorAll('nav a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === pageId);
    });

    const initFn = window[`init_${pageId.replace('-', '_')}`];
    if (typeof initFn === 'function') initFn();
    
    window.scrollTo(0, 0);

  } catch (err) {
    mainContainer.innerHTML = `<h2 style="text-align:center; padding: 50px;">Error loading page. If you are opening this file directly, please use a local server (like VS Code Live Server).</h2>`;
    console.error(err);
  }
}

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    loadPage(link.dataset.page);
  });
});

window.loadPage = loadPage;
document.addEventListener('DOMContentLoaded', () => loadPage('home'));