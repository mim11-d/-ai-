# MuseBoard — Design Inspiration Generator

디자인 과제·포스터·브랜딩 시안 초기에 방향이 막막할 때, 버튼 하나로
**Mood · Color · Keyword** 한 세트를 랜덤 조합해 아이디어 브리프를 만들어주는 가벼운 웹앱입니다.

- **Mood** — CSS만으로 그린 추상 무드 비주얼 카드 (dreamy / minimal / retro / bold / organic / futuristic / calm). 외부 이미지·이미지 생성 없음.
- **Typography** — 무드명은 무드 분위기에 맞는 폰트로(minimal → 가늘고 넓은 자간, bold → Anton, futuristic → Orbitron 등), 키워드 3개는 서로 다른 폰트로 섞어 타이포 실험처럼 보여줍니다.
- **Color** — 무드에 맞춰 조화롭게 생성된 3~5색 팔레트. 컬러칩을 탭하면 HEX가 복사됩니다.
- **Keyword** — 컨셉을 풀어갈 출발 단어 3개.
- **Recolor** — 무드·키워드는 그대로 두고, 같은 분위기의 새 컬러 팔레트만 다시 뽑습니다. (라벨에 `Set 01 · v2`처럼 변형 횟수 표시)
- **Regenerate** — 완전히 새로운 무드·컬러·키워드 세트. (Spacebar로도 생성)
- **Copy** — 현재 브리프를 텍스트로 복사.

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
