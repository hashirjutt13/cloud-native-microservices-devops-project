const config = window.APP_CONFIG;

const services = [
  { key: "user", label: "User Service", url: config.userServiceUrl, path: "/health" },
  { key: "product", label: "Product Service", url: config.productServiceUrl, path: "/health" },
  { key: "order", label: "Order Service", url: config.orderServiceUrl, path: "/health" },
  { key: "notification", label: "Notification Service", url: config.notificationServiceUrl, path: "/health" }
];

const pageTitle = document.querySelector("#page-title");
const statusGrid = document.querySelector("#status-grid");
const view = document.querySelector("#view");
const refreshButton = document.querySelector("#refresh-status");

const routes = {
  dashboard: renderDashboard,
  users: renderUsers,
  products: renderProducts,
  orders: renderOrders,
  notifications: renderNotifications
};

function serviceUrl(service, path) {
  return `${service.replace(/\/$/, "")}${path}`;
}

async function fetchJson(url, fallback) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    return { error: error.message, fallback };
  }
}

async function refreshStatus() {
  statusGrid.innerHTML = services.map((service) => `
    <article class="status-card">
      <span class="pulse pending"></span>
      <h2>${service.label}</h2>
      <p>Checking ${service.url}</p>
    </article>
  `).join("");

  const results = await Promise.all(services.map(async (service) => {
    const result = await fetchJson(serviceUrl(service.url, service.path), {});
    return { service, result };
  }));

  statusGrid.innerHTML = results.map(({ service, result }) => {
    const ok = !result.error;
    return `
      <article class="status-card">
        <span class="pulse ${ok ? "ok" : "down"}"></span>
        <h2>${service.label}</h2>
        <p>${ok ? result.status || "healthy" : "Unavailable in this browser session"}</p>
        <small>${service.url}</small>
      </article>
    `;
  }).join("");
}

async function renderDashboard() {
  pageTitle.textContent = "Dashboard";
  view.innerHTML = `
    <div class="panel">
      <h2>Cloud-native e-commerce operations</h2>
      <p>This dashboard presents the four project services, their deployment environments, and the CI/CD proof points required for the final submission.</p>
      <div class="metric-row">
        <div><strong>4</strong><span>microservices</span></div>
        <div><strong>3</strong><span>environments</span></div>
        <div><strong>5</strong><span>Docker images</span></div>
        <div><strong>1</strong><span>Jenkins pipeline</span></div>
      </div>
    </div>
  `;
}

async function renderUsers() {
  pageTitle.textContent = "Users";
  const data = await fetchJson(serviceUrl(config.userServiceUrl, "/users"), { users: [] });
  view.innerHTML = renderResourcePanel("User Service", "Registration, login, profile, and JWT-style authentication APIs.", data.users || []);
}

async function renderProducts() {
  pageTitle.textContent = "Products";
  const data = await fetchJson(serviceUrl(config.productServiceUrl, "/products"), { products: [] });
  view.innerHTML = renderResourcePanel("Product Service", "Catalog, details, inventory, search, and CRUD-style APIs.", data.products || []);
}

async function renderOrders() {
  pageTitle.textContent = "Orders";
  const data = await fetchJson(serviceUrl(config.orderServiceUrl, "/orders"), { orders: [] });
  view.innerHTML = renderResourcePanel("Order Service", "Order creation, status tracking, and product/notification service coordination.", data.orders || []);
}

async function renderNotifications() {
  pageTitle.textContent = "Notifications";
  const data = await fetchJson(serviceUrl(config.notificationServiceUrl, "/notifications"), { notifications: [] });
  view.innerHTML = renderResourcePanel("Notification Service", "Email-style and in-app messages for confirmations and operational alerts.", data.notifications || []);
}

function renderResourcePanel(title, description, rows) {
  const content = rows.length
    ? rows.map((row) => `<li><pre>${escapeHtml(JSON.stringify(row, null, 2))}</pre></li>`).join("")
    : "<li>No live data returned yet. Start the services locally or deploy the environment.</li>";

  return `
    <div class="panel">
      <h2>${title}</h2>
      <p>${description}</p>
      <ul class="data-list">${content}</ul>
    </div>
  `;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

async function route() {
  const key = window.location.hash.replace("#", "") || "dashboard";
  document.querySelectorAll("nav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === key);
  });
  await (routes[key] || routes.dashboard)();
}

refreshButton.addEventListener("click", refreshStatus);
window.addEventListener("hashchange", route);

await refreshStatus();
await route();
