const STORAGE_KEY = "offer-atlas-state-v1";
const STAGES = ["待投递", "已投递", "测评/笔试", "面试中", "Offer", "已结束"];
const PRIORITIES = ["高", "中", "低"];
const MATERIAL_STATUSES = ["未准备", "已准备未提交", "已提交", "需更新"];
const EVENT_LABELS = {
  deadline: "投递截止",
  submission: "网申提交",
  test: "笔试/测评",
  interview: "面试",
  material: "补材料",
  followup: "跟进提醒",
  result: "结果通知",
};

const seed = {
  applications: [
    {
      id: "app-1",
      companyName: "美团",
      jobTitle: "商业分析实习生",
      city: "北京 / 到店",
      stage: "面试中",
      deadline: "2026-04-20",
      nextAction: "明晚前完成二面案例复盘",
      priority: "高",
      applicationStatus: "active",
      notes: "重点准备本地生活增长分析。",
      updatedAt: "2026-04-16",
      source: "官网投递",
      jobLink: "https://example.com/meituan",
      salaryRange: "220/天",
      contact: { hrName: "陈昕", email: "hr-meituan@example.com", wechat: "mt-campus-hr", phone: "010-88886666" },
      materials: [
        { materialId: "mat-1", status: "已提交" },
        { materialId: "mat-3", status: "已提交" },
        { materialId: "mat-4", status: "已准备未提交" }
      ],
      history: [
        { date: "2026-04-08", text: "完成网申投递" },
        { date: "2026-04-11", text: "通过一面，进入二面" },
        { date: "2026-04-16", text: "收到二面案例题" }
      ]
    },
    {
      id: "app-2",
      companyName: "字节跳动",
      jobTitle: "产品经理校招",
      city: "上海 / 飞书",
      stage: "测评/笔试",
      deadline: "2026-04-18",
      nextAction: "今晚完成测评并补交案例集",
      priority: "高",
      applicationStatus: "active",
      notes: "岗位偏 B 端产品。",
      updatedAt: "2026-04-15",
      source: "内推",
      jobLink: "https://example.com/bytedance",
      salaryRange: "18k-24k x 15",
      contact: { hrName: "Luna", email: "campus-bytedance@example.com", wechat: "feishu-campus", phone: "021-66778899" },
      materials: [
        { materialId: "mat-1", status: "已提交" },
        { materialId: "mat-2", status: "需更新" }
      ],
      history: [
        { date: "2026-04-09", text: "内推通过，进入测评阶段" },
        { date: "2026-04-15", text: "HR 催补最新简历版本" }
      ]
    },
    {
      id: "app-3",
      companyName: "阿里巴巴",
      jobTitle: "数据产品经理",
      city: "杭州 / 淘天",
      stage: "待投递",
      deadline: "2026-04-19",
      nextAction: "补齐作品集封面页并完成网申",
      priority: "高",
      applicationStatus: "active",
      notes: "要求数据敏感度和跨团队协作案例。",
      updatedAt: "2026-04-14",
      source: "官网收藏",
      jobLink: "https://example.com/alibaba",
      salaryRange: "20k-28k x 16",
      contact: { hrName: "", email: "", wechat: "", phone: "" },
      materials: [
        { materialId: "mat-1", status: "已准备未提交" },
        { materialId: "mat-2", status: "已准备未提交" }
      ],
      history: [{ date: "2026-04-14", text: "加入待投递清单" }]
    },
    {
      id: "app-4",
      companyName: "腾讯",
      jobTitle: "策略运营实习生",
      city: "深圳 / 腾讯视频",
      stage: "已投递",
      deadline: "2026-04-22",
      nextAction: "两天后跟进 HR 邮件进展",
      priority: "中",
      applicationStatus: "active",
      notes: "已投递一周，尚未收到笔试通知。",
      updatedAt: "2026-04-10",
      source: "官网投递",
      jobLink: "https://example.com/tencent",
      salaryRange: "240/天",
      contact: { hrName: "王霖", email: "tx-hr@example.com", wechat: "", phone: "" },
      materials: [
        { materialId: "mat-1", status: "已提交" },
        { materialId: "mat-3", status: "已提交" }
      ],
      history: [{ date: "2026-04-10", text: "完成岗位投递" }]
    },
    {
      id: "app-5",
      companyName: "小红书",
      jobTitle: "商业化运营",
      city: "上海 / 商业产品",
      stage: "Offer",
      deadline: "2026-04-17",
      nextAction: "今晚前决定是否接受 offer",
      priority: "高",
      applicationStatus: "offer",
      notes: "已拿到 offer，需与其他岗位比较。",
      updatedAt: "2026-04-17",
      source: "内推",
      jobLink: "https://example.com/xhs",
      salaryRange: "17k-20k x 15",
      contact: { hrName: "Mia", email: "offer-xhs@example.com", wechat: "xhs-hr-mia", phone: "021-55667788" },
      materials: [
        { materialId: "mat-1", status: "已提交" },
        { materialId: "mat-3", status: "已提交" }
      ],
      history: [
        { date: "2026-04-05", text: "完成终面" },
        { date: "2026-04-17", text: "收到 offer" }
      ]
    }
  ],
  materials: [
    { id: "mat-1", name: "简历主版本", type: "简历", version: "V5.2", status: "已提交", updatedAt: "2026-04-15" },
    { id: "mat-2", name: "产品案例集", type: "作品集", version: "V2.1", status: "需更新", updatedAt: "2026-04-12" },
    { id: "mat-3", name: "成绩单", type: "学术材料", version: "2026 Spring", status: "已提交", updatedAt: "2026-04-01" },
    { id: "mat-4", name: "面试案例模板", type: "面试材料", version: "V3", status: "已准备未提交", updatedAt: "2026-04-16" }
  ],
  events: [
    { id: "evt-1", appId: "app-1", type: "interview", date: "2026-04-18", status: "pending", notes: "二面，线下面试", reminderTime: "18:00" },
    { id: "evt-2", appId: "app-1", type: "followup", date: "2026-04-19", status: "pending", notes: "整理面试反馈并感谢邮件", reminderTime: "10:00" },
    { id: "evt-3", appId: "app-2", type: "test", date: "2026-04-17", status: "pending", notes: "在线测评 45 分钟", reminderTime: "20:00" },
    { id: "evt-4", appId: "app-2", type: "material", date: "2026-04-17", status: "pending", notes: "补交产品案例集", reminderTime: "22:00" },
    { id: "evt-5", appId: "app-3", type: "deadline", date: "2026-04-19", status: "pending", notes: "阿里数据产品岗位截止", reminderTime: "12:00" },
    { id: "evt-6", appId: "app-4", type: "followup", date: "2026-04-18", status: "pending", notes: "邮件跟进 HR", reminderTime: "09:30" },
    { id: "evt-7", appId: "app-5", type: "result", date: "2026-04-17", status: "pending", notes: "确认是否接受 offer", reminderTime: "18:30" }
  ]
};

