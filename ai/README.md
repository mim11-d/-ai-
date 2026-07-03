# MuseBoard — Design Inspiration Generator

디자인 과제·포스터·브랜딩 시안 초기에 방향이 막막할 때, 버튼 하나로
**Mood · Color · Keyword** 한 세트를 랜덤 조합해 아이디어 브리프를 만들어주는 가벼운 웹앱입니다.

- **Mood** — CSS만으로 그린 추상 무드 비주얼 카드 (dreamy / minimal / retro / bold / organic / futuristic / calm). 외부 이미지·이미지 생성 없음.
- **Typography** — 무드명은 무드 분위기에 맞는 폰트로(minimal → 가늘고 넓은 자간, bold → Anton, futuristic → Orbitron 등), 키워드 3개는 서로 다른 폰트로 섞어 타이포 실험처럼 보여줍니다.
- **Color** — 무드에 맞춰 조화롭게 생성된 3~5색 팔레트. 컬러칩을 탭하면 HEX가 복사됩니다.
- **Keyword** — 컨셉을 풀어갈 출발 단어 3개.
- **Generate Inspiration** — 완전히 새로운 무드·컬러·키워드 세트. (Spacebar로도 생성)
- **Photo** — 사진을 업로드하면 그 사진에서 실제 대표 색상을 추출해 팔레트로 쓰고, 색의 채도·명도·색상 분포로 가장 가까운 무드를 매칭하고, 그 톤(warm/cool/bright/dark/soft/bold)에 어울리는 키워드를 골라줍니다. `<canvas>` 기반 색상 분석만 브라우저 안에서 수행하며, 이미지는 어디로도 업로드되지 않습니다. 사물 인식이 아니라 색 매칭이라 "사진 속 내용"까지 알아보진 못해요.
- **카드별 새로고침** — 각 카드(무드·컬러·키워드) 오른쪽 위 ↻ 버튼으로 그 부분만 다시 뽑습니다. 마음에 드는 건 두고 원하는 것만 바꿀 수 있어요. (부분 변경 시 라벨에 `Set 01 · v2`처럼 표시)
- **Save & 저장함** — 마음에 드는 조합은 Save로 저장하고, 우측 상단 북마크 아이콘(저장 개수 뱃지 포함)을 눌러 슬라이드 패널에서 언제든 다시 꺼내볼 수 있습니다. 저장 항목마다 **불러오기**(클릭)·**복사**·**삭제**가 가능합니다.
- **History (최근 기록)** — 같은 패널의 History 탭에서, Save를 누르지 않아도 최근 생성한 10개(전체 생성 + 카드별 새로고침 포함)를 자동으로 볼 수 있습니다. 마음에 드는 기록은 북마크 아이콘으로 Saved에 승격시키거나, 복사·클릭으로 바로 불러올 수 있습니다. "지우기"로 기록만 초기화할 수 있어요.
- 저장·기록 모두 브라우저 `localStorage`에만 남습니다(서버 전송 없음, 새로고침해도 유지).

## 구성

순수 HTML · CSS · JavaScript. 의존성·빌드·서버 없음.

```
index.html   # 마크업
style.css    # 스타일 + 무드 비주얼
script.js    # 생성 로직
```

> `.claude/`(serve.js, launch.json)는 로컬 미리보기 전용이며 배포에는 필요 없습니다.

## 로컬 실행

`index.html`을 브라우저에서 바로 열면 됩니다. (정적 서버가 필요하면 `node .claude/serve.js` 후 `http://localhost:4180`)

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소로 push.
2. 저장소 **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch를 `main` / 폴더를 `/ (root)`로 지정하고 저장.
4. 잠시 후 `https://<username>.github.io/<repo>/` 에서 확인.
