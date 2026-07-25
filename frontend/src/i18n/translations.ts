// Translation catalog for the app's interactive UI chrome. Covers the 10
// languages listed in state/slices/localeSlice.ts.
//
// Deliberately NOT translated here:
// - PRIVACY_POLICY_SECTIONS / TERMS_SECTIONS (content/legalContent.ts) — legal
//   text should go through professional/legal translation review before it
//   ships per-market, not machine translation. They stay English-only.
// - The Contact Us diagnostic email body — it's addressed to a specific
//   English-reading recipient (see utils/contactMail.ts).
// - "Face Reader" itself — brand name, not translated.
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
    en: 'For entertainment purposes only. Face Reader does not provide clinical, psychological, or diagnostic assessments. Photos are processed in memory and never stored.',
    zh: '仅供娱乐使用。Face Reader 不提供任何临床、心理或诊断评估。照片仅在内存中处理，绝不会被存储。',
    hi: 'केवल मनोरंजन हेतु। Face Reader कोई नैदानिक, मनोवैज्ञानिक या डायग्नोस्टिक मूल्यांकन प्रदान नहीं करता। फ़ोटो केवल मेमोरी में प्रोसेस होती हैं और कभी संग्रहीत नहीं की जातीं।',
    es: 'Solo con fines de entretenimiento. Face Reader no ofrece evaluaciones clínicas, psicológicas ni de diagnóstico. Las fotos se procesan en memoria y nunca se almacenan.',
    fr: 'À des fins de divertissement uniquement. Face Reader ne fournit aucune évaluation clinique, psychologique ou diagnostique. Les photos sont traitées en mémoire et ne sont jamais stockées.',
    ar: 'لأغراض الترفيه فقط. لا يقدم Face Reader أي تقييمات سريرية أو نفسية أو تشخيصية. تتم معالجة الصور في الذاكرة فقط ولا يتم تخزينها أبدًا.',
    bn: 'শুধুমাত্র বিনোদনের উদ্দেশ্যে। Face Reader কোনো ক্লিনিক্যাল, মনস্তাত্ত্বিক বা রোগনির্ণয়মূলক মূল্যায়ন প্রদান করে না। ছবিগুলো শুধু মেমোরিতে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না।',
    pt: 'Apenas para fins de entretenimento. O Face Reader não fornece avaliações clínicas, psicológicas ou de diagnóstico. As fotos são processadas na memória e nunca armazenadas.',
    ru: 'Только в развлекательных целях. Face Reader не предоставляет клинических, психологических или диагностических заключений. Фото обрабатываются только в памяти и никогда не сохраняются.',
    ur: 'صرف تفریحی مقاصد کے لیے۔ Face Reader کوئی طبی، نفسیاتی یا تشخیصی جائزہ فراہم نہیں کرتا۔ تصاویر صرف میموری میں پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔',
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
    en: 'Capture photos and let our neural matrix reveal distinct facets of your character, connections, and career vibe.',
    zh: '拍摄照片，让我们的神经矩阵揭示你性格、人际关系与职业气质的不同面向。',
    hi: 'फ़ोटो कैप्चर करें और हमारे न्यूरल मैट्रिक्स को अपने व्यक्तित्व, रिश्तों और करियर वाइब के अलग-अलग पहलू उजागर करने दें।',
    es: 'Captura fotos y deja que nuestra matriz neuronal revele facetas distintas de tu carácter, tus conexiones y tu vibra profesional.',
    fr: 'Capturez des photos et laissez notre matrice neuronale révéler des facettes distinctes de votre caractère, de vos relations et de votre vibe professionnelle.',
    ar: 'التقط صورًا ودع مصفوفتنا العصبية تكشف جوانب مميزة من شخصيتك وعلاقاتك وأجوائك المهنية.',
    bn: 'ছবি তুলুন এবং আমাদের নিউরাল ম্যাট্রিক্সকে আপনার ব্যক্তিত্ব, সম্পর্ক ও ক্যারিয়ার ভাইবের ভিন্ন দিক উন্মোচন করতে দিন।',
    pt: 'Capture fotos e deixe a nossa matriz neural revelar facetas distintas do seu caráter, das suas relações e da sua vibe profissional.',
    ru: 'Сделайте фото и позвольте нашей нейросети раскрыть разные грани вашего характера, отношений и карьерного вайба.',
    ur: 'تصاویر کیپچر کریں اور ہمارے نیورل میٹرکس کو اپنی شخصیت، تعلقات اور کیریئر وائب کے مختلف پہلو ظاہر کرنے دیں۔',
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
    en: 'Face Reader needs your camera to capture your photos for your reading. Photos are processed in memory and never stored.',
    zh: 'Face Reader 需要使用你的相机来拍摄解读所需的照片。照片仅在内存中处理，绝不会被存储。',
    hi: 'Face Reader को आपकी रीडिंग के लिए आपकी फ़ोटो कैप्चर करने हेतु आपके कैमरे की आवश्यकता है। फ़ोटो केवल मेमोरी में प्रोसेस होती हैं और कभी संग्रहीत नहीं की जातीं।',
    es: 'Face Reader necesita tu cámara para capturar tus fotos para tu lectura. Las fotos se procesan en memoria y nunca se almacenan.',
    fr: 'Face Reader a besoin de votre caméra pour capturer vos photos pour votre lecture. Les photos sont traitées en mémoire et ne sont jamais stockées.',
    ar: 'يحتاج Face Reader إلى كاميرتك لالتقاط صورك لقراءتك. تتم معالجة الصور في الذاكرة فقط ولا يتم تخزينها أبدًا.',
    bn: 'আপনার রিডিংয়ের জন্য আপনার ছবি ক্যাপচার করতে Face Reader-এর আপনার ক্যামেরা প্রয়োজন। ছবিগুলো শুধু মেমোরিতে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না।',
    pt: 'O Face Reader precisa da sua câmara para capturar as suas fotos para a sua leitura. As fotos são processadas na memória e nunca armazenadas.',
    ru: 'Face Reader нужен доступ к камере, чтобы сделать фото для вашего анализа. Фото обрабатываются только в памяти и никогда не сохраняются.',
    ur: 'Face Reader کو آپ کی ریڈنگ کے لیے آپ کی تصاویر لینے کے لیے آپ کے کیمرے کی ضرورت ہے۔ تصاویر صرف میموری میں پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔',
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
  'capture.step.person1.title': {
    en: 'Person One', zh: '第一位', hi: 'पहला व्यक्ति', es: 'Persona Uno', fr: 'Personne Un', ar: 'الشخص الأول',
    bn: 'প্রথম ব্যক্তি', pt: 'Pessoa Um', ru: 'Первый человек', ur: 'پہلا شخص',
  },
  'capture.step.person1.prompt': {
    en: "Capture the first person's photo.", zh: '拍摄第一位的照片。', hi: 'पहले व्यक्ति की फ़ोटो कैप्चर करें।',
    es: 'Captura la foto de la primera persona.', fr: 'Capturez la photo de la première personne.',
    ar: 'التقط صورة الشخص الأول.', bn: 'প্রথম ব্যক্তির ছবি তুলুন।', pt: 'Capture a foto da primeira pessoa.',
    ru: 'Сделайте фото первого человека.', ur: 'پہلے شخص کی تصویر لیں۔',
  },
  'capture.step.person2.title': {
    en: 'Person Two', zh: '第二位', hi: 'दूसरा व्यक्ति', es: 'Persona Dos', fr: 'Personne Deux', ar: 'الشخص الثاني',
    bn: 'দ্বিতীয় ব্যক্তি', pt: 'Pessoa Dois', ru: 'Второй человек', ur: 'دوسرا شخص',
  },
  'capture.step.person2.prompt': {
    en: "Now capture the second person's photo.", zh: '现在拍摄第二位的照片。', hi: 'अब दूसरे व्यक्ति की फ़ोटो कैप्चर करें।',
    es: 'Ahora captura la foto de la segunda persona.', fr: 'Capturez maintenant la photo de la deuxième personne.',
    ar: 'الآن التقط صورة الشخص الثاني.', bn: 'এখন দ্বিতীয় ব্যক্তির ছবি তুলুন।', pt: 'Agora capture a foto da segunda pessoa.',
    ru: 'Теперь сделайте фото второго человека.', ur: 'اب دوسرے شخص کی تصویر لیں۔',
  },
  'capture.step.solo.title': {
    en: 'Your Photo', zh: '你的照片', hi: 'आपकी फ़ोटो', es: 'Tu Foto', fr: 'Votre Photo', ar: 'صورتك',
    bn: 'আপনার ছবি', pt: 'A Sua Foto', ru: 'Ваше фото', ur: 'آپ کی تصویر',
  },
  'capture.step.solo.prompt': {
    en: 'Capture a clear photo of yourself.', zh: '拍摄一张清晰的自拍照。', hi: 'अपनी एक स्पष्ट फ़ोटो कैप्चर करें।',
    es: 'Captura una foto clara de ti mismo.', fr: 'Capturez une photo claire de vous-même.',
    ar: 'التقط صورة واضحة لنفسك.', bn: 'নিজের একটি স্পষ্ট ছবি তুলুন।', pt: 'Capture uma foto nítida de si mesmo.',
    ru: 'Сделайте чёткое фото себя.', ur: 'اپنی ایک واضح تصویر لیں۔',
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
    en: 'Character Analysis', zh: '性格分析', hi: 'कैरेक्टर एनालिसिस', es: 'Análisis de Carácter',
    fr: 'Analyse de Caractère', ar: 'تحليل الشخصية', bn: 'ক্যারেক্টার অ্যানালাইসিস', pt: 'Análise de Caráter',
    ru: 'Анализ характера', ur: 'کریکٹر تجزیہ',
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
    en: 'Enjoying your insights with Face Reader?', zh: '喜欢 Face Reader 给你的洞察吗？', hi: 'Face Reader के साथ अपने इनसाइट्स का आनंद ले रहे हैं?',
    es: '¿Disfrutando tus análisis con Face Reader?', fr: 'Vous appréciez vos analyses avec Face Reader ?',
    ar: 'هل تستمتع برؤاك مع Face Reader؟', bn: 'Face Reader-এর সাথে আপনার ইনসাইট উপভোগ করছেন?', pt: 'A gostar das suas análises com o Face Reader?',
    ru: 'Нравятся ваши результаты в Face Reader?', ur: 'کیا آپ Face Reader کے ساتھ اپنی بصیرت سے لطف اندوز ہو رہے ہیں؟',
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
  'paywall.featuresHeading': {
    en: 'Everything you unlock', zh: '解锁全部权益', hi: 'आपको जो कुछ मिलेगा', es: 'Todo lo que desbloqueas',
    fr: 'Tout ce que vous débloquez', ar: 'كل ما ستحصل عليه', bn: 'আপনি যা যা আনলক করবেন', pt: 'Tudo o que desbloqueia',
    ru: 'Всё, что вы получите', ur: 'وہ سب کچھ جو آپ کو ملے گا',
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
    en: 'High-Res Story Share Cards', zh: '高清故事分享卡',
    hi: 'हाई-रेस स्टोरी शेयर कार्ड्स', es: 'Tarjetas para compartir en alta resolución',
    fr: "Cartes de partage haute résolution", ar: 'بطاقات مشاركة عالية الدقة',
    bn: 'উচ্চ-রেজোলিউশন শেয়ার কার্ড', pt: 'Cartões de partilha em alta resolução',
    ru: 'Карточки для сторис в высоком разрешении', ur: 'ہائی ریزولوشن اسٹوری شیئر کارڈز',
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
    en: 'Full access, billed weekly', zh: '完全权限，按周计费', hi: 'पूर्ण एक्सेस, साप्ताहिक बिलिंग', es: 'Acceso completo, facturación semanal',
    fr: 'Accès complet, facturation hebdomadaire', ar: 'وصول كامل، فوترة أسبوعية', bn: 'সম্পূর্ণ অ্যাক্সেস, সাপ্তাহিক বিলিং', pt: 'Acesso total, faturação semanal',
    ru: 'Полный доступ, еженедельная оплата', ur: 'مکمل رسائی، ہفتہ وار بلنگ',
  },
  'paywall.weeklyCadence': {
    en: '/WEEK', zh: '/周', hi: '/सप्ताह', es: '/SEMANA', fr: '/SEMAINE',
    ar: '/أسبوعيًا', bn: '/সপ্তাহ', pt: '/SEMANA', ru: '/НЕДЕЛЮ', ur: '/ہفتہ',
  },
  'paywall.subscribeNow': {
    en: 'Subscribe Now', zh: '立即订阅', hi: 'अभी सब्सक्राइब करें', es: 'Suscribirse ahora', fr: "S'abonner maintenant",
    ar: 'اشترك الآن', bn: 'এখনই সাবস্ক্রাইব করুন', pt: 'Subscrever agora', ru: 'Оформить подписку', ur: 'ابھی سبسکرائب کریں',
  },
  'paywall.trialLink': {
    en: 'Prefer to try free for 3 days first?', zh: '想先免费试用3天吗？', hi: 'पहले 3 दिन मुफ़्त आज़माना चाहेंगे?',
    es: '¿Prefieres probarlo gratis 3 días antes?', fr: "Préférez-vous essayer gratuitement pendant 3 jours d'abord ?",
    ar: 'هل تفضل تجربته مجانًا لمدة 3 أيام أولاً؟', bn: 'প্রথমে ৩ দিন বিনামূল্যে চেষ্টা করতে চান?', pt: 'Prefere experimentar gratuitamente por 3 dias primeiro?',
    ru: 'Хотите сначала попробовать бесплатно 3 дня?', ur: 'کیا آپ پہلے 3 دن مفت آزمانا چاہیں گے؟',
  },
  'paywall.reassurance': {
    en: 'Cancel anytime · Secure payment', zh: '随时取消 · 安全支付', hi: 'कभी भी रद्द करें · सुरक्षित भुगतान',
    es: 'Cancela cuando quieras · Pago seguro', fr: 'Annulez à tout moment · Paiement sécurisé',
    ar: 'ألغِ في أي وقت · دفع آمن', bn: 'যেকোনো সময় বাতিল করুন · নিরাপদ পেমেন্ট', pt: 'Cancele quando quiser · Pagamento seguro',
    ru: 'Отмена в любой момент · Безопасная оплата', ur: 'کسی بھی وقت منسوخ کریں · محفوظ ادائیگی',
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
    en: 'Back to Analyze', zh: '返回分析', hi: 'विश्लेषण पर वापस जाएं', es: 'Volver a Analizar',
    fr: "Retour à Analyser", ar: 'العودة إلى التحليل', bn: 'বিশ্লেষণে ফিরে যান', pt: 'Voltar a Analisar',
    ru: 'Назад к анализу', ur: 'تجزیہ پر واپس جائیں',
  },
  'noFaceDetected.headline': {
    en: "We Couldn't Find a Face", zh: '未检测到人脸', hi: 'चेहरा नहीं मिला', es: 'No pudimos encontrar un rostro',
    fr: "Nous n'avons pas trouvé de visage", ar: 'لم نتمكن من العثور على وجه', bn: 'কোনো মুখ খুঁজে পাওয়া যায়নি',
    pt: 'Não encontrámos um rosto', ru: 'Лицо не найдено', ur: 'کوئی چہرہ نہیں ملا',
  },
  'noFaceDetected.body': {
    en: 'Make sure your face is clearly framed in good lighting, then give it another shot.',
    zh: '请确保脸部在光线充足的情况下清晰入镜，然后再试一次。',
    hi: 'सुनिश्चित करें कि आपका चेहरा अच्छी रोशनी में स्पष्ट रूप से फ्रेम में हो, फिर दोबारा कोशिश करें।',
    es: 'Asegúrate de que tu rostro esté bien encuadrado y con buena luz, luego inténtalo de nuevo.',
    fr: 'Assurez-vous que votre visage est bien cadré avec un bon éclairage, puis réessayez.',
    ar: 'تأكد من أن وجهك ظاهر بوضوح وفي إضاءة جيدة، ثم حاول مرة أخرى.',
    bn: 'ভালো আলোতে আপনার মুখ স্পষ্টভাবে ফ্রেমে আছে কিনা নিশ্চিত করুন, তারপর আবার চেষ্টা করুন।',
    pt: 'Certifique-se de que o seu rosto está bem enquadrado com boa iluminação e tente novamente.',
    ru: 'Убедитесь, что ваше лицо чётко видно при хорошем освещении, и попробуйте снова.',
    ur: 'یقینی بنائیں کہ آپ کا چہرہ اچھی روشنی میں واضح طور پر فریم میں ہے، پھر دوبارہ کوشش کریں۔',
  },
  'noFaceDetected.retry': {
    en: 'Retake Photos', zh: '重新拍照', hi: 'फिर से फ़ोटो लें', es: 'Repetir fotos', fr: 'Reprendre les photos',
    ar: 'إعادة التقاط الصور', bn: 'আবার ছবি তুলুন', pt: 'Tirar fotos novamente', ru: 'Переснять фото', ur: 'دوبارہ تصاویر لیں',
  },
  'noFaceDetected.backHome': {
    en: 'Back to Analyze', zh: '返回分析', hi: 'विश्लेषण पर वापस जाएं', es: 'Volver a Analizar',
    fr: "Retour à Analyser", ar: 'العودة إلى التحليل', bn: 'বিশ্লেষণে ফিরে যান', pt: 'Voltar a Analisar',
    ru: 'Назад к анализу', ur: 'تجزیہ پر واپس جائیں',
  },
  'reveal.narrativeHeading': {
    en: 'The Full Picture', zh: '整体画像', hi: 'पूरी तस्वीर', es: 'La imagen completa', fr: "Le tableau d'ensemble",
    ar: 'الصورة الكاملة', bn: 'সম্পূর্ণ চিত্র', pt: 'A imagem completa', ru: 'Полная картина', ur: 'مکمل تصویر',
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
    en: "Your AI character reading journey starts now. Capture your first photos whenever you're ready.",
    zh: '你的 AI 性格解读之旅现在开始。准备好后即可拍摄你的照片。',
    hi: 'आपकी AI कैरेक्टर रीडिंग यात्रा अभी शुरू होती है। जब भी तैयार हों, अपनी फ़ोटो कैप्चर करें।',
    es: 'Tu viaje de lectura de carácter con IA comienza ahora. Captura tus fotos cuando quieras.',
    fr: 'Votre parcours de lecture de caractère par IA commence maintenant. Capturez vos photos quand vous serez prêt.',
    ar: 'تبدأ رحلتك في قراءة الشخصية بالذكاء الاصطناعي الآن. التقط صورك عندما تكون مستعدًا.',
    bn: 'আপনার AI ক্যারেক্টার রিডিং যাত্রা এখনই শুরু হচ্ছে। প্রস্তুত হলে আপনার ছবি ধারণ করুন।',
    pt: 'A sua jornada de leitura de caráter com IA começa agora. Capture as suas fotos quando estiver pronto.',
    ru: 'Ваше путешествие с ИИ-анализом характера начинается прямо сейчас. Сделайте фото, когда будете готовы.',
    ur: 'آپ کا AI کریکٹر ریڈنگ سفر ابھی شروع ہوتا ہے۔ جب تیار ہوں اپنی تصاویر کیپچر کریں۔',
  },
  'welcome.cta': {
    en: "Let's Go", zh: '开始吧', hi: 'चलिए शुरू करें', es: 'Vamos', fr: 'Allons-y', ar: 'هيا بنا',
    bn: 'চলুন শুরু করি', pt: 'Vamos lá', ru: 'Поехали', ur: 'چلیں شروع کریں',
  },
  'common.close': {
    en: 'Close', zh: '关闭', hi: 'बंद करें', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق', bn: 'বন্ধ করুন', pt: 'Fechar', ru: 'Закрыть', ur: 'بند کریں',
  },
  'restorePurchases.alertBody': {
    en: 'No previous purchases were found for this device.',
    zh: '未在此设备上找到先前的购买记录。',
    hi: 'इस डिवाइस के लिए कोई पिछली खरीदारी नहीं मिली।',
    es: 'No se encontraron compras anteriores para este dispositivo.',
    fr: "Aucun achat précédent n'a été trouvé pour cet appareil.",
    ar: 'لم يتم العثور على مشتريات سابقة لهذا الجهاز.',
    bn: 'এই ডিভাইসের জন্য কোনো পূর্ববর্তী ক্রয় পাওয়া যায়নি।',
    pt: 'Não foram encontradas compras anteriores para este dispositivo.',
    ru: 'Предыдущие покупки для этого устройства не найдены.',
    ur: 'اس ڈیوائس کے لیے کوئی سابقہ خریداری نہیں ملی۔',
  },
} satisfies Record<string, Record<LanguageCode, string>>;

export function translate(key: TranslationKey, languageCode: string, vars?: Record<string, string | number>): string {
  const entry = translations[key];
  const raw = entry[languageCode as LanguageCode] ?? entry.en;
  if (!vars) return raw;
  return Object.entries(vars).reduce((acc, [name, value]) => acc.replace(`{${name}}`, String(value)), raw);
}

export type { TranslationKey };
