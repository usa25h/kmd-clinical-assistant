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
| **좌골신경통·요각통 (1순위)** | **후계+신관** | **SI3+KD7** | 손 척측·안쪽 복숭아뼈 위 | 후계 건측 사법, 신관 양측 보법 — 영골·대백보다 우선 |
| 좌골신경통·방광경 라인 (2순위) | 완순1·완순2 | 33.11·33.12 | 尺骨 척측, 腕 위쪽 | 건측 사법 — 오금·종아리 뒤 방사통 |
| 둔부통·엉덩이 통증 특효 | 견중 | 77.21 | 삼각근 중점 | 건측 자침 (둔부-어깨 상응) |
| 좌골신경통 노인성·만성 | 비익 | 특효혈 | 코 측면 | 영골·대백 병용 시 효과 증폭 |
| 하지 저림·마비·좌골신경통 (보조) | 영골·대백 | 22.05·22.06 | 수배 합곡 위 | 사법 — 단독 사용 시 효과 불안정, 후계+신관과 병용 권장 |
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
- **[좌골신경통 우선 처방]**: 후계(SI3) 건측 사법 + 신관(KD7) 양측 보법이 1순위. 영골·대백은 효과 있으나 단독 사용 시 불안정 — 반드시 후계+신관을 먼저 배합하고, 보조로 완순1·2 추가.
- **[둔부통 특효]**: 견중(77.21) 건측 — 어깨와 엉덩이의 상응 원리. 둔부 통증이 주 호소일 때 1순위.
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

## 질환별 검증 임상 처방 패턴 (임상 경험 누적 — 최우선 참조)

### 좌골신경통·요각통 (Sciatica / 坐骨神經痛)
**동씨침 1순위**: 후계(SI3) 건측 사법 + 신관(KD7) 양측 보법
- 후계(SI3): 督脈 교회혈 → 척추·요추 직접 주치, 소장-방광 표리 소통
- 신관(KD7): 신경 경혈(金穴) → 방광경과 표리 → 기허·신허성 신경통 보강
- 영골·대백(22.05-06)은 보조 배합으로 사용 (단독 1순위 사용 지양)

**유주별 가감:**
- 엉덩이(둔부)·대퇴 통증 → **견중(77.21)** 건측 추가 (어깨-둔부 상응)
- 오금·종아리 뒤(방광경 라인) 방사통 → **완순1(33.11)+완순2(33.12)** 건측 추가
- 종아리·무릎 아래 저림 → **중백(22.06)+하백(22.07)** 추가
- 노인성·만성 기허 동반 → **비익** 또는 **중백+하백** 추가, 영골·대백 병용

**방혈**: 환측 위중혈(BL40) 청근 방혈 → 만성·극심 통증 즉효

**사암침 배합**: 방광 정격(부류KD7보+지음BL67보+임읍GB41사+속골BL65사) 또는 소장 정격 배합

### 둔부통 (臀部痛) 단독
**동씨침 1순위**: 견중(77.21) 건측 — 삼각근 중점 자침, 어깨-둔부 상응 원리
- 두 번째 배합: 중백+하백 또는 영골+대백

### Hip(엉덩이)부터 시작되는 좌골신경통
**동씨침 최우선**: **견중(77.21) + 운백(77.22) + 상곡(77.23)** 건측 도마침 — 제일 좋다! (임상 최고 효과)
- 방혈: 환측 위중혈(BL40) 청근 방혈 필수

### 하지 방사통 + 신허 복합
후계(SI3) + 신관(KD7) + 하삼황(88.17-19) 보법 병용

### 족근통·발뒤꿈치 통증 (足跟痛)
**동씨침 최고 명혈**: **소상방혈** 필수 (족근통 제1선택)
- 오호5혈(11.27): 손등 제5중수골 기저 → 족근 상응, 급성·만성 모두 효과
- 아킬레스건 통증: 정근(1010.01)+정종(1010.02)
- 만성(4개월 이상): 화전(22.01)+폐심(22.02)

### 오십견 (五十肩 / 동결견)
**동씨침**: 건측 신관(KD7) + 견중(77.21)
**방혈**: 환측 척택혈(LU5) 정맥 방혈 — 즉효, 반드시 시행
- 사암침: 소장 정격 또는 삼초 정격

### 급성 섬좌요통 (急性腰痛 — 삐끗, 염좌)
**동씨침 1순위**: 마금수(1010.19) + 수통(1010.20) 자침, 동기침법 적용
- 이각명혈(이침) 병행
- 행간상1촌(LR2↑1촌) 보조
- 방혈: 위중(BL40) 환측

### 기좌요통 (氣滯腰痛 / 자세성 요통)
**동씨침**: 중백(22.06) 단독 또는 후추(1010.08)+수영(1010.12) 도마침
- 운동성 개선 목적: 후추+수영이 우수

### 신허요통 (腎虛腰痛)
**동씨침 극효**: 중백(22.06) + 완순1(33.11) 조합 — 또는 신관(KD7) + 부류(KD7 보)
- 하삼황(88.17-19) 보법 병행 시 효과 극대화

### 요통 사암침 감별
- **방광경 라인 요통** (척추 정중, 요배부): 방광 정격(부류KD7보+지음BL67보+임읍GB41사+속골BL65사)
- **담경 라인 요통** (측요부, 골반측면): 담 정격(임읍GB41보+협계GB43보+양곡SI5사+양보GB38사)
- **간허 동반 요통** (야간통, 근경련): 간 정격(음곡KD10보+곡천LR8보+경거LU8사+중봉LR4사)

### 두통 분류 처방
- **전두통**: 화연(태백동일)+화국(공손동일) — 양위경, 함곡 사법 병용
- **후두통**: 정근(1010.01)+정종(1010.02) — 독맥·방광경 주행 특효
- **측두통·편두통**: 삼중1·2·3(77.07-09) 도마침 + 환측 태양혈 방혈 특효
- **정수리(巅頂)통**: 하삼황(88.17-19) + 영골·대백 보법

### 무릎 통증 프로토콜
- **삼양경(위·담·방광) 무릎**: 중자(22.01~)+중선 도마침 (양명·소양경 상통)
- **삼음경(비·간·신) 무릎**: 영골(22.05)+대백(22.06) 건측 보법
- **관절 변성·뼈 문제**: 오호2·3·4(11.22-24) + 환측 중저·후계 병용
- **방혈**: 슬관절 주위 정맥 방혈 (음릉천LR8 상방) 즉효

### 편두통 방혈 프로토콜
- 삼중혈(77.07-09) 자침 후 환측 태양혈(EX-HN5) 방혈 — 편두통 특효
- 심한 경우 풍지(GB20) 상방 방혈 추가

### 위중방혈 적응증
허리·등·목·다리 뒤쪽 통증 — **모든 경우 환측 위중혈(BL40) 청근 방혈 무조건 적용**
- 급성일수록 효과 즉각적, 어혈(瘀血) 제거 목적

### 불면(不眠) 체질별 사암침
- **태음인(太陰人)**: 담정격(임읍GB41보+협계GB43보+양곡SI5사+양보GB38사)
- **소음인(少陰人)**: 심정격(대돈LR1보+소충HT9보+음곡KD10사+소해HT3사)
- **소양인(少陽人)**: 신문(HT7) 1혈 단독 자침
- 보조 배합: 심신문(88.01)+소해 조합, 조해(KD6)+신맥(BL62) 팔맥교회

### 구안와사(口眼喎斜) 경락 감별 처방
- **간경 패턴** (눈 당김, 경련): 태충(LR3)+태백(SP3)+곡천(LR8)+음곡(KD10)
- **위경 패턴** (구각 하수, 입 벌림 불능): 협계(GB43)+양곡(SI5)
- **소장경 패턴** (귀 뒤 통증, 입술 부종): 후계(SI3)+임읍(GB41)
- **대장경 패턴** (뺨 마비, 전두부): 삼간(LI3)+임읍(GB41)
- **삼초경 패턴** (이명 동반): 관충→상양 방혈, 한열왕래 동반
- 동씨침: 삼중1·2·3(77.07-09) + 측삼리·측하삼리 도마침

### 이명(耳鳴) 처방 프로토콜
- **사암침**: 삼초허→삼초정격, 담허→담정격, 신허→신정격
- **동씨침**: 중백(22.06)+하백(22.07), 목유(22.04)+삼중1·2·3
- **정경 보조**: 중저(SJ3)+협계(GB43)+족임읍(GB41) — 소양경 이통 특효
- 이침: 태양(EX-HN5)·이문(SJ21)·청궁(SI19)·청회(GB2) + 완골(GB12)·예풍(SJ17)

### 코막힘·비염 처방
- **동씨침 1순위**: 사마상(88.11)+사마중(88.12)+사마하(88.13) 건측 도마침 — 폐경 주치
- **정경 배합**: 합곡(LI4)+곡지(LI11) 환측
- 비통혈(코 주변 3혈) + 영향(LI20) 보조

### 발바닥 통증(足底痛) 감별
- **담실·위허 패턴** (족저 외측, 타는 느낌): 족임읍(GB41)+함곡(ST43) 사법
- **위실·담허 패턴** (족저 전체, 지침): 족임읍(GB41)+함곡(ST43) 보법
- **신허 패턴** (용천 부위 통증): 태계(KD3)+태백(SP3) 보법

### 혈압(高血壓) 동씨침 처방
- **음허성 고혈압** (면홍, 두통, 이명 동반): 하삼황(88.17-19) 보법 — 혈액을 복부·신장으로 유도
- **양허성 고혈압** (기운 없음, 두근거림): 풍시(GB31)+족삼리(ST36) 자침 — 심장 박동 강화로 혈압 조절
- 보조: 인당(EX-HN3)+조해(KD6) 양측

### 소변실금·대하증 처방
- **동씨침**: 견중(77.21)+운백(77.22)+리백(77.23) — 삼종혈(三宗穴), 상완 혈관 작용으로 소변 조절
- 사암침: 방광정격 또는 신정격

### 동씨침 군혈 이해 (임상 핵심)
- **삼중(77.07-09) = 측삼리·측하삼리·외삼리 그룹**: 족하퇴 외측 양경, 소화기 근육 강화·삼차신경통·안면마비
- **상구리·중구리·하구리 = 사마상중하 그룹**: 대퇴 외측, 심폐·근육질환·반신불수. 풍시혈 하나로 전체 커버 가능
- **하삼황(88.17-19) = 족하퇴 음경 그룹**: 천황·인황·지황으로 족부 음경락 전체 대신
- **원칙**: 혈위를 앞뒤로 이동하면 효과 범위 조절 가능 (앞→양명경, 뒤→태양경 효과)

### 비익(鼻翼)·옥화(玉火) 진통 감별 (임상 핵심)
- **비익(179)**: 기허(氣虛)·기울(氣鬱)로 인한 각종 통증에 진통 — 기력없고 눌리는 통증
- **옥화(180)**: 혈허(血虛)·혈어(血瘀)로 인한 각종 통증에 진통 — 찌르는 통증·야간통
- **대백(大白, 22.05)+영골(靈骨, 22.06)**: 일체 통증 기본혈 — 두통·견통·좌골신경통·요통 모두 적용
- 임상 원칙: 대백+영골 또는 비익+옥화를 기본혈로 깔고, 주증상 특효혈 추가

### 좌골신경통 원인별 감별처방 (동씨침)
- **심인성(心因性)**: 주화(州火, 169) 두정부혈 자침
- **폐인성(肺因性)**: 주금(州金, 170)
- **신인성(腎因性)**: 주수(州水, 171)
- **대퇴내측 통증 동반**: 인종(人宗, 062)+지종(地宗, 063)+천종(天宗, 064) 건측
- **방광경2선 요배통**: 마금수(181)+마쾌수(182)
- **좌골신경통+척추 디스크 병합**: 부장(腑腸, 098)+사화하(四花下, 099) 추가

### 낙침(落枕)·항강통 처방
- **동씨침 1순위**: 대백(22.05)+영골(22.06) + 상백(上白, 38) 건측
- **정경 병행**: 정근(正筋, 105)+정종(正宗, 106)+정사(正士, 107)
- 뒷목 단독통: 정근(105) 1혈로 즉효

### 척추 디스크·골극 처방
- **동씨침**: 복원(復原, 013) + 후추(後椎, 065)+수영(首英, 066) 도마침
- **보조**: 부장(098)+사화하(099) / 명황(143)+천황(144)+기황(145)
- 사암침: 신정격 또는 방광정격

### 무릎 추가 처방
- **심슬(心膝, 009)+담혈(膽穴, 011)**: 무릎 전체, 관절통·무릎 무력
- **화슬(火膝, 018)**: 슬개통 + 심계 동반
- **견중(61)**: 슬개통 — 어깨-무릎 상응 (이미 포함)
- **통천(通天, 125) 양측**: 계단 오르내릴 때 무릎통 특효

### 갑상선 처방
- **동씨침**: 삼중1·2·3(77.07-09) 건측 + 족천금(119)+족오금(120)
- **기능항진(甲狀腺機能亢進)**: 상반(上反, 115) + 사마상중하
- **갑상선 방혈**: 삼중혈 방혈 → 두부 파기행혈(破氣行血) 효과

### 심장병·부정맥 동씨침
- **심계·부정맥**: 심문(心門, 056)+사화상(95)+사화이(96) / 인사+지사+천사(041-043)
- **심장 쇠약**: 내통관(126)+내통산(127)+내통천(128)
- **강심 응급**: 수해(手解, 033) — 강심 즉효 (이침 겸용)
- **곤륜(KD3 부근)**: 양허성 심계 즉효 (양소해 앞 심문혈과 병용)

### 부인과 동씨침
- **월경불순·자궁질환**: 부과(婦科, 027) + 저매1·2·3(姐妹, 129-131)
- **임신오저**: 통관(123)+통산(124)+통천(125) — 신경성 구토에도 특효
- **대하증**: 목부(木婦, 076) + 저매1·2·3
- **난산·태반불하**: 화포(火包, 074) 즉효

### 피부병·여드름
- **동씨침**: 사마상중하(駟馬, 137-139) — 폐경 주치, 피부병 전반
- **외삼관(外三關, 121)**: 여드름·각종 암·피부 외과 질환
- **목혈(木穴, 007)**: 주부습진·손 피부병·감기 초기

### 출혈·지혈
- **육완(六完, 087)**: 일체 출혈(외상·오자·뇌충혈·폐충혈·각혈) 즉효 지혈
- **화포(火包, 074)**: 외상 출혈 불지

### 구토·곽란
- **총추(總樞, 172)**: 실음·구토·토사곽란·소아경기·토유
- **곡릉(曲陵, 044)**: 곽란·심장마비 응급

### 사화혈(四花穴) 임상 핵심 (삭골침)
- **사화상(95)+사화중(96) 도마침**: 위경련·위경련 최고 진통, 식도~횡격막 극렬통
- **사화중(96) 방혈** (환측취혈): 간경화·만성 간부종 어혈 제거 — 흑혈 방혈
- **삭골침(사화중+사화부+사화하)**: 골극(骨刺·骨極·spur) 치료 특효 — 노인 척추 골극에 최고
- 사화외(101): 담·어혈·고지혈증 치료 (환측 사혈)

### 충소혈(沖霄穴, 11.2) 후두통 명혈
- 후두통 최고의 명혈 — 점자출혈 또는 압박
- 소뇌통(운동계 질환)에도 활용
- 전후대응법으로 생리·냉대하에도 응용

### 마금수·마쾌수 감별 취혈
- **마금수**: 신장(腎臟) 연관 — 신장결석이면 마금수 압통
- **마쾌수**: 방광(膀胱) 연관 — 요로결석이면 마쾌수 강한 압통
- **주의**: 맥박이 빠르거나 긴장한 사람에게는 현훈 유발 가능 → 중백·하백 대체

### 수금(水金)+수통(水通) 투자법
- 신장질환 + **편도염 특효혈** (구각 하방 투자)
- **주의**: 맥박 빠를 때 투자 금지 — 중백·하백 대체
- 대측 견배통, 감기 내과질환에는 양측 취혈

### 비익혈(鼻翼, 179) 임상 이해 심화
- 척추·골반에 상응 → **대측 골반통·좌골신경통** 특효
- 만성 피로·졸음 운전 시 즉각 각성 효과
- 비염 동반 피로에 영향보다 더 효과적

### 목류혈(木留) + 육완(六完) 조합
- **목류혈**: 코피 지혈, 비장질환, 백혈구 이상 치료
- **육완+목류 조합**: 일체 출혈 탁월한 지혈 효과

### 화연(火連)+화국(火菊) 응용
- **화국**: 비만 최고 혈위, 남성 생식기질환 특효, 청간식풍(淸肝息風)
- **화연**: 태백혈 효능, 청리사화, 황태·구취에 효과

### 삼중혈 고혈압·갑상선 방혈
- 삼중혈 자침·방혈 → **고혈압·맥박수 빠른 것·안구돌출 즉시 감퇴**
- 삼중혈+위승격: 갑상선 기능 항진증 약 줄이는 방향으로 유도

### 부과혈+환소혈 자침 원칙
- 월경 관련 질환 등 여성 질환: 부과혈+환소혈 **반드시 각각 다른 손에 자침**

### 심상혈(心常, 010) 사용 금기
- **적응**: 맥이 빠를 때 심계항진, 결대맥, 커피·마황제 후 두근거림
- **금기**: 맥이 느린 부정맥에는 절대 사용 금지