const state = {
  view: "dashboard",
  calendarMode: "month",
  filters: { search: "", stage: "全部", priority: "全部", risk: "全部", hideEnded: false },
  drawerAppId: null,
  draggedAppId: null,
  data: loadState(),
};

const els = {
  todayFocus: document.getElementById("todayFocus"),
  todayDate: document.getElementById("todayDate"),
  tabs: Array.from(document.querySelectorAll(".tab-button")),
  views: Array.from(document.querySelectorAll(".view")),
  statsGrid: document.getElementById("statsGrid"),
  dashboardPills: document.getElementById("dashboardPills"),
  todayTasks: document.getElementById("todayTasks"),
  urgentApplications: document.getElementById("urgentApplications"),
  weeklyTimeline: document.getElementById("weeklyTimeline"),
  riskList: document.getElementById("riskList"),
  boardColumns: document.getElementById("boardColumns"),
  searchInput: document.getElementById("searchInput"),
  stageFilter: document.getElementById("stageFilter"),
  priorityFilter: document.getElementById("priorityFilter"),
  riskFilter: document.getElementById("riskFilter"),
  hideEndedFilter: document.getElementById("hideEndedFilter"),
  calendarTitle: document.getElementById("calendarTitle"),
  calendarMain: document.getElementById("calendarMain"),
  calendarSegments: Array.from(document.querySelectorAll("[data-calendar-mode]")),
  conflictList: document.getElementById("conflictList"),
  materialsSummary: document.getElementById("materialsSummary"),
  materialsTable: document.getElementById("materialsTable"),
  materialGaps: document.getElementById("materialGaps"),
  funnelChart: document.getElementById("funnelChart"),
  priorityBreakdown: document.getElementById("priorityBreakdown"),
  insightCards: document.getElementById("insightCards"),
  detailDrawer: document.getElementById("detailDrawer"),
  drawerTitle: document.getElementById("drawerTitle"),
  drawerContent: document.getElementById("drawerContent"),
  closeDrawerBtn: document.getElementById("closeDrawerBtn"),
  createModal: document.getElementById("createModal"),
  createForm: document.getElementById("createForm"),
  openCreateModalBtn: document.getElementById("openCreateModalBtn"),
  boardCreateBtn: document.getElementById("boardCreateBtn"),
  closeCreateModalBtn: document.getElementById("closeCreateModalBtn"),
  cancelCreateBtn: document.getElementById("cancelCreateBtn"),
  formStage: document.getElementById("formStage"),
  formPriority: document.getElementById("formPriority"),
};

init();
function init() {
  fillSelect(els.stageFilter, ["全部", ...STAGES]);
  fillSelect(els.priorityFilter, ["全部", ...PRIORITIES]);
  fillSelect(els.riskFilter, ["全部", "高", "中", "低"]);
  fillSelect(els.formStage, STAGES, "待投递");
  fillSelect(els.formPriority, PRIORITIES, "中");
  bindEvents();
  renderAll();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function fillSelect(select, options, selected) {
  select.innerHTML = options.map((item) => `<option value="${item}">${item}</option>`).join("");
  if (selected) select.value = selected;
}

function bindEvents() {
  els.tabs.forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.view;
    renderView();
  }));

  [els.searchInput, els.stageFilter, els.priorityFilter, els.riskFilter].forEach((node) => {
    node.addEventListener("input", syncFilters);
    node.addEventListener("change", syncFilters);
  });
  els.hideEndedFilter.addEventListener("change", syncFilters);

  els.calendarSegments.forEach((button) => button.addEventListener("click", () => {
    state.calendarMode = button.dataset.calendarMode;
    renderCalendar();
  }));

  els.closeDrawerBtn.addEventListener("click", closeDrawer);
  els.openCreateModalBtn.addEventListener("click", openCreateModal);
  els.boardCreateBtn.addEventListener("click", openCreateModal);
  els.closeCreateModalBtn.addEventListener("click", closeCreateModal);
  els.cancelCreateBtn.addEventListener("click", closeCreateModal);
  els.createModal.addEventListener("click", (event) => {
    if (event.target === els.createModal) closeCreateModal();
  });
  els.createForm.addEventListener("submit", createApplication);
}

