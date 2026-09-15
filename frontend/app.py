import streamlit as st
import requests
import os

API_URL = os.getenv("API_URL", "http://localhost:8080")

st.set_page_config(
    page_title="사암침 + 동씨침 처방 시스템",
    page_icon="🩺",
    layout="wide",
)

st.markdown("""
<style>
    .main-title {
        text-align: center;
        font-size: 2rem;
        font-weight: 700;
        color: #1a3a5c;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        text-align: center;
        font-size: 0.95rem;
        color: #6b7280;
        margin-bottom: 2rem;
    }
    .card {
        background: #ffffff;
        border-radius: 12px;
        padding: 1.2rem 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .card-title {
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9ca3af;
        margin-bottom: 0.6rem;
    }
    .diagnosis-value {
        font-size: 1.6rem;
        font-weight: 700;
        color: #1a3a5c;
    }
    .tag-heo {
        display: inline-block;
        background: #dbeafe;
        color: #1d4ed8;
        padding: 0.2rem 0.7rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-left: 0.5rem;
    }
    .tag-sil {
        display: inline-block;
        background: #fee2e2;
        color: #b91c1c;
        padding: 0.2rem 0.7rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-left: 0.5rem;
    }
    .method-badge {
        display: inline-block;
        background: #f0fdf4;
        color: #15803d;
        border: 1px solid #86efac;
        padding: 0.25rem 0.9rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 700;
        margin-bottom: 0.8rem;
    }
    .point-row {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f3f4f6;
        gap: 0.8rem;
    }
    .point-order {
        width: 24px;
        height: 24px;
        background: #1a3a5c;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        flex-shrink: 0;
    }
    .point-name { font-size: 1rem; font-weight: 600; color: #111827; min-width: 60px; }
    .point-code { font-size: 0.82rem; color: #6b7280; min-width: 50px; }
    .point-side { font-size: 0.85rem; color: #374151; min-width: 40px; }
    .action-bo {
        background: #eff6ff;
        color: #2563eb;
        padding: 0.1rem 0.55rem;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.85rem;
    }
    .action-sa {
        background: #fef2f2;
        color: #dc2626;
        padding: 0.1rem 0.55rem;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.85rem;
    }
    .rationale-text { font-size: 0.95rem; color: #374151; line-height: 1.7; }
    .caution-text { font-size: 0.9rem; color: #92400e; line-height: 1.6; }
    .confidence-high { color: #15803d; font-weight: 700; }
    .confidence-medium { color: #d97706; font-weight: 700; }
    .confidence-low { color: #dc2626; font-weight: 700; }
    .tung-card {
        background: #fffbeb;
        border-radius: 12px;
        padding: 1.2rem 1.5rem;
        margin-bottom: 1rem;
        border: 1.5px solid #f59e0b;
    }
    .tung-badge {
        display: inline-block;
        background: #fef3c7;
        color: #92400e;
        padding: 0.25rem 0.9rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 700;
        margin-bottom: 0.8rem;
    }
    .tung-indication { font-size: 0.78rem; color: #78716c; font-style: italic; }
    div[data-testid="stButton"] > button {
        width: 100%;
        background: #1a3a5c;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.65rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
    }
    div[data-testid="stButton"] > button:hover { background: #1e4a74; }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-title">🩺 사암침 + 동씨침 처방 시스템</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">KMD Clinical Assistant · Saam & Tung Acupuncture AI</div>', unsafe_allow_html=True)

col_form, col_result = st.columns([1, 1.6], gap="large")

with col_form:
    st.markdown("#### 환자 정보 입력")
    with st.form("patient_form"):
        age = st.number_input("연령 (세)", min_value=1, max_value=120, value=50, step=1)
        gender = st.radio("성별", ["남성", "여성"], horizontal=True)
        symptom = st.text_input("주증상 *", placeholder="예: 발뒤꿈치 통증, 요통, 두통")
        affected_side = st.selectbox("환측 (아픈 부위)", ["선택 안함", "좌측", "우측", "양측"])
        duration = st.text_input("이환기간", placeholder="예: 3일, 2주, 1개월")
        pulse = st.text_input("맥상", placeholder="예: 침세(沈細), 부삭(浮數)")
        tongue = st.text_input("설진", placeholder="예: 담홍설 박백태")
        secondary = st.text_input("부증상", placeholder="쉼표로 구분: 피로감, 야간뇨")
        notes = st.text_area("추가 소견", height=80, placeholder="기타 임상 소견")

        submitted = st.form_submit_button("처방 생성")

with col_result:
    if submitted:
        if not symptom.strip():
            st.error("주증상을 입력해 주세요.")
        else:
            payload = {
                "age": int(age),
                "gender": gender,
                "symptom": symptom.strip(),
                "affected_side": None if affected_side == "선택 안함" else affected_side,
            }
            if duration.strip():
                payload["duration"] = duration.strip()
            if pulse.strip():
                payload["pulse"] = pulse.strip()
            if tongue.strip():
                payload["tongue"] = tongue.strip()
            if secondary.strip():
                payload["secondary_symptoms"] = [s.strip() for s in secondary.split(",") if s.strip()]
            if notes.strip():
                payload["additional_notes"] = notes.strip()

            with st.spinner("사암침 + 동씨침 처방 생성 중..."):
                try:
                    res = requests.post(f"{API_URL}/prescription", json=payload, timeout=30)
                    res.raise_for_status()
                    data = res.json()
                except requests.exceptions.ConnectionError:
                    st.error("백엔드 서버에 연결할 수 없습니다. FastAPI 서버가 실행 중인지 확인하세요.")
                    st.stop()
                except Exception as e:
                    st.error(f"오류: {e}")
                    st.stop()

            diag = data.get("diagnosis", {})
            presc = data.get("prescription", {})
            sec = data.get("secondary_treatment", {})
            rationale = data.get("rationale", "")
            caution = data.get("caution")
            confidence = data.get("confidence", "medium")

            imbalance = diag.get("imbalance_type", "")
            tag_class = "tag-heo" if "허" in imbalance else "tag-sil"

            st.markdown(f"""
            <div class="card">
                <div class="card-title">🔍 변증 진단</div>
                <div class="diagnosis-value">
                    {diag.get("pattern", "-")}
                    <span class="{tag_class}">{imbalance}</span>
                </div>
                <div style="margin-top:0.6rem; font-size:0.9rem; color:#374151;">
                    주경락 <strong>{diag.get("primary_meridian", "-")}</strong>
                    {"&nbsp;·&nbsp; 보조 <strong>" + diag.get("secondary_meridian") + "</strong>" if diag.get("secondary_meridian") else ""}
                </div>
            </div>
            """, unsafe_allow_html=True)

            points = presc.get("points", [])
            points_html = ""
            for pt in sorted(points, key=lambda x: x.get("order", 0)):
                action = pt.get("action", "")
                action_cls = "action-bo" if action == "보" else "action-sa"
                points_html += f"""
                <div class="point-row">
                    <div class="point-order">{pt.get("order","")}</div>
                    <div class="point-name">{pt.get("point","")}</div>
                    <div class="point-code">{pt.get("point_code","")}</div>
                    <div class="point-side">{pt.get("side","")}측</div>
                    <div><span class="{action_cls}">{action}</span></div>
                </div>
                """

            st.markdown(f"""
            <div class="card">
                <div class="card-title">💉 처방 혈위</div>
                <div class="method-badge">{presc.get("method", "-")}</div>
                {points_html}
            </div>
            """, unsafe_allow_html=True)

            tung = data.get("tung_acupuncture", {})
            tung_points = sorted(tung.get("points", []), key=lambda x: x.get("order", 0))
            if tung_points:
                tung_rows_html = ""
                for pt in tung_points:
                    action = pt.get("action", "")
                    action_cls = "action-bo" if action in ("보", "Tonify", "补") else "action-sa"
                    indication = pt.get("indication", "")
                    ind_html = f'<div class="tung-indication">{indication}</div>' if indication else ""
                    tung_rows_html += f"""
                    <div class="point-row">
                        <div class="point-order" style="background:#92400e">{pt.get("order","")}</div>
                        <div><div class="point-name">{pt.get("point","")}</div>{ind_html}</div>
                        <div class="point-code">{pt.get("point_code","")}</div>
                        <div class="point-side">{pt.get("side","")}</div>
                        <div><span class="{action_cls}">{action}</span></div>
                    </div>
                    """
                tung_notes = tung.get("notes", "")
                notes_html = f'<div style="margin-top:0.8rem;padding-top:0.8rem;border-top:1px solid #fcd34d;font-size:0.82rem;color:#92400e">💡 {tung_notes}</div>' if tung_notes else ""
                st.markdown(f"""
                <div class="tung-card">
                    <div class="card-title" style="color:#92400e">동씨침 (董氏針) 특효혈</div>
                    <div class="tung-badge">동씨침 병용 처방</div>
                    {tung_rows_html}
                    {notes_html}
                </div>
                """, unsafe_allow_html=True)

            if rationale:
                st.markdown(f"""
                <div class="card">
                    <div class="card-title">📋 처방 근거</div>
                    <div class="rationale-text">{rationale}</div>
                </div>
                """, unsafe_allow_html=True)

            if caution:
                st.markdown(f"""
                <div class="card" style="border-color:#fcd34d; background:#fffbeb;">
                    <div class="card-title">⚠️ 주의사항</div>
                    <div class="caution-text">{caution}</div>
                </div>
                """, unsafe_allow_html=True)

            conf_cls = {"high": "confidence-high", "medium": "confidence-medium", "low": "confidence-low"}.get(confidence, "confidence-medium")
            conf_label = {"high": "높음 ✓", "medium": "보통", "low": "낮음 △"}.get(confidence, confidence)
            st.markdown(f"""
            <div style="text-align:right; font-size:0.82rem; color:#9ca3af; margin-top:0.3rem;">
                처방 신뢰도: <span class="{conf_cls}">{conf_label}</span>
            </div>
            """, unsafe_allow_html=True)

    else:
        st.markdown("""
        <div style="
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            height:340px; border:2px dashed #d1d5db; border-radius:12px; color:#9ca3af;
        ">
            <div style="font-size:3rem; margin-bottom:0.5rem;">🫁</div>
            <div style="font-size:1rem; font-weight:500;">환자 정보를 입력하고 처방 생성을 눌러주세요</div>
        </div>
        """, unsafe_allow_html=True)