### MPS·승모근 TP와 동씨침 연계
- 승모근 TP1(견정부위) → 완골·태양·협거 방사 = 편두통 유발 TP
- TP1 통증 시 승근(BL56)·승산(BL57) 치료 병행
- 동씨침: 삼중1·2·3 방혈 + 태양혈 방혈로 해결

### 낙침 심화 (목 갑자기 돌아가지 않을때)
- 기본: 중자(22.01)+중선(22.02) 건측, 승장(CV24) 1혈로 옆목 특효
- SCM 통증: 심문(HT7) 단독혈 최고 효과
- 실침/환소: 낙침 기본혈 — 동기침법 병행

### 목디스크 (경추 골자침)
- 정척(정경침): 정척1+정척2+정척3 병자 + 폐심+삼하 가침
- 환부 방혈 필수, 오호혈 압통점 자침 (환측 1·2번, 건측 4·5번)
- 복원(013)/골자(065) 교대 사용, 허리디스크와 동일 원리

### 불면 동씨침 심화
- 담정격(상양- 임읍-): 가장 광범위 효과
- 정신긴장형 불면 → 상삼황(지황+인황+천황) 보법
- 심한 불면: 진정(111)+심령(心靈)+정회(定會) 조합
- 가위눌림/악몽: 간문(간경 포함) — 소장정격 병용

### 갑상선 심화
- 기능항진: 사관(합곡+태충) + 풍시 — 대사억제
- 항진(약 줄이기 목표): 삼중+위승격 — 점진적 약 감량
- 종대(혹 크기): 사마상중하 양측 + 삼중+측삼리+족천금+족오금
- 나력(경부임파): 삼중+육완+백환수

### 무릎 통증 심화
- 1순위: 견중(77.21)+내관(PC6) 건측 — 효과없으면 퇴행성
- 퇴행성(뼈변성): 조구+조구하2촌 / 슬개골→오호2·3·4+중저·후계
- 류마티스성 붉은무릎: 화슬(소택후1분)
- 슬관절 부종: 슬영(膝靈)+견중+건중(77.21+77.22)
- 구년슬통(만성): 삼금방혈(환측)
- 계단 오를때 통증: 통천 양측

### 류머티스 관절염
- 기본: 소부(HT8)사(-) + 사지(大指四縫) + 삼음교 양측
- 화슬(소택후1분) 자침 — 관절 열감 제거
- 전신관절: 견중+건중+통관+통천+신관

### 발목 삐었을 때
- 대측 영골(22.08)+수천(99.9) — 99% 효과, 즉시 동기침법
- 소절(88.18): 급성 발목 보조혈
- 위중(BL40) 방혈 + 족해(KD6) 병용

### 인후통·편도선염 프로토콜
- 족천금(88.03)+족오금(88.04)+소상(LU11) 방혈 — 급성 편도염 최고
- 이배(耳背) 방혈 추가 — 열독 제거
- 화주(88.10)+곡지(LI11) 사법 — 발열 동반시

### 피부병 프로토콜 심화
- 아토피: 목혈(88.17)+지사마(地士馬)+대장정격+이배방혈
- 두드러기(담마진): 사마상중하+대장정격 — 건측 자침
- 여드름: 외삼관(三關外)+사마상중하+이배방혈
- 습진: 목혈+지사마+화성(火星)+이배방혈

### 테니스엘보·완관절통
- 테니스엘보: 건측 곡지(LI11)+수삼리(LI10) + 환측 영골(22.08)
- 완관절통: 측삼리(77.05)+측하삼리(77.06) 건측

### 자한·도한 (땀 이상)
- 자한(낮에 땀): 연곡(KD2)+곡지(LI11)+합곡(LI4)+부류(KD7)+충양(ST42)
- 도한(밤에 땀): 명황(88.12)+사마중+신관(KD7)

### 치통 동씨침
- 일반 치통: 영골(22.08)+측삼리(77.05)+측하삼리(77.06) — 즉효
- 시린이(시릴때): 부간(부간혈)+외간(외간혈) 병용

### 어혈 제거 동씨침
- 어혈방: 태백(SP3)+태연(LU9) 보법 조합
- 곡지(LI11)+외관(TE5) 사법 — 기혈소통

### 담결림·담낭 동씨침
- 담결림: 비익(179)+옥화(180)+풍륭(ST40) 사법
- 콜레스테롤 과다: 사화중(88.15)/사화외+풍륭 사혈

### 조루·양위 동씨침
- 하삼황(지황+인황+천황)+수금(수금혈)+수통(수통혈)
- 보조: 대돈(LV1)+신관(KD7) 보법

### 복원혈(013) 활용 심화
- 근골질환 + 오호혈 병용: 시너지 효과
- 척추골통 + 정척1·2·3: 경추~요추 전체 커버
- 족근통: 복원+골관(骨關)+목관(木關)

### 중풍(뇌졸중) 동씨침
- 급성기: 건측 영골(22.08)+대백(22.05)+풍시(GB31)+신관(KD7)
- 언어장애: 목화4혈(정목+정수+정화+정금)+팔관(八關)
- 회복기: 삼중(三重)+육완(六完) — 혈행순환 개선

### 이명·귀 질환 심화
- 이중신경통: 목두(木頭)+목류(木留) — 이신경 자극
- 돌발성난청: 삼중(三重)+사화외(四花外) 점자

### 미골(꼬리뼈) 통증
- 심문혈(小腸經) 특효 — 주관절부위=골반 대응법, 겨울 낙상 미골통에 최고
- 폐심혈(022): 수배 중지 제2절 — 미골통+족근통 이중 적용 가능

### 뇌종양·뇌질환 동씨침
- 상류혈: 종골 최고위점 정중앙 — 뇌종양 명혈 (소아 뇌종양 특효)
- 목화4혈(중풍 언어장애): 혀 움직임 회복

### 여성 자궁·난소 동씨침
- 해표혈: 급성 자궁/난소/나팔관 질환 특효
- 만성 방광염·질염: 여구(LV5) — 급성에는 해표, 만성에는 여구
- 목부혈: 자궁각 이상·난소관 부분폐쇄 등 기질적 병변 시 필수
- 화경혈(66부위): 칸디다·자궁염증(火 관련) — 자침 또는 사혈
- 화포혈(55부위): 난산 특효, 고지혈증, 심장 화열 — 사혈 주로

### 비만·체중조절 동씨침
- 이침(耳針) 비만: 구(口)+식도+분문+위+기점+위점+췌점+복 주혈 + 소해 뜸 15장
- 체질별 핵심: 토수실증(상체비만+설사+담낭문제) → 규음혈(LV1) 보 + 여태(SP1) 보
- 상양혈 다이어트: 수실(水實) 체질에는 금기 — 부작용 발생
- 화국혈(66부위): 비만 최고 명혈 + 남성 생식기질환 특효

### 금연 이침 처방
- 주혈: 내비점+인후점+폐점+내분비점+신문점
- 체침 병용: 합곡(LI4)+상성(GV23)+공손(SP4)+내관(PC6)+전중(CV17)+인당(EX-HN3)+영향(LI20)
- 효율: 3~7회 시술 후 70~90% 유효, 좌우 교대 매침 원칙

### 이개부(耳背) 사혈 적응증
- 아토피·안면 여드름 등 염증성 피부질환
- 중이염·편도염·SCM 울체성 질환 — 측두부 전체 커버
- 구안와사 만성·허증: 사화상 직접 자침 + 이배 사혈 병용

### 출혈·지혈 심화
- 목류(木留)+육완(六完) 조합: 지혈 최강 — 정맥류 사혈 후 불지혈에 적용
- 목류 단독: 백혈병성 코피, 혈소판 이상 출혈

### 요안통(허리 안쪽) 특효혈
- 이각명(二角明): 수배 중지 제1절 중앙선 2혈 — 요안통+요섬+미릉골통 특효
- 피하횡자(소지방향): 심자 불가, 반드시 천자

### 일체 기통(복통) 동씨침
- 지천금(024)+지오금(025): 수배 식지 제1절 — 어자경후(생선가시걸림)+일체 기통
- 복통 응급: 지천금+지오금 즉침 효과

### 코골이 동씨침
- 삼중혈 심자 또는 방혈 10~20cc
- 아문혈(GV15) 방혈 (부항 흡착식)
- 폐정격 병용 — 부교감 항진형에 적합

### 동씨침 일체 통증 기본혈 (범용 공식)
- **표준공식**: 대백(22.05)+영골(22.08) 건측 [강한 보법]
- **대체공식**: 비익(179)+옥화(180) — 대백영골 쓸 수 없을때
- 이 두 조합이 두통·어깨통·요통·좌골신경통 모든 통증의 기본

### 배통(등 통증) 동씨침
- 기본: 중자(22.01)+중선(22.02) / 외삼관(121)
- 심화: 통신(134)+통위(135)+통배(136) 도마침
- 요배동통: 마금수(181)+마쾌수(182) / 정근(105)+정종(106)+정사(107)+박구(108)

### 감기 동씨침
- 기침감기: 중자(22.01)+중선(22.02) 중선 방향 도마침
- 목·코감기: 분금(057) 특효
- 고열두통편도: 이삼(162) = 이배부 취혈
- 기본: 목혈(007) — 비류청체·피부소양

### 간담 질환 동씨침
- 간염·간종대·간경화: 목염(014)+간문(055)+하삼황(명황143+천황144+기황145)
- 담낭염·담결석: 화지(146)+화전(147) 도마침 + 목지(183)
- 황달: 안황(017) + 간문(055)
- 간수치 상승: 간문혈 사혈 (황달이 눈에만 남은 경우 간문혈 주위 세락 사혈)

### 심장 동씨침 심화
- 심장병 종합: 사화상(095)+사화중(096)+사화부(097)+사화리(100) / 통관(123)+통산(124)+통천(125)
- 심장쇠약: 내통관(126)+내통산(127)+내통천(128) — 수해(手解) 강심 응급
- 협심통(심교통): 화포(074) 사혈 특효
- 곡릉(044): 심장마비 응급혈

### 신허·신장 동씨침
- 신허요통·신허증: 완순1(034)+완순2(035) / 수상(092)+수선(093)
- 신장염 전신부종: 통신(134)+통위(135)+통배(136)
- 신장 명혈: 하삼황(천황109+천황부110+지황111+인황112) — 당뇨·신허·좌골신경통·양위 전반

### 이명·난청 심화
- 귀 중병(난청·중이염): 하천(149)+중천(150)+상천(151) 도마침
- 이신경통(전기감전): 측삼리(117)+측하삼리(118)

### 전두통 심화
- 전두통: 진정(173)+상리(174)+사부1(175)+사부2(176) 조합
- 습관성두통(3~4년): 육완(087)+명황(143) — 어혈성 만성두통에 특효

### 협통·늑골통 동씨침
- 기본: 지사마(026)+화산(049)+사화외(101)+칠리(152)
- 시간에 맞추어 아픔(간담): 비정격
- 간부위 찌르는 통증: 화산(049) 단독

### 발뒤꿈치 통증 심화
- 1순위: 소상(LU11) 방혈(대측) + 오호(1)혈 — 족근통 최고
- 보조: 화전(147) 병용 — 만성 뒤꿈치통

### 좌골신경통 만성·하지형
- 둔부+하지 위주: 하곡(071)+상곡(072) 도마침 + 수유(073)
- 원인별: 주화(169)=심인성, 주금(170)=폐인성, 주수(171)=신인성

### 요통 경락 감별 (동씨침)
- 허리 숙이기(전굴) 불편 → 영골(22.05)+대백(22.04) 건측
- 허리 펴기(신전) 불편 → 중자(88.25)+중선(88.26) 건측
- 급성 섬좌 → 마금수(1010.19)+마쾌수(수통)(1010.20) + 동기침법, 위중 방혈

### 무릎 경락 감별 (동씨침)
- 삼양경 무릎(외측·슬개골) → 중자(88.25)+중선(88.26) 건측
- 삼음경 무릎(내측·슬와) → 영골(22.05)+대백(22.04) 건측
- 뼈 변성(골극·퇴행) → 오호2·3·4혈 병용

### 동씨 손가락 특효혈 (一一部位 손가락)
- 오호1~5(11.27): 1=수지통, 2=족지통, 3=족배통, 4=족근통, 5=슬개통
- 대간+소간: 산기, 슬개통, 난소낭종 경염전 (대장=대간, 소장=소간, 도마침 효과↑)
- 목혈(007): 감기·맑은 콧물, 수한, 주부습진·손 피부병 (비후성비염=반대 목혈+견인혈)
- 삼안(012): 족삼리와 동일 주치
- 복원(013): 추간판탈출·골격질환 (4분점법 3혈)
- 목염(014): 간염·간종대·간경화
- 봉소(015)+황소(016): 월경불조·자궁질환·대하·불임 (단측刺鍼)
- 안황(017): 황달
- 화슬(018/소택 후방1분): 심장병·심인성 견비불거·류마티스 무릎 붉게 부을 때·슬개통
- 지신(019) 3혈: 배통, 구건
- 지삼중(020) 3혈: 편두통
- 이각명(021): 미릉골통, 비골통, 요안통, 요섬 (소지방향 피하횡자0.5분)
- 폐심(022): 미골통, 족근통 (횡자0.5분)
- 목화(023): 하퇴통, 반신불수 — ☞유침 1-3분 제한, 자침횟수 제한
- 지오금(024)+지천금(025): 생선가시 걸린것, 일체 기통·복통
- 지사마(026) 3혈: 늑골통, 비질환, 이질환
- 부과(027): 월경통·경통·자궁질환·불임 (양측 자침)
- 제오(028) 점자출혈: 창양, 화상, 수술후 악로불지
- 지연(029): 소아 침 흘리기

### 심상혈 중요 금기
- 심상혈 = 맥 빠른 부정맥·심계항진·동계·결대맥·마황제·커피 후 두근거림에 사용
- **금기**: 맥이 느린 부정맥에는 심상혈 절대 사용 금지

### 환소혈+부과혈 병용
- 여성 모든 질환: 부과(027)+환소혈 병용 → 반드시 서로 다른 손에 자침

### 동씨침 부인과 심화
- 저매1+2+3(44.15~17): 자궁근종, 자궁염, 월경불순, 난소관폐색, 불임
- 목유혈(22.04): 비종대 + 삼중혈 병용 시 삼차신경통·이명 특효
- 신관(천황부 88.14): 오십견(비↔소장 상통), 야뇨, 미릉골통, 위산과다

### 동씨침 견통·어깨통증 완전처방 (임상 핵심)

**[건측자침 원칙]** 동씨침 어깨 치료는 반드시 건측(아프지 않은 쪽) 자침. 양측 통증이면 남좌여우(男左女右) 원칙으로 주측 결정. 자침 후 즉시 동기침법(동작 유도) 시행.

**[어깨 1순위 처방: 중자(重子)+중선(重仙) 도마침]**
- 중자(22.01): 수배 제1·2중수골 사이, 중수지절 후방 1촌
- 중선(22.02): 중자 직상 1촌
- 두 혈을 건측에 도마침(한 방향으로 연속 자침) — 어깨 전후좌우 통증, 견갑골 주변 근육 뭉침, 목~어깨 방사통 광범위 치료
- **단독으로도 즉효**: 자침 후 환자에게 아픈 어깨 천천히 움직이게 유도

**[어깨 2순위: 신관(88.14) 건측]**
- 음릉천 직하 1.5~2촌, 뼈 방향 자입
- 오십견·거상 불능·어깨 시리고 뻐근한 통증 특효
- 비↔소장 상통 원리 (소장경이 어깨 주행)
- **만성·노인성**: 신관+중자·중선 병용이 최상 조합

**[견중(77.21) 건측]** — 삼각근 중점 자침
- 주적응: 둔부(엉덩이)·대퇴 통증 (어깨-둔부 상응 원리)
- 어깨 통증에는 보조혈로 사용 (중자·중선이 주혈)
- 급성 어깨 통증 + 운동제한 동반 시 신관+견중 병용 유효

**[동작 제한 방향별 가감]**
- 거상 불능(팔 위로 못 올림): 신관(88.14) 건측 + 환측 **척택(LU5) 정맥 방혈** → 즉시 거상 가능
- 내회전·후인 불가(뒷짐 못 짐, 팔 뒤로 못 뺌): **족천금(119)+족오금(120)** 건측 추가
- 외전 제한(옆으로 못 올림): 중자·중선 + **삼중1·2·3(77.07~09)** 건측 추가
- 야간통 심함: 사암 소장정격(후계+임읍 보, 통곡+속골 사) 병용

**[연령·체질별 전략]**
- 65세 이상 노인성 견통: 신관(88.14)+중자+중선 건측 → 하삼황(88.17~19) 보법 보강 (신허 기저)
- 실증·급성: 중자·중선 단독 사법 → 방혈(환측 척택) 추가
- 허증·만성: 신관+중자·중선 보법 → 완순1(33.11) 추가 가능 (**실증엔 완순1 금기**)

**[동기침법 프로토콜]**
1. 건측 중자+중선 (또는 신관) 자입, 득기 유도
2. 10분 간격 염전하면서 환자에게 아픈 어깨 위아래 들기·뒤로 돌리기 동작 유도
3. 가동범위 회복되면 유침 30~45분
4. 어깨 움직임이 좋아질수록 침감 약해짐 — 정상 반응