function syncFilters() {
  state.filters.search = els.searchInput.value.trim();
  state.filters.stage = els.stageFilter.value;
  state.filters.priority = els.priorityFilter.value;
  state.filters.risk = els.riskFilter.value;
  state.filters.hideEnded = els.hideEndedFilter.checked;
  renderBoard();
}

function renderAll() {
  renderView();
  renderDashboard();
  renderBoard();
  renderCalendar();
  renderMaterials();
  renderAnalytics();
  renderDrawer();
}

function renderView() {
  els.tabs.forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));
  els.views.forEach((view) => view.classList.toggle("active", view.id === `${state.view}-view`));
}

function appsWithMeta() {
  return state.data.applications.map((app) => {
    const events = state.data.events.filter((event) => event.appId === app.id);
    const materials = (app.materials || []).map((item) => ({ ...state.data.materials.find((mat) => mat.id === item.materialId), status: item.status }));
    const nextEvent = events.filter((event) => event.status !== "done").sort((a, b) => a.date.localeCompare(b.date))[0] || null;
    const daysToDeadline = diffDays(todayIso(), app.deadline);
    const daysSinceUpdate = diffDays(app.updatedAt, todayIso());
    const missingFields = [app.jobLink, app.deadline, app.nextAction].filter((value) => !value).length;
    const incompleteMaterials = materials.filter((item) => item.status !== "已提交").length;
    return { ...app, events, materials, nextEvent, daysToDeadline, daysSinceUpdate, incompleteMaterials, risk: riskOf(app, daysToDeadline, daysSinceUpdate, missingFields, incompleteMaterials, nextEvent) };
  });
}

function riskOf(app, daysToDeadline, daysSinceUpdate, missingFields, incompleteMaterials, nextEvent) {
  if (app.stage === "Offer" && daysToDeadline <= 0) return { level: "高", reason: "Offer 今日需要确认" };
  if (app.stage === "待投递" && daysToDeadline <= 1) return { level: "高", reason: "距离截止不足 24 小时且仍未投递" };
  if (nextEvent && diffDays(todayIso(), nextEvent.date) <= 1) return { level: "高", reason: `${EVENT_LABELS[nextEvent.type]} 即将发生` };
  if (missingFields || incompleteMaterials || daysToDeadline <= 3) return { level: "中", reason: "信息未齐全或未来 3 天内存在关键节点" };
  if (daysSinceUpdate >= 7) return { level: "低", reason: "长期无进展，建议安排跟进" };
  return { level: "低", reason: "节奏稳定，可继续推进" };
}

function filteredApps() {
  return appsWithMeta().filter((app) => {
    if (state.filters.hideEnded && app.stage === "已结束") return false;
    if (state.filters.stage !== "全部" && app.stage !== state.filters.stage) return false;
    if (state.filters.priority !== "全部" && app.priority !== state.filters.priority) return false;
    if (state.filters.risk !== "全部" && app.risk.level !== state.filters.risk) return false;
    if (state.filters.search) {
      const text = `${app.companyName} ${app.jobTitle} ${app.city}`.toLowerCase();
      if (!text.includes(state.filters.search.toLowerCase())) return false;
    }
    return true;
  });
}

