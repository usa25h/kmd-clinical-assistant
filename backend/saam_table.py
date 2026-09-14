# 사암침 정격/승격 처방 고정 테이블
# 출처: 사암침법 원전 + 임상 표준

from typing import TypedDict, List

class AcuPoint(TypedDict):
    point: str        # 한글명
    point_code: str   # WHO 코드
    action: str       # 보 | 사
    order: int

class SaamFormula(TypedDict):
    method: str              # 정격 | 승격
    primary_meridian: str
    secondary_meridian: str | None
    points: List[AcuPoint]

# 키: "{장부}_{허실}"  예) "비_허", "간_실"
SAAM_TABLE: dict[str, SaamFormula] = {
    "비_허": {
        "method": "정격",
        "primary_meridian": "비경",
        "secondary_meridian": "심경",
        "points": [
            {"point": "소부",  "point_code": "HT8",  "action": "보", "order": 1},
            {"point": "대도",  "point_code": "SP2",  "action": "보", "order": 2},
            {"point": "대돈",  "point_code": "LR1",  "action": "사", "order": 3},
            {"point": "은백",  "point_code": "SP1",  "action": "사", "order": 4},
        ],
    },
    "비_실": {
        "method": "승격",
        "primary_meridian": "비경",
        "secondary_meridian": "폐경",
        "points": [
            {"point": "경거",  "point_code": "LU8",  "action": "사", "order": 1},
            {"point": "상구",  "point_code": "SP5",  "action": "사", "order": 2},
            {"point": "소부",  "point_code": "HT8",  "action": "보", "order": 3},
            {"point": "대도",  "point_code": "SP2",  "action": "보", "order": 4},
        ],
    },
    "심_허": {
        "method": "정격",
        "primary_meridian": "심경",
        "secondary_meridian": "간경",
        "points": [
            {"point": "대돈",  "point_code": "LR1",  "action": "보", "order": 1},
            {"point": "소충",  "point_code": "HT9",  "action": "보", "order": 2},
            {"point": "음곡",  "point_code": "KD10", "action": "사", "order": 3},
            {"point": "소해",  "point_code": "HT3",  "action": "사", "order": 4},
        ],
    },
    "심_실": {
        "method": "승격",
        "primary_meridian": "심경",
        "secondary_meridian": "비경",
        "points": [
            {"point": "신문",  "point_code": "HT7",  "action": "사", "order": 1},
            {"point": "태백",  "point_code": "SP3",  "action": "사", "order": 2},
            {"point": "대돈",  "point_code": "LR1",  "action": "보", "order": 3},
            {"point": "소충",  "point_code": "HT9",  "action": "보", "order": 4},
        ],
    },
    "간_허": {
        "method": "정격",
        "primary_meridian": "간경",
        "secondary_meridian": "신경",
        "points": [
            {"point": "음곡",  "point_code": "KD10", "action": "보", "order": 1},
            {"point": "곡천",  "point_code": "LR8",  "action": "보", "order": 2},
            {"point": "경거",  "point_code": "LU8",  "action": "사", "order": 3},
            {"point": "중봉",  "point_code": "LR4",  "action": "사", "order": 4},
        ],
    },
    "간_실": {
        "method": "승격",
        "primary_meridian": "간경",
        "secondary_meridian": "심경",
        "points": [
            {"point": "행간",  "point_code": "LR2",  "action": "사", "order": 1},
            {"point": "소부",  "point_code": "HT8",  "action": "사", "order": 2},
            {"point": "음곡",  "point_code": "KD10", "action": "보", "order": 3},
            {"point": "곡천",  "point_code": "LR8",  "action": "보", "order": 4},
        ],
    },
    "폐_허": {
        "method": "정격",
        "primary_meridian": "폐경",
        "secondary_meridian": "비경",
        "points": [
            {"point": "태백",  "point_code": "SP3",  "action": "보", "order": 1},
            {"point": "태연",  "point_code": "LU9",  "action": "보", "order": 2},
            {"point": "소부",  "point_code": "HT8",  "action": "사", "order": 3},
            {"point": "어제",  "point_code": "LU10", "action": "사", "order": 4},
        ],
    },
    "폐_실": {
        "method": "승격",
        "primary_meridian": "폐경",
        "secondary_meridian": "신경",
        "points": [
            {"point": "척택",  "point_code": "LU5",  "action": "사", "order": 1},
            {"point": "음곡",  "point_code": "KD10", "action": "사", "order": 2},
            {"point": "태백",  "point_code": "SP3",  "action": "보", "order": 3},
            {"point": "태연",  "point_code": "LU9",  "action": "보", "order": 4},
        ],
    },
    "신_허": {
        "method": "정격",
        "primary_meridian": "신경",
        "secondary_meridian": "폐경",
        "points": [
            {"point": "경거",  "point_code": "LU8",  "action": "보", "order": 1},
            {"point": "부류",  "point_code": "KD7",  "action": "보", "order": 2},
            {"point": "태백",  "point_code": "SP3",  "action": "사", "order": 3},
            {"point": "태계",  "point_code": "KD3",  "action": "사", "order": 4},
        ],
    },
    "신_실": {
        "method": "승격",
        "primary_meridian": "신경",
        "secondary_meridian": "간경",
        "points": [
            {"point": "용천",  "point_code": "KD1",  "action": "사", "order": 1},
            {"point": "태계",  "point_code": "KD3",  "action": "사", "order": 2},
            {"point": "경거",  "point_code": "LU8",  "action": "보", "order": 3},
            {"point": "부류",  "point_code": "KD7",  "action": "보", "order": 4},
        ],
    },
    "담_허": {
        "method": "정격",
        "primary_meridian": "담경",
        "secondary_meridian": "소장경",
        "points": [
            {"point": "협계",  "point_code": "GB43", "action": "보", "order": 1},
            {"point": "통곡",  "point_code": "BL66", "action": "보", "order": 2},
            {"point": "임읍",  "point_code": "GB41", "action": "사", "order": 3},
            {"point": "속골",  "point_code": "BL65", "action": "사", "order": 4},
        ],
    },
    "담_실": {
        "method": "승격",
        "primary_meridian": "담경",
        "secondary_meridian": "위경",
        "points": [
            {"point": "양보",  "point_code": "GB38", "action": "사", "order": 1},
            {"point": "양곡",  "point_code": "SI5",  "action": "사", "order": 2},
            {"point": "협계",  "point_code": "GB43", "action": "보", "order": 3},
            {"point": "통곡",  "point_code": "BL66", "action": "보", "order": 4},
        ],
    },
    "소장_허": {
        "method": "정격",
        "primary_meridian": "소장경",
        "secondary_meridian": "담경",
        "points": [
            {"point": "후계",  "point_code": "SI3",  "action": "보", "order": 1},
            {"point": "임읍",  "point_code": "GB41", "action": "보", "order": 2},
            {"point": "통곡",  "point_code": "BL66", "action": "사", "order": 3},
            {"point": "속골",  "point_code": "BL65", "action": "사", "order": 4},
        ],
    },
    "소장_실": {
        "method": "승격",
        "primary_meridian": "소장경",
        "secondary_meridian": "위경",
        "points": [
            {"point": "양곡",  "point_code": "SI5",  "action": "사", "order": 1},
            {"point": "해계",  "point_code": "ST41", "action": "사", "order": 2},
            {"point": "후계",  "point_code": "SI3",  "action": "보", "order": 3},
            {"point": "임읍",  "point_code": "GB41", "action": "보", "order": 4},
        ],
    },
    "위_허": {
        "method": "정격",
        "primary_meridian": "위경",
        "secondary_meridian": "소장경",
        "points": [
            {"point": "해계",  "point_code": "ST41", "action": "보", "order": 1},
            {"point": "양곡",  "point_code": "SI5",  "action": "보", "order": 2},
            {"point": "임읍",  "point_code": "GB41", "action": "사", "order": 3},
            {"point": "양보",  "point_code": "GB38", "action": "사", "order": 4},
        ],
    },
    "위_실": {
        "method": "승격",
        "primary_meridian": "위경",
        "secondary_meridian": "대장경",
        "points": [
            {"point": "여태",  "point_code": "ST45", "action": "사", "order": 1},
            {"point": "상양",  "point_code": "LI1",  "action": "사", "order": 2},
            {"point": "해계",  "point_code": "ST41", "action": "보", "order": 3},
            {"point": "양곡",  "point_code": "SI5",  "action": "보", "order": 4},
        ],
    },
    "대장_허": {
        "method": "정격",
        "primary_meridian": "대장경",
        "secondary_meridian": "소장경",
        "points": [
            {"point": "양곡",  "point_code": "SI5",  "action": "보", "order": 1},
            {"point": "곡지",  "point_code": "LI11", "action": "보", "order": 2},
            {"point": "양보",  "point_code": "GB38", "action": "사", "order": 3},
            {"point": "임읍",  "point_code": "GB41", "action": "사", "order": 4},
        ],
    },
    "대장_실": {
        "method": "승격",
        "primary_meridian": "대장경",
        "secondary_meridian": "위경",
        "points": [
            {"point": "상양",  "point_code": "LI1",  "action": "사", "order": 1},
            {"point": "여태",  "point_code": "ST45", "action": "사", "order": 2},
            {"point": "양곡",  "point_code": "SI5",  "action": "보", "order": 3},
            {"point": "곡지",  "point_code": "LI11", "action": "보", "order": 4},
        ],
    },
    "방광_허": {
        "method": "정격",
        "primary_meridian": "방광경",
        "secondary_meridian": "신경",
        "points": [
            {"point": "부류",  "point_code": "KD7",  "action": "보", "order": 1},
            {"point": "지음",  "point_code": "BL67", "action": "보", "order": 2},
            {"point": "임읍",  "point_code": "GB41", "action": "사", "order": 3},
            {"point": "속골",  "point_code": "BL65", "action": "사", "order": 4},
        ],
    },
    "방광_실": {
        "method": "승격",
        "primary_meridian": "방광경",
        "secondary_meridian": "담경",
        "points": [
            {"point": "속골",  "point_code": "BL65", "action": "사", "order": 1},
            {"point": "통곡",  "point_code": "BL66", "action": "사", "order": 2},
            {"point": "부류",  "point_code": "KD7",  "action": "보", "order": 3},
            {"point": "지음",  "point_code": "BL67", "action": "보", "order": 4},
        ],
    },
    "삼초_허": {
        "method": "정격",
        "primary_meridian": "삼초경",
        "secondary_meridian": "담경",
        "points": [
            {"point": "중저",  "point_code": "SJ3",  "action": "보", "order": 1},
            {"point": "후계",  "point_code": "SI3",  "action": "보", "order": 2},
            {"point": "천정",  "point_code": "SJ10", "action": "사", "order": 3},
            {"point": "곡지",  "point_code": "LI11", "action": "사", "order": 4},
        ],
    },
    "삼초_실": {
        "method": "승격",
        "primary_meridian": "삼초경",
        "secondary_meridian": "소장경",
        "points": [
            {"point": "천정",  "point_code": "SJ10", "action": "사", "order": 1},
            {"point": "지구",  "point_code": "SJ6",  "action": "사", "order": 2},
            {"point": "중저",  "point_code": "SJ3",  "action": "보", "order": 3},
            {"point": "후계",  "point_code": "SI3",  "action": "보", "order": 4},
        ],
    },
}


def lookup(organ: str, deficiency: bool) -> SaamFormula | None:
    """organ: 비|심|간|폐|신|담|소장|위|대장|방광|삼초, deficiency: True=허, False=실"""
    key = f"{organ}_{'허' if deficiency else '실'}"
    return SAAM_TABLE.get(key)