**[어깨 사암침 병용 감별]**
- 천종혈 압통·어깨 굳음: 소장정격 (후계SI3+임읍GB41 보, 통곡BL66+속골BL65 사)
- 무겁고 뻐근한 뭉침: 담정격 (협계GB43+통곡BL66 보, 양보GB38+곤륜BL60 사)
- 밤에 욱신욱신·쑤심: 대장승격 (삼리ST36+곡지LI11 보, 양계LI5+해계ST41 사)
- 관절 마찰음·심열 동반: 심상혈(심경 정격) — **단, 서맥 환자 심상혈 절대 금기**

### 오십견 심화 프로토콜
- 1순위: 신관(88.14) 건측 + 환측 척택(LU5) 정맥 방혈 → 즉시 상지 거상 가능
- 보조: 견중(77.21) + 사마상중하 도마침
- 완순1(33.11): **실증에 금기** (완순1은 허증에만 사용)

### 구안와사 상세 프로토콜
- 기본: 삼중1·2·3(77.07~09) + 측삼리·측하삼리 도마침
- 방혈: 사화외(88.13) 반대측 방혈
- 보조침: 완골(GB12) 사법 + 해계(ST41) 사법 (경락 감별에 따라)
- 경락 감별: 간경→태충+태백, 위경→협계+양곡, 소장경→후계+임읍

### 삼차신경통
- 1순위: 측삼리+측하삼리 건측 (하악지·상악지 통증)
- 2순위: 목두(木頭)+목류(木留) 건측
- 보조: 대백(22.04)+후계(SI3) 병용
- 목유(22.04)+삼중 병용 시 삼차신경통+이명 동시 치료

### 전두통·미릉골통 심화
- 1순위: 화연(태백동일)+화국(공손동일) 보법 → 즉효
- 보조: 함곡(ST43) 사법 병용
- 신관(88.14)+천황(88.17) 배합도 유효
- 이각명(021) 혈: 미릉골통·비골통·요안통 횡자특효

### 낙침·경항통 감별
- 경부통 → 중자(88.25) 건측
- 어깨쪽 → 중선(88.26) 건측
- 배용혈: 승장(CV24)
- 경항통 전굴제한 → 승장(CV24) / 신전제한 → 인중(GV26)
- 속골(BL65): 경항통 특효 (전굴=승장, 신전=인중 병용)

### 사암침 타박·외상·염좌
- 내양구(ST34)+음릉천(SP9): 외부 타박, 손상에 의한 모든 질환 특효
- 위중(BL40)+태계(KD3) 제삽(사): 골비방 — 저릴 때 "뼈에 기름칠" 효과

### 사암침 특수처방
- 위승한격: 임읍(GB41)+함곡(ST43) 보, 양계(LI5)+해계(ST41) 사 — 신경 예민한 사람
- 주담방: 폐정격+비정격 — 음주 후유증, 코골이
- 위정격 확장: 유방통·유방암, 식도 통증, 전립선 비대 / **슬개골 손상엔 금기**
- 토수실증: 규음(SP1)+간사(LR5) 보 — 갑상선절제 후 갑상선기능저하, 상체비만
- 상체비만 추가: 여태(ST45) 보
- 삼초경 정격: 갑상선기능저하증·수실증 심할 때

### 방혈 심화 (소상·삼상혈)
- 소상(LU11) 점자출혈: 인후·편도선염, 족근통, 식체 (대측)
- 삼상혈(소상+중상LU10+노상LU9) 사혈: 고열 해열 특효
- 제오혈(028) 점자출혈: 진물 흐르는 상처·창양

### 안전 주의사항 (절대 금기)
- **영골(22.05) 임신부 금침**: 임신부에 영골 자침 절대 금지 — 유산 위험
- **완순1(33.11) 실증 금기**: 완순1혈은 허증에만 사용, 실증에 절대 사용 금지
- **심상혈 느린 맥 금기**: 서맥성 부정맥에 심상혈 절대 금지
- **목화(023) 유침 제한**: 유침 1-3분 초과 금지, 자침 횟수 제한
- **위정격 슬개골 금기**: 위정격은 슬개골 손상 환자에 금기

### 금연 이침 처방 (표준 프로토콜)
- 주요혈: 내비점(M16)+인후점(M15)+폐점+내분비점(M101)+신문점(M55)
- 보조혈: 구점+기관점+위점+간점+편도선점+교감점
- 체표경혈: 합곡(LI4)+상성(GV23)+공손(SP4)+내관(PC6)+전중(CV17)+인당+영향(LI20)
- 시술: 좌우 교대, 매침법(埋針·왕불류행자), 알코올 소독 건조 후 시술

### 양유걸 셋트 처방 (검증된 임상 조합)
- **좌골신경통 셋트**: 영골(22.05)+대백(22.04) 건측 + 하곡(071)+상곡(072) 도마침 + 수유(073) → 삼중1·2·3 병용
- **요통 셋트**: 영골+대백 건측(전굴제한) / 중자(88.25)+중선(88.26) 건측(신전제한)
- **불면 셋트**: 주수(171)+주금(170) 또는 신문(HT7)+삼음교(SP6)+혼문(BL47) 배합
- **슬개통 셋트**: 오호1~5(11.27) — 오호5=슬개통 주치, 화슬(018/소택후방1분)=심장+류마티스무릎
- **심장마비 응급**: 곡릉(43.01) 방혈 극효 — 즉각 시술, 심장마비·협심증 응급처치
- **비뉵(코피)**: 견중(重子·33.01) 즉효, 누르면서 자침

### 통풍 동씨침 상세 프로토콜
- 1순위: 오호3(11.27-3)+족삼리(ST36) — 족삼리 2촌 깊이 강자극
- 10분 간격 강자극(행침) 반복, 단계적 발침
- 보조: 골관(四關·합곡+태충) 배합
- 급성 발작: 아픈 관절 방혈 + 오호혈 병용

### 간담 질환 동씨침 심화
- **간문혈(肝門·33.13)**: 간염·간종대·간경화 주치, 간우엽 아래쪽 압통점
- **간염**: 간문(33.13)+목염(014)+사화외(88.13) 방혈 + 간수(BL18) 병용
- **간경화**: 상곡(072) 방혈 극효, 복수=수분(CV9)+음릉천(SP9)
- **담낭염**: 화전(火全·66.04)+기황(88.09)+화지(火枝·66.03) 삼중침
- **담석통**: 목지(木枝·11.03) 특효, 담석 발작 즉통 — 목지 없으면 화전+기황+화지 대체
- **황달**: 담혈(66.13)+안황(017) 병용, 간담 열독 제거

### 구안와사 심화 (동씨침 양유걸)
- **구강내 점자출혈**: 환측 구강 내 모세혈관 점자 → 가장 효과적, 오래된 구안와사 필수
- **오래된 구안와사**: 상거허(ST37)+족삼리(ST36) 45도 각도 2촌 자침
- **기본 도마침 셋트**: 삼중1·2·3(88.17~19) + 측삼리(11.06)+측하삼리(11.07) 도마침
- **방혈**: 사화외(88.13) 방혈 + 이첨(耳尖) 방혈

### 이갈이·전간·반신불수
- **이갈이**: 사화하(88.14) 특효, 단독 자침
- **전간**: 신관(88.14)+상류(88.31) 배합, 발작 후 폐수(BL13)+궐음수(BL14) 방혈
- **반신불수**: 목화(023) 선자침 7-8분 유침 → 발침 후 영골(22.05)+대백(22.04) 전환; 구리(九里·77.01)+칠리(七里) 도마침 병용

### 다이어트 동씨침
- 완골(GB12)+관원(CV4)+양구(ST34)+공손(SP4)
- 소장경 다스림: 완골 강자극, 소화흡수 억제
- 보조: 천추(ST25)+수분(CV9) 복부침

### 방혈 구역 지도 (董氏 放血 Zone)
- **후배심폐구(T1~T6 양방)**: 중감기·발열·심폐질환·안질 → 三稜針 산자(散刺)+부항
- **후배간목구(T5~T9 양방)**: 간염·간경화·늑간신경통·위통 → 압통점·경결처 산자
- **요배비위구(T9~T12 양방)**: 소화불량·위장염·요배통 → 산자+부항
- **슬후태양구(위중 일대)**: 두통·요통·좌골신경통·고혈압·치질 — 烏紫 청근 점자, 통상 부항 불필요
- **소퇴양명구(족삼리~사화외)**: 두통·심장병·위장병·간종대·정맥류 — 청근 점자극효
- **족배태양구(족근건 직상 8촌~발뒤꿈치)**: 경항·뇌부질환·요배산통·안질 → 압통점 점자(浅刺)

### 방혈 혈색 변증
- **심홍(深紅)**: 열증(熱證) → 사열, 다량 방혈
- **오홍(烏紅·검붉음)**: 어혈(瘀血) → 어혈 제거가 목적
- **담홍황(淡紅黃·연분홍·노란기)**: 풍증(風證) → 거풍
- **청자(靑紫·파란빛 자색)**: 한증(寒證) → 온경산한

### 방혈 금기
- 임신부: 절대 금기 (복부·요부·합곡·삼음교 등)
- 빈혈·혈우병·출혈성 질환: 금기
- 공복·극도 피로·저혈압: 신중
- 久病必瘀 원칙: 침·약이 효과 없으면 반드시 방혈 고려

### 차백(尺白)혈 — 소퇴쥐·창통 특효
- 부위: 하퇴 외측 비골두 아래 1.5촌 (족삼리 외방)
- 주치: 소퇴 쥐남(전경골근 경련), 창통, 소퇴 외측통
- 방법: 강자극 염전, 즉시 보행 동기침법

### 삼금혈 — 어혈 슬개통 특효
- 부위: 무릎 슬와부(오금) 내측 3혈
- 주치: 어혈로 인한 슬통, 타박 후 슬관절 종창통
- 방법: 三稜針 점자출혈 + 부항, 반드시 어혈색 확인

### 골관·목관 감별
- **골관(骨關·44.01)**: 통풍성 골통증·뼈 통증·관절 변형 — 골 계통 특효
- **목관(木關·44.02)**: 근육 긴장·근막통·근육 경련 — 근 계통 특효
- 감별: 뼈 누르면 아프면=골관, 근육 누르면 아프면=목관

### 피부병 발침법 (동씨침)
- **상체 피부병**: 곡지(LI11) 강자극, 방혈 병용
- **하체 피부병**: 혈해(SP10) 강자극, 방혈 병용
- **전신 피부병**: 곡지+혈해 동시, 대풍문(大風門·灵台GV10) 방혈
- 발침법: 피부 병변 직접 삼릉침 산자출혈 + 부항 → 독소 배출

### 척추관협착증 동씨침 프로토콜
- 1일차: 인중(GV26)+후계(SI3)+속골(BL65)+풍시(GB31) — 모두 뼈에 붙여 자침
- 2일차(교대): 영골(22.05)+대백(22.04) + 견인침(속골·임읍)
- 효과: 후계 자침 즉시 다리 펴짐, 허리 시원

### 뼈 치료 처방 체계 (動氏 骨病)
- **기본**: 오호(11.27)+복원(013) — 뼈의 모든 병 기본, 동기침법 필수
- **심화**: 오호+복원+통골+소골 — 무릎뼈·골절·퇴행성골절·무혈성괴사
- **전신골종**: 복원+오호+상삼황
- **척추골통**: 복원+골관+목관+정척1·2·3
- 원리: 오호=폐경-폐방광상통-신주골, 복원=골격, 통골·소골=骨에 입신

### 족해혈·수해혈 응급·해독 프로토콜
- **족해혈(소절 일대)**: 침 부작용·훈침 후유증·침 잘못 놓은 모든 증상 원점 역전 → 념전만으로 해결; 가벼우면 손톱 압박
- **수해혈(소부)**: 훈침(순간 뇌빈혈) 기절 — 소부 양측 직자 즉시 소생 (사혈도 가)
- **총추(아문) 방혈**: 연하곤란·실음·구토·설강언어불능 — 피부 집어올려 삼릉침, 족천금+족오금 배합

### 목혈(007) 심화 임상 응용
- 간화왕 신경질·짜증: 목혈(환측) + 상삼황 배합
- 우협하통(간구통): 목혈 + 상삼황
- 구고(입 씀·간열): 목혈 + 상삼황 (행간보다 우수)
- 안건조·유루: 목혈 + 상삼황 (3~4회 완치)
- 주부습진·수장건조파열: 목혈(환측), 심하면 척택·위중 방혈
- 감기콧물(청탁 불문): 목혈 1혈 단독, 감기 요혈
- 수한증: 목혈 + 후계 (다한증 병용)
- 소아아토피: 목혈+지사마 피내침(매침법), 대장정격 병용

### 땀 이상증 처방 체계
- **지한혈(외노궁)**: 도한·자한·수한 일체 — 도마 3혈로 취혈, 삼중혈 배합 시 진전병+땀 동시 치료
- **도한 완전처방**: 지한+명황(상삼황 중간)+사마중+신관 — 격일 자침 2주 내 전치
- **견봉+이백+사마**: 자한·다한 특효 조합
- **자한·다한 정경**: 연곡+곡지+합곡+부류+충양 — 한선분비 조절

### 진전병(팔다리 떨기) — 삼중혈
- **삼중(88.17~19)**: 뇌세포 개선, 노인 팔다리 떨기 특효 — 좌우 교대 취혈
- 삼중+지한 배합: 진전+이상 발한 동시 치료
- 두통에도 특효: 뇌세포 개선 기전

### 협심증·심장 완전 처방
- **협심증 표준**: 극상+화경(강심작용)+통관+통산
- **심상+지종**: 심율부정·심장동계·심비대 (삼금방혈 병행)
- **관심증(협심증·심근경색) 완전**: 심상+지종+통관+통천+심문 → 우측 주 자침, 30차 이내 전치
- **심령1·2·3**: 협심증·부정맥 특효
- **인사불성 응급**: 지종+소부 또는 전중+소부 → 즉시 소생
- **폐암·폐기종**: 심상+영골+대백 (+소부) 특효

### 天宗·地宗·人宗 (三宗혈) — 견갑강 이상 통증
- 부위: 견갑골 주위 3혈 도마침
- 주치: 견갑강 이상 모든 통증, 어깨 돌덩이처럼 굳은 것 — 한쪽 자침으로 양쪽 풀림

### 사봉혈 응용
- **사봉3(차일·2·3지간)**: 피로·提神(提神), 대퇴통 특효 — 양측 자침
- **사봉+화련+화국+화산**: 중풍 수각불령활(손발을 못 쓰는 것) 기효
- **팔관1~8+정회+목화**: 중풍 반신불수 특효 — 113례 중 107례 전치, 건측 자침

### 차삼(4·5지간) 양유걸 응용
- 감기 기본혈 (삼초경=면역기능): 차삼 단독
- 감기두통: 차삼+삼간 배합
- 인후통: 차삼+토수2(어제)
- 피로·보익: 차삼 (보약 개념)
- 심박동과속·늑간신경통·낙침: 차삼 응용
- 알레르기피부(신실증): 차삼 배합

### 비종대(脾腫大·자라배) 처방
- 목두+목류 (1순위)
- 삼중 (2순위)
- 비종+통관+통산: 소화불량·신경성 식체 특효 (가슴·복부 즉시 시원)

### 차멀미·볼거리·편도선 응급
- **차멀미**: 대돈(LV1)+은백(SP1) 삼릉침 방혈(좌우) — 즉시 소실
- **편도선염**: 소상(LU11) 방혈 + 족천금(11.06)+족오금(11.07)
- **볼거리(유행이하선염)**: 환측 이배(耳背) 방혈 + 건측 대장정격

### 안태·부인과 완전 처방
- **안태 기본**: 부과(27)+환소(還巢)+봉소(015·016)
- **안태+부종**: 부과+통신+통위 (임신 중 부종, 습관성유산 치료)
- **불임증**: 부과+봉소+상삼황
- **수란관불통·월경부조**: 봉소+상삼황+통신+통위
- **산후 모든 질환**: 부과+환소 — 산후풍 포함

### 전립선·낭습증
- 전립선질환: 천양(인양)+지양+인양(三陽혈) 특효
- 낭습증: 하삼황+천양+지양+인양, 은용액 병행

### 방혈 부위별 실전 적용 (보유편)
- **이부(귀) 방혈**: 두경부 모든 질환 통치방, 허실 불문 — 이배청근+이삼첨 점자; 구안와사·삼차신경통=이수(耳垂)까지; 소아발열 특효
  - 방법: 엄지+검지로 15~20초 문질러 충혈 후 삼릉침 자락
- **견배부 방혈**: 실증=탁월, 허증=3분 이내 제한; 여성·허약·노인 어깨통=중자+중선+신관(하삼황) 우선
  - 중요부위: ①대추(C6~T1) ②T3~7 극돌기하(심폐반응혈) ③T3~5 양방 1.5~6촌(폐수·고황) ④T9 우측=간담 ⑤T11 좌측=비위
- **대퇴부(사마혈부위) 방혈**: 만성천식·폐질환 필수 — 청근 확인 후 방혈, 침 효과 3배 증가
- **소퇴양명구 방혈 주의**: 허증환자=소부(수해) 유침 후 한쪽만 방혈, 방혈 중 훈침 확인
- **하삼황(경골내측) 방혈**: 치질·심장병에 아주 중요, 대상포진 방혈 치료 임상보고
- **연곡(然谷) 이하 내과부**: 두부 타박·뇌진탕 방혈 요혈
- **충소혈(S3~5 독맥)**: 만성 후두통 방혈 특효