function upcomingEvents(days, includePast = false) {
  const max = addDays(new Date(), days);
  return state.data.events
    .filter((event) => event.status !== "done")
    .filter((event) => includePast ? event.date <= toIso(max) : event.date >= todayIso() && event.date <= toIso(max))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getConflicts() {
  const grouped = groupBy(state.data.events.filter((event) => ["interview", "test"].includes(event.type) && event.status !== "done"), (item) => item.date);
  return Object.entries(grouped).filter(([, items]) => items.length > 1).map(([date, events]) => ({ date, events }));
}

function appById(id) {
  return state.data.applications.find((app) => app.id === id);
}

function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}
function renderDashboard() {
  const apps = appsWithMeta();
  const urgent = apps.filter((app) => app.risk.level !== "低").sort((a, b) => a.daysToDeadline - b.daysToDeadline).slice(0, 5);
  const todayEvents = state.data.events.filter((event) => event.status !== "done" && diffDays(event.date, todayIso()) === 0);
  const weekly = upcomingEvents(7);
  const stats = [
    { label: "总申请数", value: apps.length, note: `${apps.filter((app) => app.stage !== "已结束").length} 个仍在推进中` },
    { label: "高风险项", value: apps.filter((app) => app.risk.level === "高").length, note: "优先清空临期节点与 offer 决策" },
    { label: "本周事件", value: weekly.length, note: `${getConflicts().length} 个日期存在冲突` },
    { label: "已拿 Offer", value: apps.filter((app) => app.stage === "Offer").length, note: "及时比较回签时限与成长空间" },
  ];

  els.todayDate.textContent = formatLongDate(todayIso());
  els.todayFocus.textContent = stats[1].value ? `${stats[1].value} 个高风险事项` : "节奏平稳";
  els.dashboardPills.innerHTML = [`${weekly.length} 个本周事件`, `${urgent.length} 个紧急岗位`, `${apps.filter((app) => app.stage === "Offer").length} 个 Offer 机会`].map((text) => `<span class="pill">${text}</span>`).join("");
  els.statsGrid.innerHTML = stats.map((item) => `<article class="stat-card"><div class="stat-topline"><span>${item.label}</span></div><div class="stat-value">${item.value}</div><div class="stat-footnote">${item.note}</div></article>`).join("");

  els.todayTasks.innerHTML = todayEvents.length ? todayEvents.map((event) => `
    <article class="list-item clickable" data-open-app="${event.appId}">
      <div class="item-topline"><strong>${EVENT_LABELS[event.type]}</strong><span class="event-badge">${event.reminderTime || ""}</span></div>
      <div>${appById(event.appId).companyName} · ${appById(event.appId).jobTitle}</div>
      <div class="muted">${event.notes}</div>
    </article>`).join("") : emptyCard("今天没有硬性节点，可以集中处理积压事项。");

  els.urgentApplications.innerHTML = urgent.length ? urgent.map((app) => `
    <article class="list-item clickable" data-open-app="${app.id}">
      <div class="item-topline"><strong>${app.companyName}</strong><span class="risk-badge risk-${riskClass(app.risk.level)}">${app.risk.level}风险</span></div>
      <div>${app.jobTitle}</div>
      <div class="badge-row"><span class="priority-badge priority-${priorityClass(app.priority)}">${app.priority}优先级</span><span class="tag">截止 ${formatShortDate(app.deadline)}</span></div>
      <div class="muted">${app.nextAction}</div>
    </article>`).join("") : emptyCard("当前没有中高风险申请。");

  const grouped = groupBy(weekly, (item) => item.date);
  els.weeklyTimeline.innerHTML = Object.keys(grouped).length ? Object.entries(grouped).map(([date, items]) => `
    <article class="timeline-card">
      <div class="item-topline"><strong>${formatLongDate(date)}</strong><span class="tag">${items.length} 项</span></div>
      <ul>${items.map((event) => `<li>${EVENT_LABELS[event.type]} · ${appById(event.appId).companyName} · ${event.notes}</li>`).join("")}</ul>
    </article>`).join("") : emptyCard("未来一周暂无事件。");

  els.riskList.innerHTML = apps.filter((app) => app.risk.level !== "低").map((app) => `
    <article class="list-item clickable" data-open-app="${app.id}">
      <div class="item-topline"><strong>${app.companyName} · ${app.jobTitle}</strong><span class="risk-badge risk-${riskClass(app.risk.level)}">${app.risk.level}</span></div>
      <div class="muted">${app.risk.reason}</div>
      <div class="tag">下一步：${app.nextAction || "待补充"}</div>
    </article>`).join("") || emptyCard("没有明显风险项。");

  bindClickable();
}

function renderBoard() {
  const apps = filteredApps();
  els.boardColumns.innerHTML = STAGES.map((stage) => {
    const items = apps.filter((app) => app.stage === stage);
    return `
      <section class="board-column">
        <div class="column-header"><div><p class="panel-kicker">Stage</p><h3>${stage}</h3></div><span class="column-count">${items.length}</span></div>
        <div class="column-dropzone" data-stage-dropzone="${stage}">
          ${items.length ? items.map((app) => `
            <article class="board-card clickable" data-open-app="${app.id}" draggable="true" data-draggable-app="${app.id}">
              <div class="board-card-header"><span class="priority-badge priority-${priorityClass(app.priority)}">${app.priority}优先级</span><span class="risk-badge risk-${riskClass(app.risk.level)}">${app.risk.level}风险</span></div>
              <div class="board-card-title"><strong>${app.companyName}</strong><span>${app.jobTitle}</span></div>
              <div class="tag-row"><span class="tag">${app.city || "地点待补"}</span><span class="tag">截止 ${formatShortDate(app.deadline)}</span></div>
              <div class="muted">${app.nextAction || "待补充下一动作"}</div>
              <div class="card-footer"><div class="muted">${app.incompleteMaterials ? `${app.incompleteMaterials} 项待补` : "材料齐全"}</div><div class="card-actions"><button class="card-shift" type="button" data-shift-app="${app.id}" data-shift-direction="prev">←</button><button class="card-shift" type="button" data-shift-app="${app.id}" data-shift-direction="next">→</button></div></div>
            </article>`).join("") : emptyCard(`${stage} 暂无申请。`)}
        </div>
      </section>`;
  }).join("");
  bindBoardActions();
}

