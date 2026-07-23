// Translation catalog for the app's interactive UI chrome. Covers the 10
// languages listed in state/slices/localeSlice.ts.
//
// Deliberately NOT translated here:
// - PRIVACY_POLICY_SECTIONS / TERMS_SECTIONS (content/legalContent.ts) — legal
//   text should go through professional/legal translation review before it
//   ships per-market, not machine translation. They stay English-only.
// - The Contact Us diagnostic email body — it's addressed to a specific
//   English-reading recipient (see utils/contactMail.ts).
// - "FaceAI" itself — brand name, not translated.
//
// Also out of scope: RTL layout mirroring for Arabic/Urdu. Text renders
// translated but the layout direction does not flip — a follow-up would
// need I18nManager.forceRTL plus a full layout pass.

export type LanguageCode = 'en' | 'zh' | 'hi' | 'es' | 'fr' | 'ar' | 'bn' | 'pt' | 'ru' | 'ur';

type TranslationKey = keyof typeof translations;

export const translations = {
  'nav.analyze': {
    en: 'Analyze', zh: '分析', hi: 'विश्लेषण', es: 'Analizar', fr: 'Analyser',
    ar: 'تحليل', bn: 'বিশ্লেষণ', pt: 'Analisar', ru: 'Анализ', ur: 'تجزیہ',
  },
  'nav.results': {
    en: 'Results', zh: '结果', hi: 'परिणाम', es: 'Resultados', fr: 'Résultats',
    ar: 'النتائج', bn: 'ফলাফল', pt: 'Resultados', ru: 'Результаты', ur: 'نتائج',
  },
  'nav.settings': {
    en: 'Settings', zh: '设置', hi: 'सेटिंग्स', es: 'Ajustes', fr: 'Paramètres',
    ar: 'الإعدادات', bn: 'সেটিংস', pt: 'Definições', ru: 'Настройки', ur: 'ترتیبات',
  },
  'disclaimer.text': {
    en: 'For entertainment purposes only. FaceAI does not provide clinical, psychological, or diagnostic assessments. Photos are processed in memory and never stored.',
    zh: '仅供娱乐使用。FaceAI 不提供任何临床、心理或诊断评估。照片仅在内存中处理，绝不会被存储。',
    hi: 'केवल मनोरंजन हेतु। FaceAI कोई नैदानिक, मनोवैज्ञानिक या डायग्नोस्टिक मूल्यांकन प्रदान नहीं करता। फ़ोटो केवल मेमोरी में प्रोसेस होती हैं और कभी संग्रहीत नहीं की जातीं।',
    es: 'Solo con fines de entretenimiento. FaceAI no ofrece evaluaciones clínicas, psicológicas ni de diagnóstico. Las fotos se procesan en memoria y nunca se almacenan.',
    fr: 'À des fins de divertissement uniquement. FaceAI ne fournit aucune évaluation clinique, psychologique ou diagnostique. Les photos sont traitées en mémoire et ne sont jamais stockées.',
    ar: 'لأغراض الترفيه فقط. لا يقدم FaceAI أي تقييمات سريرية أو نفسية أو تشخيصية. تتم معالجة الصور في الذاكرة فقط ولا يتم تخزينها أبدًا.',
    bn: 'শুধুমাত্র বিনোদনের উদ্দেশ্যে। FaceAI কোনো ক্লিনিক্যাল, মনস্তাত্ত্বিক বা রোগনির্ণয়মূলক মূল্যায়ন প্রদান করে না। ছবিগুলো শুধু মেমোরিতে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না।',
    pt: 'Apenas para fins de entretenimento. O FaceAI não fornece avaliações clínicas, psicológicas ou de diagnóstico. As fotos são processadas na memória e nunca armazenadas.',
    ru: 'Только в развлекательных целях. FaceAI не предоставляет клинических, психологических или диагностических заключений. Фото обрабатываются только в памяти и никогда не сохраняются.',
    ur: 'صرف تفریحی مقاصد کے لیے۔ FaceAI کوئی طبی، نفسیاتی یا تشخیصی جائزہ فراہم نہیں کرتا۔ تصاویر صرف میموری میں پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔',
  },
  'loading.subtitle': {
    en: 'Initializing Neural Matrix', zh: '正在初始化神经矩阵', hi: 'न्यूरल मैट्रिक्स आरंभ हो रहा है',
    es: 'Inicializando matriz neuronal', fr: 'Initialisation de la matrice neuronale',
    ar: 'جارٍ تهيئة المصفوفة العصبية', bn: 'নিউরাল ম্যাট্রিক্স চালু হচ্ছে', pt: 'A inicializar a matriz neural',
    ru: 'Инициализация нейросети', ur: 'نیورل میٹرکس شروع ہو رہا ہے',
  },
  'loading.status1': {
    en: 'CALIBRATING VISION ENGINE...', zh: '正在校准视觉引擎...', hi: 'विज़न इंजन कैलिब्रेट हो रहा है...',
    es: 'CALIBRANDO MOTOR DE VISIÓN...', fr: 'CALIBRAGE DU MOTEUR DE VISION...',
    ar: 'جارٍ معايرة محرك الرؤية...', bn: 'ভিশন ইঞ্জিন ক্যালিব্রেট হচ্ছে...', pt: 'A CALIBRAR MOTOR DE VISÃO...',
    ru: 'КАЛИБРОВКА ДВИЖКА ЗРЕНИЯ...', ur: 'ویژن انجن کیلیبریٹ ہو رہا ہے...',
  },
  'loading.status2': {
    en: 'DECRYPTING BIOMETRIC DATA...', zh: '正在解密生物特征数据...', hi: 'बायोमेट्रिक डेटा डिक्रिप्ट हो रहा है...',
    es: 'DESCIFRANDO DATOS BIOMÉTRICOS...', fr: 'DÉCHIFFREMENT DES DONNÉES BIOMÉTRIQUES...',
    ar: 'جارٍ فك تشفير البيانات الحيوية...', bn: 'বায়োমেট্রিক ডেটা ডিক্রিপ্ট হচ্ছে...', pt: 'A DESENCRIPTAR DADOS BIOMÉTRICOS...',
    ru: 'РАСШИФРОВКА БИОМЕТРИЧЕСКИХ ДАННЫХ...', ur: 'بایومیٹرک ڈیٹا ڈکرپٹ ہو رہا ہے...',
  },
  'loading.status3': {
    en: 'OPTIMIZING NEURAL PATHWAYS...', zh: '正在优化神经通路...', hi: 'न्यूरल पाथवे अनुकूलित हो रहे हैं...',
    es: 'OPTIMIZANDO VÍAS NEURONALES...', fr: 'OPTIMISATION DES VOIES NEURONALES...',
    ar: 'جارٍ تحسين المسارات العصبية...', bn: 'নিউরাল পাথওয়ে অপ্টিমাইজ হচ্ছে...', pt: 'A OTIMIZAR VIAS NEURAIS...',
    ru: 'ОПТИМИЗАЦИЯ НЕЙРОННЫХ ПУТЕЙ...', ur: 'نیورل راستے بہتر بنائے جا رہے ہیں...',
  },
  'loading.status4': {
    en: 'ESTABLISHING SECURE PROTOCOLS...', zh: '正在建立安全协议...', hi: 'सुरक्षित प्रोटोकॉल स्थापित हो रहे हैं...',
    es: 'ESTABLECIENDO PROTOCOLOS SEGUROS...', fr: 'ÉTABLISSEMENT DE PROTOCOLES SÉCURISÉS...',
    ar: 'جارٍ إنشاء بروتوكولات آمنة...', bn: 'নিরাপদ প্রোটোকল স্থাপন হচ্ছে...', pt: 'A ESTABELECER PROTOCOLOS SEGUROS...',
    ru: 'УСТАНОВКА ЗАЩИЩЁННЫХ ПРОТОКОЛОВ...', ur: 'محفوظ پروٹوکول قائم کیے جا رہے ہیں...',
  },
  'loading.status5': {
    en: 'SYNCHRONIZING COSMIC ARTIFACTS...', zh: '正在同步宇宙元素...', hi: 'कॉस्मिक आर्टिफैक्ट्स सिंक हो रहे हैं...',
    es: 'SINCRONIZANDO ARTEFACTOS CÓSMICOS...', fr: 'SYNCHRONISATION DES ARTEFACTS COSMIQUES...',
    ar: 'جارٍ مزامنة العناصر الكونية...', bn: 'কসমিক আর্টিফ্যাক্ট সিঙ্ক হচ্ছে...', pt: 'A SINCRONIZAR ARTEFACTOS CÓSMICOS...',
    ru: 'СИНХРОНИЗАЦИЯ КОСМИЧЕСКИХ АРТЕФАКТОВ...', ur: 'کائناتی نمونے ہم آہنگ ہو رہے ہیں...',
  },
  'onboarding.step0.headline': {
    en: 'AI-Powered Expression Reading', zh: 'AI 驱动的表情解读', hi: 'AI-संचालित एक्सप्रेशन रीडिंग',
    es: 'Lectura de expresiones con IA', fr: "Lecture d'expressions par IA",
    ar: 'قراءة التعابير بالذكاء الاصطناعي', bn: 'AI-চালিত এক্সপ্রেশন রিডিং', pt: 'Leitura de expressões com IA',
    ru: 'ИИ-анализ выражений лица', ur: 'AI سے چلنے والی ایکسپریشن ریڈنگ',
  },
  'onboarding.step0.body': {
    en: 'Capture three distinct facets of your character through our neural matrix: Calm, Bright, and Deep.',
    zh: '通过我们的神经矩阵捕捉你性格的三个不同面向：平静、明亮和深邃。',
    hi: 'हमारे न्यूरल मैट्रिक्स के ज़रिए अपने व्यक्तित्व के तीन अलग-अलग पहलुओं को कैप्चर करें: शांत, उज्ज्वल और गहन।',
    es: 'Captura tres facetas distintas de tu carácter a través de nuestra matriz neuronal: Calma, Brillante y Profunda.',
    fr: 'Capturez trois facettes distinctes de votre caractère grâce à notre matrice neuronale : Calme, Lumineux et Profond.',
    ar: 'التقط ثلاثة جوانب مميزة من شخصيتك عبر مصفوفتنا العصبية: الهادئ، والمشرق، والعميق.',
    bn: 'আমাদের নিউরাল ম্যাট্রিক্সের মাধ্যমে আপনার চরিত্রের তিনটি ভিন্ন দিক ধারণ করুন: শান্ত, উজ্জ্বল এবং গভীর।',
    pt: 'Capture três facetas distintas do seu caráter através da nossa matriz neural: Calma, Radiante e Profunda.',
    ru: 'Запечатлейте три разные грани своего характера с помощью нашей нейросети: Спокойствие, Сияние и Глубина.',
    ur: 'ہماری نیورل میٹرکس کے ذریعے اپنی شخصیت کے تین مختلف پہلو محفوظ کریں: پرسکون، روشن اور گہرا۔',
  },
  'onboarding.step1.headline': {
    en: 'Before We Begin', zh: '开始之前', hi: 'शुरू करने से पहले', es: 'Antes de empezar', fr: 'Avant de commencer',
    ar: 'قبل أن نبدأ', bn: 'শুরু করার আগে', pt: 'Antes de começar', ru: 'Прежде чем начать', ur: 'شروع کرنے سے پہلے',
  },
  'onboarding.step1.body': {
    en: 'Your photos are analyzed instantly and never stored. This is for entertainment only.',
    zh: '你的照片会被即时分析，绝不会被存储。本应用仅供娱乐使用。',
    hi: 'आपकी फ़ोटो तुरंत विश्लेषित होती हैं और कभी संग्रहीत नहीं होतीं। यह केवल मनोरंजन हेतु है।',
    es: 'Tus fotos se analizan al instante y nunca se almacenan. Esto es solo para entretenimiento.',
    fr: 'Vos photos sont analysées instantanément et ne sont jamais stockées. Ceci est uniquement pour le divertissement.',
    ar: 'يتم تحليل صورك فورًا ولا يتم تخزينها أبدًا. هذا لأغراض الترفيه فقط.',
    bn: 'আপনার ছবি তাৎক্ষণিকভাবে বিশ্লেষণ করা হয় এবং কখনো সংরক্ষণ করা হয় না। এটি শুধুমাত্র বিনোদনের জন্য।',
    pt: 'As suas fotos são analisadas instantaneamente e nunca armazenadas. Isto é apenas para entretenimento.',
    ru: 'Ваши фото анализируются мгновенно и никогда не сохраняются. Это только для развлечения.',
    ur: 'آپ کی تصاویر فوری طور پر تجزیہ کی جاتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔ یہ صرف تفریح کے لیے ہے۔',
  },
  'onboarding.ageCheckbox': {
    en: 'I confirm I am 18 years of age or older.', zh: '我确认我已年满18周岁。', hi: 'मैं पुष्टि करता/करती हूं कि मेरी आयु 18 वर्ष या उससे अधिक है।',
    es: 'Confirmo que tengo 18 años de edad o más.', fr: "Je confirme avoir 18 ans ou plus.",
    ar: 'أؤكد أن عمري 18 عامًا أو أكثر.', bn: 'আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছর বা তার বেশি।', pt: 'Confirmo que tenho 18 anos ou mais.',
    ru: 'Я подтверждаю, что мне 18 лет или больше.', ur: 'میں تصدیق کرتا/کرتی ہوں کہ میری عمر 18 سال یا اس سے زیادہ ہے۔',
  },
  'onboarding.consentCheckbox': {
    en: 'I consent to my photos being processed for this entertainment reading.',
    zh: '我同意我的照片被用于此娱乐性解读的处理。',
    hi: 'मैं इस मनोरंजन रीडिंग हेतु अपनी फ़ोटो प्रोसेस किए जाने के लिए सहमति देता/देती हूं।',
    es: 'Doy mi consentimiento para que mis fotos sean procesadas para esta lectura de entretenimiento.',
    fr: 'Je consens à ce que mes photos soient traitées pour cette lecture de divertissement.',
    ar: 'أوافق على معالجة صوري لهذه القراءة الترفيهية.',
    bn: 'আমি এই বিনোদনমূলক রিডিংয়ের জন্য আমার ছবি প্রক্রিয়া করার সম্মতি দিচ্ছি।',
    pt: 'Consinto que as minhas fotos sejam processadas para esta leitura de entretenimento.',
    ru: 'Я даю согласие на обработку моих фото для этого развлекательного анализа.',
    ur: 'میں اس تفریحی ریڈنگ کے لیے اپنی تصاویر پروسیس کیے جانے کی رضامندی دیتا/دیتی ہوں۔',
  },
  'onboarding.privacyLink': {
    en: 'Read our Privacy Policy', zh: '阅读我们的隐私政策', hi: 'हमारी गोपनीयता नीति पढ़ें', es: 'Lee nuestra Política de Privacidad',
    fr: 'Lire notre politique de confidentialité', ar: 'اقرأ سياسة الخصوصية الخاصة بنا', bn: 'আমাদের গোপনীয়তা নীতি পড়ুন',
    pt: 'Leia a nossa Política de Privacidade', ru: 'Прочитать нашу политику конфиденциальности', ur: 'ہماری پرائیویسی پالیسی پڑھیں',
  },
  'onboarding.next': {
    en: 'Next', zh: '下一步', hi: 'अगला', es: 'Siguiente', fr: 'Suivant', ar: 'التالي', bn: 'পরবর্তী', pt: 'Seguinte', ru: 'Далее', ur: 'اگلا',
  },
  'onboarding.getStarted': {
    en: 'Get Started', zh: '开始使用', hi: 'शुरू करें', es: 'Comenzar', fr: 'Commencer', ar: 'ابدأ الآن',
    bn: 'শুরু করুন', pt: 'Começar', ru: 'Начать', ur: 'شروع کریں',
  },
  'capture.permission.headline': {
    en: 'Camera Access Needed', zh: '需要相机权限', hi: 'कैमरा एक्सेस आवश्यक है', es: 'Se necesita acceso a la cámara',
    fr: "Accès à la caméra requis", ar: 'يلزم الوصول إلى الكاميرا', bn: 'ক্যামেরা অ্যাক্সেস প্রয়োজন', pt: 'Acesso à câmara necessário',
    ru: 'Требуется доступ к камере', ur: 'کیمرے تک رسائی درکار ہے',
  },
  'capture.permission.body': {
    en: 'FaceAI needs your camera to capture the three expressions for your reading. Photos are processed in memory and never stored.',
    zh: 'FaceAI 需要使用你的相机来捕捉解读所需的三种表情。照片仅在内存中处理，绝不会被存储。',
    hi: 'FaceAI को आपकी रीडिंग के लिए तीन एक्सप्रेशन कैप्चर करने हेतु आपके कैमरे की आवश्यकता है। फ़ोटो केवल मेमोरी में प्रोसेस होती हैं और कभी संग्रहीत नहीं की जातीं।',
    es: 'FaceAI necesita tu cámara para capturar las tres expresiones de tu lectura. Las fotos se procesan en memoria y nunca se almacenan.',
    fr: 'FaceAI a besoin de votre caméra pour capturer les trois expressions de votre lecture. Les photos sont traitées en mémoire et ne sont jamais stockées.',
    ar: 'يحتاج FaceAI إلى كاميرتك لالتقاط التعابير الثلاثة لقراءتك. تتم معالجة الصور في الذاكرة فقط ولا يتم تخزينها أبدًا.',
    bn: 'আপনার রিডিংয়ের জন্য তিনটি এক্সপ্রেশন ক্যাপচার করতে FaceAI-এর আপনার ক্যামেরা প্রয়োজন। ছবিগুলো শুধু মেমোরিতে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না।',
    pt: 'O FaceAI precisa da sua câmara para capturar as três expressões da sua leitura. As fotos são processadas na memória e nunca armazenadas.',
    ru: 'FaceAI нужен доступ к камере, чтобы запечатлеть три выражения лица для вашего анализа. Фото обрабатываются только в памяти и никогда не сохраняются.',
    ur: 'FaceAI کو آپ کی ریڈنگ کے لیے تین تاثرات کیپچر کرنے کے لیے آپ کے کیمرے کی ضرورت ہے۔ تصاویر صرف میموری میں پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔',
  },
  'capture.permission.button': {
    en: 'Allow Camera Access', zh: '允许访问相机', hi: 'कैमरा एक्सेस की अनुमति दें', es: 'Permitir acceso a la cámara',
    fr: "Autoriser l'accès à la caméra", ar: 'السماح بالوصول إلى الكاميرا', bn: 'ক্যামেরা অ্যাক্সেসের অনুমতি দিন', pt: 'Permitir acesso à câmara',
    ru: 'Разрешить доступ к камере', ur: 'کیمرے کی رسائی کی اجازت دیں',
  },
  'capture.step.calm.title': {
    en: 'Calm', zh: '平静', hi: 'शांत', es: 'Calma', fr: 'Calme', ar: 'هادئ', bn: 'শান্ত', pt: 'Calma', ru: 'Спокойствие', ur: 'پرسکون',
  },
  'capture.step.calm.prompt': {
    en: 'Hold a relaxed, neutral expression.', zh: '保持放松、中性的表情。', hi: 'एक शांत, न्यूट्रल एक्सप्रेशन बनाए रखें।',
    es: 'Mantén una expresión relajada y neutra.', fr: 'Gardez une expression détendue et neutre.',
    ar: 'حافظ على تعبير مسترخٍ ومحايد.', bn: 'একটি শিথিল, নিরপেক্ষ অভিব্যক্তি ধরে রাখুন।', pt: 'Mantenha uma expressão relaxada e neutra.',
    ru: 'Сохраняйте расслабленное, нейтральное выражение лица.', ur: 'ایک پرسکون، غیر جانبدار تاثر برقرار رکھیں۔',
  },
  'capture.step.bright.title': {
    en: 'Bright', zh: '明亮', hi: 'उज्ज्वल', es: 'Brillante', fr: 'Lumineux', ar: 'مشرق', bn: 'উজ্জ্বল', pt: 'Radiante', ru: 'Сияние', ur: 'روشن',
  },
  'capture.step.bright.prompt': {
    en: 'Show us your glow ✨', zh: '展现你的光彩 ✨', hi: 'हमें अपनी चमक दिखाएं ✨', es: 'Muéstranos tu brillo ✨',
    fr: 'Montrez-nous votre éclat ✨', ar: 'أرِنا إشراقتك ✨', bn: 'আমাদের আপনার ঔজ্জ্বল্য দেখান ✨', pt: 'Mostre-nos o seu brilho ✨',
    ru: 'Покажите нам своё сияние ✨', ur: 'ہمیں اپنی چمک دکھائیں ✨',
  },
  'capture.step.deep.title': {
    en: 'Deep', zh: '深邃', hi: 'गहन', es: 'Profunda', fr: 'Profond', ar: 'عميق', bn: 'গভীর', pt: 'Profunda', ru: 'Глубина', ur: 'گہرا',
  },
  'capture.step.deep.prompt': {
    en: 'Now give us your mysterious side 🌙', zh: '现在展现你神秘的一面 🌙', hi: 'अब हमें अपना रहस्यमयी पक्ष दिखाएं 🌙',
    es: 'Ahora muéstranos tu lado misterioso 🌙', fr: 'Montrez-nous maintenant votre côté mystérieux 🌙',
    ar: 'الآن أرِنا جانبك الغامض 🌙', bn: 'এবার আমাদের আপনার রহস্যময় দিকটি দেখান 🌙', pt: 'Agora mostre-nos o seu lado misterioso 🌙',
    ru: 'Теперь покажите нам свою загадочную сторону 🌙', ur: 'اب ہمیں اپنا پراسرار پہلو دکھائیں 🌙',
  },
  'analyze.title': {
    en: 'Analyze', zh: '分析', hi: 'विश्लेषण', es: 'Analizar', fr: 'Analyser', ar: 'تحليل', bn: 'বিশ্লেষণ', pt: 'Analisar', ru: 'Анализ', ur: 'تجزیہ',
  },
  'analyze.subtitle': {
    en: 'Choose a reading to run.', zh: '选择要运行的解读。', hi: 'चलाने के लिए एक रीडिंग चुनें।', es: 'Elige una lectura para ejecutar.',
    fr: 'Choisissez une lecture à lancer.', ar: 'اختر قراءة لتشغيلها.', bn: 'চালানোর জন্য একটি রিডিং বেছে নিন।', pt: 'Escolha uma leitura para executar.',
    ru: 'Выберите анализ для запуска.', ur: 'چلانے کے لیے ایک ریڈنگ منتخب کریں۔',
  },
  'analyze.module.threeExpression.title': {
    en: '3-Expression Face Reading', zh: '三表情面部解读', hi: '3-एक्सप्रेशन फेस रीडिंग', es: 'Lectura facial de 3 expresiones',
    fr: 'Lecture faciale à 3 expressions', ar: 'قراءة الوجه بثلاث تعابير', bn: '৩-এক্সপ্রেশন ফেস রিডিং', pt: 'Leitura facial de 3 expressões',
    ru: 'Анализ лица по 3 выражениям', ur: '3 تاثرات پر مبنی چہرے کی ریڈنگ',
  },
  'analyze.module.threeExpression.description': {
    en: 'Capture Calm, Bright, and Deep expressions for your AI character reading.',
    zh: '捕捉平静、明亮和深邃三种表情，获取你的 AI 性格解读。',
    hi: 'अपनी AI कैरेक्टर रीडिंग के लिए शांत, उज्ज्वल और गहन एक्सप्रेशन कैप्चर करें।',
    es: 'Captura las expresiones Calma, Brillante y Profunda para tu lectura de carácter con IA.',
    fr: 'Capturez les expressions Calme, Lumineux et Profond pour votre lecture de caractère par IA.',
    ar: 'التقط تعابير الهادئ والمشرق والعميق لقراءة شخصيتك بالذكاء الاصطناعي.',
    bn: 'আপনার AI ক্যারেক্টার রিডিংয়ের জন্য শান্ত, উজ্জ্বল ও গভীর অভিব্যক্তি ধারণ করুন।',
    pt: 'Capture as expressões Calma, Radiante e Profunda para a sua leitura de caráter com IA.',
    ru: 'Запечатлейте выражения «Спокойствие», «Сияние» и «Глубина» для ИИ-анализа характера.',
    ur: 'اپنی AI کریکٹر ریڈنگ کے لیے پرسکون، روشن اور گہرے تاثرات کیپچر کریں۔',
  },
  'analyze.module.relationshipHarmony.title': {
    en: 'Relationship Harmony Analyzer', zh: '关系和谐度分析', hi: 'रिलेशनशिप हार्मनी एनालाइज़र',
    es: 'Analizador de armonía en pareja', fr: 'Analyseur d’harmonie relationnelle',
    ar: 'محلل انسجام العلاقة', bn: 'রিলেশনশিপ হারমনি অ্যানালাইজার', pt: 'Analisador de harmonia no relacionamento',
    ru: 'Анализатор гармонии в отношениях', ur: 'ریلیشن شپ ہارمنی تجزیہ کار',
  },
  'analyze.module.relationshipHarmony.description': {
    en: 'See how your expressions reflect connection, chemistry, and compatibility.',
    zh: '了解你的表情如何反映情感联结、化学反应与契合度。',
    hi: 'देखें आपके एक्सप्रेशन किस तरह जुड़ाव, केमिस्ट्री और अनुकूलता दर्शाते हैं।',
    es: 'Descubre cómo tus expresiones reflejan conexión, química y compatibilidad.',
    fr: 'Découvrez comment vos expressions reflètent la connexion, la alchimie et la compatibilité.',
    ar: 'اكتشف كيف تعكس تعابيرك التواصل والانسجام والتوافق.',
    bn: 'দেখুন আপনার অভিব্যক্তি কীভাবে সংযোগ, রসায়ন ও সামঞ্জস্য প্রতিফলিত করে।',
    pt: 'Veja como as suas expressões refletem ligação, química e compatibilidade.',
    ru: 'Узнайте, как ваши выражения лица отражают связь, химию и совместимость.',
    ur: 'دیکھیں آپ کے تاثرات کس طرح تعلق، کیمسٹری اور مطابقت کی عکاسی کرتے ہیں۔',
  },
  'analyze.module.careerMatch.title': {
    en: 'What Job Suits You', zh: '最适合你的职业', hi: 'आपके लिए कौन सी नौकरी उपयुक्त है',
    es: 'Qué trabajo te conviene', fr: 'Quel métier vous convient',
    ar: 'ما الوظيفة التي تناسبك', bn: 'আপনার জন্য কোন চাকরি উপযুক্ত', pt: 'Que trabalho combina consigo',
    ru: 'Какая работа вам подходит', ur: 'آپ کے لیے کون سی نوکری موزوں ہے',
  },
  'analyze.module.careerMatch.description': {
    en: 'Discover career paths that match your natural expression style.',
    zh: '发现与你天然表情风格相匹配的职业方向。',
    hi: 'अपनी स्वाभाविक एक्सप्रेशन शैली से मेल खाते करियर विकल्प खोजें।',
    es: 'Descubre carreras que encajan con tu estilo natural de expresión.',
    fr: 'Découvrez des carrières qui correspondent à votre style d’expression naturel.',
    ar: 'اكتشف المسارات المهنية التي تناسب أسلوب تعابيرك الطبيعي.',
    bn: 'আপনার স্বাভাবিক এক্সপ্রেশন স্টাইলের সাথে মানানসই ক্যারিয়ার পথ আবিষ্কার করুন।',
    pt: 'Descubra percursos profissionais que combinam com o seu estilo natural de expressão.',
    ru: 'Узнайте карьерные пути, которые соответствуют вашему естественному стилю выражения.',
    ur: 'اپنے فطری ایکسپریشن انداز سے میل کھاتے کیریئر کے راستے دریافت کریں۔',
  },
  'analyze.comingSoonBadge': {
    en: 'COMING SOON', zh: '即将推出', hi: 'जल्द आ रहा है', es: 'PRÓXIMAMENTE', fr: 'BIENTÔT DISPONIBLE',
    ar: 'قريبًا', bn: 'শীঘ্রই আসছে', pt: 'EM BREVE', ru: 'СКОРО', ur: 'جلد آ رہا ہے',
  },
  'analyze.comingSoon': {
    en: 'More reading modules are on the way ✦', zh: '更多解读模块即将上线 ✦', hi: 'और भी रीडिंग मॉड्यूल जल्द आ रहे हैं ✦',
    es: 'Más módulos de lectura están en camino ✦', fr: "D'autres modules de lecture arrivent ✦",
    ar: 'المزيد من وحدات القراءة قادمة قريبًا ✦', bn: 'আরও রিডিং মডিউল শীঘ্রই আসছে ✦', pt: 'Mais módulos de leitura estão a caminho ✦',
    ru: 'Скоро появятся новые модули анализа ✦', ur: 'مزید ریڈنگ ماڈیولز جلد آ رہے ہیں ✦',
  },
  'results.title': {
    en: 'Results', zh: '结果', hi: 'परिणाम', es: 'Resultados', fr: 'Résultats', ar: 'النتائج', bn: 'ফলাফল', pt: 'Resultados', ru: 'Результаты', ur: 'نتائج',
  },
  'results.emptyTitle': {
    en: 'No Readings Yet', zh: '暂无解读记录', hi: 'अभी तक कोई रीडिंग नहीं', es: 'Aún no hay lecturas', fr: "Aucune lecture pour l'instant",
    ar: 'لا توجد قراءات بعد', bn: 'এখনো কোনো রিডিং নেই', pt: 'Ainda sem leituras', ru: 'Пока нет анализов', ur: 'ابھی تک کوئی ریڈنگ نہیں',
  },
  'results.emptyBody': {
    en: 'Your past readings will show up here once you complete your first analysis.',
    zh: '完成首次分析后，你的历史解读记录将会显示在这里。',
    hi: 'आपकी पहली विश्लेषण पूरी होने के बाद पिछली रीडिंग यहां दिखाई देंगी।',
    es: 'Tus lecturas anteriores aparecerán aquí una vez que completes tu primer análisis.',
    fr: 'Vos lectures précédentes apparaîtront ici une fois votre première analyse terminée.',
    ar: 'ستظهر قراءاتك السابقة هنا بمجرد إكمال أول تحليل لك.',
    bn: 'আপনার প্রথম বিশ্লেষণ সম্পন্ন হলে অতীতের রিডিংগুলো এখানে দেখা যাবে।',
    pt: 'As suas leituras anteriores aparecerão aqui assim que concluir a sua primeira análise.',
    ru: 'Здесь появятся ваши прошлые анализы после завершения первого.',
    ur: 'آپ کی پہلی تجزیہ مکمل ہونے کے بعد پچھلی ریڈنگز یہاں دکھائی دیں گی۔',
  },
  'common.startAnalysis': {
    en: 'Start Analysis', zh: '开始分析', hi: 'विश्लेषण शुरू करें', es: 'Iniciar análisis', fr: "Démarrer l'analyse",
    ar: 'بدء التحليل', bn: 'বিশ্লেষণ শুরু করুন', pt: 'Iniciar análise', ru: 'Начать анализ', ur: 'تجزیہ شروع کریں',
  },
  'review.headerTitle': {
    en: 'Rate Experience', zh: '评价体验', hi: 'अनुभव को रेट करें', es: 'Calificar experiencia', fr: "Évaluer l'expérience",
    ar: 'تقييم التجربة', bn: 'অভিজ্ঞতা রেট করুন', pt: 'Avaliar experiência', ru: 'Оценить опыт', ur: 'تجربے کی درجہ بندی کریں',
  },
  'review.headline': {
    en: 'Enjoying your insights with FaceAI?', zh: '喜欢 FaceAI 给你的洞察吗？', hi: 'FaceAI के साथ अपने इनसाइट्स का आनंद ले रहे हैं?',
    es: '¿Disfrutando tus análisis con FaceAI?', fr: 'Vous appréciez vos analyses avec FaceAI ?',
    ar: 'هل تستمتع برؤاك مع FaceAI؟', bn: 'FaceAI-এর সাথে আপনার ইনসাইট উপভোগ করছেন?', pt: 'A gostar das suas análises com o FaceAI?',
    ru: 'Нравятся ваши результаты в FaceAI?', ur: 'کیا آپ FaceAI کے ساتھ اپنی بصیرت سے لطف اندوز ہو رہے ہیں؟',
  },
  'review.body': {
    en: 'Your feedback helps us train our AI models and improve your experience.',
    zh: '你的反馈将帮助我们训练 AI 模型并改善你的体验。',
    hi: 'आपकी प्रतिक्रिया हमें हमारे AI मॉडल को प्रशिक्षित करने और आपके अनुभव को बेहतर बनाने में मदद करती है।',
    es: 'Tu opinión nos ayuda a entrenar nuestros modelos de IA y mejorar tu experiencia.',
    fr: "Vos commentaires nous aident à entraîner nos modèles d'IA et à améliorer votre expérience.",
    ar: 'ملاحظاتك تساعدنا على تدريب نماذج الذكاء الاصطناعي وتحسين تجربتك.',
    bn: 'আপনার মতামত আমাদের AI মডেল প্রশিক্ষণে ও অভিজ্ঞতা উন্নত করতে সাহায্য করে।',
    pt: 'O seu feedback ajuda-nos a treinar os nossos modelos de IA e a melhorar a sua experiência.',
    ru: 'Ваш отзыв помогает нам обучать модели ИИ и улучшать ваш опыт.',
    ur: 'آپ کی رائے ہمیں AI ماڈلز کو تربیت دینے اور آپ کے تجربے کو بہتر بنانے میں مدد دیتی ہے۔',
  },
  'review.rateButton': {
    en: 'Rate on App Store', zh: '前往 App Store 评分', hi: 'ऐप स्टोर पर रेट करें', es: 'Calificar en App Store',
    fr: "Évaluer sur l'App Store", ar: 'قيّمنا على متجر التطبيقات', bn: 'অ্যাপ স্টোরে রেট করুন', pt: 'Avaliar na App Store',
    ru: 'Оценить в App Store', ur: 'ایپ اسٹور پر ریٹ کریں',
  },
  'review.maybeLater': {
    en: 'Maybe Later', zh: '以后再说', hi: 'शायद बाद में', es: 'Quizás más tarde', fr: 'Plus tard peut-être',
    ar: 'ربما لاحقًا', bn: 'হয়তো পরে', pt: 'Talvez mais tarde', ru: 'Может быть позже', ur: 'شاید بعد میں',
  },
  'review.starLabel': {
    en: 'Rate {n} stars', zh: '评{n}星', hi: '{n} स्टार रेट करें', es: 'Calificar con {n} estrellas', fr: 'Noter {n} étoiles',
    ar: 'قيّم بـ {n} نجوم', bn: '{n} তারকা রেট করুন', pt: 'Avaliar com {n} estrelas', ru: 'Оценить на {n} звёзд', ur: '{n} ستارے دیں',
  },
  'paywall.headline': {
    en: 'Unlock Full AI Face Insights', zh: '解锁完整 AI 面部洞察', hi: 'पूर्ण AI फेस इनसाइट्स अनलॉक करें',
    es: 'Desbloquea todos los análisis faciales con IA', fr: 'Débloquez toutes les analyses faciales par IA',
    ar: 'افتح رؤى الوجه الكاملة بالذكاء الاصطناعي', bn: 'সম্পূর্ণ AI ফেস ইনসাইট আনলক করুন', pt: 'Desbloqueie todas as análises faciais com IA',
    ru: 'Откройте полный ИИ-анализ лица', ur: 'مکمل AI فیس بصیرت اَن لاک کریں',
  },
  'paywall.subtitle': {
    en: 'Experience unlimited 3-expression analysis and deep personality reports.',
    zh: '体验无限次三表情分析和深度性格报告。',
    hi: 'असीमित 3-एक्सप्रेशन विश्लेषण और गहन व्यक्तित्व रिपोर्ट का अनुभव करें।',
    es: 'Disfruta de análisis ilimitados de 3 expresiones e informes de personalidad profundos.',
    fr: "Profitez d'analyses illimitées à 3 expressions et de rapports de personnalité approfondis.",
    ar: 'استمتع بتحليل غير محدود بثلاث تعابير وتقارير شخصية عميقة.',
    bn: 'সীমাহীন ৩-এক্সপ্রেশন বিশ্লেষণ ও গভীর ব্যক্তিত্ব রিপোর্ট উপভোগ করুন।',
    pt: 'Desfrute de análises ilimitadas de 3 expressões e relatórios de personalidade profundos.',
    ru: 'Получите неограниченный анализ по 3 выражениям и глубокие отчёты о личности.',
    ur: 'لامحدود 3-ایکسپریشن تجزیہ اور گہری شخصیت رپورٹس سے لطف اندوز ہوں۔',
  },
  'paywall.trialBanner': {
    en: '🎁 3-Day Free Trial — cancel anytime before it ends.', zh: '🎁 3天免费试用 — 结束前随时可取消。',
    hi: '🎁 3-दिन का निःशुल्क ट्रायल — समाप्त होने से पहले कभी भी रद्द करें।',
    es: '🎁 Prueba gratuita de 3 días — cancela cuando quieras antes de que termine.',
    fr: "🎁 Essai gratuit de 3 jours — annulez à tout moment avant la fin.",
    ar: '🎁 تجربة مجانية لمدة 3 أيام — يمكنك الإلغاء في أي وقت قبل انتهائها.',
    bn: '🎁 ৩-দিনের বিনামূল্যে ট্রায়াল — শেষ হওয়ার আগে যেকোনো সময় বাতিল করুন।',
    pt: '🎁 Teste gratuito de 3 dias — cancele a qualquer momento antes do fim.',
    ru: '🎁 3-дневная бесплатная пробная версия — отмените в любой момент до её окончания.',
    ur: '🎁 3 دن کا مفت ٹرائل — ختم ہونے سے پہلے کسی بھی وقت منسوخ کریں۔',
  },
  'paywall.feature1': {
    en: 'Unlimited 3-Expression AI Character Readings', zh: '无限次三表情 AI 性格解读',
    hi: 'असीमित 3-एक्सप्रेशन AI कैरेक्टर रीडिंग', es: 'Lecturas de carácter con IA de 3 expresiones ilimitadas',
    fr: 'Lectures de caractère par IA à 3 expressions illimitées', ar: 'قراءات شخصية غير محدودة بثلاث تعابير بالذكاء الاصطناعي',
    bn: 'সীমাহীন ৩-এক্সপ্রেশন AI ক্যারেক্টার রিডিং', pt: 'Leituras de caráter com IA de 3 expressões ilimitadas',
    ru: 'Неограниченный ИИ-анализ характера по 3 выражениям', ur: 'لامحدود 3-ایکسپریشن AI کریکٹر ریڈنگز',
  },
  'paywall.feature2': {
    en: 'Deep Personality & Vibe Reports', zh: '深度性格与氛围报告', hi: 'गहन व्यक्तित्व और वाइब रिपोर्ट',
    es: 'Informes profundos de personalidad y vibra', fr: 'Rapports approfondis de personnalité et de vibe',
    ar: 'تقارير عميقة عن الشخصية والطاقة', bn: 'গভীর ব্যক্তিত্ব ও ভাইব রিপোর্ট', pt: 'Relatórios profundos de personalidade e vibe',
    ru: 'Глубокие отчёты о личности и атмосфере', ur: 'گہری شخصیت اور وائب رپورٹس',
  },
  'paywall.feature3': {
    en: 'Full Reading History & High-Res Story Share Cards', zh: '完整解读历史与高清故事分享卡',
    hi: 'पूर्ण रीडिंग हिस्ट्री और हाई-रेस स्टोरी शेयर कार्ड्स', es: 'Historial completo de lecturas y tarjetas para compartir en alta resolución',
    fr: "Historique complet des lectures et cartes de partage haute résolution", ar: 'سجل كامل للقراءات وبطاقات مشاركة عالية الدقة',
    bn: 'সম্পূর্ণ রিডিং ইতিহাস ও উচ্চ-রেজোলিউশন শেয়ার কার্ড', pt: 'Histórico completo de leituras e cartões de partilha em alta resolução',
    ru: 'Полная история анализов и карточки для сторис в высоком разрешении', ur: 'مکمل ریڈنگ ہسٹری اور ہائی ریزولوشن اسٹوری شیئر کارڈز',
  },
  'paywall.mostPopular': {
    en: 'MOST POPULAR', zh: '最受欢迎', hi: 'सबसे लोकप्रिय', es: 'MÁS POPULAR', fr: 'LE PLUS POPULAIRE',
    ar: 'الأكثر شيوعًا', bn: 'সবচেয়ে জনপ্রিয়', pt: 'MAIS POPULAR', ru: 'САМЫЙ ПОПУЛЯРНЫЙ', ur: 'سب سے مقبول',
  },
  'paywall.weeklyName': {
    en: 'Weekly Pass', zh: '每周订阅', hi: 'साप्ताहिक पास', es: 'Pase semanal', fr: 'Pass hebdomadaire',
    ar: 'اشتراك أسبوعي', bn: 'সাপ্তাহিক পাস', pt: 'Passe semanal', ru: 'Недельный абонемент', ur: 'ہفتہ وار پاس',
  },
  'paywall.weeklyDescription': {
    en: '3-day free trial included', zh: '含3天免费试用', hi: '3-दिन का निःशुल्क ट्रायल शामिल', es: 'Incluye prueba gratuita de 3 días',
    fr: "Essai gratuit de 3 jours inclus", ar: 'يشمل تجربة مجانية لمدة 3 أيام', bn: '৩-দিনের বিনামূল্যে ট্রায়াল অন্তর্ভুক্ত', pt: 'Inclui teste gratuito de 3 dias',
    ru: 'Включена 3-дневная бесплатная пробная версия', ur: '3 دن کا مفت ٹرائل شامل ہے',
  },
  'paywall.weeklyCadence': {
    en: '/WEEK AFTER TRIAL', zh: '/周（试用后）', hi: '/सप्ताह (ट्रायल के बाद)', es: '/SEMANA TRAS LA PRUEBA', fr: "/SEMAINE APRÈS L'ESSAI",
    ar: '/أسبوعيًا بعد التجربة', bn: '/সপ্তাহ (ট্রায়ালের পর)', pt: '/SEMANA APÓS O TESTE', ru: '/НЕДЕЛЮ ПОСЛЕ ПРОБНОГО ПЕРИОДА', ur: '/ہفتہ (ٹرائل کے بعد)',
  },
  'paywall.annualName': {
    en: 'Annual Pass', zh: '年度订阅', hi: 'वार्षिक पास', es: 'Pase anual', fr: 'Pass annuel', ar: 'اشتراك سنوي',
    bn: 'বার্ষিক পাস', pt: 'Passe anual', ru: 'Годовой абонемент', ur: 'سالانہ پاس',
  },
  'paywall.saveBadge': {
    en: 'SAVE 60%', zh: '节省60%', hi: '60% बचाएं', es: 'AHORRA 60%', fr: 'ÉCONOMISEZ 60%', ar: 'وفّر 60٪',
    bn: '৬০% সাশ্রয়', pt: 'POUPE 60%', ru: 'ЭКОНОМИЯ 60%', ur: '60% کی بچت',
  },
  'paywall.annualDescription': {
    en: 'Best value for enthusiasts', zh: '最超值的选择', hi: 'उत्साही लोगों के लिए सबसे अच्छा मूल्य', es: 'La mejor relación calidad-precio',
    fr: 'Le meilleur rapport qualité-prix', ar: 'أفضل قيمة للمهتمين', bn: 'উৎসাহীদের জন্য সেরা মূল্য', pt: 'Melhor valor para entusiastas',
    ru: 'Лучшая цена для энтузиастов', ur: 'شائقین کے لیے بہترین قیمت',
  },
  'paywall.annualCadence': {
    en: '($3.33/MO)', zh: '（约3.33美元/月）', hi: '($3.33/माह)', es: '($3.33/MES)', fr: '(3,33 $/MOIS)', ar: '(3.33$/شهريًا)',
    bn: '($৩.৩৩/মাস)', pt: '(3,33$/MÊS)', ru: '($3.33/МЕС)', ur: '($3.33/ماہ)',
  },
  'paywall.startTrial': {
    en: 'Start Free Trial', zh: '开始免费试用', hi: 'निःशुल्क ट्रायल शुरू करें', es: 'Iniciar prueba gratuita', fr: "Démarrer l'essai gratuit",
    ar: 'ابدأ التجربة المجانية', bn: 'বিনামূল্যে ট্রায়াল শুরু করুন', pt: 'Iniciar teste gratuito', ru: 'Начать бесплатный период', ur: 'مفت ٹرائل شروع کریں',
  },
  'paywall.restorePurchases': {
    en: 'Restore Purchases', zh: '恢复购买', hi: 'खरीदारी पुनर्स्थापित करें', es: 'Restaurar compras', fr: 'Restaurer les achats',
    ar: 'استعادة المشتريات', bn: 'ক্রয় পুনরুদ্ধার করুন', pt: 'Restaurar compras', ru: 'Восстановить покупки', ur: 'خریداری بحال کریں',
  },
  'paywall.termsOfService': {
    en: 'Terms of Service', zh: '服务条款', hi: 'सेवा की शर्तें', es: 'Términos del servicio', fr: 'Conditions de service',
    ar: 'شروط الخدمة', bn: 'পরিষেবার শর্তাবলী', pt: 'Termos de serviço', ru: 'Условия использования', ur: 'شرائط خدمت',
  },
  'paywall.privacyPolicy': {
    en: 'Privacy Policy', zh: '隐私政策', hi: 'गोपनीयता नीति', es: 'Política de privacidad', fr: 'Politique de confidentialité',
    ar: 'سياسة الخصوصية', bn: 'গোপনীয়তা নীতি', pt: 'Política de privacidade', ru: 'Политика конфиденциальности', ur: 'پرائیویسی پالیسی',
  },
  'settings.title': {
    en: 'Settings', zh: '设置', hi: 'सेटिंग्स', es: 'Ajustes', fr: 'Paramètres', ar: 'الإعدادات', bn: 'সেটিংস',
    pt: 'Definições', ru: 'Настройки', ur: 'ترتیبات',
  },
  'settings.section.subscription': {
    en: 'Subscription', zh: '订阅', hi: 'सब्सक्रिप्शन', es: 'Suscripción', fr: 'Abonnement', ar: 'الاشتراك',
    bn: 'সাবস্ক্রিপশন', pt: 'Subscrição', ru: 'Подписка', ur: 'سبسکرپشن',
  },
  'settings.section.general': {
    en: 'General', zh: '通用', hi: 'सामान्य', es: 'General', fr: 'Général', ar: 'عام', bn: 'সাধারণ',
    pt: 'Geral', ru: 'Общее', ur: 'عام',
  },
  'settings.section.legal': {
    en: 'Legal', zh: '法律', hi: 'कानूनी', es: 'Legal', fr: 'Mentions légales', ar: 'قانوني', bn: 'আইনি',
    pt: 'Legal', ru: 'Правовая информация', ur: 'قانونی',
  },
  'settings.row.manageSubscription': {
    en: 'Manage Subscription', zh: '管理订阅', hi: 'सब्सक्रिप्शन प्रबंधित करें', es: 'Gestionar suscripción', fr: "Gérer l'abonnement",
    ar: 'إدارة الاشتراك', bn: 'সাবস্ক্রিপশন পরিচালনা করুন', pt: 'Gerir subscrição', ru: 'Управление подпиской', ur: 'سبسکرپشن کا نظم کریں',
  },
  'settings.row.restorePurchases': {
    en: 'Restore Purchases', zh: '恢复购买', hi: 'खरीदारी पुनर्स्थापित करें', es: 'Restaurar compras', fr: 'Restaurer les achats',
    ar: 'استعادة المشتريات', bn: 'ক্রয় পুনরুদ্ধার করুন', pt: 'Restaurar compras', ru: 'Восстановить покупки', ur: 'خریداری بحال کریں',
  },
  'settings.row.language': {
    en: 'Language', zh: '语言', hi: 'भाषा', es: 'Idioma', fr: 'Langue', ar: 'اللغة', bn: 'ভাষা', pt: 'Idioma', ru: 'Язык', ur: 'زبان',
  },
  'settings.row.rateUs': {
    en: 'Rate Us', zh: '给我们评分', hi: 'हमें रेट करें', es: 'Califícanos', fr: 'Notez-nous', ar: 'قيّمنا', bn: 'আমাদের রেট করুন',
    pt: 'Avalie-nos', ru: 'Оцените нас', ur: 'ہمیں ریٹ کریں',
  },
  'settings.row.shareApp': {
    en: 'Share App', zh: '分享应用', hi: 'ऐप शेयर करें', es: 'Compartir app', fr: "Partager l'application", ar: 'مشاركة التطبيق',
    bn: 'অ্যাপ শেয়ার করুন', pt: 'Partilhar app', ru: 'Поделиться приложением', ur: 'ایپ شیئر کریں',
  },
  'settings.row.privacyPolicy': {
    en: 'Privacy Policy', zh: '隐私政策', hi: 'गोपनीयता नीति', es: 'Política de privacidad', fr: 'Politique de confidentialité',
    ar: 'سياسة الخصوصية', bn: 'গোপনীয়তা নীতি', pt: 'Política de privacidade', ru: 'Политика конфиденциальности', ur: 'پرائیویسی پالیسی',
  },
  'settings.row.termsConditions': {
    en: 'Terms & Conditions', zh: '条款与条件', hi: 'नियम व शर्तें', es: 'Términos y condiciones', fr: 'Conditions générales',
    ar: 'الشروط والأحكام', bn: 'শর্তাবলী', pt: 'Termos e condições', ru: 'Условия использования', ur: 'شرائط و ضوابط',
  },
  'settings.row.contactUs': {
    en: 'Contact Us', zh: '联系我们', hi: 'हमसे संपर्क करें', es: 'Contáctanos', fr: 'Nous contacter', ar: 'اتصل بنا',
    bn: 'যোগাযোগ করুন', pt: 'Contacte-nos', ru: 'Связаться с нами', ur: 'ہم سے رابطہ کریں',
  },
  'analyzing.headline': {
    en: 'Reading Your Expressions', zh: '正在解读你的表情', hi: 'आपके एक्सप्रेशन पढ़े जा रहे हैं',
    es: 'Leyendo tus expresiones', fr: 'Lecture de vos expressions', ar: 'جارٍ قراءة تعابيرك',
    bn: 'আপনার এক্সপ্রেশন পড়া হচ্ছে', pt: 'A ler as suas expressões', ru: 'Анализ ваших выражений', ur: 'آپ کے تاثرات پڑھے جا رہے ہیں',
  },
  'analyzing.subtitle': {
    en: 'Our AI is generating your character reading...', zh: '我们的 AI 正在生成你的性格解读……',
    hi: 'हमारा AI आपकी कैरेक्टर रीडिंग तैयार कर रहा है...', es: 'Nuestra IA está generando tu lectura de carácter...',
    fr: 'Notre IA génère votre lecture de caractère...', ar: 'يقوم الذكاء الاصطناعي بإنشاء قراءة شخصيتك...',
    bn: 'আমাদের AI আপনার ক্যারেক্টার রিডিং তৈরি করছে...', pt: 'A nossa IA está a gerar a sua leitura de caráter...',
    ru: 'Наш ИИ создаёт анализ вашего характера...', ur: 'ہمارا AI آپ کی کریکٹر ریڈنگ تیار کر رہا ہے...',
  },
  'analyzing.error.title': {
    en: 'Something Went Wrong', zh: '出错了', hi: 'कुछ गलत हो गया', es: 'Algo salió mal', fr: "Une erreur s'est produite",
    ar: 'حدث خطأ ما', bn: 'কিছু ভুল হয়েছে', pt: 'Algo correu mal', ru: 'Что-то пошло не так', ur: 'کچھ غلط ہو گیا',
  },
  'analyzing.error.body': {
    en: "We couldn't generate your reading. Please check your connection and try again.",
    zh: '我们无法生成你的解读。请检查网络连接后重试。',
    hi: 'हम आपकी रीडिंग तैयार नहीं कर सके। कृपया अपना कनेक्शन जांचें और फिर से कोशिश करें।',
    es: 'No pudimos generar tu lectura. Comprueba tu conexión e inténtalo de nuevo.',
    fr: "Nous n'avons pas pu générer votre lecture. Vérifiez votre connexion et réessayez.",
    ar: 'تعذر إنشاء قراءتك. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
    bn: 'আমরা আপনার রিডিং তৈরি করতে পারিনি। আপনার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
    pt: 'Não foi possível gerar a sua leitura. Verifique a sua ligação e tente novamente.',
    ru: 'Не удалось создать ваш анализ. Проверьте соединение и попробуйте снова.',
    ur: 'ہم آپ کی ریڈنگ تیار نہیں کر سکے۔ براہ کرم اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔',
  },
  'analyzing.error.retry': {
    en: 'Try Again', zh: '重试', hi: 'फिर से कोशिश करें', es: 'Intentar de nuevo', fr: 'Réessayer', ar: 'إعادة المحاولة',
    bn: 'আবার চেষ্টা করুন', pt: 'Tentar novamente', ru: 'Повторить', ur: 'دوبارہ کوشش کریں',
  },
  'analyzing.error.backHome': {
    en: 'Back to Main Menu', zh: '返回主菜单', hi: 'मुख्य मेनू पर वापस जाएं', es: 'Volver al menú principal',
    fr: "Retour au menu principal", ar: 'العودة إلى القائمة الرئيسية', bn: 'মূল মেনুতে ফিরে যান', pt: 'Voltar ao menu principal',
    ru: 'Назад в главное меню', ur: 'مرکزی مینو پر واپس جائیں',
  },
  'reveal.title': {
    en: 'Your Reading', zh: '你的解读', hi: 'आपकी रीडिंग', es: 'Tu lectura', fr: 'Votre lecture', ar: 'قراءتك',
    bn: 'আপনার রিডিং', pt: 'A sua leitura', ru: 'Ваш анализ', ur: 'آپ کی ریڈنگ',
  },
  'reveal.doneButton': {
    en: 'Done', zh: '完成', hi: 'पूर्ण', es: 'Listo', fr: 'Terminé', ar: 'تم', bn: 'সম্পন্ন', pt: 'Concluído', ru: 'Готово', ur: 'مکمل',
  },
  'reveal.shareButton': {
    en: 'Share Reading', zh: '分享解读', hi: 'रीडिंग शेयर करें', es: 'Compartir lectura', fr: 'Partager la lecture',
    ar: 'مشاركة القراءة', bn: 'রিডিং শেয়ার করুন', pt: 'Partilhar leitura', ru: 'Поделиться анализом', ur: 'ریڈنگ شیئر کریں',
  },
  'welcome.headline': {
    en: "You're All Set", zh: '一切准备就绪', hi: 'आप तैयार हैं', es: 'Todo listo', fr: 'Vous êtes prêt',
    ar: 'أنت جاهز الآن', bn: 'আপনি প্রস্তুত', pt: 'Está tudo pronto', ru: 'Всё готово', ur: 'آپ تیار ہیں',
  },
  'welcome.subtitle': {
    en: 'Your AI character reading journey starts now. Capture your first three expressions whenever you’re ready.',
    zh: '你的 AI 性格解读之旅现在开始。准备好后即可捕捉你的前三个表情。',
    hi: 'आपकी AI कैरेक्टर रीडिंग यात्रा अभी शुरू होती है। जब भी तैयार हों, अपने पहले तीन एक्सप्रेशन कैप्चर करें।',
    es: 'Tu viaje de lectura de carácter con IA comienza ahora. Captura tus primeras tres expresiones cuando quieras.',
    fr: "Votre parcours de lecture de caractère par IA commence maintenant. Capturez vos trois premières expressions quand vous serez prêt.",
    ar: 'تبدأ رحلتك في قراءة الشخصية بالذكاء الاصطناعي الآن. التقط تعابيرك الثلاثة الأولى عندما تكون مستعدًا.',
    bn: 'আপনার AI ক্যারেক্টার রিডিং যাত্রা এখনই শুরু হচ্ছে। প্রস্তুত হলে আপনার প্রথম তিনটি অভিব্যক্তি ধারণ করুন।',
    pt: 'A sua jornada de leitura de caráter com IA começa agora. Capture as suas primeiras três expressões quando estiver pronto.',
    ru: 'Ваше путешествие с ИИ-анализом характера начинается прямо сейчас. Запечатлейте первые три выражения, когда будете готовы.',
    ur: 'آپ کا AI کریکٹر ریڈنگ سفر ابھی شروع ہوتا ہے۔ جب تیار ہوں اپنے پہلے تین تاثرات کیپچر کریں۔',
  },
  'welcome.cta': {
    en: "Let's Go", zh: '开始吧', hi: 'चलिए शुरू करें', es: 'Vamos', fr: 'Allons-y', ar: 'هيا بنا',
    bn: 'চলুন শুরু করি', pt: 'Vamos lá', ru: 'Поехали', ur: 'چلیں شروع کریں',
  },
  'mainMenu.proBadge': {
    en: 'PRO', zh: '专业版', hi: 'प्रो', es: 'PRO', fr: 'PRO', ar: 'برو', bn: 'প্রো', pt: 'PRO', ru: 'ПРО', ur: 'پرو',
  },
  'mainMenu.feature.vibe.title': {
    en: 'Vibe & Temperament', zh: '氛围与气质', hi: 'वाइब और स्वभाव', es: 'Vibra y temperamento', fr: 'Vibe et tempérament',
    ar: 'الطاقة والمزاج', bn: 'ভাইব ও মেজাজ', pt: 'Vibe e temperamento', ru: 'Настроение и темперамент', ur: 'وائب اور مزاج',
  },
  'mainMenu.feature.vibe.body': {
    en: 'Instant mood & energy check based on expression mapping.', zh: '基于表情映射的即时情绪与能量检测。',
    hi: 'एक्सप्रेशन मैपिंग पर आधारित तत्काल मूड और एनर्जी जांच।', es: 'Comprobación instantánea del estado de ánimo y energía según tus expresiones.',
    fr: "Vérification instantanée de l'humeur et de l'énergie basée sur la cartographie des expressions.",
    ar: 'فحص فوري للمزاج والطاقة استنادًا إلى رسم التعابير.', bn: 'এক্সপ্রেশন ম্যাপিং ভিত্তিক তাৎক্ষণিক মেজাজ ও এনার্জি চেক।',
    pt: 'Verificação instantânea de humor e energia com base no mapeamento de expressões.',
    ru: 'Мгновенная проверка настроения и энергии на основе карты выражений.', ur: 'ایکسپریشن میپنگ پر مبنی فوری موڈ اور توانائی کی جانچ۔',
  },
  'mainMenu.feature.expression.title': {
    en: 'Expression Dynamics', zh: '表情动态', hi: 'एक्सप्रेशन डायनामिक्स', es: 'Dinámica de expresiones', fr: 'Dynamique des expressions',
    ar: 'ديناميكية التعابير', bn: 'এক্সপ্রেশন ডাইনামিক্স', pt: 'Dinâmica de expressões', ru: 'Динамика выражений', ur: 'ایکسپریشن ڈائنامکس',
  },
  'mainMenu.feature.expression.body': {
    en: 'Micro-expression shifts tracked across your 3-shot session.', zh: '追踪三张照片过程中的微表情变化。',
    hi: 'आपके 3-शॉट सेशन में माइक्रो-एक्सप्रेशन बदलाव ट्रैक किए जाते हैं।', es: 'Cambios de microexpresión registrados en tu sesión de 3 fotos.',
    fr: 'Changements de micro-expressions suivis lors de votre session de 3 photos.',
    ar: 'تتبع تغيرات التعابير الدقيقة عبر جلستك المكونة من 3 لقطات.', bn: 'আপনার ৩-শট সেশনে মাইক্রো-এক্সপ্রেশন পরিবর্তন ট্র্যাক করা হয়।',
    pt: 'Alterações de micro-expressão monitorizadas na sua sessão de 3 fotos.',
    ru: 'Отслеживание микровыражений на протяжении сессии из 3 снимков.', ur: 'آپ کے 3 شاٹ سیشن میں مائیکرو ایکسپریشن تبدیلیاں ٹریک کی جاتی ہیں۔',
  },
  'mainMenu.feature.symmetry.title': {
    en: 'Face Symmetry', zh: '面部对称性', hi: 'फेस सिमेट्री', es: 'Simetría facial', fr: 'Symétrie du visage',
    ar: 'تناظر الوجه', bn: 'ফেস সিমেট্রি', pt: 'Simetria facial', ru: 'Симметрия лица', ur: 'چہرے کی توازن',
  },
  'mainMenu.feature.symmetry.body': {
    en: 'Proportion & balance reading using Golden Ratio landmarks.', zh: '基于黄金比例标志点的比例与平衡解读。',
    hi: 'गोल्डन रेशियो लैंडमार्क्स का उपयोग कर प्रोपोर्शन और बैलेंस रीडिंग।', es: 'Lectura de proporción y equilibrio usando puntos de referencia de la proporción áurea.',
    fr: "Lecture de la proportion et de l'équilibre à l'aide de repères du nombre d'or.",
    ar: 'قراءة التناسب والتوازن باستخدام معالم النسبة الذهبية.', bn: 'গোল্ডেন রেশিও ল্যান্ডমার্ক ব্যবহার করে অনুপাত ও ভারসাম্য রিডিং।',
    pt: 'Leitura de proporção e equilíbrio usando pontos de referência da proporção áurea.',
    ru: 'Анализ пропорций и баланса по точкам золотого сечения.', ur: 'گولڈن ریشو لینڈ مارکس کا استعمال کرتے ہوئے تناسب اور توازن کی ریڈنگ۔',
  },
  'mainMenu.feature.dailyLog.title': {
    en: 'Daily Vibe Log', zh: '每日氛围日志', hi: 'डेली वाइब लॉग', es: 'Registro diario de vibra', fr: 'Journal de vibe quotidien',
    ar: 'سجل الطاقة اليومي', bn: 'দৈনিক ভাইব লগ', pt: 'Registo diário de vibe', ru: 'Ежедневный журнал настроения', ur: 'روزانہ وائب لاگ',
  },
  'mainMenu.feature.dailyLog.body': {
    en: 'Track mood patterns over time with historical AI insights.', zh: '通过历史 AI 洞察追踪长期情绪模式。',
    hi: 'ऐतिहासिक AI इनसाइट्स के साथ समय के साथ मूड पैटर्न ट्रैक करें।', es: 'Sigue tus patrones de ánimo a lo largo del tiempo con análisis históricos de IA.',
    fr: "Suivez l'évolution de votre humeur dans le temps grâce aux analyses historiques de l'IA.",
    ar: 'تتبع أنماط المزاج عبر الوقت باستخدام رؤى الذكاء الاصطناعي التاريخية.', bn: 'ঐতিহাসিক AI ইনসাইট দিয়ে সময়ের সাথে মেজাজের ধরণ ট্র্যাক করুন।',
    pt: 'Acompanhe padrões de humor ao longo do tempo com análises históricas de IA.',
    ru: 'Отслеживайте изменения настроения со временем с помощью исторической аналитики ИИ.', ur: 'تاریخی AI بصیرت کے ساتھ وقت کے ساتھ موڈ کے پیٹرن ٹریک کریں۔',
  },
  'common.close': {
    en: 'Close', zh: '关闭', hi: 'बंद करें', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق', bn: 'বন্ধ করুন', pt: 'Fechar', ru: 'Закрыть', ur: 'بند کریں',
  },
} satisfies Record<string, Record<LanguageCode, string>>;

export function translate(key: TranslationKey, languageCode: string, vars?: Record<string, string | number>): string {
  const entry = translations[key];
  const raw = entry[languageCode as LanguageCode] ?? entry.en;
  if (!vars) return raw;
  return Object.entries(vars).reduce((acc, [name, value]) => acc.replace(`{${name}}`, String(value)), raw);
}

export type { TranslationKey };