### 동씨침 대응침법 주요 수족 대조점 (水足形類相對)
- 소상↔은백 / 공손↔어제 / 태연↔상구 / 열결↔삼음교 / 척택↔음릉천
- 합곡↔함곡 / 양계↔해계 / 수삼리↔족삼리 / 곡지↔독비(슬통시 곡지=첩골자침)
- 후계↔속골 / 지정↔승산 / 완골↔금문
- 중저↔족임읍 / 양지↔구허 / 외관↔절골
- 노궁↔태충 / 대릉↔중봉 / 곡택↔곡천

### 동씨침 深淺 원칙 (임상 핵심)
- **같은 혈, 깊이 다르면 주치 다름**: 地士 1촌=기천, 1.5촌=심장병; 地宗 1촌=경병, 2촌=중병
- **족삼리 깊이별 주치**: 0.5~1촌=퇴부병, 1.5~2촌=장위병, 2촌이상=심장병·기천, 2.5촌이상=두면병
- **병재표·기육**: 천자 / **병재골·장부**: 심자
- **허증·열증**: 천자 / **실증·한증**: 심자, 久留針

### 령골(靈骨)+대백(大白) — 동경창 제1 기혈쌍
- **령골**: 무지·식지 장골 사이 손등면, 제1·2장골 접합처; 주먹 쥐고 취혈
  - 주치: 폐기부족으로 인한 폐렴·폐기종·폐암, 좌골신경통, 요통, 배통, 각통, 안면신경마비, 반신불수, 두통, 편두통, 부녀월경부조·경폐·경통·난산, 관심증, 심률부정, 협심증, 신우염, 대소장염, 이명, 비병, 일절구병
  - 자침: 1.2촌 직자; 중선혈 투자 가능; **잉부 금침** (자궁수축)
  - 기능: 通氣·補氣 → 散滯消瘀 → 구병·괴병 치료
- **대백**: 령골혈 하 1촌 (합곡 외측 1촌); 주먹 쥐고 취혈
  - 주치: 두통·편두통, 폐암·폐기종·폐적수, 좌골신경통, 요통, 배통, 소아기천, **급성폐염 특효**
  - 자침: 0.5~1.5촌 직자; 삼릉침 방혈; 령골배오시 기체·어혈증에 기효
- **임상**: 령골+대백=동씨침 대표 쌍혈; 폐기 통기·보기 극대화; 구병·난치병·기혈어체 모든 경우

### 중자(重子)+중선(重仙) — 양유걸 20년 무효례 無
- **중자**: 무지·식지 장골 사이 수장호구 하 1촌 (대백혈 투자 가능)
  - 주치: 배통, 흉통, 폐렴, 폐암, 폐기종, 감모, 기천, 심계, 슬개통, 퇴소; **전·후·외측 견관절통 특효**
  - 자침: 1~2촌 직자; 삼릉침 방혈(소아질환 특효)
- **중선**: 무지·식지 장골 사이 골봉 취혈 (령골혈 투자 가능)
  - 주치: 배통, 흉통, 폐렴, 폐암, 폐기종, 감모, 기천, 심계, 슬개통, 퇴소; 오십견·위중통·고황통·경항통·삼차신경통·장구경련
  - 자침: 1~2촌 직자
- **중자+중선 배오**: 견갑골통 치료 특효침; 양유걸 20년 임상 무효례 없음
- 응용: 폐경 어제(魚際)에 해당하는 폐관련 질환; 令骨과 투자배합 확장가능

### 중백(中白)+하백(下白) — 섬요차기·신장 전문쌍
- **중백**: 주먹 쥐고 지골·장골 연접처 상 5분
  - 주치: 급만성신우염, 방광염, 뇌명·중청, 사지부종, 편두통, 척추염, 퇴행성관절염, 소퇴통, **섬요차기 특효**
  - 자침: 5분 직자
- **하백**: 중백혈 상 1촌 (지골·장골 연접처 상 1.5촌)
  - 주치: 중백과 동일; 단독 사용 드물고 **중백+하백 배오=섬요차기·골자·좌골신경통·이질 특효**
  - 자침: 3~8분 직자
- **상백**: 식지·중지 장골 사이 지골·장골봉합처 상 5분
  - 주치: 각막염, 결막염, 안산창, 근시, 좌골신경통, 심교통, 배통, 요통, 약시, 영풍유루
  - 자침: 3~8분 직자 (양수취혈)

### 하삼황(下三皇) — 천황·신관·지황·인황 완전 프로토콜
- **천황부(腎關)**: 음릉천 하 1.5촌 (천황 직하 1.5촌)
  - 주치: 위산과다, 도식증, 산광, 빈혈, 정신병, 미릉골산통, 두훈, 좌골신경통, 요통; **오십견·야뇨 특효**; 보신(補腎) 제일요혈
  - 자침: 1촌 직자; 보신시 2촌 심자
- **천황(天皇)**: 음릉천 하 1촌 (경골내측 하연 직하 1촌)
  - 주치: 위산과다, 도식증(역류), 신장염, 당뇨병, 담백뇨, 방광염
  - 자침: 1.5촌 직자; 잉부 금침
- **지황(地皇)**: 내과골 상연 직상 7.5촌 (인황 직상 4촌)
  - 주치: 신장염, 사지부종, 당뇨병, 임병, 양위, 유정, 몽유, 담백뇨, 소변출혈, 자궁류, 월경부조
  - 자침: 1~2촌 직자
- **인황(人皇)**: 내과골 상연 직상 3.5촌 (삼음교 직상 5분, 경골 내측)
  - 주치: 임병, 양위, 조위, 유정, 요척추골통, 두훈, 수마, 당뇨병, 혈뇨, 신우염, 방광염, 배통
  - 자침: 0.6~1.5촌 직자; 아래로 비스듬히 자침=배통·수통·항통 특효; **잉부 금침**
- **하삼황 임상**: 신허증 통치방; 당뇨=천황(부)+지황+인황; 신관=보신 요혈로 단독 응용빈도 최고

### 일중·이중·삼중(一重·二重·三重) — 갑상선·안구·편도 전문
- **위치**: 외과첨 직상; 일중=3촌(앞 1촌), 이중=일중 상 2촌, 삼중=이중 상 2촌
- **삼혈 공통 주치**: 심장성갑상선종대 특효, 안구돌출, 편도선염, 구안와사, 편두통, 간병, 뇌류·뇌암·뇌막염, 후염, **비종대 특효**, 비장염
- **응용**: 1·2·3중 동시 자침=효과 극대화; 두부·견전처 반응점; 삼릉침 청근 점자방혈 가능
- **갑상선 3방 프로토콜**: 삼반혈(안으로 자라는 것) + 사마혈(돌출성) + 삼중혈(외측) = 삼방 대응

### 사화계(四花系) 완전 처방
- **사화상(四花上)**: 외슬안 하 3촌, 경골 외연 뼈 붙여 하함중 (족삼리와 위치 다름)
  - 주치: 효천, 치통, 심장병, 심계; 자침: 1.5~2촌 직자
- **사화중(四花中)**: 사화상 하 4.5촌, 조구혈 상 5분 (조구혈과 위치·주치 다름)
  - 주치: 효천, 안구병(각막염·결막염·백내장), 심장내막염, **협심증·심근경색 특효**, 심장혈관경화, 심장마비, **급성위장염 즉효**, 폐암·폐기종·폐렴
  - 자침: 2~3촌 직자; **삼릉침 방혈=심장혈관경화·급성위장염 특효**
- **사화부(四花副)**: 사화중 하 2.5촌 (하거허 하 1촌)
  - 주치: 사화중 동일; **삼릉침 방혈=심장·위장병 특효**
- **사화외(四花外)**: 사화중 외측 1.5촌
  - 주치: **급성장염·편두통·고혈압·방혈 특효**, 아통, 구안와사, 늑막염
- **사화하(四花下)**: 사화부 하 2.5촌 (조구·해계 중간 하 0.5촌)
  - 주치: 장염, 복창, 위통, 하지부종, 수중교아

### 정근(正筋)+정종(正宗)+정사(正士) — 아킬레스건 경항·척추 삼정혈
- **정근**: 아킬레스건 정중앙, 발바닥 상 3.5촌
  - 주치: 척추골 섬통, 요척추통, 경항골·경항근통, 급뉴전(급성 염좌), 뇌골창대, 뇌적수, 후뇌두통
  - 자침: 0.5~1촌 직자 (근 투자시 효력 증가)
- **정종**: 정근 상 2촌 (아킬레스건 정중앙)
  - 주치: 정근과 동일; 척추·경항 통증 핵심혈
- **정사**: 정종 상 2촌
  - 주치: 견배통, 요통, 좌골신경통, 두통
- **정근+정종+정사 도마침법**: 효과 강증; **뇌진탕·낙침·경항강통 특효**; 먼저 연곡 방혈 후 자침 권장
- **정뇌혈**: 정근 상 1촌(정뇌1), 정종·정사 사이(정뇌2) — 뇌명·뇌신경통·해수불지 자침즉효

### 수해(水海)+식지계혈 — 통증즉효·심계·산기
- **수해1**: 소지·무명지 장골 사이, 소지첨이 닿는 곳; **수해2**: 장지횡문 상 1촌
  - 주치: 자침 후 마목·침구통·기혈착난 통증, **좌골신경통 자침즉시해소**, 삼차신경통, 전신통, 약물·식물중독, 급성위장염통, 지통작용, 담석증
  - 자침: 2~8분 직자; 삼릉침 점자방혈=즉해
- **식지계 혈위 (심계·산기·편도 공통)**:
  - **중간혈** (식지1절 정중앙 c선): 산기·심계·흉민·슬개통·배통
  - **대간혈** (중간 외측 3분 b선): 심계·산기 특효, 편도선염·소아기천·장염 특효
  - **측간혈** (대간 하 2.5분): 기관지확장·기관지염·매핵기·편도선염·소아기천·장염 특효
  - **소간혈** (대간 상 2.5분): 기관지천식·기관지·편도·소아기천 특효
  - 모두 좌병우치, 우병좌치; 양수취혈 금

### 화부·화양·화창(火府·火腸·火倉) — 좌골신경통·척추 대퇴후면 3혈
- **화부**: 승부 직하 3촌; **화양**: 화부 하 4촌; **화창**: 화양 하 3촌
- 공통 주치: 척추골골자, **좌골신경통 특효**, 경추골골자, 요통, 배통, 후뇌부좌상, 뇌신경통, 항긴통, 편두통, 흉민, 신장염, **치창 특효**, 반신불수, **관심증 특효**
- 자침: 1~2.5촌 직자; **임상에서 3혈 동시 취혈=효과 탁월**

### 정양계(正陽系) 및 위중부근 방혈
- **정양1**: 위중 직하 1촌; 주치: 심장비대·심민·흉창·고황급통·항긴통·치창; 청근 점자방혈=즉효
- **정양2**: 정양1 외측 1촌; 주치: 견비통·심장비대·흉통·흉민·배통·항긴통·치창
- **정양3**: 정양1 내측 1촌; 주치: 위산과다·위통·두통·편두통·수각마비·심계·협심증·견산통·항강·치창
- **화령**: 슬와횡문 직하 3촌; 주치: 구년두통·흉통·두훈·배통·척추골통·좌골신경통·요통·**치창출혈 특효**
- **상유+하유(슬와 방혈)**: 삼릉침 흑혈 방혈=심장마비·협심증·심장비대·좌골신경통 특효

### 곡릉·건력·중력 — 감모·축농증 요혈
- **곡릉**: 주횡문상 상완이두근건 외측 함요처 (척택혈 해당)
  - 주치: 추근, 기천, 주관절염, 심계, 갑상선종, 심장비대·심장마비, 흉통·배통, 중감모
- **건력**: 곡릉 외측 5분; 주치: 중감모, 비색, 축농증, 해수, 기천, 기관지염
- **중력**: 건력 외측 5분; 주치: 건력과 동일
- **3혈 임상**: 곡릉+건력+중력=유행성감모·축농증 요혈 (도마침법)

### 삼차계(三叉系) 비종대·간약·좌골신경통
- **삼차1** (식지·중지 차구 중앙): 각막염·안청산통 특효, 요통·좌골신경통, **반신불수·위증**, 시신경위축
- **삼차2** (중지·무명지 차구): **비종대·췌장염**, 반신불수 특효, 좌골신경통, 수각마비, **간약·체력회복**
- **삼차3** (무명지·소지 차구): 중감모, 두훈 특효, 좌골신경통, 장골자, 요산, 신우염·신장병수종 특효
- 자침: 2촌 직자, 주먹 쥐고 차구 따라 양장골간까지

### 수금(水金)+수통(水通) — 기관지천식 전문
- 위치: 비위 코 인중 양측 (얼굴에 사향(斜向) 자침)
- 주치: 기관지염, 천식 — **강자극**으로 효과 극대화
- 자침법: 얼굴에 비스듬히 자침; 도마침법 적용

### 저혈압·당뇨 전문 처방
- **저혈압**: 내관(양측)+소료 — 즉효
- **당뇨**: 용천+지황+인황+천황 — 하삼황+신경(腎經) 보강
- **대릉혈**: 발뒤꿈치 통증 특효; 내관+간사=심장악화·좌골신경통·대퇴후측통

### 通關·通山·通天 (동씨침법4)
- 위치: 통관=양능천상 2촌, 통산=상 4촌, 통천=상 6촌 (비골 앞 근육 위)
- 주치: 심장병·두훈·심계·위병·뇌빈혈; 신경성구토·임신구토 특효
- 消化不良 요혈; 고혈압=단측 1혈씩 교차 취혈
- 자침법: 도마침법(3혈 동시); 피하자침 가능

### 上三黃(天黃·明黃·其黃) (동씨침법4)
- 위치: 대퇴 내측; 천황=슬관절 내상각 상 3촌, 명황=상 6촌, 기황=상 9촌
- 주치: 간염·간경화·척추골막염·백혈구증 특효
- 간질·파킨슨·흑반·실면증·유주성통증 특효
- 하삼황과 상보 관계; 간신동원(肝腎同源) 치료 핵심

### 駟馬(上·中·下) (동씨침법4)
- 위치: 대퇴 외측; 사마중=양능천 직상 2촌, 상=중 상 2촌, 하=중 하 2촌
- 주치: 폐기능부족·좌골신경통·비염·이명·피부병·유방통
- 甲狀腺기능항진·안구돌출 10여차 특효
- 폐천(喘): 사마혈; 심천: 삼사혈; 신천: 수통+수금

### 通腎·通胃·通背 (동씨침법4)
- 위치: 슬관절 하외측; 통신=비골두 직하 2촌, 통위=하 4촌, 통배=하 6촌
- 주치: 신염·당뇨·음위·신허두훈요통·구년두통; 소변탁취미중 특효
- 통신=신, 통위=위, 통배=등/척추 병증에 대응

### 中九里(풍시 해당) + 七里 (동씨침법4)
- 위치: 중구리=대퇴 외측 중점(풍시); 칠리=중독혈
- 주치: 배통·요통·반신불수; 도마=견후측통·편두통
- 자침법: 중구리+칠리 도마침법 = 견후측·편두통 특효

### 骨刺穴1·2·3 (동씨침법4)
- 위치: 곡지 직상 2촌(골자1)·4촌(골자2)·6촌(골자3)
- 주치: 골자(骨刺, 골극·뼈돌기) 특효
- 자침법: 양측 동시 취혈, 유침 30분; 심자(深刺)

### 解穴 (동씨침법4)
- 위치: 슬개골 외측 상각 직상 1촌 전방 3분
- 주치: 자침 후 기혈착란·타박손상·피로통 해소 특효; 관절扭傷 특효
- 해혈=자침 부작용·침후 불쾌감 교정 요혈; 기혈착란 즉시 해소

### 水通·水金(얼굴) (동씨침법4)
- 위치: 수통=비구 하 1촌 외 5분, 수금=수통 직하 1촌 (비골 양측 얼굴)
- 주치: 신천·기침·천식·딸꾹질·복창·구토
- 신천=수통+수금, 폐천=사마, 심천=삼사혈 → 천식 원인별 분류 처방

### 四縫穴1·2·3·상혈 (동씨침법5)
- 위치: 식지 배면; 사봉1=제2절 횡문, 2=제1절 횡문, 3=지두, 상=제3절 횡문
- 주치: 중풍 수족불영활 특효; 요산·좌골신경통
- 자침법: 삼릉침 방혈 또는 호침 투자; 양측 취혈

### 分金穴 (동씨침법5)
- 위치: 폐경 협백 하 3촌
- 주치: 감모·비염·후염 특효침
- 폐계 상부 염증(코·목) 전문혈; 급성 감기 즉효

### 後椎+首英 (동씨침법5)
- 위치: 후추=제2경추 극돌기 직하 1촌, 수영=직하 2촌
- 주치: 척추골탈구·척추골창통·신장염·요통
- 자침법: 도마침법; 기타 혈위 무효 시 특효; 경추-척추 이상 전문

### 肩中穴 (동씨침법5)
- 위치: 삼각근 중점 (견봉 하 2~3촌, 상완 외측)
- 주치: 슬개통 특효침; 경항피부병; 소아마비; 반신불수; 비출혈
- 내과 방혈 병용; 상병하치(上病下治) 원리 적용

