const jobs = [
  {
    id: "aurora-pay",
    company: "Aurora Pay",
    logo: "AP",
    role: "高级前端工程师",
    region: "Singapore",
    city: "新加坡",
    salary: "SGD 7.5k-10k / 月",
    category: "tech",
    match: 96,
    summary: "负责跨境支付商户后台，团队支持中文协作，试用期可远程，EP办理经验成熟。",
    tags: ["React", "金融科技", "EP支持"],
    hr: "Amara Chen",
  },
  {
    id: "atlas-care",
    company: "AtlasCare Health",
    logo: "AC",
    role: "海外增长产品经理",
    region: "Dubai",
    city: "迪拜",
    salary: "AED 28k-36k / 月",
    category: "product",
    match: 91,
    summary: "面向中东市场的数字健康产品，重点考察B端产品设计、英文沟通和跨部门推进。",
    tags: ["B端产品", "医疗科技", "搬迁补贴"],
    hr: "Nora Rahman",
  },
  {
    id: "northstar-ai",
    company: "Northstar AI",
    logo: "NA",
    role: "数据分析师",
    region: "Toronto",
    city: "多伦多",
    salary: "CAD 95k-120k / 年",
    category: "data",
    match: 88,
    summary: "支持推荐系统增长分析，接受中国互联网背景候选人，提供LMIA顾问资源。",
    tags: ["SQL", "增长分析", "LMIA资源"],
    hr: "Ethan Miller",
  },
  {
    id: "berlin-works",
    company: "BerlinWorks",
    logo: "BW",
    role: "后端平台工程师",
    region: "Berlin",
    city: "柏林",
    salary: "EUR 72k-92k / 年",
    category: "tech",
    match: 86,
    summary: "物流SaaS平台团队，Go与云原生方向，支持欧盟蓝卡申请和英文面试辅导。",
    tags: ["Go", "云原生", "欧盟蓝卡"],
    hr: "Lena Fischer",
  },
  {
    id: "meridian-cloud",
    company: "Meridian Cloud",
    logo: "MC",
    role: "解决方案架构师",
    region: "Singapore",
    city: "新加坡",
    salary: "SGD 9k-13k / 月",
    category: "tech",
    match: 84,
    summary: "为亚太企业客户设计云迁移方案，适合有售前、架构和双语沟通经验的候选人。",
    tags: ["云服务", "售前", "客户沟通"],
    hr: "Iris Wong",
  },
  {
    id: "clearbit-labs",
    company: "Clearbit Labs",
    logo: "CL",
    role: "商业数据产品经理",
    region: "Toronto",
    city: "多伦多",
    salary: "CAD 105k-135k / 年",
    category: "product",
    match: 82,
    summary: "负责数据平台商业化，关注指标体系、定价策略和企业级客户场景。",
    tags: ["数据产品", "SaaS", "混合办公"],
    hr: "Sophia Lee",
  },
];

const jobGrid = document.querySelector("#jobGrid");
const filterButtons = document.querySelectorAll(".filter-pill");
const searchForm = document.querySelector("#searchForm");
const keywordInput = document.querySelector("#keywordInput");
const regionInput = document.querySelector("#regionInput");
const chatDrawer = document.querySelector("#chatDrawer");
const drawerCompany = document.querySelector("#drawerCompany");
const drawerMessages = document.querySelector("#drawerMessages");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const profileModal = document.querySelector("#profileModal");
const profileForm = document.querySelector("#profileForm");
const toast = document.querySelector("#toast");

let activeFilter = "all";
let activeKeyword = "";
let activeRegion = "all";
let currentChatJob = jobs[0];
let toastTimer;

