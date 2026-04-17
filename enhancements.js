(() => {
  const SETTINGS = {
    reminderLeadDays: 3,
    followupAfterDays: 5,
    pacing: "稳健推进",
    focusRule: "先清高风险，再推高优先级"
  };
  const OPPORTUNITY_STATUSES = ["优先关注", "观察中", "暂缓"];
  const PRIORITIES = ["高", "中", "低"];
  const TASK_LABELS = { primary: "关键动作", followup: "跟进", prep: "准备", decision: "决策", admin: "录入" };
  const refs = {
    opportunityColumns: document.getElementById("opportunityColumns"),
    opportunitySearchInput: document.getElementById("opportunitySearchInput"),
    opportunityStatusFilter: document.getElementById("opportunityStatusFilter"),
    opportunityPriorityFilter: document.getElementById("opportunityPriorityFilter"),
    settingsPanel: document.getElementById("settingsPanel"),
    calendarSettings: document.getElementById("calendarSettings"),
    strategyMetrics: document.getElementById("strategyMetrics"),
    channelInsights: document.getElementById("channelInsights"),
    materialInsights: document.getElementById("materialInsights"),
    offerComparison: document.getElementById("offerComparison"),
    opportunityCreateBtn: document.getElementById("opportunityCreateBtn"),
    exportDataBtn: document.getElementById("exportDataBtn"),
    importDataBtn: document.getElementById("importDataBtn"),
    importFileInput: document.getElementById("importFileInput"),
    recordTypeSelect: document.getElementById("recordTypeSelect"),
    templateSelect: document.getElementById("templateSelect"),
    cloneSelect: document.getElementById("cloneSelect")
  };
  const templates = [
    { label: "自定义", type: "application" },
    { label: "产品经理模板", type: "application", source: "官网 / 内推", nextAction: "补齐产品案例并完成网申", stage: "待投递" },
    { label: "策略/商分模板", type: "application", source: "官网 / BOSS", nextAction: "准备业务分析案例并确认截止时间", stage: "待投递" },
    { label: "机会收藏模板", type: "opportunity", source: "Boss / 脉脉", reason: "先收藏，等到合适窗口再投" }
  ];
  const defaultOpportunities = [
    { id: uid("opp"), companyName: "京东", jobTitle: "商业分析", city: "北京", priority: "高", status: "优先关注", source: "官网", reason: "业务匹配度高，岗位窗口刚开", notes: "等周末补简历后投递", createdAt: todayIso() },
    { id: uid("opp"), companyName: "携程", jobTitle: "策略运营", city: "上海", priority: "中", status: "观察中", source: "Boss", reason: "方向合适，但团队信息还不够", notes: "先补公司研究卡", createdAt: todayIso() }
  ];
  hydrate();
  const baseRenderAll = renderAll;
  const baseRenderAnalytics = renderAnalytics;
  const baseRenderDrawer = renderDrawer;

  refs.opportunityCreateBtn?.addEventListener("click", () => openCapture("opportunity"));
  refs.exportDataBtn?.addEventListener("click", exportData);
  refs.importDataBtn?.addEventListener("click", () => refs.importFileInput?.click());
  refs.importFileInput?.addEventListener("change", importData);
  refs.opportunitySearchInput?.addEventListener("input", renderOpportunityView);
  refs.opportunityStatusFilter?.addEventListener("change", renderOpportunityView);
  refs.opportunityPriorityFilter?.addEventListener("change", renderOpportunityView);
  refs.recordTypeSelect?.addEventListener("change", syncCaptureMode);
  refs.templateSelect?.addEventListener("change", applyTemplate);
  refs.cloneSelect?.addEventListener("change", applyClone);
  els.createForm.addEventListener("submit", handleCaptureSubmit, true);
  document.addEventListener("click", handleEnhancementClick);
  document.addEventListener("change", handleEnhancementChange);

  fillSelect(refs.opportunityStatusFilter, ["全部", ...OPPORTUNITY_STATUSES]);
  fillSelect(refs.opportunityPriorityFilter, ["全部", ...PRIORITIES]);
  fillSelect(refs.templateSelect, templates.map((item) => item.label));

  renderDashboard = function renderDashboardEnhanced() {
    const apps = appsWithMeta().map((app) => ({ ...app, tasks: pendingTasks(app.id), offerTotal: offerTotal(app) }));
    const queue = state.data.tasks.filter((task) => task.status !== "done").sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 6);
    const opps = filteredOpportunities().slice(0, 4);
    const weekly = upcomingEvents(7);
    const urgent = apps.filter((app) => app.risk.level !== "低").sort((a, b) => a.daysToDeadline - b.daysToDeadline).slice(0, 4);
    const stats = [
      { label: "总申请数", value: apps.length, note: `${apps.filter((app) => app.stage !== "已结束").length} 个仍在推进中` },
      { label: "行动待办", value: state.data.tasks.filter((task) => task.status !== "done").length, note: `${queue.filter((task) => diffDays(todayIso(), task.dueDate) < 0).length} 个已逾期` },
      { label: "机会池", value: state.data.opportunities.length, note: `${state.data.opportunities.filter((item) => item.status === "优先关注").length} 个优先机会` },
      { label: "Offer 决策", value: apps.filter((app) => app.stage === "Offer").length, note: "支持多维对比做选择" }
    ];
    els.todayFocus.textContent = queue[0] ? queue[0].title : "节奏平稳";
    els.todayDate.textContent = formatLongDate(todayIso());
    els.dashboardPills.innerHTML = [`${queue.length} 个待办动作`, `${opps.length} 个机会待筛选`, `${weekly.length} 个本周事件`, state.data.settings.pacing].map((text) => `<span class="pill">${text}</span>`).join("");
    els.statsGrid.innerHTML = stats.map((item) => `<article class="stat-card"><div class="stat-topline"><span>${item.label}</span></div><div class="stat-value">${item.value}</div><div class="stat-footnote">${item.note}</div></article>`).join("");
    els.todayTasks.innerHTML = queue.length ? queue.map((task) => `<article class="list-item"><div class="item-topline"><strong>${task.title}</strong><span class="tag">${taskUrgency(task)}</span></div><div>${appById(task.appId)?.companyName || "未关联岗位"} · ${TASK_LABELS[task.category] || "动作"}</div><div class="inline-actions"><button class="micro-btn" type="button" data-task-snooze="${task.id}">稍后 1 天</button><button class="micro-btn" type="button" data-task-complete="${task.id}">标记完成</button></div></article>`).join("") : emptyCard("当前没有待办动作。");
    els.urgentApplications.innerHTML = urgent.length ? urgent.map((app) => `<article class="list-item clickable" data-open-app="${app.id}"><div class="item-topline"><strong>${app.companyName}</strong><span class="risk-badge risk-${riskClass(app.risk.level)}">${app.risk.level}</span></div><div>${app.jobTitle}</div><div class="muted">下一步：${app.nextAction || "待补充"}</div></article>`).join("") : emptyCard("当前没有中高风险申请。");
    document.getElementById("opportunitySnapshot").innerHTML = opps.length ? opps.map((item) => `<article class="list-item"><div class="item-topline"><strong>${item.companyName}</strong><span class="priority-badge priority-${priorityClass(item.priority)}">${item.priority}</span></div><div>${item.jobTitle} · ${item.city || "地点待补"}</div><div class="muted">${item.reason || "待补关注理由"}</div><div class="inline-actions"><button class="micro-btn" type="button" data-promote-opportunity="${item.id}">转为申请</button></div></article>`).join("") : emptyCard("机会池为空，建议先收藏一批可投岗位。");
    const grouped = groupBy(weekly, (item) => item.date);
    els.weeklyTimeline.innerHTML = Object.entries(grouped).map(([date, items]) => `<article class="timeline-card"><div class="item-topline"><strong>${formatLongDate(date)}</strong><span class="tag">${items.length} 项</span></div><ul>${items.map((event) => `<li>${EVENT_LABELS[event.type]} · ${appById(event.appId)?.companyName || "未知公司"} · ${event.notes}</li>`).join("")}</ul></article>`).join("") || emptyCard("未来一周暂无事件。");
    els.riskList.innerHTML = apps.filter((app) => app.risk.level !== "低").map((app) => `<article class="list-item clickable" data-open-app="${app.id}"><div class="item-topline"><strong>${app.companyName} · ${app.jobTitle}</strong><span class="risk-badge risk-${riskClass(app.risk.level)}">${app.risk.level}</span></div><div class="muted">${app.risk.reason}</div><div class="tag">下一步：${app.nextAction || "待补充"}</div></article>`).join("") || emptyCard("没有明显风险项。");
    renderSettings();
  };

  renderAnalytics = function renderAnalyticsEnhanced() {
    baseRenderAnalytics();
    const apps = appsWithMeta();
    const total = apps.length || 1;
    const metrics = [
      { label: "面试转化率", value: `${((apps.filter((item) => ["面试中", "Offer"].includes(item.stage)).length / total) * 100).toFixed(0)}%`, note: "进入面试及之后阶段的申请占比" },
      { label: "Offer 转化率", value: `${((apps.filter((item) => item.stage === "Offer").length / total) * 100).toFixed(0)}%`, note: "已拿到 Offer 的申请占比" },
      { label: "平均跟进天数", value: average(apps.map((item) => diffDays(item.createdAt || item.updatedAt, item.updatedAt || todayIso()))).toFixed(1), note: "创建到最近一次更新的平均天数" },
      { label: "机会池容量", value: `${state.data.opportunities.length}`, note: "投递前储备的岗位数量" }
    ];
    refs.strategyMetrics.innerHTML = metrics.map((item) => `<article class="stat-card"><div class="stat-topline"><span>${item.label}</span></div><div class="stat-value">${item.value}</div><div class="stat-footnote">${item.note}</div></article>`).join("");
    const channels = Object.entries(groupBy(apps, (item) => item.source || "未注明")).map(([source, items]) => ({ source, total: items.length, interviews: items.filter((item) => ["面试中", "Offer"].includes(item.stage)).length, offers: items.filter((item) => item.stage === "Offer").length }));
    refs.channelInsights.innerHTML = channels.map((item) => `<article class="metric-item"><div class="item-topline"><strong>${item.source}</strong><span>${item.total}</span></div><div class="muted">面试 ${item.interviews} / Offer ${item.offers}</div></article>`).join("") || emptyCard("暂无渠道数据。");
    refs.materialInsights.innerHTML = state.data.materials.map((material) => { const usage = state.data.applications.filter((app) => (app.materials || []).some((entry) => entry.materialId === material.id)); return `<article class="metric-item"><div class="item-topline"><strong>${material.name}</strong><span>${usage.length}</span></div><div class="muted">Offer ${usage.filter((item) => item.stage === "Offer").length} / 面试 ${usage.filter((item) => item.stage === "面试中").length}</div></article>`; }).join("");
    const offers = apps.filter((item) => item.stage === "Offer");
    refs.offerComparison.innerHTML = offers.length ? offers.map((app) => `<article class="offer-card clickable" data-open-app="${app.id}"><div class="item-topline"><strong>${app.companyName}</strong><span class="tag">${formatShortDate(app.offerDecision?.expiresOn || app.deadline)}</span></div><div>${app.jobTitle} · ${app.city || ""}</div><div class="offer-score"><strong>${offerTotal(app)}</strong><span class="muted">/25</span></div><div class="muted">${app.offerDecision?.notes || "建议补齐选择理由，避免只凭感觉做决定。"}</div></article>`).join("") : emptyCard("当前还没有需要比较的 Offer。");
  };

  renderDrawer = function renderDrawerEnhanced() {
    baseRenderDrawer();
    if (!state.drawerAppId) return;
    const app = appById(state.drawerAppId);
    if (!app) return;
    const host = els.drawerContent;
    const section = document.createElement("section");
    section.className = "drawer-section";
    section.innerHTML = `<div><p class="panel-kicker">Action & Review</p><h3>动作闭环与面试复盘</h3></div><div class="list-stack">${pendingTasks(app.id).map((task) => `<article class="list-item"><div class="item-topline"><strong>${task.title}</strong><span class="tag">${taskUrgency(task)}</span></div><div class="inline-actions"><button class="micro-btn" type="button" data-task-snooze="${task.id}">稍后 1 天</button><button class="micro-btn" type="button" data-task-complete="${task.id}">标记完成</button></div></article>`).join("") || emptyCard("当前没有待办动作。")}</div><form id="enhancedTaskForm" class="subform"><div class="subform-grid"><label><span>新增动作</span><input name="title" type="text" placeholder="例如：周五前完成案例复盘" /></label><label><span>截止日期</span><input name="dueDate" type="date" value="${app.deadline || todayIso()}" /></label></div><div class="form-actions"><button class="primary-btn" type="submit">新增动作</button></div></form><form id="enhancedInterviewForm" class="subform"><label><span>面试复盘</span><textarea name="reviewNotes" rows="3">${app.interviewPrep?.reviewNotes || ""}</textarea></label><label><span>跟进邮件草稿</span><textarea name="followupDraft" rows="3">${app.interviewPrep?.followupDraft || ""}</textarea></label><div class="form-actions"><button class="primary-btn" type="submit">保存复盘</button></div></form>${app.stage === "Offer" ? `<form id="enhancedOfferForm" class="subform"><div class="subform-grid"><label><span>回签日期</span><input name="expiresOn" type="date" value="${app.offerDecision?.expiresOn || app.deadline || todayIso()}" /></label><label><span>主观匹配分</span><select name="matchScore">${[1,2,3,4,5].map((item)=>`<option value="${item}" ${item === (app.offerDecision?.matchScore || 3) ? "selected" : ""}>${item}</option>`).join("")}</select></label></div><label><span>决策备注</span><textarea name="notes" rows="3">${app.offerDecision?.notes || ""}</textarea></label><div class="form-actions"><button class="primary-btn" type="submit">保存 Offer 判断</button></div></form>` : ""}`;
    host.appendChild(section);
    document.getElementById("enhancedTaskForm")?.addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const title = String(form.get("title") || "").trim(); if (!title) return; state.data.tasks.unshift({ id: uid("tsk"), appId: app.id, title, dueDate: String(form.get("dueDate") || todayIso()), status: "todo", category: "primary", source: "manual" }); syncNextAction(app.id); persist(); renderAll(); });
    document.getElementById("enhancedInterviewForm")?.addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); app.interviewPrep = app.interviewPrep || { reviewNotes: "", followupDraft: "" }; app.interviewPrep.reviewNotes = String(form.get("reviewNotes") || ""); app.interviewPrep.followupDraft = String(form.get("followupDraft") || ""); app.updatedAt = todayIso(); persist(); renderDrawer(); });
    document.getElementById("enhancedOfferForm")?.addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); app.offerDecision = { ...(app.offerDecision || {}), expiresOn: String(form.get("expiresOn") || app.deadline || todayIso()), matchScore: Number(form.get("matchScore") || 3), notes: String(form.get("notes") || "") }; persist(); renderAll(); });
  };

  renderAll = function renderAllEnhanced() {
    baseRenderAll();
    enhanceBoardCards();
    renderOpportunityView();
    renderSettings();
    syncCaptureMode();
  };

  renderAll();

  function hydrate() {
    state.data.applications = (state.data.applications || []).map((app) => ({ ...app, createdAt: app.createdAt || app.updatedAt || todayIso(), interviewPrep: app.interviewPrep || { checklist: [{ label: "准备岗位亮点案例", done: false }, { label: "整理自我介绍", done: false }, { label: "确认跟进动作", done: false }], commonQuestions: "", reviewNotes: "", followupDraft: "" }, offerDecision: app.offerDecision || (app.stage === "Offer" ? { expiresOn: app.deadline || todayIso(), matchScore: 4, growthScore: 4, cityScore: 5, compensationScore: 3, preferenceScore: 4, notes: "建议补齐选择理由，避免只凭感觉做决定。" } : null) }));
    if (!Array.isArray(state.data.tasks)) state.data.tasks = [];
    if (!state.data.tasks.length) state.data.tasks = state.data.applications.flatMap((app) => app.nextAction ? [{ id: uid("tsk"), appId: app.id, title: app.nextAction, dueDate: app.deadline || todayIso(), status: "todo", category: "primary", source: "nextAction" }] : []);
    if (!Array.isArray(state.data.opportunities)) state.data.opportunities = defaultOpportunities;
    if (!state.data.opportunities.length) state.data.opportunities = defaultOpportunities;
    state.data.settings = { ...SETTINGS, ...(state.data.settings || {}) };
    state.opportunityFilters = state.opportunityFilters || { search: "", status: "全部", priority: "全部" };
    persist();
  }

  function renderOpportunityView() {
    if (!refs.opportunityColumns) return;
    state.opportunityFilters.search = refs.opportunitySearchInput?.value.trim() || "";
    state.opportunityFilters.status = refs.opportunityStatusFilter?.value || "全部";
    state.opportunityFilters.priority = refs.opportunityPriorityFilter?.value || "全部";
    refs.opportunityColumns.innerHTML = OPPORTUNITY_STATUSES.map((status) => { const items = filteredOpportunities().filter((item) => item.status === status); return `<section class="opportunity-column"><div class="column-header"><div><p class="panel-kicker">Pool</p><h3>${status}</h3></div><span class="column-count">${items.length}</span></div><div class="opportunity-dropzone">${items.map((item) => `<article class="opportunity-card"><div class="item-topline"><strong>${item.companyName}</strong><span class="priority-badge priority-${priorityClass(item.priority)}">${item.priority}</span></div><div class="opportunity-title"><span>${item.jobTitle}</span><span class="muted">${item.city || "地点待补"}</span></div><div class="muted">${item.reason || "待补关注理由"}</div><div class="card-actions"><button class="micro-btn" type="button" data-promote-opportunity="${item.id}">转为申请</button>${OPPORTUNITY_STATUSES.filter((entry) => entry !== status).map((entry) => `<button class="micro-btn" type="button" data-opportunity-status="${item.id}" data-status-target="${entry}">${entry}</button>`).join("")}</div></article>`).join("") || emptyCard(`${status} 暂无机会。`)}</div></section>`; }).join("");
  }

  function renderSettings() {
    const html = `<label class="settings-card"><span>提前提醒天数</span><select data-setting-key="reminderLeadDays">${[1,2,3,5,7].map((item)=>`<option value="${item}" ${Number(state.data.settings.reminderLeadDays)===item?"selected":""}>提前 ${item} 天</option>`).join("")}</select></label><label class="settings-card"><span>跟进节奏</span><select data-setting-key="followupAfterDays">${[3,5,7,10].map((item)=>`<option value="${item}" ${Number(state.data.settings.followupAfterDays)===item?"selected":""}>${item} 天未更新提醒</option>`).join("")}</select></label><label class="settings-card"><span>推进风格</span><select data-setting-key="pacing">${["高压冲刺","稳健推进","保守筛选"].map((item)=>`<option value="${item}" ${state.data.settings.pacing===item?"selected":""}>${item}</option>`).join("")}</select></label><label class="settings-card"><span>优先规则</span><select data-setting-key="focusRule">${["先清高风险，再推高优先级","先推高优先级，再补齐缺口","先处理最接近截止的岗位"].map((item)=>`<option value="${item}" ${state.data.settings.focusRule===item?"selected":""}>${item}</option>`).join("")}</select></label>`;
    refs.settingsPanel && (refs.settingsPanel.innerHTML = html);
    refs.calendarSettings && (refs.calendarSettings.innerHTML = html);
  }

  function enhanceBoardCards() {
    document.querySelectorAll("[data-duplicate-enhanced]").forEach((node) => node.remove());
    document.querySelectorAll(".board-card .card-actions").forEach((node) => { const card = node.closest(".board-card"); if (!card) return; const id = card.dataset.openApp; if (!id) return; const button = document.createElement("button"); button.type = "button"; button.className = "micro-btn"; button.dataset.duplicateEnhanced = id; button.textContent = "复制"; node.prepend(button); });
  }

  function handleEnhancementClick(event) {
    const duplicate = event.target.closest("[data-duplicate-enhanced]");
    if (duplicate) { const app = appById(duplicate.dataset.duplicateEnhanced); if (!app) return; openCapture("application"); fillCapture(app); return; }
    const complete = event.target.closest("[data-task-complete]");
    if (complete) { const task = state.data.tasks.find((item) => item.id === complete.dataset.taskComplete); if (!task) return; task.status = "done"; syncNextAction(task.appId); persist(); renderAll(); return; }
    const snooze = event.target.closest("[data-task-snooze]");
    if (snooze) { const task = state.data.tasks.find((item) => item.id === snooze.dataset.taskSnooze); if (!task) return; task.dueDate = addDaysIso(task.dueDate || todayIso(), 1); persist(); renderAll(); return; }
    const promote = event.target.closest("[data-promote-opportunity]");
    if (promote) { const item = state.data.opportunities.find((entry) => entry.id === promote.dataset.promoteOpportunity); if (!item) return; openCapture("application"); fillCapture({ companyName: item.companyName, jobTitle: item.jobTitle, city: item.city, priority: item.priority, source: item.source, nextAction: item.reason, notes: item.notes }); state.data.opportunities = state.data.opportunities.filter((entry) => entry.id !== item.id); persist(); renderOpportunityView(); return; }
    const statusBtn = event.target.closest("[data-opportunity-status]");
    if (statusBtn) { const item = state.data.opportunities.find((entry) => entry.id === statusBtn.dataset.opportunityStatus); if (!item) return; item.status = statusBtn.dataset.statusTarget; persist(); renderOpportunityView(); renderDashboard(); }
  }

  function handleEnhancementChange(event) {
    const key = event.target.dataset.settingKey;
    if (key) { state.data.settings[key] = ["reminderLeadDays", "followupAfterDays"].includes(key) ? Number(event.target.value) : event.target.value; persist(); renderAll(); }
  }

  function handleCaptureSubmit(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const data = new FormData(event.currentTarget);
    const recordType = String(data.get("recordType") || "application");
    const bulk = String(data.get("bulkInput") || "").trim();
    if (bulk) { bulk.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line) => recordType === "opportunity" ? createOpportunity(...line.split("|").map((item) => item.trim())) : createApp(...line.split("|").map((item) => item.trim()), data)); closeCreateModal(); renderAll(); persist(); return; }
    if (recordType === "opportunity") createOpportunity(String(data.get("companyName")||"").trim(), String(data.get("jobTitle")||"").trim(), String(data.get("city")||"").trim(), String(data.get("reason")||"").trim(), String(data.get("priority")||"中").trim(), String(data.get("source")||"").trim(), String(data.get("notes")||"").trim());
    else createApp(String(data.get("companyName")||"").trim(), String(data.get("jobTitle")||"").trim(), String(data.get("city")||"").trim(), String(data.get("deadline")||"").trim(), String(data.get("priority")||"中").trim(), String(data.get("nextAction")||"").trim(), String(data.get("source")||"").trim(), String(data.get("jobLink")||"").trim(), String(data.get("salaryRange")||"").trim(), String(data.get("notes")||"").trim(), data);
    persist(); closeCreateModal(); renderAll();
  }

  function createApp(companyName, jobTitle, city = "", deadline = addDaysIso(todayIso(), 3), priority = "中", nextAction = "补齐岗位信息并安排下一步动作", source = "未注明", jobLink = "", salaryRange = "", notes = "", formData = null) {
    if (!companyName || !jobTitle) return;
    const id = uid("app");
    state.data.applications.unshift({ id, companyName, jobTitle, city, stage: String(formData?.get("stage") || "待投递"), deadline: deadline || addDaysIso(todayIso(), 3), nextAction: nextAction || "补齐岗位信息并安排下一步动作", priority, applicationStatus: "active", notes, updatedAt: todayIso(), source: source || "未注明", jobLink, salaryRange, contact: { hrName: "", email: "", wechat: "", phone: "" }, materials: [{ materialId: "mat-1", status: "已准备未提交" }, { materialId: "mat-3", status: "未准备" }], history: [{ date: todayIso(), text: "创建申请记录" }], interviewPrep: { checklist: [{ label: "准备岗位亮点案例", done: false }, { label: "整理自我介绍", done: false }, { label: "确认跟进动作", done: false }], commonQuestions: "", reviewNotes: "", followupDraft: "" }, offerDecision: null });
    state.data.tasks.unshift({ id: uid("tsk"), appId: id, title: nextAction || "补齐岗位信息并安排下一步动作", dueDate: deadline || addDaysIso(todayIso(), 3), status: "todo", category: "primary", source: "nextAction" });
    state.data.events.unshift({ id: uid("evt"), appId: id, type: "deadline", date: deadline || addDaysIso(todayIso(), 3), status: "pending", notes: `${companyName} 岗位截止提醒`, reminderTime: "10:00" });
  }

  function createOpportunity(companyName, jobTitle, city = "", reason = "", priority = "中", source = "未注明", notes = "") {
    if (!companyName || !jobTitle) return;
    state.data.opportunities.unshift({ id: uid("opp"), companyName, jobTitle, city, priority: PRIORITIES.includes(priority) ? priority : "中", status: "优先关注", source: source || "未注明", reason: reason || "待补关注理由", notes, createdAt: todayIso() });
  }

  function openCapture(mode) {
    openCreateModal();
    refs.recordTypeSelect.value = mode;
    syncCaptureMode();
    refs.templateSelect.value = templates[0].label;
  }

  function syncCaptureMode() {
    document.querySelectorAll(".application-only-field").forEach((node) => node.classList.toggle("hidden", refs.recordTypeSelect.value !== "application"));
    document.querySelectorAll(".opportunity-only-field").forEach((node) => node.classList.toggle("hidden", refs.recordTypeSelect.value !== "opportunity"));
  }

  function applyTemplate() {
    const template = templates.find((item) => item.label === refs.templateSelect.value);
    if (!template) return;
    refs.recordTypeSelect.value = template.type;
    syncCaptureMode();
    if (template.source) els.createForm.source.value = template.source;
    if (template.nextAction) els.createForm.nextAction.value = template.nextAction;
    if (template.stage) els.createForm.stage.value = template.stage;
    if (template.reason && els.createForm.reason) els.createForm.reason.value = template.reason;
  }

  function applyClone() {
    const raw = refs.cloneSelect.value || "";
    const id = raw.includes("::") ? raw.split("::")[0] : "";
    const app = appById(id);
    if (app) fillCapture(app);
  }

  function fillCapture(app) {
    Object.entries({ companyName: app.companyName || "", jobTitle: app.jobTitle || "", city: app.city || "", source: app.source || "", salaryRange: app.salaryRange || "", nextAction: app.nextAction || "", jobLink: app.jobLink || "", notes: app.notes || "", deadline: app.deadline || "", priority: app.priority || "中" }).forEach(([key, value]) => { if (els.createForm[key]) els.createForm[key].value = value; });
  }

  function filteredOpportunities() {
    return state.data.opportunities.filter((item) => (state.opportunityFilters.status === "全部" || item.status === state.opportunityFilters.status) && (state.opportunityFilters.priority === "全部" || item.priority === state.opportunityFilters.priority) && (!state.opportunityFilters.search || `${item.companyName} ${item.jobTitle} ${item.city} ${item.reason}`.toLowerCase().includes(state.opportunityFilters.search.toLowerCase())));
  }

  function pendingTasks(appId) { return state.data.tasks.filter((item) => item.appId === appId && item.status !== "done").sort((a, b) => a.dueDate.localeCompare(b.dueDate)); }
  function syncNextAction(appId) { const app = appById(appId); if (!app) return; app.nextAction = pendingTasks(appId)[0]?.title || app.nextAction || ""; app.updatedAt = todayIso(); }
  function taskUrgency(task) { const diff = diffDays(todayIso(), task.dueDate || todayIso()); return diff < 0 ? "已逾期" : diff <= 1 ? "即将到期" : `${diff} 天后`; }
  function offerTotal(app) { return [app.offerDecision?.matchScore || 0, app.offerDecision?.growthScore || 0, app.offerDecision?.cityScore || 0, app.offerDecision?.compensationScore || 0, app.offerDecision?.preferenceScore || 0].reduce((sum, value) => sum + value, 0); }
  function average(values) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0; }
  function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

  function exportData() { const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `offer-atlas-backup-${todayIso()}.json`; link.click(); URL.revokeObjectURL(url); }
  function importData(event) { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { state.data = JSON.parse(String(reader.result || "{}")); hydrate(); persist(); renderAll(); } catch { window.alert("导入失败：文件内容不合法。"); } finally { refs.importFileInput.value = ""; } }; reader.readAsText(file, "utf-8"); }
})();