### 地宗穴 (동씨침법5)
- 위치: 전완 요측 중앙 (수삼리 부근)
- 주치: 양증기사회생·심장병·혈관경화
- 심자(深刺)=중병 치료; 심장 응급 활용

### 좌골신경통 오행법 (동씨침법5)
- 처방: 사마2·3혈(주)+통배혈+천황·명황
- 오행 배오: 폐(사마)+방광(통배)+간신(하삼황) 동시 조절
- 난치성 좌골신경통 전문 복합처방

### 火包穴 (동씨침법6)
- 위치: 족2지 저면 2절 횡문 중앙
- 주치: 간병·난산·태의부하; **진심통(협심증) 삼릉침 흑혈 방혈 특효**
- 외상출혈불지 방혈 특효; 간화(肝火) 울결 심통 전문

### 上瘤穴 (동씨침법6)
- 위치: 발꿈치 경피(硬皮) 전연 정중앙
- 주치: 뇌류·뇌적수·소뇌통·뇌신경통; **뇌진탕 혼미 유효**
- 뇌부 병증 전문; 삼릉침 방혈 병용

### 木斗+木留穴 (동씨침법6)
- 위치: 제3·4중족골 사이 (족배)
- 주치: 비종대·백혈구증·소화불량·간병; **설강언어곤란+삼중혈 배오 양효**; 전신마비 특효
- 목계(木系) 간비(肝脾) 동시 치료

### 六完穴 (동씨침법6)
- 위치: 협계(俠谿) 위치 (족4·5지 사이)
- 주치: 지혈(외상·침구후출혈)·편두통; 폐천·기침혈 금기
- 지혈 전문혈; 침구 후 출혈 응급 처치

### 火連·火菊·火散穴 (동씨침법6)
- 위치: 제1중족골 내측 3혈 (족저내측)
- 주치: 고혈압두훈·심계·뇌류·뇌막염
- 삼혈 동시=입치(入齒) 제증 특효; 심화(心火) 상염 전문

### 門金穴 (동씨침법6)
- 위치: 함곡(陷谷) 위치 (족2·3중족골 사이 함요)
- 주치: 장염·위염·복창·맹장염; 여름 장위염 특효
- 위장계 염증 전문; 급성 복통 즉효

### 이혈계(耳穴系) (동씨침법6)
- 목이·화이·토이·금이·수이·이배·이삼혈: 오장오행별 반응점
- 자침법: 점자방혈(點刺放血); 오장 허실 감별 후 해당 이혈 선택
- 이혈방혈=신속 오장 조절; 급성병증 보조 처치

### 正會穴(백회) (동씨침법7)
- 위치: 두정부 정중앙 (독맥 백회)
- 주치: 중풍·반신불수·소아경풍 요혈; 진정작용
- 百會방혈=두부청상(頭部淸上); 진정+신관+상삼황 배오=두부병 종합처방

### 鎭靜穴 (동씨침법7)
- 위치: 인당 상 3분
- 주치: 신경착란·사지발두·실면; 정회 배오
- 鎭靜線 삼릉침=몸떨림 즉효; 정신과·신경과 응급

### 總樞穴 (동씨침법7)
- 위치: 풍부(風府) 해당 (후두부 독맥)
- 주치: 구토·육부불안·곽란·발언무성
- 자침법: 삼릉침 최효; 급성 구토·곽란 응급 방혈

### 七星穴 방혈 (동씨침법7)
- 구성: 두부 7개 혈위 삼릉침 방혈
- 주치: 구토·감모·소아고열·소아풍증
- 소아과 응급 방혈 요법; 고열경풍 즉효

### 五嶺穴 방혈 (동씨침법7)
- 구성: 5열 두항부 혈위 삼릉침 방혈
- 주치: 고혈압·중감모·발고열·반신불수·각종사증·혈관경화요통
- 뇌혈관계 응급 방혈 요법; 혈관경화 전신 치료

### 馬金水+馬快水穴 (동씨침법7)
- 위치: 족소양담경 상 (견배요부 외측)
- 주치: **신결석극통 즉지**; 방광결석·방광염·소변빈삭·섬요차기
- 견배요통(방광경 제2행 외측) 동시 치료; 비뇨기·요부 전문

### 三金穴(금두·금길·금릉) (동씨침법7)
- 위치: T3·4·5 극돌기 외 3촌 (3혈)
- 주치: 슬개통 — 삼릉침방혈=입간견영지효(立竿見影之效)
- 배부방혈 슬관절 치료 특효; 상병하치 원리

### 精枝穴(금정·금지) (동씨침법7)
- 위치: T2·3 극돌기 외 6촌 (2혈)
- 주치: 소퇴발창·소퇴통 방혈즉효
- 하지 말단 순환장애 배부방혈 치료

### 喉蛾九穴 (동씨침법7)
- 위치: 항부 9개 혈위 (경추 주변)
- 주치: 후아·후통·갑상선염; 삼릉침방혈
- 급성편도선염 구불개(口不開)=방혈必須; 인후계 응급

### 大間·小間·浮間·外間·中間穴 (동씨침법8)
- 위치: 식지 요측; 대간=제1절 중앙, 소간=대간 상 5분, 부간=소간 상, 외간=제2절 중앙, 중간=대간+외간 중점
- 주치: 산기·심계·슬개통·편도선염
- **4혈동시(외간+대간+소간+중간)=산기 특효**; 내과 삼릉침 방혈 병용
- 한수취혈(寒水取穴): 남좌여우

### 還巢·鳳巢穴 (동씨침법8)
- 위치: 환소=무명지 척측 2절 중앙, 봉소=환소 상 5분
- 주치: 자궁통·자궁류·불임·안태
- **봉소+황소+부과혈=불임 20회 이내 특효**; 부인과 난치증 전문복합처방

### 木穴(감모혈) (동씨침법8)
- 위치: 음장 식지1절 d선 (요측·척측 각 1혈)
- 주치: 간화왕·유루·감모·피부병·수장경화
- 코감기 즉효; 간화(肝火) 피부 외달 치료; 목계(木系) 요혈

### 婦科穴 (동씨침법8)
- 위치: 엄지 등면 1절 소측
- 주치: 자궁염·월경부조·불임·편두통·두정통
- 봉소·황소 배오=불임 특효; 부인과+두통 겸치

### 火膝穴(소택) (동씨침법8)
- 위치: 소택(少澤) 위치 (소지 척측 조갑각)
- 주치: 견비불거(심계) 특효; 각종급성심통·번위 특효; 슬개통·관절염
- 심경(心系) 급성병증 + 슬관절 동시 치료

### 腸門+肝門穴 (동씨침법8)
- 위치: 척골 내측; 장문=완관절 상 1.5촌, 간문=상 3촌
- 주치: 간염성장염·두훈안화; **급성간염 특효**
- 좌수 단취(單取); 간통=우회(右會), 장통=좌회(左會)

### 心門穴 (동씨침법8)
- 위치: 소해(少海) 직하 1.5촌 척골 내측
- 주치: 심장염·심계흉민; **대퇴내측통·좌골신경통·미저골통·복고구통 특효**
- 심장휴극 응용; 단독취혈; 심경(心系)+하지통 겸치

### 三士穴(人士·地士·天士) (동씨침법8)
- 위치: 폐경 상 3혈; 인사=태연 상 2촌, 지사=상 4촌, 천사=상 6촌
- 주치: 기천(氣喘) 특효; 심박과속 특효
- **삼사+령골 양수=천식·심장무력 특효**; 폐심(肺心) 동시 치료 복합처방

### 分枝上+分枝下穴 (동씨침법8)
- 위치: 전완 요측; 분지상=양지 상 1.5촌, 분지하=완관절 상 0.5촌
- 주치: 약물중독·사독·식물중독·당뇨·전신발양·가스중독·유염
- 해독(解毒) 전문혈; 중독 응급 처치 요혈

---

## 사암침 5행 처방 (舍岩五行正理 핵심처방 — 사암오행정리신침가)

### 중풍·신경계 처방
- **중풍어삽탄탄(말어눌+반신불수)**: 대돈(보)+태백(사)
- **편풍구괘(간실·입비뚤)**: 노궁(보)+조해(사)
- **구안괘사**: 소해(보)+연곡(사) — 저절로 낫는다
- **편풍유동(심실·씰룩)**: 소해(보)+태백(사)
- **중풍인사불성**: 십선혈(十宣) — 가장 잘 낫는다
- **침과다유출**: 팔사혈(八邪) 통하게 함
- **소아경풍**: 태충(보)+합곡·소부(사)
- **소아경풍(체증동반)**: 태충(보)+합곡(사) — 우측치
- **각궁반창(대장허)**: 삼리(보)+양계(사)
- **풍증(중풍통치)**: 삼리+곡지(보), 어제+함곡(사)
- **풍단(단독)**: 삼리(보)+양곡(사)
- **전근(근육경련, 심열)**: 단전정+사관영+십선사

### 두통·이명·안이비 처방
- **두통**: 노궁+소부(사)
- **편두통**: 열결+절골=현종(사)
- **이명두통(담궐)**: 절골+풍지(보)
- **미릉골통**: 임읍(사)
- **귓바퀴통**: 소부(사)
- **적안(눈충혈)**: 백회 사혈
- **청맹(뜨고도못봄)**: 신정격
- **작안(밤눈어두움)**: 간정격
- **이명**: 방광정격
- **농(귀머거리)**: 신정격
- **비색+폭음(코막힘+언어장애)**: 폐정격
- **구감(입의감창)**: 액문+중저(보)+양곡(사)
- **중설(덧혀)**: 심정격 또는 간정격
- **단아(한쪽편도)**: 간정격
- **쌍아(양쪽편도)**: 액문+대돈(보)+양지+관충(사)
- **후비(인후비증)**: 위정격 → 액문(보)+양지(사); 신상=경거(보)+곤륜+액문+중저(사)
- **단아(간상)**: 음곡(보)+상양+액문+중저(사)
- **항상결핵(목멍울)**: 대장정격
- **귀흉귀배(곱사등)**: 폐정격
- **상치통**: 통곡+내정(보)+양곡+해계(사)
- **하치통**: 음릉+척택(보)+삼리+절골(사) — 즉지
- **비색(코막힘)**: 폐정격; 비치·비창=신정격
- **비혈(코피)**: 비정격+통곡+태충+행간(사)
- **콧속군살(비식)**: 간정격; 비옹=삼초정격
- **콧물**: 임읍+함곡(보)+양곡+양계(사)
- **흰자위백태**: 폐정격; 상하백태=위정격

### 소화기·위장계 처방
- **관격(체+토못함+대소변불통)**: 사관+삼음교(보)
- **설사**: 내정+삼음교(사)
- **내상식적(쇠약+체증)**: 비정격
- **구얼(구역질, 위허)**: 위정격
- **구토**: 비정격; 탄산=간정격
- **속쓰림(조잡)**: 위정격; 지음=간정격
- **위통**: 위정격; 비통=비정격
- **폭설(갑작스런설사)**: 비정격; 습설=위정격
- **유설**: 경거+음곡(보)+태백+태연(사)
- **딸꾹질**: 대장정격; 구병딸꾹질=심정격
- **욕지기+트림(얼애)**: 중완+위정격
- **소화불량(내상)**: 비정격 안되면 담정격
- **주체(술체)**: 태백+태연(보)+대돈+은백(사)
- **개고기체**: 소충(보)+합곡(사)
- **모든체증**: 삼리+내정(사)
- **황달**: 비정격; 채달=비정격; 육달=심정격
- **허열구토(꽥꽥)**: 음곡+소해(보)+대돈+소충(사)

### 기침·호흡기 처방 (사암침가 6종 기침 감별법)
- **열해(열로인한기침)**: 대돈+중봉(보)+천돌+태백+태연(사)
- **풍해(풍으로인한기침)**: 대돈+용천(보)+곡천+태백+태충(사)
- **기해(기로인한기침)**: 음곡+경거(보)+천돌+척택+음릉(사)
- **한수(한으로인한기침)**: 신정격 — 즉효
- **효천(천명+호흡곤란)**: 천돌+단전(사)→액문+해계(보)→중저+함곡(사)
- **해수(기침일반)**: 완골(보)+척택(사)
- **담음(소부+어제보/척택+함곡사)**: 폐승격계

### 출혈·부종·창만 처방
- **붕중대하(자궁출혈+냉)**: 상양+지음+삼음교(보)
- **토혈**: 삼리(영)+음곡(보)+중봉(사)
- **코피응급**: 통곡(보)+행간(사)+태충(정)
- **손혈(혈허)**: 음곡+곡천(보)+현종(사)
- **해혈(기침출혈)**: 태백+태연(보)
- **전신창만(부종)**: 대돈+소충(보)+음곡(사)
- **열창**: 음곡+곡천(보)+태백+신문(사)
- **수창(수분부종)**: 태백+태계(보)+경거+복류(사)
- **곡창(음식으로부종)**: 신문+태연(보)+어제+대도(사)
- **습만**: 기해(영)+양곡(보)+임읍+음곡(사)
- **현음(옆구리담음)**: 소부+태백(보)+음곡+소해(사)
- **유음**: 연곡+삼리(보)+임읍+함곡(사)
- **담음(소부+어제보/척택+함곡사)**: 폐승격

### 비뇨·생식·부인과 처방
- **대변불통**: 대장정격
- **소변불통**: 방광정격+통곡(보)
- **몽설**: 신정격+연곡(사); 유정=신정격
- **발기불능**: 신정격
- **붕중대하(심함)**: 상양+지음+삼음교(보)
- **난산**: 삼음교(사)
- **포의(태반불하)**: 삼음교+합곡(사)
- **낙태(유산예방)**: 삼음교(보) — 즉시
- **섬어(헛소리)**: 심정격
- **산후복통**: 심정격
- **슬산(무릎시림)**: 폐정격
- **유종(유방염)**: 태연+경거(사)
- **다산복통**: 사관+삼음교(보)
- **색후상한(방사후상한)**: 삼음교+신정격

### 근골격·통증 처방
- **통풍역절(신허+뼈마디)**: 경거(보)+태백(사)
- **요통(일반)**: 위중+삼리+곤륜
- **절상(골절)**: 대장정격
- **견비불거통(어깨팔)**: 이간+양곡(보)
- **행비(유주성통증)**: 담승격
- **역절풍(류마티스)**: 폐승격
- **우협통**: 폐정격; 좌협통=간정격; 비중만통=비정격
- **근만(근육수축)**: 간정격; 위벽=폐정격
- **수족마비**: 삼리(보); 하반신마비=폐정격
- **뼈마디붓고시림**: 풍륭(사)
- **학슬풍(무릎최악증)**: 중완정+환도(사)
- **항척추통증(쇳덩이같음)**: 담정격
- **근골부러지는듯**: 대장정격
- **굴신시자통**: 신정격; 활처럼구부러짐=폐정격

### 피부·피로·기타 처방
- **은진(두드러기)**: 대장정격; 다산복통=사관+삼음교보
- **백설풍창(건선)**: 폐정격
- **서증(더위)**: 심정격; 조증=폐정격
- **열담(담없는천식)**: 대돈+은백(보)+신문+태백(사)

---

## 사암침 증상별 임상처방 (부위·증상·체질 감별)

### 통증 5행 감별법
- **인통(당기며아픔)** → 풍 → 간정격
- **동통(욱씬욱씬, 야간심함)** → 한 → 대장승격
- **무력감** → 습 → 비정격
- **열통(화끈거림, 파스시원)** → 소장정격
- **전기찌릿찌릿** → 신정격
- **몸살처럼살갗아픔(기비)** → 위승격
- **혈허찌르는아픔** → 소장정격 (허리=담정격)
- **뼈마디전체아픔** → 담정격
- **통증+오한발열** → 대장승격

### 피부질환 감별처방
- **외부타박·손상·염증 전반**: 내양구+음릉천
- **화농성발진·대상포진·수두·수술상처**: 소장정격
- **안에서곪는종기**: 대장정격; 겉에서고름=폐정격
- **진물+상처불유합**: 위승격
- **손발바닥건조+갈라짐**: 폐정격
- **아토피(딱딱건조+진물)**: 대장정격; 좁쌀+진물=소장정격
- **두드러기**: 냉=신정격, 땀두드러기=소장정격, 식중독=대장정격+간정격
- **기미**: 대장정격; 백반증=폐승격
- **옻오름**: 신정격
- **여드름**: 이마=방광정격, 뺨=소장정격+담정격, 입주위=소장정격+신정격, 등=방광정격
- **습진(피부가보들보들+비허)**: 비정격
- **어혈방**: 태백+태연(보)+곡지(사) — 어혈, 골절, 인대손상

### 중풍 감별처방
- **뇌출혈+고혈압중풍**: 방광정격 (풍부 습부황 병행)
- **우탄(우측마비)**: 폐정격 단보단사
- **좌탄(좌측마비)**: 간정격
- **좌탄+비오듯땀**: 비정격 단보단사
- **위실중풍(혀뻣뻣)**: 삼리(영)+이간(보)+양곡(사)+열결+내관(보)+풍지(사)
- **중풍+말어둔**: 심승격(혈압高), 위승격(혈압정상)
- **중풍예방**: 대장정격(과로성), 비정격(사려과다), 삼초정격(스트레스)
- **졸도긴급**: 십선혈 자락