function bindBoardActions() {
  bindClickable();
  document.querySelectorAll("[data-shift-app]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    moveStage(button.dataset.shiftApp, button.dataset.shiftDirection === "prev" ? -1 : 1);
  }));
  document.querySelectorAll("[data-draggable-app]").forEach((card) => {
    card.addEventListener("dragstart", () => { state.draggedAppId = card.dataset.draggableApp; });
    card.addEventListener("dragend", () => {
      state.draggedAppId = null;
      document.querySelectorAll(".column-dropzone").forEach((zone) => zone.classList.remove("is-over"));
    });
  });
  document.querySelectorAll("[data-stage-dropzone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => { event.preventDefault(); zone.classList.add("is-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("is-over");
      if (state.draggedAppId) setStage(state.draggedAppId, zone.dataset.stageDropzone);
    });
  });
}

function moveStage(appId, delta) {
  const app = appById(appId);
  const index = STAGES.indexOf(app.stage) + delta;
  if (index < 0 || index >= STAGES.length) return;
  setStage(appId, STAGES[index]);
}

function setStage(appId, stage) {
  const app = appById(appId);
  if (!app || app.stage === stage) return;
  app.stage = stage;
  app.updatedAt = todayIso();
  app.history = app.history || [];
  app.history.unshift({ date: todayIso(), text: `阶段更新为 ${stage}` });
  syncApplicationStatus(app);
  persist();
  renderAll();
}
function renderCalendar() {
  els.calendarSegments.forEach((button) => button.classList.toggle("active", button.dataset.calendarMode === state.calendarMode));
  if (state.calendarMode === "month") {
    els.calendarTitle.textContent = "本月安排";
    els.calendarMain.innerHTML = renderMonth();
  } else if (state.calendarMode === "week") {
    els.calendarTitle.textContent = "未来 7 天";
    els.calendarMain.innerHTML = renderWeek();
  } else {
    els.calendarTitle.textContent = "事件列表";
    els.calendarMain.innerHTML = renderList();
  }
  const conflicts = getConflicts();
  els.conflictList.innerHTML = conflicts.length ? conflicts.map((item) => `
    <article class="list-item">
      <div class="item-topline"><strong>${formatLongDate(item.date)}</strong><span class="risk-badge risk-medium">${item.events.length} 个事件</span></div>
      <div class="muted">${item.events.map((event) => `${EVENT_LABELS[event.type]} · ${appById(event.appId).companyName}`).join(" / ")}</div>
    </article>`).join("") : emptyCard("未来一周暂无明显时间冲突。");
  bindClickable();
}

function renderMonth() {
  const base = new Date();
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const last = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  const offset = (first.getDay() + 6) % 7;
  const grouped = groupBy(upcomingEvents(40, true), (event) => event.date);
  const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day) => `<div class="calendar-header-cell">${day}</div>`).join("");
  const cells = [];
  for (let i = 0; i < offset; i += 1) cells.push('<div class="calendar-day empty"></div>');
  for (let day = 1; day <= last.getDate(); day += 1) {
    const iso = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const items = grouped[iso] || [];
    cells.push(`
      <div class="calendar-day ${iso === todayIso() ? "today" : ""}">
        <div class="item-topline"><span class="day-number">${day}</span>${items.length ? `<span class="tag">${items.length}</span>` : ""}</div>
        ${items.length ? items.slice(0, 3).map((event) => `<button class="day-chip clickable" type="button" data-open-app="${event.appId}">${EVENT_LABELS[event.type]} · ${appById(event.appId).companyName}</button>`).join("") : '<span class="muted">无安排</span>'}
      </div>`);
  }
  return `<div class="calendar-month">${weekdays}${cells.join("")}</div>`;
}

function renderWeek() {
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const grouped = groupBy(upcomingEvents(7, true), (event) => event.date);
  return `<div class="calendar-week">${days.map((date) => {
    const iso = toIso(date);
    const items = grouped[iso] || [];
    return `<article class="week-card"><div class="item-topline"><strong>${formatLongDate(iso)}</strong>${items.length ? `<span class="tag">${items.length} 项</span>` : ""}</div>${items.length ? items.map((event) => `<button class="list-item clickable" type="button" data-open-app="${event.appId}"><div class="item-topline"><strong>${EVENT_LABELS[event.type]}</strong><span class="event-badge">${event.reminderTime || ""}</span></div><div>${appById(event.appId).companyName}</div><div class="muted">${event.notes}</div></button>`).join("") : '<div class="muted">无安排</div>'}</article>`;
  }).join("")}</div>`;
}

function renderList() {
  const items = upcomingEvents(30, true);
  return items.length ? `<div class="list-view">${items.map((event) => `<article class="list-event clickable" data-open-app="${event.appId}"><div class="item-topline"><strong>${formatLongDate(event.date)} · ${EVENT_LABELS[event.type]}</strong><span class="event-badge">${event.reminderTime || ""}</span></div><div>${appById(event.appId).companyName} · ${appById(event.appId).jobTitle}</div><div class="muted">${event.notes}</div></article>`).join("")}</div>` : emptyCard("未来 30 天暂无事件。");
}