function renderJobs() {
  const keyword = activeKeyword.trim().toLowerCase();
  const visibleJobs = jobs.filter((job) => {
    const matchesFilter = activeFilter === "all" || job.category === activeFilter;
    const matchesRegion = activeRegion === "all" || job.region === activeRegion;
    const searchable = `${job.role} ${job.company} ${job.summary} ${job.tags.join(" ")}`.toLowerCase();
    const matchesKeyword = !keyword || searchable.includes(keyword);
    return matchesFilter && matchesRegion && matchesKeyword;
  });

  if (visibleJobs.length === 0) {
    jobGrid.innerHTML = `
      <article class="job-card">
        <div class="job-top">
          <span class="company-logo">AI</span>
          <div class="company-meta">
            <h3>暂未找到完全匹配</h3>
            <p>试试放宽地区或岗位关键词</p>
          </div>
        </div>
        <p>你也可以先完善档案，系统会在新职位上线时自动提醒。</p>
        <div class="job-actions">
          <button type="button" data-open-profile>完善档案</button>
          <button type="button" data-reset-search>重置搜索</button>
        </div>
      </article>
    `;
    return;
  }

  jobGrid.innerHTML = visibleJobs
    .map(
      (job) => `
        <article class="job-card">
          <div class="job-top">
            <span class="company-logo">${job.logo}</span>
            <div class="company-meta">
              <h3>${job.company}</h3>
              <p>${job.city} · ${job.salary}</p>
            </div>
            <span class="match-badge">${job.match}%匹配</span>
          </div>
          <div>
            <h4>${job.role}</h4>
            <p>${job.summary}</p>
            <div class="job-tags">
              ${job.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </div>
          <div class="job-actions">
            <button type="button" data-apply="${job.id}">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              立即匹配
            </button>
            <button type="button" data-chat="${job.id}">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
              </svg>
              与雇主聊
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setDrawerOpen(element, isOpen) {
  element.classList.toggle("open", isOpen);
  element.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("drawer-open", document.querySelector(".chat-drawer.open, .profile-modal.open") !== null);
}

function openChat(jobId) {
  currentChatJob = jobs.find((job) => job.id === jobId) || jobs[0];
  drawerCompany.innerHTML = `
    <strong>${currentChatJob.company} · ${currentChatJob.role}</strong>
    <span>${currentChatJob.hr} 正在负责该岗位 · ${currentChatJob.city}</span>
  `;
  drawerMessages.innerHTML = `
    <div class="bubble employer">你好，我是${currentChatJob.company}的${currentChatJob.hr}。我看到你的背景和${currentChatJob.role}很接近。</div>
    <div class="bubble employer">可以先告诉我你期望的入职时间，以及是否接受${currentChatJob.city}的搬迁安排吗？</div>
    <div class="bubble candidate">可以，我想先了解签证支持、远程试用期和面试流程。</div>
  `;
  setDrawerOpen(chatDrawer, true);
  window.setTimeout(() => messageInput.focus(), 120);
}

function appendMessage(text, owner = "candidate") {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${owner}`;
  bubble.textContent = text;
  drawerMessages.appendChild(bubble);
  drawerMessages.scrollTop = drawerMessages.scrollHeight;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderJobs();
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  activeKeyword = keywordInput.value;
  activeRegion = regionInput.value;
  renderJobs();
  document.querySelector("#jobs").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", (event) => {
  const chatButton = event.target.closest("[data-chat]");
  const applyButton = event.target.closest("[data-apply]");
  const profileButton = event.target.closest("[data-open-profile]");
  const closeChatButton = event.target.closest("[data-close-chat]");
  const closeProfileButton = event.target.closest("[data-close-profile]");
  const resetButton = event.target.closest("[data-reset-search]");

  if (chatButton) {
    openChat(chatButton.dataset.chat);
  }

  if (applyButton) {
    const job = jobs.find((item) => item.id === applyButton.dataset.apply);
    showToast(`已为你加入「${job.role}」匹配队列，AI顾问会整理投递建议。`);
  }

  if (profileButton) {
    setDrawerOpen(profileModal, true);
  }

  if (closeChatButton) {
    setDrawerOpen(chatDrawer, false);
  }

  if (closeProfileButton) {
    setDrawerOpen(profileModal, false);
  }

  if (resetButton) {
    activeKeyword = "";
    activeRegion = "all";
    keywordInput.value = "";
    regionInput.value = "all";
    renderJobs();
  }
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  appendMessage(text);
  messageInput.value = "";

  window.setTimeout(() => {
    appendMessage(`收到，我会把这个问题带给${currentChatJob.hr}。建议你也补充一版英文项目亮点，回复率会更高。`, "employer");
  }, 650);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setDrawerOpen(profileModal, false);
  showToast("档案已保存，系统正在生成你的海外岗位推荐。");
  profileForm.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setDrawerOpen(chatDrawer, false);
  setDrawerOpen(profileModal, false);
});

renderJobs();