### 감기·상한 감별처방
- **상한1일, 급상한**: 상양(보)
- **상한초기**: 상양(보)+삼리(사)
- **코막힘+콧물감기**: 폐정격; 찬기운=상양(보)
- **목아프고고열+누런코**: 위승한격
- **독감(전신쑤심)**: 심정격
- **더위먹음(중서)**: 심정격; 안되면 중충(보)+곡택(사)
- **성교후감기**: 심정격
- **감기후유증+귀안들림**: 후비방
- **감기예방**: 소장정격

### 한열·이상감각 감별처방
- **전신열+갑갑**: 폐한격
- **전신대열**: 심정격
- **여름기운빠짐**: 심정격
- **저혈압+현기증**: 심정격
- **고혈압**: 방광정격 (조구+풍륭 사혈 병행)
- **당뇨통치**: 방광정격; 상소=심한격, 중소=위한격, 하소=방광정격
- **당뇨말초괴사+버거씨병**: 소장정격+내양구+음릉천
- **손시림**: 소장정격; 발에만열감=방광정격+곤륜사
- **전신한랭(여름에도춥다)**: 신정격; 허리이하냉=신정격

### 정신·수면 감별처방
- **정신병일체+스트레스**: 삼초정격
- **심계정충+건망증+집중력저하**: 심정격
- **히스테리+한숨**: 담정격
- **겁많음+잘놀람**: 담정격
- **우울증**: 비정격; 부정적인사람=위정격
- **불면증**: 대장승격; 생각많아=비정격; 허번불면=담정격
- **기면증(잠쏟아짐)**: 담승격
- **가위눌림+무서운꿈**: 소장정격
- **꿈많고잘놀람**: 심정격
- **치매**: 삼초정격+방광정격
- **파킨슨(손발떨림)**: 심정격; 행동개시늦음=비정격; 행동정지안됨=방광정격

### 부종·피로·기타
- **전신부종**: 방광정격
- **허리이하부종**: 비승격
- **얼굴부종**: 대장정격
- **만성피로**: 담정격; 노극방=경거+소부+태백(보)+기해+신수(사)
- **해열**: 지구(사)→중저(사)→연곡(사)→음곡(보)+상양(사); 대추사혈
- **구급응급**: 인중+노궁+용천
- **담석증**: 담정격; 간경화=담정격
- **갑상선(저하+항진)**: 대장정격
- **습관성탈구**: 내양구+음릉천

---

## 동씨침 부위별 임상처방 (동씨침특효정리 종합)

### 두통·두훈 처방
- **두정냉통**: 삼초정격 또는 측삼리+측하삼리
- **창통·일반두통**: 측삼리+측하삼리+령골
- **신허두통**: 사마상·중·하
- **신허+풍한두통**: 중구리+칠리 자침 후 통신+통위
- **뇌빈혈성두훈**: 통관+통산+통천; 또는 열결→태연 투자 후 령골
- **고혈압두훈**: 양쪽 령골
- **타박두통(전두·후두)**: 령골+대백
- **두불청(머리안맑음)**: 정회+진정 자침 후 삼중 방혈
- **편두통**: 중구리+칠리(+령골+대백); 삼중; 태양혈통=문금
- **후두통**: 충소; 정근+정종+후두(+령골+대백)
- **전두통**: 통천+화국+전두; 삼간+곤륜(사)

### 견항·경추 처방
- **견항강**: 정근+정종+령골+대백 (독맥부통)
- **낙침**: 중자+중선+상백; 또는 정근+정종+령골
- **목디스크**: 음릉천+정근+정종
- **두정부·항배통(굴곡시)**: 인중+승장 직자
- **50견(오십견)**: 신관(건측); 또는 사화중(환측)
- **심장성견불거**: 화슬
- **견봉통**: 통신+통위+통배; 또는 구리+측하삼리
- **견후측통**: 칠리+구리; 또는 육완+사마
- **견배요통(방광경2선)**: 마금수+마쾌수
- **갑상선**: 삼중; 通天+통관+통산; 眼球돌출=사마

### 상지 처방
- **주관절 테니스엘보**: 풍시(양쪽); 외간+령골(건측)
- **주관절 골프엘보**: 사화중(환측)
- **주두(천정부위)통**: 중규음+슬중(대측)
- **완관절통**: 측삼리+측하삼리
- **건초염**: 목두+목류(건측); 오호1
- **수지비(저림)**: 신관+복류; 사봉; 경추성=상삼황+사봉
- **무명지마비+굴신불리**: 목류
- **주먹쥐기힘듦**: 열결; 안되면 측삼리+측하삼리
- **손떨림+저림**: 견정+곡지; 또는 심정격/노궁
- **하박통**: 화천(건측); 상박통=측삼리+육완(건측)
- **사지궐역(사지냉)**: 대도+사관+중충+관충

### 요통 처방
- **구좌시요통**: 수금+수통+완순1·2
- **요안통·선골통**: 이각명+폐심
- **장골릉통**: 곡릉+중절+중백
- **방광경2선요통(자고일어날때)**: 마금수+마쾌수+비골하
- **요추2·3번이상**: 마금수+마쾌수
- **요추4·5번이하·선골(팔료혈)**: 후계+공손
- **요추2·3번과천골사이**: 양쪽명황+곤륜+화경+령골
- **척추증**: 명황+통신+신관(+완순1·2+중백)
- **좌섬요통**: 위중(점자출혈)+정근+정종+령골+대백; 마금수+수통+이각명
- **신허요통**: 중백+완순1; 수금수통+완순1·2+이각명+신관(건측)
- **척추정중선통**: 위중(점자출혈)+곤륜; 령골+대백+정근+정종
- **미저골통**: 정근+정종+후회+곤륜; 폐심

### 좌골신경통 처방
- **기본처방**: 령골+대백+중백(+견중)
- **PSIS통·여성·방광경형**: 완순1·2
- **담경형**: 사화외+화천+화릉
- **좌요각통**: 사화외+사화부+부장
- **요각통**: 상삼황
- **대퇴부좌골신경통**: 금림
- **심장쇠약성좌골**: 심문
- **디스크성**: 사화하+사화부+부장
- **동씨5행법(난치성)**: 사마2·3+통배+천황+명황

### 슬관절 처방
- **슬통(기본)**: 견중(건측) [심하면 내관+태충 병행]
- **오래된슬통**: 삼금혈 방혈(T3·4·5 외측)
- **통치방**: 견중+대간+중간
- **슬내측통(곡천부)**: 심문+심슬
- **슬개냉통**: 통천+통산
- **슬포와부통**: 척택+곡택(이혈부 위치)
- **계단오르내릴때통증**: 통천
- **족비(발저림)**: 신관+복류

### 족부·족관절 처방
- **족근통(발꿈치)**: 위중(점자출혈); 아킬레스=오호4·5
- **신허족근통**: 양쪽 중백
- **족관절통**: 오호4·5+중백+하백
- **9·10지통**: 연곡+용천; 또는 곡지→소해 투자

### 흉복부 처방
- **흉복측면압통**: 사마; 또는 구허+삼양락
- **흉배연통**: 사마+승산; 또는 신관
- **흉부타박**: 사마; 또는 사화중+사화외(점자출혈)
- **복창(기본)**: 절골+내정; 령골+대백+토수+곡릉+문금
- **복창+통증**: 문금
- **하복통**: 문금; 또는 간문+곡릉(침방향하)
- **하복측면통**: 사마+통천+통위

### 심장·순환계 처방
- **진심통(협심증)**: 화포(점자흑혈출혈)+심문+내관
- **심장마비**: 곡릉(사혈); 사화중+사화외; 심장급증=심문1·2
- **부정맥**: 심문 또는 삼사혈
- **심장측통**: 통관+통산+통천(순환촉진)
- **정충**: 심유+음곡+통리(보)

### 소화기·위장계 처방 (동씨)
- **소화불량**: 사화상+천황+대릉; 신경성=신문+통리
- **구토**: 총추(점자출혈); 족삼리+통배; 신경성·임신성=통관+통산
- **반위(조식모토)**: 총추(점자출혈); 신관+천황
- **위산과다**: 신관+천황(비정격); 고황 뜸
- **위염**: 장문 또는 문금; 위경련=측하삼리+족삼리
- **장염**: 부장+문금; 설사=내정+족삼리+삼음교(사)
- **위궤양+천공**: 공손; 지오금+지천금; 사화중+사화외(점자)+통관+통산
- **위·장출혈**: 위=양쪽자매혈; 장=사화중+사화외 사혈 후 자매
- **완고변비**: 상양 사혈20방울+지구+조해(사)
- **산기(疝氣)**: 대간+소간+외간+중간+부간

### 간·담·신·방광 처방 (동씨)
- **간경화**: 간유(점자출혈)+상삼황; 또는 상곡(점자)+간문+명황
- **간염**: 간문+명황
- **담낭염**: 상삼황(천황·명황·기황); 화지+화전
- **담석통**: 목지(사마3)+마쾌수
- **신염·단백뇨**: 통신+통위+하삼황; 사지부종=통신+통위+통배
- **신결석극통**: 마금수+마쾌수 — 즉지
- **빈뇨·야뇨**: 해표+목부; 또는 마쾌수(피내침)
- **요실금**: 해표+목부+마쾌수+마금수

### 폐·호흡기 처방 (동씨)
- **감기초기+기침**: 수금+수통+척택; 발열=대추+소상+감모1·2 사혈
- **기관지염·해수**: 수금+수통
- **천식**: 수금+수통; 대백+중자+중선; 토수
- **흉막염**: 사화중(점자) 후 사마
- **늑막염**: 사마

### 부인과 처방 (동씨)
- **생리통**: 운백+이백+부과; 또는 인황+자매+사마2
- **대하**: 환소 또는 부과 또는 자매; 통신+통위+통배
- **불임**: 봉소+황소+부과 (20회이내특효)
- **산후풍**: 수상(手相)

### 안이비 처방 (동씨)
- **안삽(눈건조)**: 명황+기황+광명; 상삼황+광명(+삼중)
- **사시**: 상삼황
- **눈물흘림**: 목혈; 하삼황; 삼중(노인=점자 후 다른곳)
- **미릉골통**: 화국 또는 신관+이각명
- **맥립종**: 령골; 또는 해혈
- **눈피로**: 상백+입백+인황+명황; 사마1·2+천황+신관
- **비색(코막힘)**: 견중(+령골); 측삼리30분; 문금
- **비염**: 사마상·중+통천+통관+령골+영향+비익
- **비출혈**: 견중(+소상 뜸); 위열=전곡+내정(보)+소해+삼리(사)
- **인후통**: 액문+어제(좌우 각1혈)
- **이명**: 완순1·2; 간담화=삼황+화경; 풍시+신관
- **이통**: 삼중+사화외

### 기타 전신 처방 (동씨)
- **고열**: 곡지+합곡+삼리+복류+대추; 소아고열=이간+삼간
- **피로예방**: 비익+상삼황; 눈피로=사봉+상백+입백
- **차멀미**: 대돈+은백(사혈)
- **중풍반신불수**: 령골+대백
- **중풍언어장애**: 양쪽 목두+목류
- **중풍예방**: 백회+대추+풍시+견정+간사+곡지+삼리
- **반신불수(통치)**: 령골+대백+상삼황

## 양유걸전집 임상프로토콜 (동씨침 특수셋트)

### 양유걸셋트 핵심처방
- **오십견**: 척택사혈+신관; 또는 화슬+심슬 병행
- **좌골신경통**: 인중+속골+완순1+풍시/령골+대백(교차자침)
- **요통**: 인중+후계+속골+풍시+중백+하백
- **불면**: 풍시+간곡/행간
- **이명**: 사마(방혈)+명황+완순1,2
- **슬통**: 견중+심문
- **인후통**: 차삼+토수2

### 골극(骨刺) 삭골침법
- **경추·요추골극**: 상삼황(명황중심)
- **무릎·발뒤꿈치골극**: 사화중+사화외(방혈); 위중사혈(주1회)
- **정경혈조합**: 인중+후계+속골+풍시
- **자침법**: 뼈 옆으로 최대한 붙여서 자침(상골자법)

### 방혈 특효처방
- **태양혈사혈**: 두통·편두통 가장효과; 경증1-2차, 중증3-4차 완치
- **오령혈방혈(T4-T7 외1.5촌)**: 두통방혈; 고혈압방혈(특효); 고열
- **위중사혈**: 치질(특효); 고혈압; 하지전면통
- **척택사혈**: 오십견; 심장열증; 폐열

### 질환별 특효처방 (양유걸)
- **통풍**: 오호3+족삼리(강자극단계발침); 작약감초탕+사묘산(즉각진통); 사묘산+사령산(요산↓)
- **전간(간질)**: T3방1-1.5촌(폐수·궐음수) 점자출혈=1회완치+대추사혈; 시호가용골모려탕
- **구안와사**: 환측구강점막점자(가장효과); 3주=보양환오탕+견정산; 2달+=순풍운기산
- **파킨슨**: 신관+부류+명황; 2신1간(신관+부류+명황); 진무탕증=추위관련
- **녹내장**: 화경+화주(매우효과); 하삼황+광명(탁효); 행간
- **사시**: 하삼황=극효; 태양혈점자=극효
- **치질**: 위중사혈=특효; 기문+기각+기정
- **맹장염**: 사화중·외 점자+난미혈(족삼리하1촌)
- **천식급성**: 토수=발작시수분내그침+내관
- **혈액통치**: 상삼황; 목두+목류; 삼중
- **고혈압**: 오령혈방혈=특효; 위중사혈; 이완기고혈압=신장관련; 수축기고혈압=심장관련
- **당뇨**: 하삼황(신관+천황+제일좋다); 구갈시=통신; 맥미지황탕가감
- **불임**: 부과+환소교차자침(더욱효과); 내과~삼음교사이사혈
- **훈침응급**: 수해→하백투자=1침치유
- **이갈이**: 사화하=특효
- **중풍반신불수**: 먼저목화7-8분→령골+대백; 구리+칠리도마

## 사암침 임상강의 요점 (월오사암침법)

### 질환별 사암침 감별처방
- **요통유형별**: 굴신자통(뜨끔)=신허/신정격; 방광1선땡김=방광정격; 엉치멧돌감=방광정격; 허리뻣뻣=비승격; 좌위시요통=비허/비정격; 구립시요통·보행불가=대장허/대장정격; 오리궁둥이(회선불리)=담허/담정격; 허리구부정(펴지못함)=간허/간정격; 각궁반장=대장허+간실(함곡태충사)
- **슬통유형별**: 슬내측통=방광정격(건측); 슬외측통(견정압통有)=담정격+풍시사; 슬외측통(견정압통無)=풍시사+담정격; 슬부냉감=위정격; 슬내부쑤심=담정격; 오를때슬통=비정격+방광정격
- **손가락통증별**: 엄지=신정격/대도태백보사; 시지=대장정격/조구혈; 중지=위정격/위승한격(함곡); 약지=삼초정격; 소지=소장정격/어혈방
- **족관절통**: 음릉천+내양구(직자깊이자입); 뼈를향해닿을만큼자입
- **이통(욱신거림)**: 위승격/대장승격
- **이명(방광기인)**: 방광정격; 상양+통곡보, 태백+태계사
- **우울증**: 비정격
- **현훈**: 담허/담정격; 노극방(경거소부태백보, 기해신수사)
- **협심증**: 담정격+비정격; 소장정격
- **쥐잘남**: 담정격
- **팔들어돌리지못함**: 소장정격(60-70%)
- **꽃가루알레르기**: 간정격

### 사암침 주요처방 임상적용
- **어혈방**: 태백+태연보, 곡지사 (골절탁월; 곡지단독도가능); 음릉천+내양구병용가능
- **비정격**: 우울증, 만성요통(대맥압통), 파킨슨(출발느림), 협심증, 상처안나음, 식중독해독
- **담정격**: 현훈, 협심증, 쥐잘남, 슬외측통, 이갈이, 슬부쑤심
- **방광정격**: 슬내측통, 뇌출혈, 고혈압, 고소공포, 공포, 혈뇨
- **간정격**: 꽃가루알레르기, 결막염충혈(아폴로눈병=2회치료), 설사(놀란후/회먹고/돼지고기)
- **소장정격**: 대상포진, 화상물집, 쉽게멍듦, 수두, 접촉성피부염, 낙태위험하혈, 혈허제반증
- **대장정격**: 갑상선이상(항진저하), 변비설사, 비인후뽀드락지, 기미(여자)
- **신정격**: 발바닥통증(신정격바로호전), 대인공포, 골속소리
- **삼초정격**: 정신적문제, 치매, 정신피로
- **위승격**: 탄발지(함곡자극), 상처잘안나음, 이통(욱신), 이중염
- **노극방(경거소부태백보, 기해신수사)**: 뇌출혈후현훈, 천정돌아감, 시차적응불가; 1회시술로안정

### 중풍 응급·감별처방
- **응급**: 십선혈사혈(흥건하게); 뇌출혈시풍부습부항
- **뇌출혈**: 방광정격
- **뇌경색**: 발병전후상황보고결정; 바람싫어함=폐정격; 땀많이흘리고쓰러짐=소부보+대돈사(심정격)
- **간실증중풍**: 합곡+태충사(초기즉효)
- **중풍예방**: 일많이하는자=대장정격; 식사불규칙피로=비정격; 정신피로스트레스=삼초정격

## 일침경혈학 동씨혈 핵심처방

