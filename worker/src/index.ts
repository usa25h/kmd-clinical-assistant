const CORS_HEADERS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};



const HTML_PAGE = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KMD 침 처방 Assistant</title>
<style>
:root {
  --primary:#1b4c3e; --primary-h:#16402f; --navy:#0d1f2d; --navy-h:#162738;
  --teal-chip:#e6f0ed; --teal-chip-t:#1b4c3e;
  --bg:#edf1f5; --card:#fff; --border:#dde3ea;
  --text:#1a202c; --muted:#718096; --sub:#4a5568;
  --active-step:#0d1f2d; --done-step:#2d4a6a;
  --chip:#edf2f7; --chip-a:#1b4c3e; --chip-at:#fff;
  --bo:#2563eb; --bo-bg:#dbeafe;
  --sa:#dc2626; --sa-bg:#fee2e2;
  --warn-bg:#fffbeb; --warn-b:#fcd34d; --warn-t:#92400e;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;background:var(--bg);color:var(--text);font-size:14px;min-height:100vh}

/* ── HEADER ── */
header{background:var(--navy);color:#fff;padding:0 24px;height:52px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.hd-left{display:flex;align-items:center;gap:12px}
.hd-logo{width:32px;height:32px;background:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
.hd-brand{font-size:11px;letter-spacing:.12em;color:#94a3b8;text-transform:uppercase}
.hd-title{font-size:15px;font-weight:700;color:#fff;margin-top:1px}
.hd-ver{background:rgba(255,255,255,.12);border-radius:4px;padding:2px 8px;font-size:10px;color:#94a3b8;margin-left:8px}
.hd-right{font-size:11px;color:#64748b;display:flex;align-items:center;gap:6px}
.hd-right svg{opacity:.6}

/* ── STEP NAV ── */
.step-nav{background:#fff;border-bottom:1px solid var(--border);display:flex;padding:0 20px;overflow-x:auto}
.step-nav::-webkit-scrollbar{display:none}
.step-btn{flex:none;padding:14px 20px;font-size:12.5px;font-weight:600;color:#94a3b8;border:none;background:none;cursor:pointer;border-bottom:3px solid transparent;transition:.15s;white-space:nowrap;display:flex;align-items:center;gap:6px}
.step-btn.done{color:var(--done-step)}
.step-btn.active{color:var(--active-step);border-bottom-color:var(--primary)}
.step-btn .snum{width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;background:#e2e8f0;color:#718096}
.step-btn.active .snum{background:var(--primary);color:#fff}
.step-btn.done .snum{background:var(--done-step);color:#fff}

/* ── MAIN ── */
main{max-width:860px;margin:0 auto;padding:24px 16px 80px}
.step-panel{display:none}
.step-panel.active{display:block}

/* ── SECTION CARD ── */
.section-header{margin-bottom:20px}
.section-badge{font-size:11px;font-weight:700;color:var(--primary);letter-spacing:.08em;text-transform:uppercase;display:flex;align-items:center;gap:6px;margin-bottom:6px}
.section-title{font-size:20px;font-weight:700;color:var(--navy)}
.section-sub{font-size:12px;color:var(--muted);margin-top:4px}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:16px}
.card-label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}

/* ── INPUTS ── */
.row2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-size:12px;font-weight:600;color:var(--sub)}
input[type=number],input[type=text],textarea,select{
  border:1.5px solid var(--border);border-radius:8px;padding:9px 12px;
  font-size:13px;color:var(--text);background:#fff;width:100%;outline:none;
  font-family:inherit;transition:.15s
}
input:focus,textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(27,76,62,.1)}
textarea{resize:vertical;min-height:90px}
.bmi-display{background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:10px 14px;font-size:12px;color:#166534;display:flex;align-items:center;gap:8px;margin-top:8px}
.bmi-status{padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700}
.bmi-status.normal{background:#dcfce7;color:#166534}
.bmi-status.over{background:#fee2e2;color:#991b1b}
.bmi-status.under{background:#fef9c3;color:#854d0e}

/* ── TOGGLE BUTTONS ── */
.toggle-group{display:flex;gap:8px;flex-wrap:wrap}
.toggle-btn{padding:8px 18px;border:1.5px solid var(--border);border-radius:8px;background:#fff;font-size:13px;font-weight:500;color:var(--sub);cursor:pointer;transition:.15s}
.toggle-btn:hover{border-color:var(--primary);color:var(--primary)}
.toggle-btn.active{background:var(--primary);border-color:var(--primary);color:#fff;font-weight:600}

/* ── CHIPS ── */
.chip-group{display:flex;flex-wrap:wrap;gap:8px}
.chip{padding:6px 14px;border:1.5px solid var(--border);border-radius:999px;background:#fff;font-size:12.5px;color:var(--sub);cursor:pointer;transition:.15s;user-select:none}
.chip:hover{border-color:var(--primary);color:var(--primary)}
.chip.active{background:var(--chip-a);border-color:var(--chip-a);color:var(--chip-at);font-weight:600}
.chip.checked::before{content:"✓ ";font-size:11px}

/* ── BODY DIAGRAM ── */
.body-view-tabs{display:flex;gap:2px;margin-bottom:16px}
.bv-tab{padding:7px 20px;border:1.5px solid var(--border);border-radius:8px 8px 0 0;background:#f8fafc;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;transition:.15s}
.bv-tab.active{background:var(--primary);border-color:var(--primary);color:#fff}
.body-wrap{display:flex;gap:20px;align-items:flex-start}
.body-svg-wrap{flex:none;width:200px}
.body-svg-wrap svg{width:100%;height:auto}
.zone{fill:#d4e8e2;stroke:#9fc5bb;stroke-width:1.5;cursor:pointer;transition:.15s;rx:6}
.zone:hover{fill:#a8d4c8}
.zone.selected{fill:var(--primary);stroke:var(--primary-h)}
.zone-label{font-size:9px;fill:#2d6a55;text-anchor:middle;pointer-events:none;font-weight:600}
.zone.selected + .zone-label,.zone.selected ~ text{fill:#fff}
.selected-list{flex:1}
.selected-title{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.06em;margin-bottom:8px}
.selected-tag{display:inline-flex;align-items:center;gap:6px;background:var(--teal-chip);color:var(--teal-chip-t);border-radius:999px;padding:4px 12px;font-size:12px;font-weight:600;margin:4px 4px 0 0}
.selected-tag button{background:none;border:none;cursor:pointer;color:var(--primary);font-size:14px;line-height:1;padding:0}
.no-select{color:var(--muted);font-size:12px;font-style:italic}

/* ── CAT GRID ── */
.cat-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:16px}
.cat-chip{background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:8px 4px;text-align:center;cursor:pointer;transition:.15s}
.cat-chip:hover{border-color:var(--primary);background:#f0fdf8}
.cat-chip.active{border-color:var(--primary);background:var(--teal-chip)}
.cat-kanji{font-size:18px;font-weight:700;color:var(--navy);display:block}
.cat-ko{font-size:10px;color:var(--muted);margin-top:2px;display:block}

/* ── SLIDER ── */
.slider-wrap{margin-bottom:20px}
.slider-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:6px}
input[type=range]{width:100%;-webkit-appearance:none;height:6px;border-radius:3px;background:linear-gradient(to right,var(--primary) 50%,#e2e8f0 50%);outline:none;border:none;padding:0}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--primary);cursor:pointer;border:3px solid #fff;box-shadow:0 0 0 2px var(--primary)}
.slider-val{text-align:center;font-size:12px;color:var(--primary);font-weight:700;margin-top:4px}

/* ── TONGUE GRID ── */
.tongue-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tongue-card{border:1.5px solid var(--border);border-radius:10px;padding:14px;cursor:pointer;transition:.15s;background:#fff}
.tongue-card:hover{border-color:var(--primary);background:#f0fdf8}
.tongue-card.active{border-color:var(--primary);background:var(--teal-chip)}
.tongue-card.active::before{content:"✓";float:right;color:var(--primary);font-weight:700}
.tongue-name{font-size:13px;font-weight:700;color:var(--navy);margin-bottom:4px}
.tongue-desc{font-size:11px;color:var(--muted);line-height:1.4}

/* ── RESULTS ── */
.assess-card{background:linear-gradient(135deg,#0d1f2d 0%,#1b3a4b 100%);border-radius:14px;padding:24px 28px;margin-bottom:16px;color:#fff}
.assess-label{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#64b5f6;margin-bottom:8px;font-weight:700}
.assess-pattern{font-size:26px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px}
.assess-sub{font-size:13px;color:#94a3b8;margin-bottom:14px}
.assess-tags{display:flex;gap:8px;flex-wrap:wrap}
.atag{padding:5px 14px;border-radius:999px;font-size:12px;font-weight:600;border:1.5px solid rgba(255,255,255,.25);color:#e2e8f0}
.atag.heo{background:rgba(59,130,246,.2);border-color:rgba(59,130,246,.4);color:#93c5fd}
.atag.sil{background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.4);color:#fca5a5}
.principle-card{background:#f0fdf8;border:1.5px solid #86efac;border-radius:12px;padding:16px 20px;margin-bottom:16px}
.principle-label{font-size:10px;font-weight:700;color:#166534;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}
.principle-text{font-size:14px;font-weight:600;color:#14532d}
.rx-card{border:1.5px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:12px;background:#fff}
.rx-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.rx-method{font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;background:var(--teal-chip);color:var(--teal-chip-t)}
.rx-meridian{font-size:12px;color:var(--muted)}
.point-table{width:100%;border-collapse:collapse}
.point-table th{font-size:10px;color:var(--muted);font-weight:600;text-align:left;padding:4px 8px;border-bottom:1px solid var(--border);letter-spacing:.06em;text-transform:uppercase}
.point-table td{padding:8px 8px;border-bottom:1px solid #f8fafc;font-size:13px;vertical-align:middle}
.point-table tr:last-child td{border-bottom:none}
.order-dot{width:22px;height:22px;border-radius:50%;background:var(--navy);color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center}
.action-bo{background:var(--bo-bg);color:var(--bo);padding:3px 10px;border-radius:6px;font-size:12px;font-weight:700}
.action-sa{background:var(--sa-bg);color:var(--sa);padding:3px 10px;border-radius:6px;font-size:12px;font-weight:700}
.side-badge{background:#f1f5f9;color:#475569;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600}
.rationale-card{border:1px solid var(--border);border-radius:12px;padding:16px 20px;margin-bottom:12px;background:#fafbfc}
.rationale-text{font-size:13.5px;line-height:1.8;color:var(--sub)}
.caution-card{border:1.5px solid var(--warn-b);border-radius:12px;padding:16px 20px;margin-bottom:12px;background:var(--warn-bg)}
.caution-text{font-size:13px;line-height:1.7;color:var(--warn-t)}
.narrative-card{border:1px solid #bfdbfe;border-radius:12px;padding:18px 20px;margin-bottom:12px;background:#eff6ff}
.narrative-header{font-size:13px;font-weight:700;color:#1d4ed8;margin-bottom:10px}
.narrative-body{font-size:13px;line-height:1.85;color:#1e3a5f;white-space:normal}
.narrative-body strong{color:#0d1f2d;font-weight:700}
.confidence-row{text-align:right;font-size:12px;color:var(--muted);margin-top:4px}
.conf-high{color:#16a34a;font-weight:700}
.conf-medium{color:#d97706;font-weight:700}
.conf-low{color:#dc2626;font-weight:700}

/* ── RESULT REDESIGN ── */
.assess-card .principle-inner{background:rgba(22,101,52,.18);border:1px solid rgba(134,239,172,.4);border-radius:8px;padding:12px 16px;margin-top:14px}
.principle-inner-label{font-size:10px;font-weight:700;color:#86efac;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
.principle-inner-text{font-size:14px;font-weight:600;color:#dcfce7;line-height:1.5}
.rx-section-header{display:flex;justify-content:space-between;align-items:center;margin:20px 0 10px}
.rx-section-title{font-size:15px;font-weight:700;color:var(--navy)}
.rx-section-note{font-size:11px;color:var(--muted)}
.rx-tung-card{background:#fffbeb;border-color:#f59e0b}
.rx-saam-card{background:#f8fafc;border-color:var(--border)}
.rx-jeongyeong-card{background:#f0fdf8;border-color:#6ee7b7}
.rx-sub-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.rx-type-badge{font-size:11.5px;font-weight:700;padding:4px 12px;border-radius:999px}
.tung-badge{background:#fef3c7;color:#92400e}
.saam-badge{background:#dbeafe;color:#1e40af}
.jeongyeong-badge{background:#d1fae5;color:#065f46}
.rx-type-sub{font-size:11px;color:var(--muted)}
.pt-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}
.pt-chip{display:inline-flex;align-items:center;gap:3px;background:#fff;border:1.5px solid var(--border);border-radius:8px;padding:6px 12px;font-size:13px;font-weight:600;color:var(--navy)}
.pt-code{font-size:10px;color:var(--muted);font-weight:400;margin-left:2px}
.pt-action-bo{background:#dbeafe;color:#1e40af;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:4px}
.pt-action-sa{background:#fee2e2;color:#dc2626;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:4px}
.method-chip{display:inline-flex;align-items:center;background:var(--teal-chip);color:var(--teal-chip-t);border-radius:8px;padding:6px 14px;font-size:13px;font-weight:700}
.rx-card-note{font-size:11.5px;color:var(--muted);margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,0,0,.06);line-height:1.7}
.caution-card{border:1.5px solid var(--warn-b);border-radius:12px;padding:16px 20px;margin-bottom:12px;background:var(--warn-bg)}
.caution-header{font-size:13px;font-weight:700;color:var(--warn-t);margin-bottom:8px}
.caution-list{padding-left:18px;font-size:13px;line-height:1.9;color:var(--warn-t);margin:0}
.narrative-card{border:1px solid #bfdbfe;border-radius:12px;padding:18px 20px;margin-bottom:12px;background:#eff6ff}
.narrative-header{font-size:13px;font-weight:700;color:#1d4ed8;margin-bottom:10px}
.narrative-body{font-size:13px;line-height:1.85;color:#1e3a5f;white-space:normal}
.narrative-body strong{color:#0d1f2d;font-weight:700}
.quick-nav{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.quick-nav-label{font-size:11.5px;font-weight:700;color:var(--muted)}
.quick-nav-btn{background:#f1f5f9;border:none;border-radius:6px;padding:4px 10px;font-size:11.5px;color:var(--sub);cursor:pointer;transition:.15s}
.quick-nav-btn:hover{background:var(--teal-chip);color:var(--teal-chip-t)}

/* ── NAV BUTTONS ── */
.nav-bar{display:flex;justify-content:space-between;align-items:center;margin-top:24px;gap:12px}
.btn{padding:11px 22px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:.15s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{background:var(--primary-h)}
.btn-ghost{background:#fff;color:var(--sub);border:1.5px solid var(--border)}
.btn-ghost:hover{border-color:var(--primary);color:var(--primary)}
.btn-full{width:100%}
.btn-sm{padding:8px 16px;font-size:12px}
.btn-danger{background:#dc2626;color:#fff}

/* ── SPINNER ── */
.spinner-overlay{display:none;position:fixed;inset:0;background:rgba(13,31,45,.55);z-index:999;align-items:center;justify-content:center;flex-direction:column;gap:16px}
.spinner-overlay.show{display:flex}
.spinner{width:44px;height:44px;border:4px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
.spinner-text{color:#fff;font-size:14px;font-weight:600}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── EMPTY STATE ── */
.empty-state{border:2px dashed #cbd5e0;border-radius:14px;padding:60px 20px;text-align:center;color:var(--muted)}
.empty-icon{font-size:52px;margin-bottom:12px}
.empty-text{font-size:14px;font-weight:500}

/* ── TUNG ACUPUNCTURE ── */
.tung-card{border:1.5px solid #f59e0b;border-radius:12px;padding:18px 20px;margin-bottom:12px;background:#fffbeb}
.tung-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.tung-badge{font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;background:#fef3c7;color:#92400e}
.tung-indication{font-size:11px;color:#78716c;font-style:italic;margin-top:2px}

/* ── MISC ── */
.divider{border:none;border-top:1px solid var(--border);margin:16px 0}
.text-right{text-align:right}
.mt4{margin-top:4px}
.mt8{margin-top:8px}
.mt12{margin-top:12px}
.note{font-size:11px;color:var(--muted);margin-top:6px}

@media(max-width:600px){
  .row2,.row3{grid-template-columns:1fr}
  .cat-grid{grid-template-columns:repeat(4,1fr)}
  .tongue-grid{grid-template-columns:1fr 1fr}
  .body-wrap{flex-direction:column}
  .body-svg-wrap{width:160px;margin:0 auto}
  .assess-pattern{font-size:20px}
}
</style>
</head>
<body>

<!-- SPINNER -->
<div class="spinner-overlay" id="spinnerOverlay">
  <div class="spinner"></div>
  <div class="spinner-text">사암침 + 동씨침 처방 생성 중...</div>
</div>

<!-- HEADER -->
<header>
  <div class="hd-left">
    <div class="hd-logo">🩺</div>
    <div>
      <div class="hd-brand">KMD Clinical Assistant <span class="hd-ver">v2.1 Cloudflare</span></div>
      <div class="hd-title">침 처방 Assistant</div>
    </div>
  </div>
  <div class="hd-right">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    개인식별정보 미저장 (안심 세션)
  </div>
</header>

<!-- STEP NAV -->
<nav class="step-nav">
  <button class="step-btn active" data-step="1" onclick="goStep(1)">
    <span class="snum">1</span> 기본정보
  </button>
  <button class="step-btn" data-step="2" onclick="goStep(2)">
    <span class="snum">2</span> 신체 탭 (3-View)
  </button>
  <button class="step-btn" data-step="3" onclick="goStep(3)">
    <span class="snum">3</span> 문진
  </button>
  <button class="step-btn" data-step="4" onclick="goStep(4)">
    <span class="snum">4</span> 설-맥진
  </button>
  <button class="step-btn" data-step="5" onclick="goStep(5)">
    <span class="snum">5</span> 침 처방 결과
  </button>
</nav>

<main>

<!-- ════════════════ STEP 1: 기본정보 ════════════════ -->
<section class="step-panel active" id="panel1">
  <div class="section-header">
    <div class="section-badge">⚕ STEP 1. 환자 기초 계측</div>
    <div class="section-title">기본 정보를 입력해 주세요</div>
    <div class="section-sub">※ 환자의 이름, 전화번호, 주민번호 등 개인식별정보는 절대 입력하지 않습니다.</div>
  </div>

  <div class="card">
    <div class="row2">
      <div class="field">
        <label>연령 (Age)</label>
        <input type="number" id="age" min="1" max="120" value="65" placeholder="예: 65">
      </div>
      <div class="field">
        <label>성별 (Gender)</label>
        <div class="toggle-group mt4" id="genderGroup">
          <button class="toggle-btn active" data-val="남성" onclick="setToggle('genderGroup',this,'남성')">남성</button>
          <button class="toggle-btn" data-val="여성" onclick="setToggle('genderGroup',this,'여성')">여성</button>
          <button class="toggle-btn" data-val="미지정" onclick="setToggle('genderGroup',this,'미지정')">미지정</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-label">📏 신장 및 체중 (Height &amp; Weight)</div>
    <div class="row3">
      <div class="field">
        <label>키 (ft)</label>
        <input type="number" id="ht-ft" min="1" max="8" value="5" oninput="calcBMI()">
      </div>
      <div class="field">
        <label>추가 (inch)</label>
        <input type="number" id="ht-in" min="0" max="11" value="8" oninput="calcBMI()">
      </div>
      <div class="field">
        <label>체중 (lb)</label>
        <input type="number" id="wt-lb" min="10" max="600" value="160" oninput="calcBMI()">
      </div>
    </div>
    <div class="bmi-display" id="bmiDisplay">
      <span>📊</span>
      <span id="bmiText">신장: 173cm / 72.6kg &nbsp;·&nbsp; BMI 지수: 24.3 kg/m²</span>
      <span class="bmi-status normal" id="bmiStatus">정상</span>
    </div>
  </div>

  <div class="card">
    <div class="card-label">🔖 체질 판별 (참고용)</div>
    <div class="chip-group" id="constitutionGroup">
      <span class="chip" onclick="toggleChipSingle('constitutionGroup',this)">미론병 (소음/음체)</span>
      <span class="chip active" onclick="toggleChipSingle('constitutionGroup',this)">보통 (평체)</span>
      <span class="chip" onclick="toggleChipSingle('constitutionGroup',this)">비번형 (태음/습담)</span>
      <span class="chip" onclick="toggleChipSingle('constitutionGroup',this)">근육형 (양명/실증)</span>
      <span class="chip" onclick="toggleChipSingle('constitutionGroup',this)">부종형 (수술정체)</span>
    </div>
  </div>

  <div class="card">
    <div class="card-label">💬 증상 직접 서술 (선택 단계 건너뛰기 가능)</div>
    <textarea id="chiefComplaint" placeholder="예: 70대 남성, 양측 고관절 및 둔부 통증이 10개월째 지속되고 보행 시 악화. 우측이 더 심하며 목욕하고 닦기가 달기는 느낌. 요즘 4-5발 협착증 기왕력."></textarea>
    <div class="note">원하는 증상을 직접 입력하면 이후 단계를 건너뛰고 바로 처방을 생성할 수 있습니다.</div>
    <div id="instantPrescribeWrap" style="display:none;margin-top:12px">
      <button class="btn btn-primary btn-full" onclick="submitPrescription()" style="background:#0d1f2d;font-size:15px;padding:14px">⚡ 즉석 처방 생성 (단계 건너뛰기) →</button>
    </div>
  </div>

  <div class="nav-bar">
    <div></div>
    <button class="btn btn-primary" onclick="goStep(2)">
      다음: 신체 탭 (3-View) 통증 부위 선택 →
    </button>
  </div>
</section>

<!-- ════════════════ STEP 2: 신체 탭 ════════════════ -->
<section class="step-panel" id="panel2">
  <div class="section-header">
    <div class="section-badge">🫀 STEP 2. 신체 탭 (3-View)</div>
    <div class="section-title">통증 부위를 선택해 주세요</div>
    <div class="section-sub">부위를 분류 탭에서 선택하거나 신체도를 직접 클릭하세요.</div>
  </div>

  <div class="card">
    <div class="card-label">부위 분류 (12大門)</div>
    <div class="cat-grid" id="catGrid">
      <div class="cat-chip" data-cat="두부" onclick="toggleCat(this)"><span class="cat-kanji">首</span><span class="cat-ko">두부</span></div>
      <div class="cat-chip" data-cat="경부/항부" onclick="toggleCat(this)"><span class="cat-kanji">頸</span><span class="cat-ko">경부/항부</span></div>
      <div class="cat-chip" data-cat="흉부" onclick="toggleCat(this)"><span class="cat-kanji">胸</span><span class="cat-ko">흉부</span></div>
      <div class="cat-chip" data-cat="복부" onclick="toggleCat(this)"><span class="cat-kanji">腹</span><span class="cat-ko">복부</span></div>
      <div class="cat-chip" data-cat="허리/요부" onclick="toggleCat(this)"><span class="cat-kanji">腰</span><span class="cat-ko">허리/요부</span></div>
      <div class="cat-chip" data-cat="족부/수족지" onclick="toggleCat(this)"><span class="cat-kanji">足</span><span class="cat-ko">족부/수족지</span></div>
      <div class="cat-chip" data-cat="안면/이비인후" onclick="toggleCat(this)"><span class="cat-kanji">面</span><span class="cat-ko">안면/이비인후</span></div>
      <div class="cat-chip" data-cat="피부근골" onclick="toggleCat(this)"><span class="cat-kanji">筋</span><span class="cat-ko">피부근골</span></div>
      <div class="cat-chip" data-cat="비뇨생식" onclick="toggleCat(this)"><span class="cat-kanji">陰</span><span class="cat-ko">비뇨생식</span></div>
      <div class="cat-chip" data-cat="전신기혈" onclick="toggleCat(this)"><span class="cat-kanji">氣</span><span class="cat-ko">전신기혈</span></div>
      <div class="cat-chip" data-cat="부인과" onclick="toggleCat(this)"><span class="cat-kanji">婦</span><span class="cat-ko">부인과</span></div>
      <div class="cat-chip" data-cat="소아과" onclick="toggleCat(this)"><span class="cat-kanji">兒</span><span class="cat-ko">소아과</span></div>
    </div>
  </div>

  <div class="card">
    <div class="body-view-tabs">
      <button class="bv-tab active" onclick="setBvTab(this,'front')">앞면 (정면)</button>
      <button class="bv-tab" onclick="setBvTab(this,'back')">뒷면 (후면)</button>
      <button class="bv-tab" onclick="setBvTab(this,'side')">옆면 (측면)</button>
    </div>
    <div class="body-wrap">
      <div class="body-svg-wrap">

        <!-- ▶ 앞면 (정면) -->
        <svg class="body-svg-panel" id="bodySvg_front" viewBox="0 0 200 462" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto">
          <!-- body zones first -->
          <ellipse class="zone" cx="100" cy="40" rx="32" ry="36" data-zone="두부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="66" style="font-size:8px">두부</text>
          <rect class="zone" x="88" y="78" width="24" height="18" rx="4" data-zone="경부/항부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="90">경부</text>
          <rect class="zone" x="60" y="96" width="80" height="62" rx="6" data-zone="흉부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="130">흉부</text>
          <rect class="zone" x="62" y="158" width="76" height="50" rx="6" data-zone="복부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="186">복부</text>
          <rect class="zone" x="66" y="208" width="68" height="38" rx="6" data-zone="허리/요부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="230">허리</text>
          <rect class="zone" x="18" y="98" width="36" height="64" rx="10" data-zone="좌 상완" onclick="toggleZone(this)"/>
          <text class="zone-label" x="36" y="133">좌완</text>
          <rect class="zone" x="146" y="98" width="36" height="64" rx="10" data-zone="우 상완" onclick="toggleZone(this)"/>
          <text class="zone-label" x="164" y="133">우완</text>
          <rect class="zone" x="10" y="172" width="28" height="54" rx="8" data-zone="좌 전완" onclick="toggleZone(this)"/>
          <text class="zone-label" x="24" y="202">전완</text>
          <rect class="zone" x="162" y="172" width="28" height="54" rx="8" data-zone="우 전완" onclick="toggleZone(this)"/>
          <text class="zone-label" x="176" y="202">전완</text>
          <rect class="zone" x="68" y="250" width="30" height="72" rx="8" data-zone="좌 대퇴" onclick="toggleZone(this)"/>
          <text class="zone-label" x="83" y="288">좌퇴</text>
          <rect class="zone" x="102" y="250" width="30" height="72" rx="8" data-zone="우 대퇴" onclick="toggleZone(this)"/>
          <text class="zone-label" x="117" y="288">우퇴</text>
          <rect class="zone" x="70" y="334" width="26" height="58" rx="8" data-zone="좌 하퇴" onclick="toggleZone(this)"/>
          <text class="zone-label" x="83" y="365">좌경</text>
          <rect class="zone" x="104" y="334" width="26" height="58" rx="8" data-zone="우 하퇴" onclick="toggleZone(this)"/>
          <text class="zone-label" x="117" y="365">우경</text>
          <!-- joint zones (on top of body zones) -->
          <ellipse class="zone" cx="19" cy="98" rx="14" ry="12" data-zone="좌 어깨관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="19" y="102" style="font-size:6.5px">어깨</text>
          <ellipse class="zone" cx="181" cy="98" rx="14" ry="12" data-zone="우 어깨관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="181" y="102" style="font-size:6.5px">어깨</text>
          <ellipse class="zone" cx="19" cy="164" rx="12" ry="11" data-zone="좌 팔꿈치관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="19" y="168" style="font-size:6px">팔꿈</text>
          <ellipse class="zone" cx="181" cy="164" rx="12" ry="11" data-zone="우 팔꿈치관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="181" y="168" style="font-size:6px">팔꿈</text>
          <ellipse class="zone" cx="19" cy="226" rx="10" ry="8" data-zone="좌 손목관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="19" y="229" style="font-size:5.5px">손목</text>
          <ellipse class="zone" cx="181" cy="226" rx="10" ry="8" data-zone="우 손목관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="181" y="229" style="font-size:5.5px">손목</text>
          <ellipse class="zone" cx="19" cy="241" rx="12" ry="8" data-zone="좌 손등" onclick="toggleZone(this)"/>
          <text class="zone-label" x="19" y="244" style="font-size:6px">손등</text>
          <ellipse class="zone" cx="19" cy="258" rx="12" ry="9" data-zone="좌 손바닥" onclick="toggleZone(this)"/>
          <text class="zone-label" x="19" y="262" style="font-size:5.5px">손바닥</text>
          <ellipse class="zone" cx="181" cy="241" rx="12" ry="8" data-zone="우 손등" onclick="toggleZone(this)"/>
          <text class="zone-label" x="181" y="244" style="font-size:6px">손등</text>
          <ellipse class="zone" cx="181" cy="258" rx="12" ry="9" data-zone="우 손바닥" onclick="toggleZone(this)"/>
          <text class="zone-label" x="181" y="262" style="font-size:5.5px">손바닥</text>
          <ellipse class="zone" cx="72" cy="250" rx="14" ry="11" data-zone="좌 고관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="72" y="254" style="font-size:6px">고관절</text>
          <ellipse class="zone" cx="128" cy="250" rx="14" ry="11" data-zone="우 고관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="128" y="254" style="font-size:6px">고관절</text>
          <ellipse class="zone" cx="83" cy="325" rx="15" ry="12" data-zone="좌 무릎관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="83" y="329" style="font-size:6.5px">무릎</text>
          <ellipse class="zone" cx="117" cy="325" rx="15" ry="12" data-zone="우 무릎관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="117" y="329" style="font-size:6.5px">무릎</text>
          <ellipse class="zone" cx="83" cy="393" rx="13" ry="9" data-zone="좌 발목관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="83" y="397" style="font-size:6px">발목</text>
          <ellipse class="zone" cx="117" cy="393" rx="13" ry="9" data-zone="우 발목관절" onclick="toggleZone(this)"/>
          <text class="zone-label" x="117" y="397" style="font-size:6px">발목</text>
          <ellipse class="zone" cx="80" cy="410" rx="16" ry="10" data-zone="좌 발등" onclick="toggleZone(this)"/>
          <text class="zone-label" x="80" y="413" style="font-size:6.5px">발등</text>
          <ellipse class="zone" cx="80" cy="430" rx="16" ry="10" data-zone="좌 발바닥" onclick="toggleZone(this)"/>
          <text class="zone-label" x="80" y="434" style="font-size:5.5px">발바닥</text>
          <ellipse class="zone" cx="120" cy="410" rx="16" ry="10" data-zone="우 발등" onclick="toggleZone(this)"/>
          <text class="zone-label" x="120" y="413" style="font-size:6.5px">발등</text>
          <ellipse class="zone" cx="120" cy="430" rx="16" ry="10" data-zone="우 발바닥" onclick="toggleZone(this)"/>
          <text class="zone-label" x="120" y="434" style="font-size:5.5px">발바닥</text>
          <!-- face sub-zones (last = highest z-order, captures clicks inside head) -->
          <ellipse class="zone" cx="65" cy="38" rx="9" ry="12" data-zone="좌 귀" onclick="toggleZone(this)"/>
          <text class="zone-label" x="65" y="42" style="font-size:7px">귀</text>
          <ellipse class="zone" cx="135" cy="38" rx="9" ry="12" data-zone="우 귀" onclick="toggleZone(this)"/>
          <text class="zone-label" x="135" y="42" style="font-size:7px">귀</text>
          <ellipse class="zone" cx="90" cy="30" rx="8" ry="5" data-zone="좌 눈" onclick="toggleZone(this)"/>
          <text class="zone-label" x="90" y="33" style="font-size:6px">눈</text>
          <ellipse class="zone" cx="110" cy="30" rx="8" ry="5" data-zone="우 눈" onclick="toggleZone(this)"/>
          <text class="zone-label" x="110" y="33" style="font-size:6px">눈</text>
          <ellipse class="zone" cx="100" cy="42" rx="6" ry="8" data-zone="코" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="46" style="font-size:6px">코</text>
          <rect class="zone" x="90" y="53" width="20" height="9" rx="4" data-zone="입" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="60" style="font-size:6px">입</text>
        </svg>

        <!-- ▶ 뒷면 (후면) -->
        <svg class="body-svg-panel" id="bodySvg_back" viewBox="0 0 200 462" xmlns="http://www.w3.org/2000/svg" style="display:none;width:100%;height:auto">
          <ellipse class="zone" cx="100" cy="40" rx="32" ry="36" data-zone="후두부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="43">후두부</text>
          <rect class="zone" x="88" y="78" width="24" height="18" rx="4" data-zone="항부(목뒤)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="90">항부</text>
          <rect class="zone" x="92" y="96" width="16" height="122" rx="4" data-zone="척추" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="160">척추</text>
          <rect class="zone" x="44" y="98" width="46" height="50" rx="6" data-zone="좌 견갑" onclick="toggleZone(this)"/>
          <text class="zone-label" x="67" y="126">좌견갑</text>
          <rect class="zone" x="110" y="98" width="46" height="50" rx="6" data-zone="우 견갑" onclick="toggleZone(this)"/>
          <text class="zone-label" x="133" y="126">우견갑</text>
          <rect class="zone" x="14" y="98" width="30" height="64" rx="8" data-zone="좌 상완(후)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="29" y="133">좌완</text>
          <rect class="zone" x="156" y="98" width="30" height="64" rx="8" data-zone="우 상완(후)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="171" y="133">우완</text>
          <rect class="zone" x="8" y="172" width="26" height="54" rx="7" data-zone="좌 전완(후)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="21" y="202">전완</text>
          <rect class="zone" x="166" y="172" width="26" height="54" rx="7" data-zone="우 전완(후)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="179" y="202">전완</text>
          <rect class="zone" x="60" y="220" width="46" height="50" rx="10" data-zone="좌 둔부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="83" y="248">좌둔부</text>
          <rect class="zone" x="94" y="220" width="46" height="50" rx="10" data-zone="우 둔부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="117" y="248">우둔부</text>
          <rect class="zone" x="64" y="270" width="30" height="62" rx="8" data-zone="좌 대퇴(후)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="79" y="304">대퇴후</text>
          <rect class="zone" x="106" y="270" width="30" height="62" rx="8" data-zone="우 대퇴(후)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="121" y="304">대퇴후</text>
          <ellipse class="zone" cx="79" cy="334" rx="16" ry="11" data-zone="좌 슬와(오금)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="79" y="338" style="font-size:7px">슬와</text>
          <ellipse class="zone" cx="121" cy="334" rx="16" ry="11" data-zone="우 슬와(오금)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="121" y="338" style="font-size:7px">슬와</text>
          <rect class="zone" x="66" y="346" width="26" height="50" rx="8" data-zone="좌 비복근" onclick="toggleZone(this)"/>
          <text class="zone-label" x="79" y="374">비복</text>
          <rect class="zone" x="108" y="346" width="26" height="50" rx="8" data-zone="우 비복근" onclick="toggleZone(this)"/>
          <text class="zone-label" x="121" y="374">비복</text>
          <rect class="zone" x="68" y="396" width="22" height="16" rx="4" data-zone="좌 아킬레스건" onclick="toggleZone(this)"/>
          <text class="zone-label" x="79" y="407" style="font-size:5.5px">아킬레스</text>
          <rect class="zone" x="110" y="396" width="22" height="16" rx="4" data-zone="우 아킬레스건" onclick="toggleZone(this)"/>
          <text class="zone-label" x="121" y="407" style="font-size:5.5px">아킬레스</text>
          <ellipse class="zone" cx="79" cy="424" rx="18" ry="12" data-zone="좌 발바닥(후)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="79" y="427" style="font-size:6.5px">발바닥</text>
          <ellipse class="zone" cx="121" cy="424" rx="18" ry="12" data-zone="우 발바닥(후)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="121" y="427" style="font-size:6.5px">발바닥</text>
          <ellipse class="zone" cx="79" cy="445" rx="14" ry="9" data-zone="좌 발뒤꿈치" onclick="toggleZone(this)"/>
          <text class="zone-label" x="79" y="448" style="font-size:6px">뒤꿈치</text>
          <ellipse class="zone" cx="121" cy="445" rx="14" ry="9" data-zone="우 발뒤꿈치" onclick="toggleZone(this)"/>
          <text class="zone-label" x="121" y="448" style="font-size:6px">뒤꿈치</text>
        </svg>

        <!-- ▶ 옆면 (측면) -->
        <svg class="body-svg-panel" id="bodySvg_side" viewBox="0 0 200 462" xmlns="http://www.w3.org/2000/svg" style="display:none;width:100%;height:auto">
          <ellipse class="zone" cx="105" cy="40" rx="32" ry="36" data-zone="측두부" onclick="toggleZone(this)"/>
          <text class="zone-label" x="105" y="43">측두부</text>
          <rect class="zone" x="88" y="78" width="32" height="20" rx="4" data-zone="경측부(목옆)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="104" y="91">경측</text>
          <ellipse class="zone" cx="156" cy="98" rx="28" ry="22" data-zone="어깨(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="156" y="101">견측면</text>
          <rect class="zone" x="74" y="98" width="74" height="62" rx="6" data-zone="흉협(옆가슴)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="111" y="132">흉협</text>
          <rect class="zone" x="150" y="120" width="30" height="54" rx="8" data-zone="상완(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="165" y="149">상완</text>
          <rect class="zone" x="76" y="160" width="62" height="48" rx="6" data-zone="복측부(옆배)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="107" y="187">복측</text>
          <rect class="zone" x="150" y="174" width="28" height="50" rx="7" data-zone="전완(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="164" y="201">전완</text>
          <ellipse class="zone" cx="100" cy="228" rx="40" ry="26" data-zone="고관절(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="100" y="231">고관절측</text>
          <rect class="zone" x="76" y="254" width="42" height="68" rx="8" data-zone="대퇴(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="97" y="290">대퇴측</text>
          <ellipse class="zone" cx="95" cy="324" rx="22" ry="16" data-zone="슬관절(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="95" y="327" style="font-size:7px">슬관절측</text>
          <rect class="zone" x="76" y="340" width="36" height="54" rx="8" data-zone="하퇴(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="94" y="369">하퇴측</text>
          <ellipse class="zone" cx="94" cy="396" rx="22" ry="13" data-zone="발목(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="94" y="399" style="font-size:6.5px">발목측면</text>
          <ellipse class="zone" cx="112" cy="424" rx="40" ry="14" data-zone="족(측면)" onclick="toggleZone(this)"/>
          <text class="zone-label" x="112" y="427" style="font-size:7px">족측면</text>
        </svg>

      </div>
      <div class="selected-list" style="padding-top:8px">
        <div class="selected-title">선택된 통증 부위 (<span id="zoneCount">0</span>개)</div>
        <div id="selectedZones"><div class="no-select">신체 부위를 클릭하여 통증 지점을 추가하세요.</div></div>
        <div class="note mt8">부위를 선택하지 않고 다음 단계에서 직접 증상을 기술할 수도 있습니다</div>
      </div>
    </div>
  </div>

  <div class="nav-bar">
    <button class="btn btn-ghost" onclick="goStep(1)">← 이전: 기본정보</button>
    <button class="btn btn-primary" onclick="goStep(3)">다음: 상세 문진 →</button>
  </div>
</section>

<!-- ════════════════ STEP 3: 문진 ════════════════ -->
<section class="step-panel" id="panel3">
  <div class="section-header">
    <div class="section-badge">🔎 STEP 3. 상세 증상 문진</div>
    <div class="section-title">증상을 조금 더 알려주세요</div>
    <div class="section-sub">선택사항입니다. 필요한 항목만 체크하거나 하단에 직접 입력하세요.</div>
  </div>

  <div class="card">
    <div class="card-label">통증의 좌우 편측 (Laterality)</div>
    <div class="toggle-group" id="lateralityGroup">
      <button class="toggle-btn" data-val="좌측" onclick="setToggle('lateralityGroup',this,'좌측')">좌측 (Left)</button>
      <button class="toggle-btn" data-val="우측" onclick="setToggle('lateralityGroup',this,'우측')">우측 (Right)</button>
      <button class="toggle-btn active" data-val="양측" onclick="setToggle('lateralityGroup',this,'양측')">양측 (Bilateral)</button>
      <button class="toggle-btn" data-val="" onclick="setToggle('lateralityGroup',this,'')">좌우 / 편측 없음</button>
    </div>
  </div>

  <div class="card">
    <div class="card-label">유병 기간 (Duration)</div>
    <div class="chip-group" id="durationGroup">
      <span class="chip" onclick="toggleChipSingle('durationGroup',this)">당일 급성</span>
      <span class="chip" onclick="toggleChipSingle('durationGroup',this)">3일 이내</span>
      <span class="chip" onclick="toggleChipSingle('durationGroup',this)">1주 이내</span>
      <span class="chip" onclick="toggleChipSingle('durationGroup',this)">1개월 이내</span>
      <span class="chip" onclick="toggleChipSingle('durationGroup',this)">1–3개월</span>
      <span class="chip active" onclick="toggleChipSingle('durationGroup',this)">3개월 이상 (만성)</span>
      <span class="chip" onclick="toggleChipSingle('durationGroup',this)">1년 이상 (교질)</span>
    </div>
  </div>

  <div class="card">
    <div class="card-label">주요 호소 증상 (복수 선택 가능)</div>
    <div class="chip-group" id="symptomsGroup">
      <span class="chip" onclick="toggleChip(this)">극심한 관절통</span>
      <span class="chip" onclick="toggleChip(this)">뻐근한 근육통</span>
      <span class="chip" onclick="toggleChip(this)">신경통/저림</span>
      <span class="chip" onclick="toggleChip(this)">보행 장애</span>
      <span class="chip" onclick="toggleChip(this)">관절 가동범위 제한</span>
      <span class="chip" onclick="toggleChip(this)">두통/어지럼증</span>
      <span class="chip" onclick="toggleChip(this)">소화불량/속쓰림</span>
      <span class="chip" onclick="toggleChip(this)">만성 피로/기력저하</span>
      <span class="chip" onclick="toggleChip(this)">불면/자율신경실조증</span>
    </div>
  </div>

  <div class="card">
    <div class="card-label">통증 성질 및 감각 (Pain Quality)</div>
    <div class="chip-group" id="painQualityGroup">
      <span class="chip" onclick="toggleChip(this)">욱씬거림</span>
      <span class="chip" onclick="toggleChip(this)">찌르는 통증</span>
      <span class="chip" onclick="toggleChip(this)">쪽박/비교</span>
      <span class="chip active" onclick="toggleChip(this)">당김/경련</span>
      <span class="chip" onclick="toggleChip(this)">찢어짐/찰과</span>
      <span class="chip" onclick="toggleChip(this)">화끈거림 (열감)</span>
      <span class="chip" onclick="toggleChip(this)">시림 (한감)</span>
      <span class="chip" onclick="toggleChip(this)">묵직함/당김</span>
    </div>
  </div>

  <div class="card">
    <div class="card-label">악화 및 완화 요인 (Aggravating Factors)</div>
    <div class="chip-group" id="aggravGroup">
      <span class="chip active" onclick="toggleChip(this)">움직일 때/보행 시 악화</span>
      <span class="chip" onclick="toggleChip(this)">오래 앉아있을 때 악화</span>
      <span class="chip" onclick="toggleChip(this)">음식/식사 시 악화</span>
      <span class="chip" onclick="toggleChip(this)">아침 기상 시 뻣뻣함</span>
      <span class="chip" onclick="toggleChip(this)">야간에 심해짐</span>
      <span class="chip" onclick="toggleChip(this)">추위/한냉에 악화</span>
      <span class="chip" onclick="toggleChip(this)">비오거나 흐린 날 악화</span>
      <span class="chip" onclick="toggleChip(this)">스트레스 받을 때 악화</span>
    </div>
  </div>

  <div class="card">
    <div class="card-label">추가 임상 소견 및 특이사항</div>
    <textarea id="additionalNotes" placeholder="예: 야간에 심하여 수면 장애 동반. 운동회 시 호전되고 근 곳에 기면시 사라지는 경향. 이전 집 치료 시 생명골 치방 후 이전 집 호전된 병력."></textarea>
  </div>

  <div class="nav-bar">
    <button class="btn btn-ghost" onclick="goStep(2)">← 이전: 신체 탭</button>
    <div style="display:flex;gap:10px">
      <button class="btn btn-ghost" onclick="goStep(4)">설-맥진 바로 가기 →</button>
      <button class="btn btn-primary" onclick="goStep(4)">다음: 설-맥진 →</button>
    </div>
  </div>
</section>

<!-- ════════════════ STEP 4: 설-맥진 ════════════════ -->
<section class="step-panel" id="panel4">
  <div class="section-header">
    <div class="section-badge">👅 STEP 4. 설-맥진</div>
    <div class="section-title">설진과 맥진을 선택하세요</div>
    <div class="section-sub">임상에서 중요한 특이사항이 없다면 항목을 체크하고 바로 처방 결과로 이동해도 좋습니다.</div>
  </div>

  <div class="card">
    <div class="card-label">1. 설진 조건 (Tongue Diagnosis) &nbsp;<span style="font-size:10px;color:var(--muted);font-weight:400">다중 선택 가능</span></div>
    <div class="tongue-grid" id="tongueGrid">
      <div class="tongue-card active" onclick="toggleTongue(this)">
        <div class="tongue-name">담홍설 (淡紅色)</div>
        <div class="tongue-desc">정상 설진, 기혈 조화</div>
      </div>
      <div class="tongue-card" onclick="toggleTongue(this)">
        <div class="tongue-name">홍설 (紅色)</div>
        <div class="tongue-desc">열증/음허</div>
      </div>
      <div class="tongue-card" onclick="toggleTongue(this)">
        <div class="tongue-name">암설 (暗設)</div>
        <div class="tongue-desc">어혈 관련</div>
      </div>
      <div class="tongue-card" onclick="toggleTongue(this)">
        <div class="tongue-name">담백설 (淡白色)</div>
        <div class="tongue-desc">기혈허, 양허증</div>
      </div>
      <div class="tongue-card" onclick="toggleTongue(this)">
        <div class="tongue-name">청자어 (靑紫)</div>
        <div class="tongue-desc">한증(냉증), 어혈</div>
      </div>
      <div class="tongue-card" onclick="toggleTongue(this)">
        <div class="tongue-name">황태 (黃苔)</div>
        <div class="tongue-desc">이습증(濕熱)</div>
      </div>
      <div class="tongue-card" onclick="toggleTongue(this)">
        <div class="tongue-name">백태·경병 (白苔)</div>
        <div class="tongue-desc">표증, 한증</div>
      </div>
      <div class="tongue-card" onclick="toggleTongue(this)">
        <div class="tongue-name">무태·경병설 (無苔)</div>
        <div class="tongue-desc">음허, 위음부족</div>
      </div>
      <div class="tongue-card" onclick="toggleTongue(this)">
        <div class="tongue-name">열홍설 (裂紋舌)</div>
        <div class="tongue-desc">음허 또는 열성</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-label">2. 맥진 소견 (Pulse Diagnosis)</div>
    <div class="slider-wrap">
      <div class="slider-labels">
        <span>浮脈 (부 — 겉/가벼운 탈)</span>
        <span>沈脈 (침 — 깊이 눌러야 탈)</span>
      </div>
      <input type="range" id="pulseDepth" min="0" max="10" value="5" oninput="updateSlider(this,'pulseDepthVal')">
      <div class="slider-val" id="pulseDepthVal">중간 (보통)</div>
    </div>
    <div class="slider-wrap">
      <div class="slider-labels">
        <span>遲脈 (지 — 느린 탈)</span>
        <span>數脈 (삭 — 빠른)</span>
      </div>
      <input type="range" id="pulseRate" min="0" max="10" value="5" oninput="updateSlider(this,'pulseRateVal')">
      <div class="slider-val" id="pulseRateVal">평맥 (보통)</div>
    </div>
  </div>

  <div class="nav-bar">
    <button class="btn btn-ghost" onclick="goStep(3)">← 이전: 상세 문진</button>
    <button class="btn btn-primary" onclick="submitPrescription()">침 처방 결과 보기 →</button>
  </div>
</section>

<!-- ════════════════ STEP 5: 결과 ════════════════ -->
<section class="step-panel" id="panel5">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">
    <div class="quick-nav" id="summaryBreadcrumb"></div>
    <button class="btn btn-sm btn-ghost" onclick="resetForm()">↺ 새 환자 진료 시작</button>
  </div>

  <div id="resultArea">
    <div class="empty-state">
      <div class="empty-icon">🫁</div>
      <div class="empty-text">환자 정보를 입력하고 처방 생성을 눌러주세요</div>
    </div>
  </div>

  <div class="nav-bar" id="resultNav" style="display:none">
    <button class="btn btn-ghost" onclick="goStep(4)">← 이전: 설-맥진</button>
    <button class="btn btn-primary" onclick="submitPrescription()">↺ 재처방 생성</button>
  </div>
</section>

</main>

<script>
const API_URL = 'https://kmd-clinical-assistant.38card.workers.dev';
let currentStep = 1;
const selectedZones = new Set();
const selectedCats = new Set();

/* ── STEP NAV ── */
function goStep(n) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel' + n).classList.add('active');
  document.querySelectorAll('.step-btn').forEach(b => {
    const s = parseInt(b.dataset.step);
    b.classList.remove('active','done');
    if (s === n) b.classList.add('active');
    else if (s < n) b.classList.add('done');
  });
  currentStep = n;
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ── TOGGLE HELPERS ── */
function setToggle(groupId, btn, val) {
  document.querySelectorAll(\`#\${groupId} .toggle-btn\`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function toggleChipSingle(groupId, chip) {
  document.querySelectorAll(\`#\${groupId} .chip\`).forEach(c => c.classList.remove('active'));
  chip.classList.toggle('active');
}
function toggleChip(chip) { chip.classList.toggle('active'); }
function toggleTongue(card) { card.classList.toggle('active'); }

/* ── BMI ── */
function calcBMI() {
  const ft = parseFloat(document.getElementById('ht-ft').value)||0;
  const inch = parseFloat(document.getElementById('ht-in').value)||0;
  const lb = parseFloat(document.getElementById('wt-lb').value)||0;
  const cm = Math.round((ft*30.48)+(inch*2.54));
  const kg = Math.round(lb*0.4536*10)/10;
  const bmi = cm>0 ? Math.round((kg/((cm/100)**2))*10)/10 : 0;
  let status='', cls='normal';
  if(bmi<18.5){status='저체중';cls='under';}
  else if(bmi<25){status='정상';cls='normal';}
  else if(bmi<30){status='과체중';cls='over';}
  else{status='비만';cls='over';}
  document.getElementById('bmiText').textContent = \`신장: \${cm}cm / \${kg}kg  ·  BMI 지수: \${bmi} kg/m²\`;
  const st = document.getElementById('bmiStatus');
  st.textContent = status;
  st.className = 'bmi-status ' + cls;
}
calcBMI();

/* ── BODY DIAGRAM ── */
function toggleZone(el) {
  const zone = el.dataset.zone;
  if (el.classList.contains('selected')) {
    el.classList.remove('selected');
    selectedZones.delete(zone);
  } else {
    el.classList.add('selected');
    selectedZones.add(zone);
  }
  renderSelectedZones();
}
function toggleCat(el) {
  const cat = el.dataset.cat;
  if (el.classList.contains('active')) {
    el.classList.remove('active');
    selectedCats.delete(cat);
  } else {
    el.classList.add('active');
    selectedCats.add(cat);
  }
  renderSelectedZones();
}
function renderSelectedZones() {
  const all = new Set([...selectedZones, ...selectedCats]);
  document.getElementById('zoneCount').textContent = all.size;
  const container = document.getElementById('selectedZones');
  if (all.size === 0) {
    container.innerHTML = '<div class="no-select">신체 부위를 클릭하여 통증 지점을 추가하세요.</div>';
  } else {
    container.innerHTML = [...all].map(z =>
      \`<span class="selected-tag">\${z} <button onclick="removeZone('\${z}')">×</button></span>\`
    ).join('');
  }
}
function removeZone(zone) {
  selectedZones.delete(zone); selectedCats.delete(zone);
  document.querySelectorAll(\`.zone[data-zone="\${zone}"]\`).forEach(el=>el.classList.remove('selected'));
  document.querySelectorAll(\`.cat-chip[data-cat="\${zone}"]\`).forEach(el=>el.classList.remove('active'));
  renderSelectedZones();
}
function setBvTab(btn, view) {
  document.querySelectorAll('.bv-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.body-svg-panel').forEach(el=>el.style.display='none');
  const panel = document.getElementById('bodySvg_'+view);
  if(panel) panel.style.display='block';
}

/* ── SLIDERS ── */
const pulseDepthLabels = ['부맥 (매우 浮)','부맥 (浮)','부중맥','부중맥','중맥','중간 (보통)','중침맥','중침맥','침맥','침맥 (沈)','침맥 (매우 沈)'];
const pulseRateLabels  = ['지맥 (매우 遲)','지맥 (遲)','지완맥','완맥','완맥','평맥 (보통)','평삭맥','삭맥','삭맥 (數)','삭맥 (數)','삭맥 (매우 數)'];
function updateSlider(el, valId) {
  const v = parseInt(el.value);
  const labels = el.id === 'pulseDepth' ? pulseDepthLabels : pulseRateLabels;
  document.getElementById(valId).textContent = labels[v];
  el.style.background = \`linear-gradient(to right, var(--primary) \${v*10}%, #e2e8f0 \${v*10}%)\`;
}
updateSlider(document.getElementById('pulseDepth'), 'pulseDepthVal');
updateSlider(document.getElementById('pulseRate'), 'pulseRateVal');

/* ── COLLECT DATA ── */
function collectPayload() {
  const age = parseInt(document.getElementById('age').value);
  const genderBtn = document.querySelector('#genderGroup .toggle-btn.active');
  const gender = genderBtn ? genderBtn.dataset.val : '미지정';

  // Chief complaint
  const directText = document.getElementById('chiefComplaint').value.trim();
  const bodyZones = [...new Set([...selectedZones, ...selectedCats])];
  const selSymptoms = [...document.querySelectorAll('#symptomsGroup .chip.active')].map(c=>c.textContent);

  let symptom = directText;
  if (!symptom && bodyZones.length > 0) symptom = bodyZones.join(', ') + ' 통증';
  if (!symptom) symptom = '전신 불편감';

  // Affected side
  const latBtn = document.querySelector('#lateralityGroup .toggle-btn.active');
  const affectedSide = latBtn ? (latBtn.dataset.val || null) : null;

  // Duration
  const durChip = document.querySelector('#durationGroup .chip.active');
  const duration = durChip ? durChip.textContent : null;

  // Tongue
  const tongueCards = [...document.querySelectorAll('#tongueGrid .tongue-card.active')];
  const tongue = tongueCards.map(c=>c.querySelector('.tongue-name').textContent).join(', ') || null;

  // Pulse
  const depthV = parseInt(document.getElementById('pulseDepth').value);
  const rateV  = parseInt(document.getElementById('pulseRate').value);
  const depthLabel = pulseDepthLabels[depthV];
  const rateLabel  = pulseRateLabels[rateV];
  const pulse = (depthV !== 5 || rateV !== 5) ? \`\${depthLabel}, \${rateLabel}\` : null;

  // Pain quality + aggravation
  const pqChips = [...document.querySelectorAll('#painQualityGroup .chip.active')].map(c=>c.textContent);
  const agChips = [...document.querySelectorAll('#aggravGroup .chip.active')].map(c=>c.textContent);
  const additionalNotes = document.getElementById('additionalNotes').value.trim() || null;

  const secSymptoms = [...selSymptoms, ...pqChips, ...agChips];

  const payload = { age, gender, symptom };
  if (affectedSide) payload.affected_side = affectedSide;
  if (duration) payload.duration = duration;
  if (tongue) payload.tongue = tongue;
  if (pulse) payload.pulse = pulse;
  if (secSymptoms.length) payload.secondary_symptoms = secSymptoms;
  if (additionalNotes) payload.additional_notes = additionalNotes;

  return payload;
}

/* ── BREADCRUMB ── */
function renderBreadcrumb(p) {
  document.getElementById('summaryBreadcrumb').innerHTML = \`
    <span class="quick-nav-label">빠른 수정:</span>
    <button class="quick-nav-btn" onclick="goStep(1)">기본정보</button>
    <button class="quick-nav-btn" onclick="goStep(2)">신체 탭(3-View)</button>
    <button class="quick-nav-btn" onclick="goStep(3)">문진</button>
    <button class="quick-nav-btn" onclick="goStep(4)">설·맥진</button>
  \`;
}

/* ── SUBMIT ── */
async function submitPrescription() {
  const payload = collectPayload();
  goStep(5);
  document.getElementById('resultNav').style.display = 'none';
  renderBreadcrumb(payload);
  document.getElementById('spinnerOverlay').classList.add('show');
  document.getElementById('resultArea').innerHTML = '';
  try {
    const res = await fetch(\`\${API_URL}/prescription\`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || res.statusText);
    }
    const data = await res.json();
    renderResult(data);
    document.getElementById('resultNav').style.display = 'flex';
  } catch(e) {
    document.getElementById('resultArea').innerHTML = \`
      <div class="caution-card">
        <div class="card-label">⚠️ 오류</div>
        <div class="caution-text">\${e.message}<br><br>Cloudflare Worker (https://kmd-clinical-assistant.38card.workers.dev) 배포 상태를 확인하세요.</div>
      </div>\`;
  } finally {
    document.getElementById('spinnerOverlay').classList.remove('show');
  }
}

/* ── RENDER RESULT ── */
function renderResult(data) {
  const diag = data.diagnosis || {};
  const presc = data.prescription || {};
  const sec = data.secondary_treatment || {};
  const tung = data.tung_acupuncture || {};
  const rationale = data.rationale || '';
  const caution = data.caution || null;
  const confidence = data.confidence || 'medium';
  const treatmentPrinciple = data.treatment_principle || '';

  function ptChip(pt, showAction=true) {
    const code = pt.point_code ? \`<span class="pt-code">\${pt.point_code}</span>\` : '';
    let badge = '';
    if (showAction && pt.action) {
      badge = pt.action === '보'
        ? \`<span class="pt-action-bo">보</span>\`
        : \`<span class="pt-action-sa">사</span>\`;
    }
    return \`<span class="pt-chip">\${pt.point||''}\${code}\${badge}</span>\`;
  }

  // ── Assessment card (dark) ──
  let html = \`
  <div class="assess-card">
    <div class="assess-label">🔬 임상 변증 분석 (Assessment) · 달리보험 침구 처방 기반</div>
    <div class="assess-pattern">\${diag.pattern || '-'}</div>
    <div class="assess-sub">\${rationale ? rationale.split(/[.。]/).filter(s=>s.trim())[0] : (diag.primary_meridian||'')}</div>
    \${treatmentPrinciple ? \`
    <div class="principle-inner">
      <div class="principle-inner-label">치료 원칙 (TREATMENT PRINCIPLE)</div>
      <div class="principle-inner-text">\${treatmentPrinciple}</div>
    </div>\` : ''}
  </div>\`;

  // ── Prescription section header ──
  html += \`
  <div class="rx-section-header">
    <span class="rx-section-title">추천 침구 처방 (Acupuncture Formulas)</span>
    <span class="rx-section-note">혈위를 클릭하면 위치를 확인할 수 있습니다</span>
  </div>\`;

  // ── 동씨침법 ──
  const tungPoints = (tung.points || []).sort((a,b)=>(a.order||0)-(b.order||0));
  if (tungPoints.length) {
    const chips = tungPoints.map(pt => {
      const code = pt.point_code ? \`<span class="pt-code">\${pt.point_code}</span>\` : '';
      const badge = pt.action === '보'
        ? \`<span class="pt-action-bo">보</span>\`
        : \`<span class="pt-action-sa">사</span>\`;
      const ind = pt.indication ? \`<div style="font-size:10px;color:#a16207;font-style:italic;margin-top:2px">\${pt.indication}</div>\` : '';
      return \`<div class="pt-chip" style="flex-direction:column;align-items:flex-start;gap:2px"><div style="display:flex;align-items:center;gap:3px">\${pt.point||''}\${code}\${badge}</div>\${ind}</div>\`;
    }).join('');
    html += \`
  <div class="rx-card rx-tung-card">
    <div class="rx-sub-header">
      <span class="rx-type-badge tung-badge">동씨침법(董氏針法)</span>
      <span class="rx-type-sub">도기침법(동씨針法) 병용</span>
    </div>
    <div class="pt-chips">\${chips}</div>
    \${tung.notes ? \`<div class="rx-card-note">💡 \${tung.notes}</div>\` : ''}
  </div>\`;
  }

  // ── 사암오행침법 ──
  const saamPoints = (presc.points || []).sort((a,b)=>(a.order||0)-(b.order||0));
  if (presc.method || saamPoints.length) {
    const methodChip = presc.method ? \`<span class="method-chip">사암 \${presc.method}</span>\` : '';
    const chips = saamPoints.map(pt => ptChip(pt)).join('');
    html += \`
  <div class="rx-card rx-saam-card">
    <div class="rx-sub-header">
      <span class="rx-type-badge saam-badge">사암오행침법(舍岩五行針)</span>
      <span class="rx-type-sub">양보 보사(補瀉) 적용 · \${diag.primary_meridian||''} 기준</span>
    </div>
    <div class="pt-chips" style="gap:8px 6px">\${methodChip}\${chips}</div>
    <div class="rx-card-note">💡 \${diag.primary_meridian||''} 오수혈 배열 — 반드시 반대측(건측) 취혈 적용.</div>
  </div>\`;
  }

  // ── 정경 상용 혈 ──
  const secPoints = (sec.points || []).sort((a,b)=>(a.order||0)-(b.order||0));
  if (secPoints.length) {
    const chips = secPoints.map(pt => ptChip(pt, false)).join('');
    html += \`
  <div class="rx-card rx-jeongyeong-card">
    <div class="rx-sub-header">
      <span class="rx-type-badge jeongyeong-badge">정경 상용 혈(14혈위)</span>
      <span class="rx-type-sub">사중용·활혈혈 배합</span>
    </div>
    <div class="pt-chips">\${chips}</div>
    \${sec.notes ? \`<div class="rx-card-note">💡 \${sec.notes}</div>\` : ''}
  </div>\`;
  }

  // ── 처방 근거 ──
  if (rationale) {
    html += \`
  <div class="rationale-card">
    <div class="card-label">📋 처방 근거 (Rationale)</div>
    <div class="rationale-text">\${rationale}</div>
  </div>\`;
  }

  // ── 임상 가이드 및 금기 ──
  if (caution) {
    const lines = caution.split(/(?<=[.。])\\s*/).filter(l=>l.trim().length > 2);
    const listHtml = lines.length > 1
      ? \`<ul class="caution-list">\${lines.map(l=>\`<li>\${l.trim()}</li>\`).join('')}</ul>\`
      : \`<div class="caution-text">\${caution}</div>\`;
    html += \`
  <div class="caution-card">
    <div class="caution-header">⚠️ 임상 가이드 및 금기 (PRECAUTIONS)</div>
    \${listHtml}
  </div>\`;
  }

  // ── 임상 처방 해설 (clinical_narrative) ──
  const narrative = data.clinical_narrative || '';
  if (narrative) {
    // Convert **bold** and newlines to HTML
    const narrativeHtml = narrative
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>')
      .replace(/\\n/g,'<br>');
    html += \`
  <div class="narrative-card">
    <div class="narrative-header">📖 임상 처방 해설 (Clinical Narrative)</div>
    <div class="narrative-body">\${narrativeHtml}</div>
  </div>\`;
  }

  // ── 신뢰도 ──
  const confMap = {high:'conf-high',medium:'conf-medium',low:'conf-low'};
  const confLabel = {high:'높음 ✓',medium:'보통',low:'낮음 △'};
  html += \`<div class="confidence-row">처방 신뢰도: <span class="\${confMap[confidence]||'conf-medium'}">\${confLabel[confidence]||confidence}</span></div>\`;

  document.getElementById('resultArea').innerHTML = html;
}

/* ── INSTANT PRESCRIBE SHOW/HIDE ── */
document.getElementById('chiefComplaint').addEventListener('input', function() {
  document.getElementById('instantPrescribeWrap').style.display = this.value.trim() ? 'block' : 'none';
});

/* ── RESET ── */
function resetForm() {
  document.getElementById('chiefComplaint').value='';
  document.getElementById('additionalNotes').value='';
  document.getElementById('age').value=65;
  document.getElementById('instantPrescribeWrap').style.display='none';
  selectedZones.clear(); selectedCats.clear();
  document.querySelectorAll('.zone.selected').forEach(el=>el.classList.remove('selected'));
  document.querySelectorAll('.cat-chip.active').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.chip.active').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.tongue-card.active').forEach(el=>el.classList.remove('active'));
  document.querySelector('#tongueGrid .tongue-card').classList.add('active');
  document.querySelector('#lateralityGroup [data-val="양측"]').classList.add('active');
  document.querySelectorAll('#lateralityGroup .toggle-btn:not([data-val="양측"])').forEach(b=>b.classList.remove('active'));
  document.getElementById('pulseDepth').value=5;
  document.getElementById('pulseRate').value=5;
  updateSlider(document.getElementById('pulseDepth'),'pulseDepthVal');
  updateSlider(document.getElementById('pulseRate'),'pulseRateVal');
  document.querySelectorAll('.body-svg-panel').forEach(el=>el.style.display='none');
  document.getElementById('bodySvg_front').style.display='block';
  document.querySelectorAll('.bv-tab').forEach((b,i)=>b.classList.toggle('active',i===0));
  renderSelectedZones();
  goStep(1);
}
</script>
</body>
</html>`;

// Embedded from prompt_template.txt (keep in sync with backend/main.py)
const SYSTEM_INSTRUCTION = `당신은 한국 전통 사암침(舍岩鍼) 전문 임상 의사 AI입니다.
[USER REQUEST] 섹션에 제공된 실제 환자 정보만을 사용하여 사암침 처방을 생성합니다.
아래의 참조표는 형식과 혈위 정확도를 위한 참조입니다. 반드시 이 표의 혈위만 사용하십시오.

## 핵심 진단 체계
- **오장(五臟)**: 간(肝), 심(心), 비(脾), 폐(肺), 신(腎)
- **육부(六腑)**: 담(膽), 소장(小腸), 위(胃), 대장(大腸), 방광(膀胱), 삼초(三焦)
- **허실 판단**: 증상 + 맥상 + 환측(患側) + 이환기간 + 나이 + 성별 종합 분석
- **정격/승격**: 허증(虛證) → 정격(正格), 실증(實證) → 승격(勝格)

## 사암침 처방 원칙
- 정격: 해당 장부 본경 보(補) 2혈 + 사(瀉) 2혈
- 승격: 해당 장부 본경 사(瀉) 2혈 + 보(補) 2혈
- 환측(患側) 반대측 취혈 원칙 적용
- 오수혈(五輸穴): 정(井) 형(滎) 수(俞) 경(經) 합(合) 기준

## 사암침 정격/승격 참조표 (반드시 이 표의 혈위만 사용)

| 장부 | 정격 (허증) | 승격 (실증) |
|------|------------|------------|
| 비(脾) | 소부HT8보, 대도SP2보, 대돈LR1사, 은백SP1사 | 경거LU8사, 상구SP5사, 소부HT8보, 대도SP2보 |
| 심(心) | 대돈LR1보, 소충HT9보, 음곡KD10사, 소해HT3사 | 신문HT7사, 태백SP3사, 대돈LR1보, 소충HT9보 |
| 간(肝) | 음곡KD10보, 곡천LR8보, 경거LU8사, 중봉LR4사 | 행간LR2사, 소부HT8사, 음곡KD10보, 곡천LR8보 |
| 폐(肺) | 태백SP3보, 태연LU9보, 소부HT8사, 어제LU10사 | 척택LU5사, 음곡KD10사, 태백SP3보, 태연LU9보 |
| 신(腎) | 경거LU8보, 부류KD7보, 태백SP3사, 태계KD3사 | 용천KD1사, 태계KD3사, 경거LU8보, 부류KD7보 |
| 담(膽) | 협계GB43보, 통곡BL66보, 임읍GB41사, 속골BL65사 | 양보GB38사, 양곡SI5사, 협계GB43보, 통곡BL66보 |
| 소장(小腸) | 후계SI3보, 임읍GB41보, 통곡BL66사, 속골BL65사 | 양곡SI5사, 해계ST41사, 후계SI3보, 임읍GB41보 |
| 위(胃) | 해계ST41보, 양곡SI5보, 임읍GB41사, 양보GB38사 | 여태ST45사, 상양LI1사, 해계ST41보, 양곡SI5보 |
| 대장(大腸) | 양곡SI5보, 곡지LI11보, 양보GB38사, 임읍GB41사 | 상양LI1사, 여태ST45사, 양곡SI5보, 곡지LI11보 |
| 방광(膀胱) | 부류KD7보, 지음BL67보, 임읍GB41사, 속골BL65사 | 속골BL65사, 통곡BL66사, 부류KD7보, 지음BL67보 |
| 삼초(三焦) | 중저SJ3보, 후계SI3보, 천정SJ10사, 곡지LI11사 | 천정SJ10사, 지구SJ6사, 중저SJ3보, 후계SI3보 |

## 동씨침(董氏針) 특효혈 참조표 (사암침과 반드시 병용)

| 주증상·패턴 | 특효혈 | 동씨침 코드 | 위치 | 시술법 |
|-----------|--------|-----------|-----|------|
| 신허 전반·단백뇨·부종·당뇨 연관 | 하삼황: 천황·지황·인황 | 88.17·88.18·88.19 | 경골 내측 3혈 | 보법 (1.5–2촌) |
| 신장·방광 기능 강화·야뇨·빈뇨 | 통신·통위 | 88.09·88.10 | 수배 무명지 척측 | 보법 |
| 발바닥 열감·팅글링·작열감 | 노궁 사법 | PC8 | 장심 중앙 | 사법 (족저 작열·저림 해소) |
| 하지 저림·마비·좌골신경통 | 영골·대백 | 22.05·22.06 | 수배 합곡 위 | 사법 |
| 무릎·요슬 신허 연관 통증 | 중백·하백 | 22.06·22.07 | 수배 소지·무명지 사이 | 보법 |
| 비허 수습·하지 부종 | 사화중·사화외 | 88.12·88.13 | 위경 대퇴부 | 보법 |
| 손발가락 저림·관절 통증 | 오호 | 11.27 | 무지 척측 | 보/사 |
| 간경·안질환·신허 복합 | 명황·천황부 | 88.19·88.14 | 대퇴 내측 | 보법 |
| **족근통·발뒤꿈치 통증 (1순위)** | **오호5혈** | **11.27** | 엄지손가락 적백육제 제5혈 | 뼈 밑 바짝 붙여 깊게 자입 (건측) |
| 족근통·뼈속 통증 (골극) | 골관·목관 | 77.01·77.02 | 수배 소지·무명지 중수골 사이 | 골병→골관, 근병→목관 |
| 발목 염좌·족근 복합 통증 | 오호4·5혈+소절 | 11.26·11.27·22.13 | 무지 척측+소지 | 사법 (급성 지통) |
| 수족상대 발목·발뒤꿈치 | 대릉혈 | PC7 | 손목 중앙 장측 | 교차대응 (건측) |
| 아킬레스건·뒤꿈치 인대 | 정근·정종 | 1010.01·1010.02 | 종아리 중앙 | 건측 자침, 보법 |
| 만성 족근통+미골·선골통 동반 | 화전·폐심 | 22.01·22.02 | 수배 척측 | 만성 4개월 이상 |
| 어깨·경추 전면 통증 | 중평혈 | 88.25 | 비골두 아래 족삼리 외측 | 사법 |
| 요통·요추 디스크 | 영골·대백 대측 | 22.05·22.06 | 수배 합곡 위 | 강자극 사법 |
| 두통·편두통·항강 | 중구·중仙 | 1010.07·1010.08 | 족배 2·3지 사이 | 사법 |

**동씨침 시술 원칙:**
- **하삼황(88.17-88.19)**: 세 혈위 동시 자침, 경골 내측 취혈 — 신허 패턴의 1순위 특효혈
- **영골(22.05)+대백(22.06)**: 대측(건측) 수배 자침 → 하지·요통·신경통 즉효
- **노궁(PC8) 사법**: 발바닥 작열·팅글링 시 반드시 추가
- **통신(88.09)+통위(88.10)**: 신기불고 패턴(소변 거품·단백뇨)에 하삼황과 병용
- **오호5혈(11.27)**: 족근통·발뒤꿈치 통증 1순위 특효혈 — 엄지손가락 적백육제 5번째 압통점, 뼈 밑 바짝 붙여 깊게 자입
- **골관(77.01)·목관(77.02)**: 족근 골병(뼈속 통증)·근병(인대 통증) 구별 취혈
- **대릉(PC7)**: 수족상대 원리 — 손목 대응 발목·발뒤꿈치 즉각 진통
- **정근·정종(1010.01-02)**: 아킬레스건·종아리 근건 통증 특효, 건측 자침

## 5단계 임상 추론 프로세스 (JSON 출력 전 내부적으로 수행)

### Step 1 · 병리 변증 (Pathological Pattern Identification)
증상의 ① 성질(통증·마비·부종·분비물·열감·냉감), ② 발생 부위(경락 주행 대조), ③ 시간 패턴(야간 악화→허증, 활동 시 악화→실증, 만성→허증 경향), ④ 유발·완화 인자를 종합하여 **허(虛)/실(實)** 판별 → 주 장부 1개 가선정.

### Step 2 · 경락 감별 (Meridian Differentiation)
가선정 장부의 경락 주행이 주증상 부위를 **직접 통과하는지** 확인.
- 통과하면 확정 → 정격(허) 또는 승격(실) 결정
- 통과하지 않으면 재검토 → 아래 증상-경락 감별 가이드 재참조

### Step 3 · 증상별 처방 그룹화 (Symptom-Based Prescription Grouping)
- **주증상(Chief Complaint)**: 본방 4혈 선정 — 참조표에서 정격/승격 4혈 그대로 적용
- **부증상(Secondary Symptoms)**: secondary_treatment 가감 여부 검토; 참조표 범위 내 혈위만 허용
- **전신 동반 증상**: secondary_treatment.notes에 임상 설명 기재

### Step 4 · 실전 자침 조합 및 수기법 가이드 (Needling Technique)
- **정격(허증)**: 보혈(補穴) 먼저 자침 → 득기 후 염전 보법(捻轉補法)
- **승격(실증)**: 사혈(瀉穴) 먼저 자침 → 득기 후 염전 사법(捻轉瀉法)
- 환측 반대측 취혈 엄수; order 1→4 시술 순서대로 정렬
- 자침 방향: 보법은 경락 주행 방향, 사법은 역방향 원칙

### Step 5 · 임상 가감 질문 (Clinical Modification Notes)
rationale 마지막 문장에 반드시 다음 형식으로 감별 포인트 1가지 명시:
"추가 확인 시 고려: [맥상/설진/이환기간/수반증상 중 1가지 구체적 항목]"

---

## 증상-경락 감별진단 가이드 (장부 선택 전 반드시 검토)

**경락 주행 기반 1차 장부 후보 선별:**
| 증상 부위 / 키워드 | 우선 검토 장부 | 주의 |
|------------------|--------------|------|
| 좌골신경통, 요추~발뒤쪽 방사통 | 방광(膀胱) 실/허 | BL경 주행 경로 |
| 발뒤꿈치 통증 (단독, 만성) | 신(腎) 허증 | KD경 뒤꿈치 통과 |
| 발뒤꿈치 통증 (급성, 압통 심함) | 신(腎) 실증 또는 방광(膀胱) | 급성은 실증 우선 |
| 옆구리·협늑 통증, 눈 충혈·건조 | 간(肝) 실/허 | LR경 주행 |
| 측두부 두통, 귀 증상, 무릎 외측 | 담(膽) 실/허 | GB경 주행 |
| 소화불량, 식욕부진, 무릎 안쪽 | 비(脾) 허증 | 토기 약화 |
| 위완부 통증, 구역, 무릎 앞쪽 | 위(胃) 실증 | ST경 주행 |
| 어깨 후면·견갑골 통증 | 소장(小腸) 실/허 | SI경 주행 |
| 어깨 외측, 목 측면 통증 | 삼초(三焦) 실/허 | SJ경 주행 |
| 흉통, 불면, 심계항진 | 심(心) 허증 | |
| 기침, 피부질환, 코 증상 | 폐(肺) 허/실 | LU경 |
| 손목·팔꿈치 통증, 변비 | 대장(大腸) 실/허 | LI경 주행 |
| 소변 거품·단백뇨·빈뇨·야뇨 | 신(腎) 허증 | 신기불고(腎氣不固) |
| 하지 부종·양말 자국·전신 부기 | 비(脾) 허증 또는 신(腎) 허증 | 비허 수습운화 실조 우선 검토 |
| 발바닥 중앙 팅글링·작열감·저림 | 신(腎) 허증 | KD1 통과 부위 |
| 발바닥 중앙 + 소변 이상 복합 | 신(腎) 허증 (신정부족 패턴) | 신허 + 비허 복합 가능성 |

**⚠️ 변증 편향 방지 규칙 (필수):**
- 신허증(腎虛證)은 빈번한 진단이지만 **기본값(default)이 아님**.
- 좌골신경통(좌골~하지 방사통)은 방광경(BL) 주행 증상 → **방광 실/허를 1순위로 검토**.
- 발뒤꿈치 단독 통증은 신경(KD) 연관이 높지만, 이환기간·맥상·나이를 종합해 허/실 판단.
- 매 케이스를 독립적으로 평가하고, 주증상의 경락 주행을 기반으로 장부를 선택할 것.

## 출력 규격 (반드시 아래 JSON 스키마만 출력)

\`\`\`json
{
  "diagnosis": {
    "pattern": "장부명 + 허/실 (예: 비허증, 간실증)",
    "primary_meridian": "주 경락명 (예: 비경)",
    "secondary_meridian": "보조 경락명 또는 null",
    "imbalance_type": "허(虛) 또는 실(實)"
  },
  "treatment_principle": "치료 원칙 한자 병기 2-4 키워드 (예: 거풍산한(祛風散寒)·활혈통락(活血通絡)·진통소서(鎭痛消舒))",
  "prescription": {
    "method": "정격 또는 승격",
    "points": [
      {
        "point": "혈위명 (한글)",
        "point_code": "경혈 코드 (예: SP3)",
        "side": "좌 또는 우 또는 양측",
        "action": "보 또는 사",
        "order": 1
      }
    ]
  },
  "secondary_treatment": {
    "points": [
      {
        "point": "정경 상용 혈위명 (예: 합곡)",
        "point_code": "WHO 코드 (예: LI4)",
        "side": "양측",
        "order": 1
      }
    ],
    "notes": "정경 상용 혈 선택 근거 또는 null"
  },
  "tung_acupuncture": {
    "points": [
      {
        "point": "동씨침 혈위명 (예: 하삼황)",
        "point_code": "동씨침 코드 (예: 88.17)",
        "side": "좌 또는 우 또는 양측",
        "action": "보 또는 사",
        "indication": "선택 이유 (예: 신허 단백뇨 특효)",
        "order": 1
      }
    ],
    "notes": "동씨침 처방 근거 또는 null"
  },
  "rationale": "처방 근거 2-3문장 (오행 상생상극 원리 + 환자 증상 직접 연결)",
  "caution": "주의사항 또는 null",
  "confidence": "high 또는 medium 또는 low",
  "clinical_narrative": "【상세 임상 처방 해설】\\n\\n**1. 사암침 처방 해설**\\n각 혈위별 선택 근거, 보사법 원리, 오행 상생·상극 관계 설명 (각 혈위 1-2문장씩)\\n\\n**2. 동씨침 처방 해설**\\n각 혈위의 상응 원리, 자침 방법, 특효 임상 적응증, 예상 효과 (각 혈위 2-3문장씩)\\n\\n**3. 방혈 요혈 (해당시)**\\n방혈 혈위명, 적응증, 방혈량 기준\\n\\n**4. 실전 시술 순서**\\n1단계: ... → 2단계: ... → 3단계: ... → 4단계: ...\\n\\n**5. 동기침법 안내**\\n침 유침 중 환자에게 시행할 동작 또는 이미지 유도 방법\\n\\n**6. 임상 가감 질문**\\n처방 최적화를 위해 추가로 확인해야 할 3-5개 질문 (맥상, 이환기간, 동반증상 등)"
}
\`\`\`

## 절대 준수 규칙
1. JSON 외 다른 텍스트 출력 금지.
2. points는 반드시 위 참조표의 혈위만 사용 — 임의 혈위 생성 금지.
3. points 배열은 반드시 4개 포함 (빈 배열 반환 절대 금지).
4. \`points\` 배열은 시술 순서(order)대로 정렬.
5. 혈위명은 한글 정식 명칭 사용.
6. [USER REQUEST]의 실제 환자 증상(나이, 성별, 주증상)을 rationale에 직접 반영할 것.
7. 참조표에 없는 혈위 코드 사용 금지.
8. 환측 반대측 취혈: affected_side가 좌측이면 side는 우측, 우측이면 좌측, 없음/양측이면 양측.
9. 장부 진단 다양성 보장: 증상-경락 감별진단 가이드를 먼저 검토하여 증상에 맞는 최적 장부를 선택. 신(腎)을 반사적으로 선택하지 말 것.
10. 동씨침(董氏針) 특효혈 병용 필수: tung_acupuncture.points 배열에 반드시 1개 이상 포함. 동씨침 참조표에서 주증상에 맞는 특효혈 선택. 빈 배열 반환 절대 금지.
11. 동씨침 코드는 동씨침 번호 체계(예: 88.17, 22.05, PC8)로 표기. 사암침 WHO 코드와 혼용 금지.
12. treatment_principle: 치료 원칙을 한자 병기 포함 2-4개 키워드로 표현 (예: 거풍산한(祛風散寒)·활혈통락(活血通絡)·진통소서(鎭痛消舒)). 반드시 포함.
13. secondary_treatment.points: 정경(14경락) 상용 혈 2-4개 포함. 주증상에 맞는 WHO 코드 기준 혈위 (합곡LI4, 태충LR3, 양릉천GB34, 족삼리ST36, 삼음교SP6, 혈해SP10, 태계KD3 등). 빈 배열 지양.
14. clinical_narrative: 반드시 400자 이상의 상세 임상 해설 작성. 각 혈위별 선택 근거·자침 방법·임상 응용, 실전 시술 순서(1-4단계), 동기침법, 임상 가감 질문 포함. 빈 문자열 절대 금지.`;

// Meridian hints (mirrors Python _MERIDIAN_HINTS)
const MERIDIAN_HINTS: [string[], string][] = [
  [["좌골신경통", "좌골", "방사통", "하지방사", "엉덩이", "종아리 뒤"], "방광경(BL) 주행 증상 → 방광(膀胱) 허/실 우선 검토"],
  [["발뒤꿈치", "족저", "뒤꿈치"], "신경(KD) 관련 → 신(腎) 허/실 검토 (이환기간·맥상 고려)"],
  [["무릎 외측", "슬관절 외측", "측두통", "편두통", "귀"], "담경(GB) 주행 → 담(膽) 허/실 검토"],
  [["어깨 후면", "견갑골", "팔꿈치 외측 내측"], "소장경(SI) 주행 → 소장(小腸) 허/실 검토"],
  [["어깨 외측", "목 측면", "삼초"], "삼초경(SJ) 주행 → 삼초(三焦) 허/실 검토"],
  [["소화", "위완", "구역", "식욕", "무릎 앞"], "비위(脾胃) 패턴 → 비(脾)/위(胃) 허/실 검토"],
  [["옆구리", "협늑", "눈 충혈", "눈 건조", "눈 피로"], "간경(LR) 주행 → 간(肝) 허/실 검토"],
  [["기침", "가래", "피부", "코막힘", "콧물"], "폐경(LU) → 폐(肺) 허/실 검토"],
  [["불면", "심계항진", "가슴 두근", "흉통"], "심경(HT) → 심(心) 허/실 검토"],
  [["변비", "손목", "팔꿈치 외측"], "대장경(LI) 주행 → 대장(大腸) 허/실 검토"],
  [["소변 거품", "단백뇨", "야뇨", "빈뇨", "소변 이상"], "신기불고(腎氣不固) 패턴 → 신(腎) 허증 우선 검토"],
  [["발바닥 중앙", "족저 중앙", "팅글링", "저림", "작열감"], "KD1(용천) 부위 → 신(腎) 허증 검토"],
  [["양말 자국", "하지 부종", "발목 부종", "다리 붓기"], "비허 수습운화 실조 → 비(脾) 허증 우선 검토"],
];

// Tung hints (mirrors Python _TUNG_HINTS)
const TUNG_HINTS: [string[], string][] = [
  [["소변 거품", "단백뇨", "야뇨", "빈뇨", "발바닥 중앙", "팅글링", "양말 자국", "족저 중앙"],
    "동씨침: 하삼황(88.17·88.18·88.19) 보법 + 통신(88.09)·통위(88.10) + 노궁(PC8) 사법"],
  [["좌골신경통", "하지 저림", "방사통", "하지방사", "마비"],
    "동씨침: 영골(22.05)+대백(22.06) 사법 (건측 수배 자침)"],
  [["하지 부종", "양말 자국", "다리 붓기", "발목 부종"],
    "동씨침: 사화중(88.12)+사화외(88.13) 보법"],
  [["발뒤꿈치", "족저", "뒤꿈치", "족근통", "아킬레스"],
    "동씨침: 오호5혈(11.27) 1순위 (손등 제5중수골 기저 → 족근 상응), 골관(77.01)+목관(77.02) 병행 (골병·근병 구별), 급성이면 오호4·5+소절(11.26-27+22.04), 만성 4개월+이면 화전(22.01)+폐심(22.02), 수족상대로 대릉(PC7) 추가, 아킬레스건이면 정근(1010.01)+정종(1010.02)"],
  [["기침", "가래", "코막힘"],
    "동씨침: 오호(11.27) 보/사"],
  [["간경", "눈 충혈", "눈 건조", "협늑"],
    "동씨침: 명황(88.19)+천황부(88.14) 보법"],
  [["무릎 외측", "슬관절 외측", "측두통", "편두통", "성장통", "담경"],
    "동씨침: 중백(22.06)+하백(22.07) 보법 (담허 → 신기 보강) 또는 사화중(88.12)+사화외(88.13) 사법 (담실 → 소양경 울체 해소)"],
];

function getMeridianHint(symptom: string): string | null {
  const s = symptom.toLowerCase();
  for (const [keywords, hint] of MERIDIAN_HINTS) {
    if (keywords.some((kw) => s.includes(kw))) return hint;
  }
  return null;
}

function getTungHint(symptom: string, secondary: string[] = []): string | null {
  const combined = (symptom + " " + secondary.join(" ")).toLowerCase();
  for (const [keywords, hint] of TUNG_HINTS) {
    if (keywords.some((kw) => combined.includes(kw))) return hint;
  }
  return null;
}

interface PatientInput {
  age: number;
  gender: string;
  symptom: string;
  affected_side?: string;
  secondary_symptoms?: string[];
  pulse?: string;
  tongue?: string;
  duration?: string;
  additional_notes?: string;
}

function buildUserPrompt(p: PatientInput): string {
  const meridianHint = getMeridianHint(p.symptom);
  const tungHint = getTungHint(p.symptom, p.secondary_symptoms);

  const lines: string[] = [
    "[USER REQUEST]",
    "",
    "## 환자 정보 (Patient Data)",
    `  age             : ${p.age}세`,
    `  gender          : ${p.gender}`,
    `  chief_complaint : ${p.symptom}`,
  ];
  if (p.affected_side)              lines.push(`  affected_side   : ${p.affected_side}`);
  if (p.secondary_symptoms?.length) lines.push(`  secondary_syms  : ${p.secondary_symptoms.join(", ")}`);
  if (p.pulse)                      lines.push(`  pulse           : ${p.pulse}`);
  if (p.tongue)                     lines.push(`  tongue          : ${p.tongue}`);
  if (p.duration)                   lines.push(`  duration        : ${p.duration}`);
  if (p.additional_notes)           lines.push(`  additional_notes: ${p.additional_notes}`);

  lines.push("", "## 변증 지시 (Reasoning Instructions)");
  if (meridianHint) lines.push(`  meridian_hint   : ${meridianHint}`);
  if (tungHint)     lines.push(`  tung_hint       : ${tungHint}`);
  lines.push(
    `  - 위 5단계 임상 추론 프로세스(Step 1~5)를 내부적으로 수행 후 JSON만 출력.`,
    `  - rationale에 ${p.age}세 ${p.gender} 환자의 주증상 [${p.symptom}]을 직접 언급할 것.`,
    `  - affected_side=${p.affected_side ?? "없음"} → 반대측 취혈 적용.`,
    `  - additional_notes=[${p.additional_notes ?? "없음"}] → 처방 결정에 반영.`,
    `  - 신허증(腎虛)을 기본값으로 쓰지 말 것. 경락 주행과 허실을 독립 판단.`,
    `  - 참조표에 없는 혈위 절대 사용 금지.`,
    `  - tung_acupuncture.points 배열에 동씨침 특효혈 반드시 1개 이상 포함 (빈 배열 금지).`,
  );
  return lines.join("\n");
}

interface Env {
  GEMINI_API_KEY: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok" }, { headers: CORS_HEADERS });
    }

    if (url.pathname === "/" && request.method === "GET") {
      return new Response(HTML_PAGE, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === "/prescription" && request.method === "POST") {
      let patient: PatientInput;
      try {
        patient = await request.json<PatientInput>();
      } catch {
        return Response.json(
          { detail: "Invalid JSON body" },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      if (!patient.age || !patient.gender || !patient.symptom) {
        return Response.json(
          { detail: "age, gender, symptom are required" },
          { status: 422, headers: CORS_HEADERS }
        );
      }

      const userPrompt = buildUserPrompt(patient);

      const geminiBody = JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
          candidateCount: 1,
        },
      });

      let geminiRes: Response | null = null;
      let lastErrText = "";
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise((r) => setTimeout(r, attempt * 2000));
        geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${env.GEMINI_API_KEY}`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: geminiBody }
        );
        if (geminiRes.ok) break;
        lastErrText = await geminiRes.text();
        if (geminiRes.status !== 503 && geminiRes.status !== 429) break;
      }

      if (!geminiRes!.ok) {
        return Response.json(
          { detail: `Gemini API error: ${lastErrText}` },
          { status: 502, headers: CORS_HEADERS }
        );
      }

      const geminiData = await geminiRes.json<GeminiResponse>();
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return Response.json(
          { detail: "Empty response from Gemini" },
          { status: 502, headers: CORS_HEADERS }
        );
      }

      try {
        const prescription = JSON.parse(text);
        return Response.json(prescription, { headers: CORS_HEADERS });
      } catch (e) {
        return Response.json(
          { detail: `Gemini returned invalid JSON: ${e}` },
          { status: 502, headers: CORS_HEADERS }
        );
      }
    }

    return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
  },
};
