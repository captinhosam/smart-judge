import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not defined or is placeholder. Please configure it in your Secrets Panel.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// REST Legal Consultant API powered by Gemini AI
app.post("/api/gemini/consult", async (req, res) => {
  try {
    const { query, agentContext } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "الرجاء كتابة الاستفسار القانوني." });
    }

    try {
      const client = getGeminiClient();
      
      const systemInstruction = `
        أنت مستشار قضائي وقانوني ومساحي خبير ومتخصص في القوانين العربية والشرعية (مصر، السعودية، الخليج، إلخ).
        تقوم بتقديم استشارات قانونية دقيقة، مبسطة، ومنهجية وتوفر حلول رصينة ومحترفة.
        تتحدث باللغة العربية الفصحى بنبرة قضائية رصينة ومهذبة وموثوقة.
        سياق الاستفسار الحالي مرتبط بـ: ${agentContext || "التحليلات القضائية وتوزيع التركات والأوقاف والأراضي"}.
        اكتب الاستجابة مظهرة التفاصيل القانونية الهامة مع التوصيات الإرشادية.
      `;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nالسؤال المستعلم عنه:\n${query}` }] }
        ]
      });

      return res.json({
        success: true,
        answer: response.text,
        source: "ذكاء اصطناعي قضائي (Gemini 2.5)",
        timestamp: new Date().toLocaleTimeString("ar-EG")
      });

    } catch (apiError: any) {
      console.warn("Gemini API missing or failed, using smart rule-based legal advisor fallback:", apiError.message);
      
      // Intelligent Rule-Based Arabic Legal fallback
      const offlineAnswers: Record<string, string> = {
        "ميراث": "بناءً على الشريعة الإسلامية وقانون المواريث، يتم حصر التركة أولاً بعد سداد الديون والوصايا النافذة (في حدود الثلث لغير وارث). يرث الأولاد للذكر مثل حظ الأنثيين إذا انفردا أو اجتمعا مع أصحاب فروض كالأم (السدس في وجود فرع وارث) والزوجة (الثمن). يُنصح باستصدار إعلام وراثة رسمي لتثبيت الأنصبة الشرعية.",
        "وقف": "لتسجيل وقف رسمي، يجب تحرير حجة وقف شرعية لدى المحكمة المختصة أو وزارة الأوقاف. يشترط في الوقف ألا يكون على معصية، ويجوز للواقف تعيين ناظر للوقف وإدراج شروط الصرف (مثل الصرف على الأيتام، عمارة المسجد، أو الذرية). يخضع الوقف لرقابة مشددة لضمان مطابقة أوجه الصرف لشروط الواقف.",
        "نزاع": "في حالة تداخل صكوك الملكية أو وجود نزاع زراعي أو سكني، يتم تكليف خبير مساحي مرخص لرفع الإحداثيات ومقارنة صك الملكية مع المخطط التنظيمي المعتمد. ينصح باللجوء إلى لجان تسوية المنازعات ومكاتب الصلح القضائي لتجنب طول أمد التقاضي بالمحكمة الابتدائية.",
        "عقد": "يتطلب العقد الصحيح أركاناً أساسية: التراضي (الإيجاب والقبول)، والمحل (الشيء المتعاقد عليه شرط أن يكون مشروعاً وممكناً)، والسبب. يجب صياغة شروط فسخ العقد والشرط الجزائي بدقة متناهية لضمان حقوق الطرفين ومنع الغبن أو التحايل.",
        "ترخيص": "يخضع ترخيص البناء الهندسي لاشتراطات كود البناء الوطني المعتمد، متضمناً شهادة صلاحية الموقع للبناء، إعداد المخططات الهندسية من مكاتب استشارية معتمدة، وموافقة الدفاع المدني وهيئة المساحة للأراضي التابعة لقطاع الشؤون البلدية والقروية."
      };

      let answer = "يسعدنا تقديم الإرشاد القانوني الأولي. وفقاً للقواعد الاستشارية العامة، يتطلب هذا النوع من المعاملات تقديم المستندات الثبوتية كعقود الملكية أو التوكيلات الرسمية إلى الدوائر العقارية المختصة أو مكاتب الخبراء المعتمدين لدارسة الدعوى من كافة جوانبها ومطابقتها تنظيمياً ومساحياً.";
      
      const queryLower = query.toLowerCase();
      for (const [key, value] of Object.entries(offlineAnswers)) {
        if (queryLower.includes(key)) {
          answer = value;
          break;
        }
      }

      return res.json({
        success: true,
        answer: answer + "\n\n(ملاحظة: هذا الرد استرشادي فوري لعدم توفر أو تكوين مفتاح Gemini API في إعدادات المنصة)",
        source: "المستشار القانوني الاسترشادي التلقائي (قاعدة قواعد البيانات المدمجة)",
        timestamp: new Date().toLocaleTimeString("ar-EG")
      });
    }

  } catch (error: any) {
    res.status(500).json({ error: "حدث خطأ غير متوقع أثناء معالجة الاستشارة الاستشارية." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