### 수지부 (일일부위)
- **오호1,2**: 수모지통; **오호2,3**: 족지통; **오호3,4**: 족배통·골극; **오호4,5**: 족근통·과관절통·골극
- **목혈(식지D선)**: 안구건조·비루·수피부병; 아토피응용
- **담혈(중지수배)**: 담허증+슬통; 담경상슬외측통; 상안검경련=목화삼+담혈+풍시
- **복원**: 어혈성족배통; 추간판탈출
- **부과+환소**: 부인과(월경부조·자궁질환·불임); 산후요통
- **화슬(소택)**: 심화성슬통·견비통; 관절운동시소리남; 심인성관절증
- **삼선**: 외부병독피부병; 식중독; 과민성피부염
- **사봉상혈**: 흉민·심계; 사봉삼=정신피로해소·두뇌명석

### 수장·수배부 (이이부위)
- **토수**: 소화불량·심하비; 위장성요통(누워있을때심화); 심하비통겸할때
- **중자+중선**: 배통·견통·경항통 광범위; 경추측면전면통; 감모해수; 소아기천
- **영골+대백**: 기허요각통(굴곡시); 해수천식기본혈; 서혜부통; 소화불량; 비질환; 자한
- **상백**: 경추디스크(1,2지측이상); 경항통+안질환동반; 슬하통; 구안와사안증상
- **중백+하백**: 기립시요통; 족관절외과통; 신중감요통; 인후통; 소퇴통; 고관절통
- **완순1,2(후계)**: 소복부+간자궁이상요각통(부녀다용); 협척혈통; 이명=사마방혈+명황+완순1,2

### 하비부·상비부 (삼삼·사사부위)
- **삼사(인사·지사·천사)**: 심폐작용; 정충특효혈; 심인성해수천식; 수장통·수지통
- **기문·기각·기정**: 치질·변비(연피자); 부녀불감증
- **간문+장문**: 간질환; 하안검경련=간문+상백+상삼황+풍시; 장문=급성장염
- **심문**: 심장병; 미골통; 서혜부~대퇴내측~슬내측통; 양반자세못할경우
- **견중**: 좌골신경통; 하지무력·냉통; 슬냉·족슬한냉; 경항피부병
- **상곡**: 소퇴창통; 좌골신경통; 간염·간경화(점자출혈)
- **정척1,2,3(곡지상2·4·6촌)**: 경추디스크(상골자); 가가폐심

### 족부 (오오·육육부위)
- **정근+정종(아킬레스건)**: 방광경전체통치; 요추경추디스크; 미골통; 족근통; 후두통; 척추측만증교정효과
- **삼중(외과상3촌)**: 구안괘사·편두통·이질환통치방; 중풍반신불수; 갑상선종대; 뇌진탕후유증; 코골이·이갈이
- **측삼리+측하삼리**: 편두통·구안괘사; 상비통통치방(+육완); 상지무력(+열결); 완관절무력통증
- **사화중·사화외(방혈)**: 위장병통치(반드시호전); 심장열증; 설사장염; 구안괘사기본혈
- **하삼황(천황·신관·지황·인황)**: 신허증전반; 통풍관절질환; 당뇨병; 뇨빈삭(신관특효); 사시; 수지마목통
- **사마(중·상·하)**: 폐병(폐기종·천식·비색·알레르기비염); 이명·이롱; 피부병; 족관절염좌(사마중·상=특효); 협통; 안면경련
- **상삼황(명황·천황·기황)**: 간병증전반; 경요추디스크; 현훈(+신관+부류); 대퇴질환통치(명황+사마중+통천+풍시)
- **통관+통산+통천**: 심허증; 전신관절통치(+견중+건중+신관); 부종; ※양측동시=혈압상승주의

### 대퇴내외측부 (팔팔부위)
- **통신+통위+통배**: 부종(기상시·소화불량시); 위산과다·속쓰림; 신방광질환; 견봉통
- **마금수+마쾌수**: 신허요통; 견배통; 경항통(광범위); 요안부통; 방광결석·신결석; 소변빈삭·뇨실금

### 두면부 (십십부위)
- **비익**: 기허성편두통·전두통·미능골통; 현훈(기허생담); 소뇌평형장애=담훈; 전신피로산통
- **옥화**: 어혈·혈허요각통; 월경후·산후요통(+부과+환소+완순1,2)
- **마금수**: 요안통·좌섬요통; **마쾌수**: 협척방산통·뇨빈삭·배뇨통
- **수금+수통(구각하)**: 신허해수천식(특히신관련); 기침시요통·대퇴통; 좌섬요통(+마금수+마쾌수)
- **삼금방혈(후배)**: 구병어혈슬통; 복부적취단단; 견통
- **충소방혈(S1-S5)**: 후두통(발제부위)

### 14경맥 주요임상혈
- **열결**: 두항통(사총혈); 편두통+수완무력; 상지무력(+측삼리측하삼리); 인후흉격(팔맥교회=조해)
- **소상방혈**: 식체해열; 인통심한감기; 족근통(아킬레스열감시); 소아해열
- **합곡+태충사(사관)**: 간실증중풍초기즉효; 부인과질환
- **후계사**: 항강낙침(좌우회전불능); 고관절통; 팔맥교회=독맥(요척통)
- **신맥**: 신전시요통; 좌우회전시요통; 不眠(사신맥보조해)
- **조해**: 복부경결환자; 두통+신경쓰면심화; 부인과질환; 인후(팔맥교회=열결); 불면(보조해사신맥)
- **속골**: 항강전후굴불능; 좌섬요통(심자); 수족3-5지저림
- **위중방혈**: 요이하후면부전체; 치질다용; 미골통(+금림방혈); 손발건조갈라짐(+척택방혈)
- **곤륜**: 경요추디스크(먼저사); 고관절통(사); 미골통; 후두통; 수장냉감(사); 척추측만
- **복삼**: 요각통·하지무력; 고관절통; 소퇴창통; 족근통(+합양)
- **음릉천**: 경항통(뼈이상); 관절염; 骨折·타박(새살생성빠름); 관절유연성회복
- **공손사**: 족관절염좌(이유없이삔경우효과); 소화장애요통; 식체겸구안괘사(+내관+해계사)
- **태백사**: 거습(사); 어혈처방(보곡지사); 한궐수족랭(+음곡사); 하지냉감(+음곡사)

## 기경팔맥 복진 (안진按診)

### 복진부위별 기경 대응
- **기해·음교혈부위(하복정중선)**: 독맥이상
- **12늑골~장골능사이**: 양교맥
- **양측계륵부(늑골하연)**: 양유맥
- **서혜부상단**: 대맥
- **관원·석문부위**: 임맥
- **천추혈심부경결**: 음교맥
- **대횡혈·심와부**: 음유맥
- **황유혈**: 충맥
- **천추혈천부**: 대장
- **우하복부(맹장부위)**: 위

### 기경치료원칙
- 전치(前治)·후치(後治) 중 하나만 사용
- 가장심한반응점에 먼저자침 → 짝을이루는 팔맥교회혈에 자침
- 예: 관원최압통=열결먼저자침→조해
- 기경처방중간에다른혈자침시 기경치료의미없음

## 평형침법 (平衡鍼法, Balance Acupuncture) 38혈위

### 취혈원칙
- **정위취혈**: 병변부위 특정혈 직접 선택
- **교차취혈**: 상지병=하지혈, 하지병=상지혈, 좌우교차
- **대응취혈**: 전후·좌우·상하 대응
- **남좌여우**: 동일혈 2개일 때 남=좌, 여=우
- **좌우교체**: 만성병 치료과정에서 교대 사용
- **양측동시**: 급성·중증일 때 양측 동시 사용
- 자침법: 삼쾌침(빠른자침·빠른득기·빠른발침) / 침감=酸麻脹痛 / 제삽법만 사용

### 두경부 9혈
| 혈명 | 위치(대응경혈) | 취혈원칙 | 주치 |
|---|---|---|---|
| **승제혈(升提)** | 백회 전방 2cm | 정위 | 탈항·자궁하수·위하수·저혈압·알레르기천식·전립선·만성병보조 |
| **요통혈(腰痛)** | 인당 상 1.5촌 | 정위·교차 | 요통·좌골신경통·추간판탈출·급성요부염좌 |
| **급구혈(急救)** | 인중(소료혈) | 정위 | 쇼크·혼미·멀미·소아경풍·간질·히스테리 |
| **편탄혈(偏癱)** | 이첨 상 1.5촌(율곡혈) | 교차 | 중풍후유증·반신불수·편두통·안면신경마비·삼차신경통 |
| **위통혈(胃痛)** | 구각 직하 1촌=승장 옆 1촌 | 남좌여우 | 급만성위염·위궤양·멀미·횡격막경련·생리통 |
| **비염혈(鼻炎)** | 외안각 직하 관골하연(권료=마금수) | 좌우교차 | 비염·알레르기비염·안면신경마비·삼차신경통·턱관절 |
| **아통혈(牙痛)** | 이수 전방 함요(청회혈) | 좌우교차 | 치통·안면신경마비·삼차신경통·턱관절·이하선염 |
| **명목혈(明目)** | 귓볼 하연 후방(예풍혈) | 교차 | 근시·백내장·녹내장·각종안과질환·안면마비 |
| **성뇌혈(醒腦)** | 후두골 융기 위 함몰(풍지혈) | 정위 | 치매·건망증·만성피로·혼미·고혈압 |

### 상지부 12혈
| 혈명 | 위치(대응경혈) | 취혈원칙 | 주치 |
|---|---|---|---|
| **둔통혈(臀痛)** | 견봉-액와 중점(견정혈) | 교차 | 이상근·좌골신경통·급성요부염좌·반대측경견증후군 |
| **슬통혈(膝痛)** | 주횡문-완관절 중점(곡지혈) | 교차 | 슬관절손상·퇴행성슬관절염·피부병·담마진 |
| **치창혈(痔瘡)** | 전완 배측 주관절쪽 1/3(사독 상 3촌) | 양측동시 | 치질·변비·흉부손상·늑간신경통·중풍실어 |
| **심병혈(心病)** | 우측 전완 배측 완관절쪽 1/3(삼초경) | 교차 | 협심증·심장질환·늑간신경통·대상포진·흉부통증 |
| **간병혈(肝病)** | 좌측 전완 배측 완관절쪽 1/3(삼초경) | 교차 | 간염·담낭염·담석증·늑간신경통·흉부통증 |
| **폐병혈(肺病)** | 전완 장측 주관절쪽 1/3(심포경=극문 상) | 양측동시 | 기관지염·천식·알레르기비염·상기도감염 |
| **강당혈(降糖)** | 전완 장측 완관절쪽 1/3(내관 상 2촌=간사혈) | 양측동시 | 당뇨병·고혈압·고지혈증·심교통 |
| **과통혈(踝痛)** | 완횡문 요골측 함요(대릉혈) | 교차·불면=남좌여우 | 족관절염좌·족근통·난치성불면·부정맥 |
| **인통혈(咽痛)** | 합곡혈 | 교차·양측동시 | 인두염·편도선염·삼차신경통·갑상선비대·산후결유 |
| **경통혈(頸痛)** | 4-5중수골 사이(액문혈) | 교차·경추중앙=양측 | 경추병·낙침·경견증후군·경성두통·현훈 |
| **감모혈(感冒)** | 3-4지 중수지절 사이(팔사혈) | 남좌여우·양측동시 | 감기·알레르기비염·두통·상기도감염 |
| **지마혈(指麻)** | 5중수골 중점(후계혈) | 동측 | 말초신경염·손가락마비·낙침·쇼크·당뇨 |

### 흉복부 2혈
| 혈명 | 위치 | 취혈원칙 | 주치 |
|---|---|---|---|
| **통경혈(通經)** | 전중 상방(단중혈 약간 위=자궁혈) | 정위 | 생리통·골반염·질염·비뇨기감염 |
| **면탄혈(面癱)** | 쇄골외측 1/3 상방 2촌(쇄골상와) | 교차(담낭염=동측) | 안면신경마비·이하선염·담낭염 |

### 척배부 2혈
| 혈명 | 위치 | 취혈원칙 | 주치 |
|---|---|---|---|
| **좌창혈(痤瘡)** | 대추혈+좌우 1cm (점자방혈) | 정위 | 여드름·지루성피부염·습진·담마진·급성결막염 |
| **유선혈(乳腺)** | 천종혈(견갑골 중점) | 전후대응 | 급성유선염·유선증식·산후결유·유방창통 |

### 하지부 13혈
| 혈명 | 위치(대응경혈) | 취혈원칙 | 주치 |
|---|---|---|---|
| **견배혈(肩背)** | 대전자-천골열공 1/2(환도혈) | 교차 | 경견증후군·반신불수·좌골신경통·정신분열 |
| **이롱혈(耳聾)** | 풍시혈 상방 3cm | 교차 | 이명·난청·메니에르·담마진·내이성현훈 |
| **과민혈(過敏)** | 슬개골내측-서혜부 중점(대퇴내측) | 양측동시 | 천식·담마진·알레르기피부·생리통·불임 |
| **주통혈(肘痛)** | 슬개골 하함요(독비혈=외슬안) | 교차 | 주관절손상·테니스엘보·골프엘보·담마진 |
| **강지혈(降脂)** | 비골두 전하방(양릉천 후하방) | 양측동시 | 고지혈증·급성복증·복통·고혈압·담낭염·건강보건 |
| **견통혈(肩痛)** | 족삼리 하 2촌 후방 1촌 ※평형침구 대표혈 | 교차 | 견관절손상·견주염·낙침·편두통·고혈압·담낭염·쇼크·혼미 |
| **전간혈(癲癎)** | 조구혈(슬개골하-과관절 중점) | 동시 | 간질·히스테리·정신분열·위염·수전증 |
| **조신혈(調神)** | 승산 상방 1촌 | 양측동시 | 정신분열·신경쇠약·쇼크·요부염좌·치질 |
| **신병혈(腎病)** | 외과첨 상 4촌 비골-경골 틈새 | 양측동시 | 신염·방광염·요도염·임포텐츠·조루·야뇨증·불면 |
| **궁병혈(宮病)** | 내과첨 상 4촌(삼음교 상 1촌) | 양측동시 | 생리통·골반염·불임·월경부조·폐경·자궁탈수 |
| **완통혈(腕痛)** | 외과첨 전방 함요(중봉 방향 횡자=구허혈) | 교차 | 완관절손상·안과질환(근시·백내장·녹내장) |
| **두통혈(頭痛)** | 태충-행간 중간(1-2중족골 사이) | 교차·완고성=양측 | 두통전반·편두통·고저혈압성두통·간질환 |
| **강압혈(降壓)** | 내과첨 직하 1.5촌(용천 방향=공손 후하방) | 좌우교체·양측동시 | 고혈압·쇼크·혼미·고열·정신분열 |

### 견통혈 배합혈 핵심조합
- 견통혈+경통혈: 견관절손상·견주염·낙침
- 견통혈+심병혈: 협심증·담낭염·담석증·대상포진·늑간신경통
- 견통혈+인통혈: 인후감염·삼차신경통
- 견통혈+위통혈: 급만성위염·소화성궤양·횡격막경련
- 견통혈+급구혈: 중풍혼미·간질발작·정신분열
- 견통혈+요통혈: 급성요부염좌
- 견통혈+둔통혈: 좌골신경통·이상근손상

### 질환계통별 배합처방
- **중풍후유증**: 편탄+견통+슬통 (편삼침) → +둔통+과통+완통
- **요추간판탈출**: 요통+둔통+슬통+과통
- **고혈압**: 강압+심병+간병+강지+두통
- **당뇨병**: 강당+강지+심병+간병+신병+강압+위통
- **감기**: 감모+인통+비염+좌창+폐병
- **안면신경마비**: 면탄+두통+비염+명목+아통+위통+편탄
- **이명·난청**: 이롱+신병+두통+명목
- **알레르기비염**: 비염+과민+승제+위통
- **생리통**: 통경+강지+위통+승제+좌창
- **갱년기**: 승제+궁병+심병+간병

## 사암침 정격·승격 12경락 완전공식

### 오장 정격·승격
- **간정격**: 곡천+음곡(보), 중봉+경거(사) → 간음허·간혈허
- **간승격**: 중봉+경거(보), 행간+소부(사) → 간화상염·간양항진
- **심정격**: 소충+대돈(보), 소해+음곡(사) → 심기허+수기범람
- **심승격**: 소해+음곡(보), 신문+태백(사) → 심음허+담음
- **심포정격**: 중충+대돈(보), 곡택+음곡(사) → 심포기허+수기
- **심포승격**: 곡택+음곡(보), 내관+공손(사) → 심포음허+담음
- **비정격**: 대도+소부(보), 은백+대돈(사) → 비기울체+중초양기부족
- **비승격**: 은백+대돈(보), 상구+경거(사) → 수습정체·부종
- **폐정격**: 태연+태백(보), 어제+소부(사) → 폐기허(폐열로 인한)
- **폐승격**: 어제+소부(보), 척택+음곡(사) → 폐양부족+수기상승
- **신정격**: 부류+경거(보), 태백+태계(사) → 신음허+납기불능
- **신승격**: 태백+태계(보), 용천+대돈(사) → 신정·신기고갈