function renderMaterials() {
  const materials = state.data.materials.map((material) => ({
    ...material,
    usage: state.data.applications.filter((app) => (app.materials || []).some((item) => item.materialId === material.id)),
  }));
  els.materialsSummary.innerHTML = MATERIAL_STATUSES.map((status) => ({ label: status, value: materials.filter((item) => item.status === status).length, note: status === "需更新" ? "优先处理版本老化材料" : "" })).map((item) => `<article class="stat-card"><div class="stat-topline"><span>${item.label}</span></div><div class="stat-value">${item.value}</div><div class="stat-footnote">${item.note}</div></article>`).join("");
  els.materialsTable.innerHTML = `
    <div class="table-row header"><span>材料</span><span>版本</span><span>状态</span><span>使用岗位</span></div>
    ${materials.map((material) => `<div class="table-row"><span><strong>${material.name}</strong><br /><span class="muted">${material.type}</span></span><span>${material.version}</span><span><span class="tag">${material.status}</span></span><span class="material-usage">${material.usage.length ? material.usage.map((app) => `<span class="tag">${app.companyName}</span>`).join("") : '<span class="muted">未关联</span>'}</span></div>`).join("")}`;
  const gaps = appsWithMeta().filter((app) => app.incompleteMaterials > 0);
  els.materialGaps.innerHTML = gaps.length ? gaps.map((app) => `<article class="list-item clickable" data-open-app="${app.id}"><div class="item-topline"><strong>${app.companyName} · ${app.jobTitle}</strong><span class="tag">${app.incompleteMaterials} 项待补</span></div><div class="muted">${app.materials.filter((item) => item.status !== "已提交").map((item) => `${item.name}:${item.status}`).join(" / ")}</div></article>`).join("") : emptyCard("所有岗位的材料状态都已齐全。");
  bindClickable();
}

