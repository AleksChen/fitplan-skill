# FitPlan Skill

FitPlan Skill 是一个通用的饮食规划 AI Skill，用于把用户画像转成可解释的热量、三大营养素、餐单建议和本地 HTML 饮食仪表盘。

它不绑定单一平台：可以作为支持 `SKILL.md` 的 AI 助手 Skill 使用，也可以作为 TypeScript 计算库集成到 Web、CLI、Bot、Agent 或后端服务中。

![FitPlan Skill dashboard preview](docs/images/dashboard-preview.png)

_Dashboard preview generated with gpt-image-2 for README illustration._

> 当前项目是 MVP。它适合一般饮食规划和健身目标拆解，不提供医疗诊断、治疗或处方建议。

## 功能

- 通过 Mifflin-St Jeor 公式计算 BMR。
- 通过 PAL 活动系数估算 TDEE。
- 支持 `cut`、`bulk`、`maintain`、`glucose_control` 四类目标。
- 自动分配蛋白质、脂肪和碳水目标。
- 基于内置中文食物库生成基础餐单。
- 明确食物重量基准：生重、熟重或包装标示。
- 输出结构化 JSON，方便其他应用继续处理。
- 渲染离线可用的单文件本地 HTML Dashboard，用户可以直接用浏览器打开。

## 适配平台

FitPlan Skill 分成三层，方便在不同平台复用：

| 层级 | 文件 | 用途 |
| --- | --- | --- |
| Skill 指令层 | `SKILL.md` | 给支持 Skill 的 AI 助手读取，指导它如何采集信息、计算和输出饮食计划。 |
| 计算引擎层 | `src/` | TypeScript 代码，提供 BMR、TDEE、宏量营养素和餐单生成函数。 |
| 展示模板层 | `templates/` / `src/render/` | 生成可本地打开的 HTML 饮食仪表盘。 |

可用方式包括：

- AI Skill：将仓库作为一个 Skill 安装或复制到目标平台的 Skills 目录。
- TypeScript library：在 Node.js、Web 构建工具或 Agent Runtime 中调用 `createFitPlan`。
- Local HTML generator：调用 `createFitPageHtml` 生成完整 HTML 字符串。
- Data package：复用 `assets/foods_zh.json` 作为初始食物库，并按相同 schema 扩展。

## 目录结构

```text
fitplan-skill/
├── SKILL.md                 # 通用 AI Skill 指令入口
├── README.md                # 项目说明和使用方法
├── assets/
│   └── foods_zh.json        # 50 种常见中文健康食物数据
├── docs/
│   └── nutrition-logic.md   # 计算公式和默认参数说明
├── src/
│   ├── calculators/         # BMR、TDEE、宏量营养素计算
│   ├── planner/             # 餐单生成
│   ├── render/              # HTML 渲染
│   ├── types/               # TypeScript 类型
│   └── index.ts             # 公共 API 入口
├── scripts/
│   └── copy-assets.mjs      # 跨平台构建资源复制脚本
├── templates/
│   └── modern-v1.html       # 单文件 HTML 模板
└── tests/                   # 单元测试
```

## 安装与开发

```bash
npm install
npm test
npm run build
```

也可以使用 pnpm：

```bash
pnpm install
pnpm test
pnpm run build
```

## 作为 AI Skill 使用

将仓库放到目标平台的 Skills 目录后，让助手读取 `SKILL.md`。用户可以用自然语言提出请求，例如：

```text
帮我做一个减脂饮食计划。我是男性，30 岁，175cm，75kg，每周训练 4 次，不吃牛肉。
```

Skill 会引导助手完成以下流程：

1. 收集或补全身高、体重、年龄、性别、活动等级、目标和饮食偏好。
2. 计算 BMR、TDEE、目标热量和三大营养素。
3. 生成结构化饮食计划。
4. 在需要时输出本地 HTML 仪表盘。
5. 对控糖、肾病、孕期、饮食障碍等高风险场景给出边界提示。

## 作为 TypeScript 库使用

```ts
import { createFitPlan, createFitPageHtml } from "fitplan-skill";

const input = {
  profile: {
    sex: "male",
    age: 30,
    heightCm: 175,
    weightKg: 75,
    activityLevel: "moderate",
    goal: "cut"
  }
} as const;

const plan = createFitPlan(input);
const html = createFitPageHtml(input);

console.log(plan.macros);
console.log(html);
```

示例输出节选：

```json
{
  "energy": {
    "bmr": 1699,
    "tdee": 2633,
    "targetCalories": 2106
  },
  "macros": {
    "calories": 2107,
    "proteinG": 150,
    "fatG": 47,
    "carbsG": 271
  },
  "meals": [
    {
      "slot": "breakfast",
      "title": "早餐",
      "totals": {
        "calories": 788,
        "proteinG": 43.9,
        "fatG": 35.7,
        "carbsG": 71.9
      }
    }
  ]
}
```

`createFitPageHtml` 返回完整 HTML 字符串，内部包含样式和数据，不依赖 CDN。

## 输入字段

```ts
type UserProfile = {
  sex: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "high" | "athlete";
  goal: "cut" | "bulk" | "maintain" | "glucose_control";
};
```

活动等级：

- `sedentary`：久坐，几乎不运动
- `light`：每周 1-3 次训练
- `moderate`：每周 3-5 次训练
- `high`：每周 6-7 次训练或体力劳动
- `athlete`：高训练量或接近每日两练

目标：

- `cut`：减脂，约 20% 热量缺口
- `bulk`：增肌，约 10% 热量盈余
- `maintain`：维持体重
- `glucose_control`：控糖友好，维持热量并降低碳水比例

## 输出内容

`createFitPlan` 返回：

- `profile`：标准化用户画像
- `energy.bmr`：基础代谢
- `energy.tdee`：每日总消耗
- `energy.targetCalories`：目标热量
- `macros`：蛋白质、脂肪、碳水克数
- `meals`：早餐、午餐、晚餐、加餐
- `notes`：食物重量、误差和健康边界说明

## 扩展食物库

内置食物库位于 `assets/foods_zh.json`。新增食物时保持以下字段：

```json
{
  "id": "chicken_breast_raw",
  "nameZh": "鸡胸肉",
  "category": "protein",
  "basis": "raw",
  "servingUnit": "g",
  "caloriesPer100g": 120,
  "proteinPer100g": 23,
  "fatPer100g": 2,
  "carbsPer100g": 0
}
```

`basis` 很重要：

- `raw`：生重
- `cooked`：熟重
- `packaged`：以包装营养标签为准

## 计算逻辑

详细公式见 [docs/nutrition-logic.md](docs/nutrition-logic.md)。

默认策略：

- 减脂：`TDEE * 0.8`，蛋白质约 `2.0g/kg`
- 增肌：`TDEE * 1.1`，蛋白质约 `1.8g/kg`
- 维持：`TDEE * 1.0`，蛋白质约 `1.5g/kg`
- 控糖：`TDEE * 1.0`，碳水热量约限制在 38% 内

## 健康边界

FitPlan Skill 不诊断、治疗或管理疾病。以下人群在改变饮食前应咨询医生或注册营养师：

- 糖尿病或正在使用降糖药物
- 肾病、肝病、心血管疾病
- 孕期、哺乳期
- 饮食障碍或相关病史
- 未成年人、老年人
- 近期手术、重大疾病恢复期

## 许可证

MIT
