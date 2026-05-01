# FitPlan Skill

**Idiomas:** [English](README.md) | [中文](README.zh-CN.md) | Español | [한국어](README.ko.md) | [日本語](README.ja.md) | [العربية](README.ar.md)

FitPlan Skill es una skill de IA y una biblioteca TypeScript, neutral respecto a la plataforma, que convierte el perfil de una persona en objetivos claros de calorías, macronutrientes, sugerencias de comidas y un panel nutricional HTML que puede abrirse localmente.

Puede utilizarse como skill para asistentes de IA mediante `SKILL.md`, o integrarse como biblioteca TypeScript en una aplicación web, una CLI, un bot, un agente o un servicio backend.

![FitPlan Skill dashboard preview](docs/images/dashboard-preview.png)

_Vista previa generada con gpt-image-2 para ilustrar el README._

> FitPlan Skill es un MVP orientado a planificación general de nutrición y fitness. No ofrece diagnóstico médico, tratamiento ni prescripciones.

## Funcionalidades

- Calcula el BMR con la ecuación de Mifflin-St Jeor.
- Estima el TDEE mediante factores de actividad PAL.
- Admite cuatro objetivos: `cut`, `bulk`, `maintain` y `glucose_control`.
- Distribuye automáticamente proteína, grasa y carbohidratos.
- Genera un plan inicial de comidas a partir de una base de alimentos china incluida.
- Indica con claridad si el peso del alimento es crudo, cocido o según la etiqueta del envase.
- Devuelve JSON estructurado para que otras aplicaciones o agentes lo reutilicen.
- Renderiza un panel HTML local, de un solo archivo y sin conexión.

## Arquitectura

FitPlan Skill se organiza en tres capas reutilizables:

| Capa | Archivos | Propósito |
| --- | --- | --- |
| Instrucciones de skill | `SKILL.md` | Guía al asistente en la toma de datos, cálculos, planificación y salida. |
| Motor de cálculo | `src/` | Funciones TypeScript para BMR, TDEE, macros y generación de comidas. |
| Capa de presentación | `templates/` / `src/render/` | Produce un panel HTML local listo para el navegador. |

Modos habituales de integración:

- **Skill de IA:** instala o copia el repositorio en un entorno compatible con skills.
- **Biblioteca TypeScript:** llama a `createFitPlan` desde Node.js, una app web, un agente o un backend.
- **Generador HTML local:** llama a `createFitPageHtml` para obtener un HTML completo e independiente.
- **Paquete de datos:** reutiliza y amplía `assets/foods_zh.json` como base inicial de alimentos.

## Instalación y desarrollo

```bash
npm install
npm test
npm run build
```

También puedes usar pnpm:

```bash
pnpm install
pnpm test
pnpm run build
```

## Uso como skill de IA

Coloca el repositorio en el directorio de Skills del entorno de destino y permite que el asistente lea `SKILL.md`. Una petición natural podría ser:

```text
Crea un plan de comidas para definición. Soy hombre, tengo 30 años, mido 175 cm, peso 75 kg, entreno 4 veces por semana y no como carne de res.
```

La skill ayuda al asistente a recopilar el perfil, calcular BMR, TDEE, calorías y macros, generar un plan estructurado, crear un panel HTML local cuando sea útil y añadir límites claros para contextos clínicos o de mayor riesgo.

## Uso como biblioteca TypeScript

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
```

`createFitPlan` devuelve el perfil normalizado, BMR, TDEE, calorías objetivo, macronutrientes, comidas y notas. `createFitPageHtml` devuelve un documento HTML completo, con estilos y datos incrustados, sin depender de CDN.

## Entrada

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

Los niveles de actividad cubren desde una vida sedentaria hasta entrenamiento de alto volumen. Los objetivos cubren pérdida de grasa, ganancia muscular, mantenimiento y planificación consciente de la glucosa.

## Base de alimentos y lógica nutricional

La base de alimentos incluida está en `assets/foods_zh.json`. Al añadir alimentos, conserva los campos `id`, `nameZh`, `category`, `basis`, `servingUnit` y los valores nutricionales por 100 g. El campo `basis` define el criterio de peso: `raw` para crudo, `cooked` para cocido y `packaged` para etiqueta del envase.

Las fórmulas están documentadas en [docs/nutrition-logic.md](docs/nutrition-logic.md). La estrategia predeterminada usa aproximadamente `TDEE * 0.8` para definición, `TDEE * 1.1` para volumen, `TDEE * 1.0` para mantenimiento y, para control de glucosa, calorías de mantenimiento con una proporción menor de carbohidratos.

## Límites de salud

FitPlan Skill no diagnostica, trata ni gestiona enfermedades. Las personas con diabetes o medicación hipoglucemiante, enfermedad renal, hepática o cardiovascular, embarazo o lactancia, antecedentes de trastornos alimentarios, menores, adultos mayores, o quienes estén recuperándose de una cirugía o enfermedad importante, deben consultar a un médico o dietista-nutricionista antes de cambiar su alimentación.

## Licencia

MIT
