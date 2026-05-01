# FitPlan Skill

**语言：** [English](README.md) | 中文 | [Español](README.es.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [العربية](README.ar.md)

FitPlan Skill 是一个平台无关的 AI Skill 与 TypeScript 工具包，用于把用户画像转化为清晰可解释的热量目标、三大营养素目标、餐单建议，以及可在本地打开的 HTML 饮食仪表盘。

它既可以作为支持 `SKILL.md` 的 AI 助手技能使用，也可以作为 TypeScript 计算库集成到 Web、CLI、Bot、Agent 或后端服务中。

![FitPlan Skill dashboard preview](docs/images/dashboard-preview.png)

_README 预览图由 gpt-image-2 生成，仅用于展示效果。_

> FitPlan Skill 目前是 MVP，适合一般健身和饮食规划场景。它不提供医疗诊断、治疗或处方建议。

## 功能

- 使用 Mifflin-St Jeor 公式计算 BMR。
- 使用 PAL 活动系数估算 TDEE。
- 支持 `cut`、`bulk`、`maintain`、`glucose_control` 四类目标。
- 自动分配蛋白质、脂肪和碳水化合物目标。
- 基于内置中文食物库生成基础餐单。
- 明确标注食物重量基准：生重、熟重或包装营养标签。
- 输出结构化 JSON，便于其他应用或 Agent 继续处理。
- 渲染离线可用的单文件本地 HTML 仪表盘。

## 架构

FitPlan Skill 分为三层，方便在不同平台复用：

| 层级 | 文件 | 用途 |
| --- | --- | --- |
| Skill 指令层 | `SKILL.md` | 指导 AI 助手完成信息采集、计算、餐单生成和输出。 |
| 计算引擎层 | `src/` | 提供 BMR、TDEE、宏量营养素和餐单生成的 TypeScript 函数。 |
| 展示模板层 | `templates/` / `src/render/` | 生成可直接在浏览器打开的本地 HTML 仪表盘。 |

常见集成方式：

- **AI Skill：** 将仓库安装或复制到支持 Skill 的助手运行环境中。
- **TypeScript 库：** 在 Node.js、Web 构建、Agent Runtime 或后端服务中调用 `createFitPlan`。
- **本地 HTML 生成器：** 调用 `createFitPageHtml` 获取完整的独立 HTML 字符串。
- **数据包：** 复用并扩展 `assets/foods_zh.json` 作为初始食物库。

## 项目结构

```text
fitplan-skill/
├── SKILL.md                 # 平台无关的 AI Skill 指令
├── README.md                # 英文项目说明
├── assets/
│   └── foods_zh.json        # 中文食物数据库
├── docs/
│   └── nutrition-logic.md   # 公式和默认参数说明
├── src/
│   ├── calculators/         # BMR、TDEE 和宏量营养素计算
│   ├── planner/             # 餐单生成
│   ├── render/              # HTML 渲染
│   ├── types/               # TypeScript 类型
│   └── index.ts             # 公共 API 入口
├── scripts/
│   ├── clean.mjs            # 清理构建产物
│   └── copy-assets.mjs      # 将运行时资源复制到 dist
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

将仓库放入目标运行环境的 Skills 目录，并让助手读取 `SKILL.md`。用户可以直接用自然语言提出请求，例如：

```text
帮我做一个减脂饮食计划。我是男性，30 岁，175cm，75kg，每周训练 4 次，不吃牛肉。
```

Skill 会引导助手完成：

1. 收集或标准化身高、体重、年龄、性别、活动等级、目标和饮食偏好。
2. 计算 BMR、TDEE、目标热量和三大营养素目标。
3. 生成结构化餐单。
4. 在需要时渲染本地 HTML 仪表盘。
5. 对糖尿病、肾病、孕期、饮食障碍、未成年人、老年人等临床或高风险场景给出清晰边界。

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

`createFitPageHtml` 返回包含样式和数据的完整 HTML 文档，不依赖 CDN。

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

活动等级包括久坐、轻度、中等、高活动量和运动员级训练。目标包括减脂、增肌、维持体重和控糖友好规划。

## 输出内容

`createFitPlan` 返回标准化用户画像、BMR、TDEE、目标热量、蛋白质/脂肪/碳水克数、早餐/午餐/晚餐/加餐，以及食物重量、误差和健康边界说明。

## 食物库

内置食物库位于 `assets/foods_zh.json`。新增食物时请保持以下字段：

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

`basis` 用于说明重量口径：`raw` 为生重，`cooked` 为熟重，`packaged` 为包装营养标签口径。

## 计算逻辑

详细公式见 [docs/nutrition-logic.md](docs/nutrition-logic.md)。

默认策略：

- 减脂：`TDEE * 0.8`，蛋白质约 `2.0g/kg`
- 增肌：`TDEE * 1.1`，蛋白质约 `1.8g/kg`
- 维持：`TDEE * 1.0`，蛋白质约 `1.5g/kg`
- 控糖：`TDEE * 1.0`，碳水热量约限制在 38% 内

## 健康边界

FitPlan Skill 不诊断、治疗或管理疾病。糖尿病或正在使用降糖药物、肾病、肝病、心血管疾病、孕期或哺乳期、饮食障碍史、未成年人、老年人，以及近期手术或重大疾病恢复期人群，在调整饮食前应咨询医生或注册营养师。

## 许可证

MIT