function renderAnalytics() {
  const apps = appsWithMeta();
  const total = apps.length || 1;
  els.funnelChart.innerHTML = STAGES.map((stage) => {
    const count = apps.filter((app) => app.stage === stage).length;
    return `<div class="funnel-row"><span>${stage}</span><div class="funnel-bar"><div class="funnel-fill" style="width:${(count / total) * 100}%"></div></div><strong>${count}</strong></div>`;
  }).join("");
  els.priorityBreakdown.innerHTML = PRIORITIES.map((priority) => {
    const count = apps.filter((app) => app.priority === priority).length;
    return `<article class="metric-item"><div class="item-topline"><strong>${priority}优先级</strong><span>${count}</span></div><div class="muted">占总申请 ${(count / total * 100).toFixed(0)}%</div></article>`;
  }).join("");
  const stale = apps.filter((app) => app.daysSinceUpdate >= 7 && app.stage !== "已结束");
  const highRisk = apps.filter((app) => app.risk.level === "高");
  const topGap = apps.filter((app) => app.incompleteMaterials > 0).sort((a, b) => b.incompleteMaterials - a.incompleteMaterials)[0];
  const cards = [
    { kicker: "Rhythm", title: highRisk.length ? `先处理 ${highRisk[0].companyName}` : "整体节奏稳定", body: highRisk.length ? `${highRisk[0].risk.reason}。今天优先完成：${highRisk[0].nextAction}` : "当前没有硬性高风险事项。" },
    { kicker: "Follow-up", title: stale.length ? `${stale.length} 个岗位需要跟进` : "跟进节奏正常", body: stale.length ? `${stale.map((app) => app.companyName).join("、")} 已超过 7 天未更新。` : "没有明显停滞申请。" },
    { kicker: "Offer", title: `${apps.filter((app) => app.stage === "Offer").length} 个 Offer 节点`, body: "建议把回签时限、岗位匹配度和成长空间拉成对比表。" },
    { kicker: "Materials", title: topGap ? `${topGap.companyName} 材料压力最高` : "材料准备整体健康", body: topGap ? `${topGap.incompleteMaterials} 项材料仍未提交，优先补齐能直接降低风险。` : "当前材料缺口不大。" },
  ];
  els.insightCards.innerHTML = cards.map((item) => `<article class="insight-card"><p class="panel-kicker">${item.kicker}</p><h3>${item.title}</h3><p class="muted">${item.body}</p></article>`).join("");
}
function renderDrawer() {
  if (!state.drawerAppId) {
    els.detailDrawer.classList.remove("open");
    els.detailDrawer.setAttribute("aria-hidden", "true");
    return;
  }
  const app = appsWithMeta().find((item) => item.id === state.drawerAppId);
  if (!app) {
    closeDrawer();
    return;
  }
  const pendingEvents = app.events.filter((event) => event.status !== "done").sort((a, b) => a.date.localeCompare(b.date));
  const doneEvents = app.events.filter((event) => event.status === "done").sort((a, b) => b.date.localeCompare(a.date));
  els.drawerTitle.textContent = `${app.companyName} · ${app.jobTitle}`;
  els.drawerContent.innerHTML = `
    <section class="drawer-section">
      <div class="badge-row"><span class="priority-badge priority-${priorityClass(app.priority)}">${app.priority}优先级</span><span class="risk-badge risk-${riskClass(app.risk.level)}">${app.risk.level}风险</span><span class="tag">${app.stage}</span></div>
      <form id="drawerEditForm" class="form-grid drawer-form">
        <label><span>公司名称</span><input name="companyName" type="text" value="${escapeAttr(app.companyName)}" required /></label>
        <label><span>岗位名称</span><input name="jobTitle" type="text" value="${escapeAttr(app.jobTitle)}" required /></label>
        <label><span>城市 / 部门</span><input name="city" type="text" value="${escapeAttr(app.city || "")}" /></label>
        <label><span>当前阶段</span><select name="stage">${STAGES.map((stage) => `<option value="${stage}" ${stage === app.stage ? "selected" : ""}>${stage}</option>`).join("")}</select></label>
        <label><span>截止日期</span><input name="deadline" type="date" value="${escapeAttr(app.deadline || "")}" /></label>
        <label><span>优先级</span><select name="priority">${PRIORITIES.map((priority) => `<option value="${priority}" ${priority === app.priority ? "selected" : ""}>${priority}</option>`).join("")}</select></label>
        <label class="span-2"><span>下一关键动作</span><input name="nextAction" type="text" value="${escapeAttr(app.nextAction || "")}" /></label>
        <label class="span-2"><span>岗位链接</span><input name="jobLink" type="url" value="${escapeAttr(app.jobLink || "")}" /></label>
        <label><span>来源渠道</span><input name="source" type="text" value="${escapeAttr(app.source || "")}" /></label>
        <label><span>薪资范围</span><input name="salaryRange" type="text" value="${escapeAttr(app.salaryRange || "")}" /></label>
        <label><span>HR 姓名</span><input name="hrName" type="text" value="${escapeAttr(app.contact.hrName || "")}" /></label>
        <label><span>邮箱</span><input name="email" type="email" value="${escapeAttr(app.contact.email || "")}" /></label>
        <label><span>微信</span><input name="wechat" type="text" value="${escapeAttr(app.contact.wechat || "")}" /></label>
        <label><span>电话</span><input name="phone" type="text" value="${escapeAttr(app.contact.phone || "")}" /></label>
        <label class="span-2"><span>备注</span><textarea name="notes" rows="4">${escapeHtml(app.notes || "")}</textarea></label>
        <div class="form-actions span-2">
          <button class="secondary-btn danger-btn" id="drawerDeleteBtn" type="button">删除岗位</button>
          <button class="primary-btn" type="submit">保存详情</button>
        </div>
      </form>
    </section>
    <section class="drawer-section"><div><p class="panel-kicker">Events</p><h3>关键节点</h3></div>${pendingEvents.length ? pendingEvents.map((event) => `<article class="list-item"><div class="item-topline"><strong>${EVENT_LABELS[event.type]}</strong><span class="event-badge">${formatShortDate(event.date)} ${event.reminderTime || ""}</span></div><div class="muted">${event.notes}</div><div class="card-actions"><button class="secondary-btn inline-btn" type="button" data-complete-event="${event.id}">标记完成</button></div></article>`).join("") : emptyCard("暂无待处理事件")}${doneEvents.length ? `<div><p class="panel-kicker">Done</p><h3>已完成事件</h3></div>${doneEvents.map((event) => `<article class="list-item"><div class="item-topline"><strong>${EVENT_LABELS[event.type]}</strong><span class="tag">已完成</span></div><div class="muted">${formatLongDate(event.date)} · ${event.notes}</div></article>`).join("")}` : ""}</section>
    <section class="drawer-section"><div><p class="panel-kicker">Materials</p><h3>材料状态</h3></div>${app.materials.length ? app.materials.map((item) => `<article class="list-item"><div class="item-topline"><strong>${item.name}</strong><span class="tag">${item.status}</span></div><div class="muted">${item.type} · 版本 ${item.version}</div></article>`).join("") : emptyCard("暂无材料关联")}</section>
    <section class="drawer-section"><div><p class="panel-kicker">History</p><h3>进度记录</h3></div>${(app.history || []).map((item) => `<article class="list-item"><div class="item-topline"><strong>${item.text}</strong><span class="tag">${formatShortDate(item.date)}</span></div></article>`).join("") || emptyCard("暂无历史记录")}</section>`;
  document.getElementById("drawerEditForm").addEventListener("submit", (event) => saveDrawerDetails(app.id, event));
  document.getElementById("drawerDeleteBtn").addEventListener("click", () => deleteApplication(app.id));
  document.querySelectorAll("[data-complete-event]").forEach((button) => button.addEventListener("click", () => completeEvent(button.dataset.completeEvent)));
  els.detailDrawer.classList.add("open");
  els.detailDrawer.setAttribute("aria-hidden", "false");
}

function bindClickable() {
  document.querySelectorAll("[data-open-app]").forEach((node) => node.addEventListener("click", () => {
    state.drawerAppId = node.dataset.openApp;
    renderDrawer();
  }));
}

function closeDrawer() {
  state.drawerAppId = null;
  renderDrawer();
}

function openCreateModal() {
  els.createModal.classList.remove("hidden");
  els.createModal.setAttribute("aria-hidden", "false");
  els.createForm.reset();
  els.formStage.value = "待投递";
  els.formPriority.value = "中";
}

