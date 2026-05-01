import type { FitPlan } from "../types/index.js";

const dataToken = "__FITPLAN_DATA__";

export function renderFitPageHtml(plan: FitPlan, template = defaultTemplate): string {
  const serialized = JSON.stringify(plan).replace(/<\/script/gi, "<\\/script");
  return template.replace(dataToken, serialized);
}

export const defaultTemplate = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FitPlan 饮食计划</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7faf8;
      --panel: #ffffff;
      --panel-soft: #eef8f1;
      --text: #102018;
      --muted: #66756d;
      --line: #dce7df;
      --green: #108a45;
      --blue: #2563eb;
      --amber: #d97706;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 32px 0; }
    .hero { border-bottom: 1px solid var(--line); padding-bottom: 24px; }
    .eyebrow { color: var(--green); font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 8px; }
    h1 { font-size: clamp(30px, 5vw, 44px); line-height: 1.05; margin: 0; letter-spacing: 0; }
    h2 { font-size: 18px; margin: 0; }
    .summary { color: var(--muted); max-width: 680px; margin: 12px 0 0; }
    .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 24px; }
    .meal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 24px; }
    .card { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 20px; }
    .metric-label { color: var(--muted); font-size: 14px; margin: 0; }
    .metric-value { font-size: 30px; font-weight: 750; margin: 8px 0 0; letter-spacing: 0; }
    .metric-unit { color: var(--green); font-size: 14px; margin: 0; }
    .meal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .badge { background: var(--panel-soft); color: var(--green); border-radius: 6px; padding: 4px 8px; font-size: 13px; white-space: nowrap; }
    .table-wrap { margin-top: 16px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 520px; }
    th { color: var(--muted); font-weight: 650; text-align: left; padding: 10px 8px; }
    td { border-top: 1px solid var(--line); padding: 10px 8px; }
    .notes { margin-top: 24px; }
    .notes ul { color: var(--muted); font-size: 14px; margin: 12px 0 0; padding-left: 20px; }
    @media (max-width: 840px) {
      main { width: min(100% - 24px, 1120px); padding: 24px 0; }
      .metrics, .meal-grid { grid-template-columns: 1fr; }
      .card { padding: 16px; }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <p class="eyebrow">FitPlan Skill</p>
      <h1>饮食计划仪表盘</h1>
      <p id="summary" class="summary"></p>
    </section>
    <section class="metrics" id="metrics"></section>
    <section class="meal-grid" id="meals"></section>
    <section class="card notes">
      <h2>注意事项</h2>
      <ul id="notes"></ul>
    </section>
  </main>
  <script>
    const data = __FITPLAN_DATA__;
    const profile = data.profile;
    document.getElementById("summary").textContent =
      \`\${profile.age} 岁，\${profile.heightCm}cm，\${profile.weightKg}kg，目标：\${profile.goal}\`;

    const metrics = [
      ["BMR", data.energy.bmr, "kcal"],
      ["TDEE", data.energy.tdee, "kcal"],
      ["目标热量", data.energy.targetCalories, "kcal"],
      ["蛋白/脂肪/碳水", \`\${data.macros.proteinG} / \${data.macros.fatG} / \${data.macros.carbsG}\`, "g"]
    ];

    const metricsEl = document.getElementById("metrics");
    metrics.forEach(([label, value, unit]) => {
      const article = element("article", "card");
      article.append(
        element("p", "metric-label", label),
        element("p", "metric-value", String(value)),
        element("p", "metric-unit", unit)
      );
      metricsEl.appendChild(article);
    });

    const mealsEl = document.getElementById("meals");
    data.meals.forEach((meal) => {
      const article = element("article", "card");
      const head = element("div", "meal-head");
      head.append(element("h2", "", meal.title), element("span", "badge", \`\${meal.totals.calories} kcal\`));

      const tableWrap = element("div", "table-wrap");
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      ["食物", "重量", "蛋白", "脂肪", "碳水"].forEach((label) => headerRow.appendChild(element("th", "", label)));
      thead.appendChild(headerRow);

      const tbody = document.createElement("tbody");
      meal.foods.forEach((food) => {
        const row = document.createElement("tr");
        [
          food.nameZh,
          \`\${food.grams}g \${basisLabel(food.basis)}\`,
          \`\${food.proteinG}g\`,
          \`\${food.fatG}g\`,
          \`\${food.carbsG}g\`
        ].forEach((value) => row.appendChild(element("td", "", value)));
        tbody.appendChild(row);
      });

      table.append(thead, tbody);
      tableWrap.appendChild(table);
      article.append(head, tableWrap);
      mealsEl.appendChild(article);
    });

    const notesEl = document.getElementById("notes");
    data.notes.forEach((note) => notesEl.appendChild(element("li", "", note)));

    function basisLabel(basis) {
      return { raw: "生重", cooked: "熟重", packaged: "包装标示" }[basis] || basis;
    }

    function element(tagName, className, text) {
      const node = document.createElement(tagName);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }
  </script>
</body>
</html>`;