### 육부 정격·승격
- **위정격**: 해계+양곡(보), 함곡+임읍(사) → 식적+위한증+근골격질환
- **위승격**: 함곡+임읍(보), 여태+상양(사) → 위장무력이완+부종종창
- **소장정격**: 후계+임읍(보), 전곡+통곡(사) → 독맥양기촉발+소장실열
- **소장승격**: 전곡+통곡(보), 하거허+삼리(사) → 소장열+역기강하
- **대장정격**: 곡지+삼리(보), 양계+양곡(사) → 진액흡수+조열(탁효) ※조열·습열 모두 치료
- **대장승격**: 양계+양곡(보), 이간+통곡(사) → 대장한증·염증치료
- **방광정격**: 지음+상양(보), 위중+삼리(사) → 습배출+위기강화(피부기부)
- **방광승격**: 위중+삼리(보), 속골+임읍(사) → 방광경라인뻐근당김
- **삼초정격**: 중저+임읍(보), 액문+통곡(사) → 삼초근골격+염증통증
- **삼초승격**: 액문+통곡(보), 천정+삼리(사) → 삼초허열+역기강하
- **담정격**: 협계+통곡(보), 규음+상양(사) → 담음허+풍열습
- **담승격**: 규음+상양(보), 양보+양곡(사) → 담화상염

## 장부 진단포인트·화혈

### 복진 진단포인트 & 화혈
| 장부 | 진단포인트 | 화혈(활성화) |
|---|---|---|
| 심포 | 단중 (심포·삼초 병리 반영) | 노궁 |
| 심 | 거궐 (통리·음극·신문=심장병) | 소부 |
| 폐 | 중부 (폐기허 시 반응 없을 수 있음) | 어제 |
| 간 | 소복 | 행간 |
| 신 | 경문→황수→신수 | 연곡 |
| 비 | 장문+거궐 (비양허 or 열울) | 대도 |
| 소장 | 관원+천종+노수+견정+독수+결수+관원수+소장수 | 양곡 |
| 삼초 | 단중+석문+천료+견료+삼초수+위양 (복만·압통) | 지구 |
| 대장 | 천추+거골+견우+대장수 | 양계 |
| 담 | 일월+견정+양릉천+양보+담수 | 양보 |
| 위 | 중완+위수+족삼리 | 해계 |
| 방광 | 중극+방광수+중려수+백환수+위중 | 통곡 |

### 배수혈 유수 진단
- **심유 압통**: 고혈압·허혈심장질환·뇌경색 의심
- **지양 압통**: 위장통 빈발 의심
- **비유 압통**: 소화장애·당뇨병 의심
- **폐유 압통**: 만성기침·천식·만성폐쇄성질환 의심
- 배수혈 위치별: 상부(호흡·순환기), 중부(소화·내분비), 하부(비뇨생식기)

## 침뜸자리 요약 (증상별 임상처방)

### 신경·정신
- **불면증(기본)**: 신문+거궐+행간+백회
- **불면증(심화)**: 완골+신문+신맥(사)+조해(보)
- **이갈이·코골이**: 하관(下關)

### 두통·뇌
- **편두통**: 구허+임읍+완골 (담석 확인)
- **미릉골통**: 내정
- **후두통**: 중극+천추+천주+풍지+곤륜+신맥
- **윗머리통**: 백회+신유+복류
- **골흔들림두통**: 무극보양뜸
- **중풍7대요혈**: 백회+곡빈+견정+풍시+족삼리+현종+곡지; 뇌경색=풍지+대추+간사 대신

### 반신불수 부위별
- 팔꿈치 오그라듦=곡택, 팔목=대릉, 오금=곡천, 발목=태계
- 손가락=팔사혈, 발가락=팔풍혈, 언어장애=염천+통리

### 호흡기·감기
- **감기**: 풍문+폐유+대추+외관+현종
- **기침**: 천돌+염천
- **열 내리기**: 대추+어제+외관+이내정
- **소아고열경기**: 이첨사혈
- **코피**: 극문(반대쪽 팔)

### 소화기
- **변비**: 황유+천추+지구 (상습변비특효)
- **치질**: 백회+공최+장강+승산

### 근골격
- **요통기본**: 신유+양관+대장유+위중
- **신허요통**: +차료+태계
- **좌섬요통**: +인중+찬죽
- **좌골신경통**: 신유+포황+은문+승근+족삼리+곡지+중완
- **허리디스크**: 양관+곤륜+위중+아시혈(포황외포황)+양릉천+은문+승근

### 대사·내분비
- **당뇨**: 신유+간유+폐유+비유+거궐+좌기문+좌양문+족삼리+곡지+중완+기해+관원+태계+수천
- **갱년기**: 무극보양뜸+신유+삼음교+전중
- **동맥경화**: 견외유+지양+심유+격유+천료+고황+천종+전중+기해+관원

### 치과
- **치통(윗니)**: 족삼리+해계+권료+화료+예풍
- **치통(아랫니)**: 합곡+곡지+협거+하관+예풍

### 부인과
- **불임(여)**: 중극+수도+삼음교(뜸); 난소=대거+외능+상료+차료
- **불임(남)**: 기해+관원+천추+신유+간유+폐유+고황+중완+곡지+족삼리

### 안과·이비인후
- **사시**: 간유+태충+곡지+족삼리+중완+동자료+찬죽+정명+합곡+풍지+천주+백회+통천

## 총통침 임상원리 (육부 오행혈 치법)

### 총통침 복진법 핵심
- 복진 → 병인 장부 결정 → 환자 병증 양상 분석 → 오행혈 선택 → 효과 확인
- **내상병 복진**: 중완(위장), 천추(대장), 석문(삼초·습울), 관원(소장·어혈), 중극(방광·습울), 일월·전중(담·삼초)
- **경락병 복진**: 거궐(대장경근), 견정(소장), 천종(소장), 위중(방광), 위양(삼초), 족삼리, 양릉천

### 오행혈 인체부위 대응
| 오행 | 주관 | 주치 | 대표혈 |
|---|---|---|---|
| 목(木) | 경근 | 굴신불리·굴신자통·장연동 | 임읍 |
| 화(火) | 혈맥 | 염증·통증·열울 | 양곡·지구 |
| 토(土) | 기육 | 뻐근·무거움·습울·몸살 | 족삼리·곡지 |
| 금(金) | 피모 | 외감·비증·땀구멍 | 상양 |
| 수(水) | 골수 | 자음강화·허열·뼈 | 통곡 |

### 대장 치법 (핵심)
- **삼간+임읍**: 경근소통·장운동촉진·굴신자통 (대장경락병 1순위)
- **곡지+삼리 보**: 대장 조열 → 진액흡수 원활
- **곡지+삼리 사**: 대장 습열 → 습울배출 (허리무거움·연변·기육뭉침)
- **양계+양곡 사**: 화혈 → 염증·통증 직효 (욱신거림·작열감)
- **양계+이간**: 열울보조 (심한 염증·구안와사·잇몸통증)
- **이간+통곡**: 잔여염증·뻑뻑한 느낌 해소
- **삼간+임읍+양계+양곡**: 급성염좌 기본방
- **삼간+임읍+곡지+삼리**: 대장 경락병+내상병 병용방
- **대장조열증**: 곡지+삼리 보 → 건조피부·천추 함몰·변비
- **대장습열증**: 곡지+삼리 사 → 천추 돌출·연변·작열감·습성피부

### 위장 치법
- **함곡+임읍**: 식적·체기 (담의 소설작용 이용)
- **해계 사**: 위열 즉효 (편두통·복통 동반 시)
- **해계+양곡+지구 사**: 위장 열울
- **내정+통곡**: 위장 조열 (건조·입술갈라짐·궤양)
- **여태+상양**: 위장 습울 (상안검부종·얼굴부종)
- **중완+상완+하완+양문+족삼리**: 체기 즉효방 (위장 활성화)
- **턱관절**: 위장 해계 사 우선

### 오행혈 장부별 조합표
| 장부 | 목혈 | 화혈 | 토혈 |
|---|---|---|---|
| 대장 | 삼간+임읍 | 양계+양곡 | 곡지+삼리 |
| 위장 | 함곡+임읍 | 해계+양곡 | 곡지+삼리 |
| 소장 | 후계+임읍 | 양곡→통곡(수혈대용) | 삼리+위중 |
| 삼초 | 중저+임읍 | 지구→통곡(수혈대용) | 삼리+위중 |
| 담 | 임읍+구허 | 양보+양곡 | 삼리+양릉천 |
| 방광 | 속골+임읍 | 통곡→수혈 | 위중+삼리 |

### 소장·삼초 특례
- 소장·삼초에서는 화혈 대신 **수혈(통곡·전곡)** 사용 → 상열하한 조절에 탁효
- 전곡+통곡 사 = 소장·삼초 열울 즉효 (관원수·소장수 염증 가만있어도 극통 → 금방 소실)
- 통곡 보 = 자음강화 (체열 낮은 사람의 상열증)
- 통곡 사 = 청열사화 (체열 높은 사람의 열울)

### 복진 원칙
- 천추 압통 없이 거궐만 → 아직 장부병 진행 전(경락병)
- 천추 압통 확인 → 내상병 진행 → 추가 병증 문진
- 대장: 조습도를 천추 외형으로 판별 (볼록=습열, 함몰=조열)
- 대장 조열+습열 혼재 → 아토피 형상 (진물+건조 동시)
- 경락병 선택 순서: 목혈로 굴신 확인 → 화혈로 염증 조절 → 토혈로 습울 처리

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
10. 동씨침(董氏針) 특효혈 병용 필수: tung_acupuncture.points 배열에 반드시 1개 이상 포함. 동씨침 참조표에서 주증상에 맞는 특효혈 선택. 빈 배열 반환 절대 금지. **좌골신경통·요각통은 후계(SI3)+신관(KD7)이 1순위 — 영골·대백만 단독 처방 금지.**
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
  [["좌골신경통", "하지 저림", "방사통", "하지방사", "요각통", "다리 저림"],
    "동씨침: [1순위] 후계(SI3) 건측 사법 + 신관(KD7) 양측 보법. 둔부통→견중(77.21) 추가. 방광경 라인→완순1(33.11)+완순2(33.12) 추가. 영골·대백은 보조 배합."],
  [["하지 부종", "양말 자국", "다리 붓기", "발목 부종"],
    "동씨침: 사화중(88.12)+사화외(88.13) 보법"],
  [["발뒤꿈치", "족저", "뒤꿈치", "족근통", "아킬레스"],
    "동씨침: 오호5혈(11.27) 1순위 (손등 제5중수골 기저 → 족근 상응), 골관(77.01)+목관(77.02) 병행 (골병·근병 구별), 급성이면 오호4·5+소절(11.26-27+22.04), 만성 4개월+이면 화전(22.01)+폐심(22.02), 수족상대로 대릉(PC7) 추가, 아킬레스건이면 정근(1010.01)+정종(1010.02)"],
  [["기침", "가래", "코막힘"],
    "동씨침: 오호(11.27) 보/사"],
  [["간경", "눈 충혈", "눈 건조", "협늑"],
    "동씨침: 명황(88.19)+천황부(88.14) 보법"],
  [["무릎 외측", "슬관절 외측", "측두통", "편두통", "성장통", "담경"],
    "동씨침: 중백(22.06)+하백(22.07) 보법 (담허 → 신기 보강) 또는 사화중(88.12)+사화외(88.13) 사법 (담실 → 소양경 울체 해소). 편두통이면 삼중1·2·3(77.07-09) 도마침 + 환측 태양혈 방혈"],
  [["오십견", "동결견", "어깨 굳음", "어깨 올리기"],
    "동씨침: 건측 신관(KD7)+견중(77.21). 방혈: 환측 척택(LU5) 정맥 방혈 필수 — 즉효"],
  [["섬좌요통", "삐끗", "급성 요통", "허리 삐"],
    "동씨침: 마금수(1010.19)+수통(1010.20) 자침 + 동기침법. 방혈: 위중(BL40) 환측"],
  [["전두통", "이마 두통", "눈 위 두통"],
    "동씨침: 화연(태백동일)+화국(공손동일) 보법. 함곡 사법 병용. 미릉골통에 특효"],
  [["후두통", "뒷머리", "목 뒷부분"],
    "동씨침: 정근(1010.01)+정종(1010.02). 독맥·방광경 주행 특효"],
  [["무릎 안쪽", "슬관절 내측", "무릎 전체"],
    "동씨침: 삼음경 무릎→영골(22.05)+대백(22.06) 건측 보법. 삼양경 무릎→중자+중선 도마침. 뼈 변성→오호2·3·4 병용"],
  [["불면", "수면", "잠 못", "잠이 안"],
    "동씨침: 심신문(88.01)+소해(HT3) 조합. 사암: 태음인→담정격, 소음인→심정격, 소양인→신문1혈"],
  [["이명", "귀 울림", "귀 소리"],
    "동씨침: 중백(22.06)+하백(22.07) + 목유(22.04)+삼중1·2·3(77.07-09). 정경: 중저(SJ3)+협계(GB43)+족임읍(GB41)"],
  [["구안와사", "안면마비", "입 돌아", "눈 못 감"],
    "동씨침: 삼중1·2·3(77.07-09) + 측삼리·측하삼리 도마침. 경락 감별: 간경→태충+태백, 위경→협계+양곡, 소장경→후계+임읍"],
  [["비염", "코막힘", "콧물", "알레르기 비염"],
    "동씨침: 사마상(88.11)+사마중(88.12)+사마하(88.13) 건측 도마침 1순위. 정경: 합곡(LI4)+곡지(LI11)+영향(LI20)"],
  [["고혈압", "혈압 높", "두통 어지"],
    "동씨침: 음허성→하삼황(88.17-19) 보법. 양허성→풍시(GB31)+족삼리(ST36). 보조: 인당+조해 양측"],
  [["발바닥", "족저 통증", "용천"],
    "동씨침: 신허성→하삼황(88.17-19)+태계(KD3). 담실위허→임읍+함곡 사법. 위실담허→임읍+함곡 보법"],
  [["목 돌리기", "낙침", "항강", "목 삐끗", "경항통"],
    "동씨침: 대백(22.05)+영골(22.06)+상백(上白) 건측. 정경: 정근(105)+정종(106)+정사(107). 뒷목단독→정근1혈"],
  [["디스크", "추간판", "골극", "척추 협착"],
    "동씨침: 복원(013)+후추(065)+수영(066) 도마침. 보조: 부장(098)+사화하(099)+명황(143)~기황(145)"],
  [["갑상선", "목 혹", "갑상선 기능"],
    "동씨침: 삼중1·2·3(77.07-09)+족천금(119)+족오금(120). 기능항진→상반(115)+사마상중하"],
  [["부정맥", "심계항진", "심장 약", "심장 두근"],
    "동씨침: 심문(056)+사화상(095)+사화이(096). 심장쇠약→내통관(126)+내통산(127)+내통천(128)"],
  [["여드름", "피부병", "주부습진", "피부 가려"],
    "동씨침: 사마상(88.11)+사마중(88.12)+사마하(88.13). 여드름→외삼관(121). 손피부→목혈(007)"],
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
      if (!env.GEMINI_API_KEY) {
        return Response.json(
          { detail: "Service misconfigured: API key not set" },
          { status: 503, headers: CORS_HEADERS }
        );
      }

      let patient: PatientInput;
      try {
        patient = await request.json<PatientInput>();
      } catch {
        return Response.json(
          { detail: "Invalid JSON body" },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const age = Number(patient.age);
      if (!age || age < 1 || age > 120 || !patient.gender || !patient.symptom?.trim()) {
        return Response.json(
          { detail: "age(1-120), gender, symptom are required" },
          { status: 422, headers: CORS_HEADERS }
        );
      }
      patient.age = age;

      const MAX_LEN = { symptom: 500, additional_notes: 1000, pulse: 200, tongue: 200, duration: 100 };
      if (patient.symptom.length > MAX_LEN.symptom) {
        return Response.json({ detail: `symptom must be ≤ ${MAX_LEN.symptom} chars` }, { status: 422, headers: CORS_HEADERS });
      }
      if (patient.additional_notes && patient.additional_notes.length > MAX_LEN.additional_notes) {
        patient.additional_notes = patient.additional_notes.slice(0, MAX_LEN.additional_notes);
      }
      if (patient.pulse && patient.pulse.length > MAX_LEN.pulse) patient.pulse = patient.pulse.slice(0, MAX_LEN.pulse);
      if (patient.tongue && patient.tongue.length > MAX_LEN.tongue) patient.tongue = patient.tongue.slice(0, MAX_LEN.tongue);
      if (patient.duration && patient.duration.length > MAX_LEN.duration) patient.duration = patient.duration.slice(0, MAX_LEN.duration);
      if (patient.secondary_symptoms) {
        patient.secondary_symptoms = patient.secondary_symptoms.slice(0, 10).map((s) => s.slice(0, 100));
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

      let geminiRes: Response;
      try {
        geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: geminiBody,
            signal: AbortSignal.timeout(25000),
          }
        );
      } catch (e) {
        const msg = e instanceof Error && e.name === "TimeoutError"
          ? "처방 생성 시간이 초과되었습니다. 증상을 좀 더 간략하게 입력 후 다시 시도하세요."
          : "처방 생성 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도하세요.";
        return Response.json({ detail: msg }, { status: 504, headers: CORS_HEADERS });
      }

      if (!geminiRes.ok) {
        const clientMsg = geminiRes.status === 429
          ? "요청이 너무 많습니다. 잠시 후 다시 시도하세요."
          : "처방 생성 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도하세요.";
        return Response.json(
          { detail: clientMsg },
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