function closeCreateModal() {
  els.createModal.classList.add("hidden");
  els.createModal.setAttribute("aria-hidden", "true");
}

function createApplication(event) {
  event.preventDefault();
  const data = new FormData(els.createForm);
  const companyName = String(data.get("companyName") || "").trim();
  const jobTitle = String(data.get("jobTitle") || "").trim();
  if (!companyName || !jobTitle) return;
  const id = `app-${Date.now()}`;
  const deadline = String(data.get("deadline") || "").trim() || todayIso();
  state.data.applications.unshift({
    id,
    companyName,
    jobTitle,
    city: String(data.get("city") || "").trim(),
    stage: String(data.get("stage") || "待投递"),
    deadline,
    nextAction: String(data.get("nextAction") || "").trim(),
    priority: String(data.get("priority") || "中"),
    applicationStatus: "active",
    notes: String(data.get("notes") || "").trim(),
    updatedAt: todayIso(),
    source: String(data.get("source") || "").trim(),
    jobLink: String(data.get("jobLink") || "").trim(),
    salaryRange: String(data.get("salaryRange") || "").trim(),
    contact: { hrName: "", email: "", wechat: "", phone: "" },
    materials: [{ materialId: "mat-1", status: "已准备未提交" }, { materialId: "mat-3", status: "未准备" }],
    history: [{ date: todayIso(), text: "创建申请记录" }],
  });
  state.data.events.unshift({
    id: `evt-${Date.now()}`,
    appId: id,
    type: "deadline",
    date: deadline,
    status: "pending",
    notes: "新岗位截止提醒",
    reminderTime: "10:00",
  });
  persist();
  closeCreateModal();
  state.view = "board";
  renderAll();
}

function saveDrawerDetails(appId, event) {
  event.preventDefault();
  const app = appById(appId);
  if (!app) return;
  const data = new FormData(event.currentTarget);
  const previousStage = app.stage;
  const previousDeadline = app.deadline;
  app.companyName = String(data.get("companyName") || "").trim();
  app.jobTitle = String(data.get("jobTitle") || "").trim();
  app.city = String(data.get("city") || "").trim();
  app.stage = String(data.get("stage") || app.stage);
  app.deadline = String(data.get("deadline") || "").trim() || todayIso();
  app.priority = String(data.get("priority") || app.priority);
  app.nextAction = String(data.get("nextAction") || "").trim();
  app.jobLink = String(data.get("jobLink") || "").trim();
  app.source = String(data.get("source") || "").trim();
  app.salaryRange = String(data.get("salaryRange") || "").trim();
  app.notes = String(data.get("notes") || "").trim();
  app.contact = {
    hrName: String(data.get("hrName") || "").trim(),
    email: String(data.get("email") || "").trim(),
    wechat: String(data.get("wechat") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
  };
  syncApplicationStatus(app);
  if (previousStage !== app.stage) {
    app.history = app.history || [];
    app.history.unshift({ date: todayIso(), text: `阶段更新为 ${app.stage}` });
  }
  if (previousDeadline !== app.deadline) {
    const deadlineEvent = state.data.events.find((item) => item.appId === app.id && item.type === "deadline" && item.status !== "done");
    if (deadlineEvent) deadlineEvent.date = app.deadline;
  }
  app.updatedAt = todayIso();
  app.history = app.history || [];
  app.history.unshift({ date: todayIso(), text: "更新岗位详情" });
  persist();
  renderAll();
}

function deleteApplication(appId) {
  const app = appById(appId);
  if (!app) return;
  if (!window.confirm(`确认删除 ${app.companyName} · ${app.jobTitle} 吗？该岗位的事件记录也会一起移除。`)) return;
  state.data.applications = state.data.applications.filter((item) => item.id !== appId);
  state.data.events = state.data.events.filter((item) => item.appId !== appId);
  state.drawerAppId = null;
  persist();
  renderAll();
}

function completeEvent(eventId) {
  const event = state.data.events.find((item) => item.id === eventId);
  if (!event) return;
  event.status = "done";
  const app = appById(event.appId);
  if (app) {
    app.updatedAt = todayIso();
    app.history = app.history || [];
    app.history.unshift({ date: todayIso(), text: `完成事件：${EVENT_LABELS[event.type]}` });
  }
  persist();
  renderAll();
}

function syncApplicationStatus(app) {
  if (app.stage === "Offer") {
    app.applicationStatus = "offer";
  } else if (app.stage === "已结束") {
    app.applicationStatus = "closed";
  } else {
    app.applicationStatus = "active";
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function emptyCard(text) {
  return `<div class="empty-card">${text}</div>`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function diffDays(from, to) {
  const start = new Date(from);
  const end = new Date(to);
  const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((b - a) / 86400000);
}

function toIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function todayIso() {
  return toIso(new Date());
}

function formatShortDate(value) {
  if (!value) return "待补充";
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatLongDate(value) {
  if (!value) return "待补充";
  const date = new Date(value);
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
}

function riskClass(level) {
  return { 高: "high", 中: "medium", 低: "low" }[level] || "low";
}

function priorityClass(level) {
  return { 高: "high", 中: "medium", 低: "low" }[level] || "low";
}




