(function () {
  const STORAGE_KEY = "medcom_medication_course_v1";
  const course = window.MEDCOM_MEDICATION_COURSE;
  if (!course) {
    console.error("MEDCOM_MEDICATION_COURSE not loaded");
    return;
  }

  const chapters = course.chapters;
  const totalSteps = chapters.length + 1;
  let stepIndex = 0;

  const el = {
    sidebar: document.getElementById("learningSidebar"),
    sidebarBackdrop: document.getElementById("sidebarBackdrop"),
    openSidebar: document.getElementById("openSidebarBtn"),
    closeSidebar: document.getElementById("closeSidebarBtn"),
    chapterList: document.getElementById("chapterList"),
    mainTitle: document.getElementById("mainChapterTitle"),
    mainMeta: document.getElementById("mainChapterMeta"),
    mainBody: document.getElementById("mainChapterBody"),
    progressFill: document.getElementById("progressFill"),
    progressLabel: document.getElementById("progressLabel"),
    btnPrev: document.getElementById("btnPrev"),
    btnNext: document.getElementById("btnNext"),
    btnNextLabel: document.getElementById("btnNextLabel"),
    btnNextIcon: document.getElementById("btnNextIcon"),
    footerStepHint: document.getElementById("footerStepHint"),
    mobileTitle: document.getElementById("mobileChapterTitle")
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  function saveProgress(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  }

  let completed = loadProgress();

  function parseInitialStep() {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash === "assessment") return chapters.length;
    const n = parseInt(hash, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= chapters.length) return n - 1;
    const params = new URLSearchParams(window.location.search);
    const c = parseInt(params.get("chapter") || params.get("c") || "", 10);
    if (!Number.isNaN(c) && c >= 1 && c <= chapters.length) return c - 1;
    if (params.get("step") === "assessment") return chapters.length;
    return 0;
  }

  function setHashForStep(idx) {
    const h = idx < chapters.length ? String(idx + 1) : "assessment";
    if (window.location.hash !== "#" + h) {
      history.replaceState(null, "", "#" + h);
    }
  }

  function progressPercent(idx) {
    return Math.round(((idx + 1) / totalSteps) * 100);
  }

  function renderSidebar() {
    el.chapterList.innerHTML = "";
    chapters.forEach((ch, i) => {
      const a = document.createElement("button");
      a.type = "button";
      a.className =
        "learning-chapter-btn w-full text-left px-3 py-2.5 rounded-lg text-sm border border-transparent text-gray-700 hover:bg-gray-50 transition-colors";
      a.dataset.index = String(i);
      const done = completed.has(i);
      a.innerHTML =
        '<span class="font-medium text-gray-500 w-6 inline-block">' +
        (i + 1) +
        "</span>" +
        '<span class="align-middle">' +
        escapeHtmlShort(ch.title || "Chapter " + (i + 1)) +
        "</span>" +
        (done ? '<i class="fas fa-check-circle text-green-600 float-right mt-0.5"></i>' : "");
      a.addEventListener("click", function () {
        goToStep(i);
        closeMobileSidebar();
      });
      el.chapterList.appendChild(a);
    });

    const as = document.createElement("button");
    as.type = "button";
    as.className =
      "learning-chapter-btn w-full text-left px-3 py-2.5 rounded-lg text-sm border border-transparent text-gray-700 hover:bg-gray-50 mt-2";
    as.dataset.index = "assessment";
    as.innerHTML =
      '<span class="font-medium text-gray-500 w-6 inline-block"><i class="fas fa-clipboard-check"></i></span> Assessment';
    as.addEventListener("click", function () {
      goToStep(chapters.length);
      closeMobileSidebar();
    });
    el.chapterList.appendChild(as);
  }

  function escapeHtmlShort(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  /**
   * Multiple-choice blocks: .mcq-root with buttons.mcq-opt[data-correct="true|false"]
   * Correct → success message and disable options; wrong → ask to try again (options stay active).
   */
  function bindChapterMcqs(root) {
    if (!root) return;
    root.querySelectorAll(".mcq-root").forEach(function (wrap) {
      const feedback = wrap.querySelector(".mcq-feedback");
      wrap.querySelectorAll(".mcq-opt").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (btn.disabled) return;
          var ok = btn.getAttribute("data-correct") === "true";
          if (feedback) {
            feedback.textContent = ok
              ? (feedback.getAttribute("data-msg-correct") || "Correct.")
              : (feedback.getAttribute("data-msg-wrong") || "Not quite. Try again.");
            feedback.className =
              "mcq-feedback mt-3 text-sm min-h-[1.25rem] " +
              (ok ? "text-green-700 font-medium" : "text-amber-800");
          }
          if (ok) {
            wrap.querySelectorAll(".mcq-opt").forEach(function (b) {
              b.disabled = true;
              b.classList.add("opacity-70", "cursor-not-allowed");
            });
            btn.classList.remove("opacity-70");
            btn.classList.add("ring-2", "ring-green-500", "border-green-600", "bg-green-50");
          }
        });
      });
    });
  }

  function updateSidebarActive() {
    document.querySelectorAll(".learning-chapter-btn").forEach(function (btn) {
      const idx = btn.dataset.index;
      let active = false;
      if (idx === "assessment") active = stepIndex === chapters.length;
      else active = parseInt(idx, 10) === stepIndex;
      btn.classList.toggle("bg-teal-50", active);
      btn.classList.toggle("border-teal-200", active);
      btn.classList.toggle("text-teal-900", active);
      btn.classList.toggle("font-semibold", active);
    });
  }

  function goToStep(idx) {
    if (idx < 0 || idx >= totalSteps) return;
    stepIndex = idx;
    setHashForStep(stepIndex);

    const isAssessment = stepIndex === chapters.length;
    if (isAssessment) {
      el.mainTitle.textContent = "Assessment";
      el.mainMeta.textContent = "Final step • " + totalSteps + " of " + totalSteps;
      el.mainBody.innerHTML = course.assessmentHtml;
      el.mobileTitle.textContent = "Assessment";
      bindChapterMcqs(el.mainBody);
    } else {
      const ch = chapters[stepIndex];
      el.mainTitle.textContent = "Chapter " + (stepIndex + 1) + ": " + (ch.title || "");
      el.mainMeta.textContent =
        "Chapter " + (stepIndex + 1) + " of " + chapters.length + " • " + progressPercent(stepIndex) + "% through module";
      el.mainBody.innerHTML = ch.html || "";
      el.mobileTitle.textContent = "Ch. " + (stepIndex + 1);
      bindChapterMcqs(el.mainBody);
    }

    el.progressFill.style.width = progressPercent(stepIndex) + "%";
    el.progressLabel.textContent = progressPercent(stepIndex) + "% complete";

    const isLast = stepIndex >= totalSteps - 1;
    if (el.btnPrev) el.btnPrev.disabled = stepIndex === 0;
    if (el.btnNextLabel) el.btnNextLabel.textContent = isLast ? "Finish" : "Next";
    if (el.btnNextIcon) {
      el.btnNextIcon.className = (isLast ? "fas fa-check" : "fas fa-chevron-right") + " ml-1 sm:ml-2";
      el.btnNextIcon.setAttribute("aria-hidden", "true");
    }
    if (el.footerStepHint) {
      /* Short label so Prev/Next never get pushed off-screen on narrow devices */
      if (isAssessment) {
        el.footerStepHint.textContent = "Assessment • " + totalSteps + " / " + totalSteps;
      } else {
        el.footerStepHint.textContent =
          "Step " + (stepIndex + 1) + " of " + totalSteps;
      }
    }
    updateSidebarActive();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    if (stepIndex < totalSteps - 1) {
      completed.add(stepIndex);
      saveProgress(completed);
      goToStep(stepIndex + 1);
    } else {
      completed.add(stepIndex);
      saveProgress(completed);
      alert("Module complete (demo). Progress saved in your browser.");
    }
  }

  function prev() {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  }

  function openMobileSidebar() {
    el.sidebar.classList.remove("-translate-x-full");
    el.sidebarBackdrop.classList.remove("hidden");
  }

  function closeMobileSidebar() {
    el.sidebar.classList.add("-translate-x-full");
    el.sidebarBackdrop.classList.add("hidden");
  }

  if (el.openSidebar) el.openSidebar.addEventListener("click", openMobileSidebar);
  if (el.closeSidebar) el.closeSidebar.addEventListener("click", closeMobileSidebar);
  if (el.sidebarBackdrop) el.sidebarBackdrop.addEventListener("click", closeMobileSidebar);
  if (el.btnPrev) el.btnPrev.addEventListener("click", prev);
  if (el.btnNext) el.btnNext.addEventListener("click", next);

  document.addEventListener("keydown", function (e) {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
    if (e.key === "ArrowLeft" && el.btnPrev && !el.btnPrev.disabled) {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight" && el.btnNext) {
      e.preventDefault();
      next();
    }
  });

  window.addEventListener("hashchange", function () {
    const nextIdx = parseInitialStep();
    if (nextIdx !== stepIndex) goToStep(nextIdx);
  });

  renderSidebar();
  stepIndex = parseInitialStep();
  goToStep(stepIndex);
})();
