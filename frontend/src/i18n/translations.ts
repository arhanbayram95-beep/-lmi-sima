// Translation catalog for the app's interactive UI chrome. Covers the 10
// languages listed in state/slices/localeSlice.ts.
//
// Deliberately NOT translated here:
// - PRIVACY_POLICY_SECTIONS / TERMS_SECTIONS (content/legalContent.ts) — legal
//   text should go through professional/legal translation review before it
//   ships per-market, not machine translation. They stay English-only.
// - The Contact Us diagnostic email body — it's addressed to a specific
//   English-reading recipient (see utils/contactMail.ts).
// - "Questborn" itself — brand name, not translated.
//
// Also out of scope: RTL layout mirroring for Arabic/Urdu. Text renders
// translated but the layout direction does not flip — a follow-up would
// need I18nManager.forceRTL plus a full layout pass.

export type LanguageCode = 'en' | 'zh' | 'hi' | 'es' | 'fr' | 'ar' | 'bn' | 'pt' | 'ru' | 'ur';

type TranslationKey = keyof typeof translations;

export const translations = {
  'nav.analyze': {
    en: 'Create', zh: '创建', hi: 'बनाएँ', es: 'Crear', fr: 'Créer', ar: 'إنشاء', bn: 'তৈরি', pt: 'Criar', ru: 'Создать',
    ur: 'بنائیں',
  },
  'nav.results': {
    en: 'Heroes', zh: '英雄', hi: 'हीरो', es: 'Héroes', fr: 'Héros', ar: 'الأبطال', bn: 'হিরো', pt: 'Heróis', ru: 'Герои',
    ur: 'ہیرو',
  },
  'nav.settings': {
    en: 'Settings', zh: '设置', hi: 'सेटिंग्स', es: 'Ajustes', fr: 'Paramètres',
    ar: 'الإعدادات', bn: 'সেটিংস', pt: 'Definições', ru: 'Настройки', ur: 'ترتیبات',
  },
  'onboarding.step0.headline': {
    en: 'Your Selfie, Your Legend', zh: '你的自拍，你的传奇', hi: 'आपकी सेल्फ़ी, आपकी गाथा', es: 'Tu selfie, tu leyenda',
    fr: 'Votre selfie, votre légende', ar: 'صورتك، أسطورتك', bn: 'আপনার সেলফি, আপনার কিংবদন্তি', pt: 'A sua selfie, a sua lenda',
    ru: 'Ваше селфи — ваша легенда', ur: 'آپ کی سیلفی، آپ کی داستان',
  },
  'onboarding.step0.body': {
    en: 'Strike a pose and our AI game master forges an original fantasy hero: class, stats, abilities, backstory and a quest to begin.',
    zh: '摆个姿势，我们的AI游戏主持人会为你打造一位原创奇幻英雄：职业、属性、技能、背景故事和第一个任务。',
    hi: 'पोज़ दें और हमारा AI गेम मास्टर एक मौलिक फ़ैंटेसी हीरो गढ़ेगा: क्लास, स्टैट्स, क्षमताएँ, बैकस्टोरी और पहला मिशन।',
    es: 'Posa y nuestro máster de IA forjará un héroe de fantasía original: clase, estadísticas, habilidades, trasfondo y una misión para empezar.',
    fr: 'Prenez la pose et notre maître du jeu IA forge un héros de fantasy original : classe, caractéristiques, capacités, histoire et une première quête.',
    ar: 'اتخذ وضعية وسيصنع مدير اللعبة الذكي بطلًا خياليًا أصليًا: الفئة والإحصائيات والقدرات والقصة الخلفية ومهمة للبدء.',
    bn: 'একটি পোজ দিন, আর আমাদের AI গেম মাস্টার বানাবে একটি মৌলিক ফ্যান্টাসি হিরো: ক্লাস, স্ট্যাটস, ক্ষমতা, ব্যাকস্টোরি আর শুরুর একটি অভিযান।',
    pt: 'Faça uma pose e o nosso mestre de jogo de IA forja um herói de fantasia original: classe, atributos, habilidades, história e uma missão para começar.',
    ru: 'Примите позу, и наш ИИ-мастер создаст оригинального фэнтези-героя: класс, характеристики, способности, предысторию и первый квест.',
    ur: 'پوز دیں اور ہمارا AI گیم ماسٹر ایک اصل فینٹسی ہیرو تیار کرے گا: کلاس، اسٹیٹس، صلاحیتیں، پس منظر اور آغاز کی ایک مہم۔',
  },
  'onboarding.step1.headline': {
    en: 'Before We Begin', zh: '开始之前', hi: 'शुरू करने से पहले', es: 'Antes de empezar', fr: 'Avant de commencer',
    ar: 'قبل أن نبدأ', bn: 'শুরু করার আগে', pt: 'Antes de começar', ru: 'Прежде чем начать', ur: 'شروع کرنے سے پہلے',
  },
  'onboarding.step1.body': {
    en: 'Your photos are only used to create your fictional character and, if you ask, an illustrated portrait. They are processed instantly and never stored. Just for fun.',
    zh: '你的照片仅用于创建虚构角色，以及（应你要求）绘制插画肖像。会被即时处理且从不存储。仅供娱乐。',
    hi: 'आपकी फ़ोटो केवल आपका काल्पनिक किरदार और, आपके कहने पर, एक चित्रित पोर्ट्रेट बनाने में उपयोग होती हैं। वे तुरंत प्रोसेस होती हैं और कभी संग्रहीत नहीं होतीं। सिर्फ़ मनोरंजन के लिए।',
    es: 'Tus fotos solo se usan para crear tu personaje ficticio y, si lo pides, un retrato ilustrado. Se procesan al instante y nunca se guardan. Solo por diversión.',
    fr: 'Vos photos servent uniquement à créer votre personnage fictif et, si vous le demandez, un portrait illustré. Elles sont traitées instantanément et jamais conservées. Juste pour s’amuser.',
    ar: 'تُستخدم صورك فقط لإنشاء شخصيتك الخيالية، وصورة مرسومة إذا طلبت ذلك. تُعالج فورًا ولا تُخزن أبدًا. للمتعة فقط.',
    bn: 'আপনার ছবি শুধু আপনার কাল্পনিক চরিত্র এবং, আপনি চাইলে, একটি আঁকা প্রতিকৃতি তৈরিতে ব্যবহৃত হয়। তাৎক্ষণিকভাবে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না। শুধুই মজার জন্য।',
    pt: 'As suas fotos só servem para criar a sua personagem fictícia e, se pedir, um retrato ilustrado. São processadas na hora e nunca guardadas. Só por diversão.',
    ru: 'Ваши фото используются только для создания вымышленного персонажа и, по вашему запросу, иллюстрированного портрета. Они обрабатываются мгновенно и никогда не хранятся. Просто для развлечения.',
    ur: 'آپ کی تصاویر صرف آپ کا فرضی کردار اور، آپ کے کہنے پر، ایک تصویری پورٹریٹ بنانے میں استعمال ہوتی ہیں۔ فوراً پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔ صرف تفریح کے لیے۔',
  },
  'onboarding.ageCheckbox': {
    en: 'I confirm I am 18 years of age or older.', zh: '我确认我已年满18周岁。', hi: 'मैं पुष्टि करता/करती हूं कि मेरी आयु 18 वर्ष या उससे अधिक है।',
    es: 'Confirmo que tengo 18 años de edad o más.', fr: "Je confirme avoir 18 ans ou plus.",
    ar: 'أؤكد أن عمري 18 عامًا أو أكثر.', bn: 'আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছর বা তার বেশি।', pt: 'Confirmo que tenho 18 anos ou mais.',
    ru: 'Я подтверждаю, что мне 18 лет или больше.', ur: 'میں تصدیق کرتا/کرتی ہوں کہ میری عمر 18 سال یا اس سے زیادہ ہے۔',
  },
  'onboarding.consentCheckbox': {
    en: 'I consent to my photos being processed to create my character.', zh: '我同意处理我的照片以创建我的角色。',
    hi: 'मैं अपना किरदार बनाने के लिए अपनी फ़ोटो प्रोसेस किए जाने की सहमति देता/देती हूँ।',
    es: 'Acepto que mis fotos se procesen para crear mi personaje.',
    fr: 'J’accepte que mes photos soient traitées pour créer mon personnage.', ar: 'أوافق على معالجة صوري لإنشاء شخصيتي.',
    bn: 'আমার চরিত্র তৈরির জন্য আমার ছবি প্রক্রিয়া করতে আমি সম্মতি দিচ্ছি।',
    pt: 'Concordo que as minhas fotos sejam processadas para criar a minha personagem.',
    ru: 'Я согласен(на) на обработку моих фото для создания персонажа.',
    ur: 'میں اپنا کردار بنانے کے لیے اپنی تصاویر کی پروسیسنگ پر رضامند ہوں۔',
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
    en: 'Questborn needs your camera to take the photos your character is based on. Photos are processed in memory and never stored.',
    zh: 'Questborn需要使用相机拍摄角色灵感照片。照片仅在内存中处理，从不存储。',
    hi: 'Questborn को आपके किरदार के लिए फ़ोटो लेने हेतु कैमरे की ज़रूरत है। फ़ोटो मेमोरी में प्रोसेस होती हैं और कभी संग्रहीत नहीं होतीं।',
    es: 'Questborn necesita tu cámara para tomar las fotos en las que se basa tu personaje. Se procesan en memoria y nunca se guardan.',
    fr: 'Questborn a besoin de votre caméra pour prendre les photos dont s’inspire votre personnage. Elles sont traitées en mémoire et jamais conservées.',
    ar: 'يحتاج Questborn إلى الكاميرا لالتقاط الصور التي تستند إليها شخصيتك. تُعالج الصور في الذاكرة ولا تُخزن أبدًا.',
    bn: 'আপনার চরিত্রের ছবি তুলতে Questborn-এর ক্যামেরা প্রয়োজন। ছবি মেমোরিতে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না।',
    pt: 'O Questborn precisa da câmara para tirar as fotos em que a sua personagem se baseia. São processadas em memória e nunca guardadas.',
    ru: 'Questborn нужна камера, чтобы сделать фото для вашего персонажа. Фото обрабатываются в памяти и никогда не хранятся.',
    ur: 'Questborn کو آپ کے کردار کی تصاویر لینے کے لیے کیمرے کی ضرورت ہے۔ تصاویر میموری میں پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔',
  },
  'capture.permission.button': {
    en: 'Allow Camera Access', zh: '允许访问相机', hi: 'कैमरा एक्सेस की अनुमति दें', es: 'Permitir acceso a la cámara',
    fr: "Autoriser l'accès à la caméra", ar: 'السماح بالوصول إلى الكاميرا', bn: 'ক্যামেরা অ্যাক্সেসের অনুমতি দিন', pt: 'Permitir acesso à câmara',
    ru: 'Разрешить доступ к камере', ur: 'کیمرے کی رسائی کی اجازت دیں',
  },
  'capture.error.title': {
    en: 'Capture Failed', zh: '拍摄失败', hi: 'कैप्चर विफल', es: 'Error al capturar', fr: 'Échec de la capture',
    ar: 'فشل الالتقاط', bn: 'ক্যাপচার ব্যর্থ হয়েছে', pt: 'Falha na captura', ru: 'Не удалось сделать снимок',
    ur: 'کیپچر ناکام ہوگیا',
  },
  'capture.error.body': {
    en: 'Something went wrong taking that photo. Please try again.',
    zh: '拍摄照片时出了点问题，请重试。',
    hi: 'वह फ़ोटो लेने में कुछ गड़बड़ हुई। कृपया फिर से कोशिश करें।',
    es: 'Algo salió mal al tomar esa foto. Inténtalo de nuevo.',
    fr: "Une erreur s'est produite lors de la prise de cette photo. Veuillez réessayer.",
    ar: 'حدث خطأ أثناء التقاط هذه الصورة. يُرجى المحاولة مرة أخرى.',
    bn: 'সেই ছবিটি তোলার সময় কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    pt: 'Algo correu mal ao tirar essa foto. Por favor, tente novamente.',
    ru: 'При съёмке этого фото что-то пошло не так. Пожалуйста, попробуйте ещё раз.',
    ur: 'وہ تصویر لینے میں کچھ گڑبڑ ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  'capture.cancelButton': {
    en: 'Cancel', zh: '取消', hi: 'रद्द करें', es: 'Cancelar', fr: 'Annuler', ar: 'إلغاء', bn: 'বাতিল করুন',
    pt: 'Cancelar', ru: 'Отмена', ur: 'منسوخ کریں',
  },
  'capture.sourceModal.title': {
    en: 'Add a Photo', zh: '添加照片', hi: 'फ़ोटो जोड़ें', es: 'Añadir una foto', fr: 'Ajouter une photo',
    ar: 'إضافة صورة', bn: 'ছবি যোগ করুন', pt: 'Adicionar uma foto', ru: 'Добавить фото', ur: 'تصویر شامل کریں',
  },
  'capture.sourceModal.takePhoto.title': {
    en: 'Take Photo', zh: '拍照', hi: 'फ़ोटो लें', es: 'Tomar foto', fr: 'Prendre une photo', ar: 'التقاط صورة',
    bn: 'ছবি তুলুন', pt: 'Tirar foto', ru: 'Сделать фото', ur: 'تصویر لیں',
  },
  'capture.sourceModal.takePhoto.subtitle': {
    en: 'Use your camera now', zh: '立即使用相机', hi: 'अभी अपने कैमरे का उपयोग करें', es: 'Usa tu cámara ahora',
    fr: 'Utilisez votre caméra maintenant', ar: 'استخدم كاميرتك الآن', bn: 'এখনই আপনার ক্যামেরা ব্যবহার করুন',
    pt: 'Use a sua câmara agora', ru: 'Использовать камеру сейчас', ur: 'ابھی اپنا کیمرہ استعمال کریں',
  },
  'capture.sourceModal.library.title': {
    en: 'Choose from Library', zh: '从相册选择', hi: 'लाइब्रेरी से चुनें', es: 'Elegir de la biblioteca',
    fr: 'Choisir dans la bibliothèque', ar: 'الاختيار من المكتبة', bn: 'লাইব্রেরি থেকে বেছে নিন',
    pt: 'Escolher da biblioteca', ru: 'Выбрать из галереи', ur: 'لائبریری سے منتخب کریں',
  },
  'capture.sourceModal.library.subtitle': {
    en: 'Pick an existing photo', zh: '选择一张现有照片', hi: 'मौजूदा फ़ोटो चुनें', es: 'Elige una foto existente',
    fr: 'Choisissez une photo existante', ar: 'اختر صورة موجودة', bn: 'একটি বিদ্যমান ছবি বেছে নিন',
    pt: 'Escolha uma foto existente', ru: 'Выберите существующее фото', ur: 'موجودہ تصویر منتخب کریں',
  },
  'capture.step.person1.title': {
    en: 'Hero One', zh: '英雄一', hi: 'पहला हीरो', es: 'Héroe uno', fr: 'Héros un', ar: 'البطل الأول', bn: 'প্রথম হিরো',
    pt: 'Herói um', ru: 'Первый герой', ur: 'پہلا ہیرو',
  },
  'capture.step.person1.prompt': {
    en: 'Your photo: the first hero of the party.', zh: '你的照片：小队的第一位英雄。', hi: 'आपकी फ़ोटो: दल का पहला हीरो।',
    es: 'Tu foto: el primer héroe del grupo.', fr: 'Votre photo : le premier héros du groupe.',
    ar: 'صورتك: البطل الأول في الفريق.', bn: 'আপনার ছবি: দলের প্রথম হিরো।', pt: 'A sua foto: o primeiro herói do grupo.',
    ru: 'Ваше фото: первый герой отряда.', ur: 'آپ کی تصویر: ٹیم کا پہلا ہیرو۔',
  },
  'capture.step.person2.title': {
    en: 'Hero Two', zh: '英雄二', hi: 'दूसरा हीरो', es: 'Héroe dos', fr: 'Héros deux', ar: 'البطل الثاني', bn: 'দ্বিতীয় হিরো',
    pt: 'Herói dois', ru: 'Второй герой', ur: 'دوسرا ہیرو',
  },
  'capture.step.person2.prompt': {
    en: 'Now your friend, with their permission.', zh: '现在拍你的朋友（需征得其同意）。', hi: 'अब अपने दोस्त की, उनकी अनुमति से।',
    es: 'Ahora tu amigo, con su permiso.', fr: 'Maintenant votre ami·e, avec son accord.', ar: 'الآن صديقك، بإذنه.',
    bn: 'এবার আপনার বন্ধুর, তার অনুমতি নিয়ে।', pt: 'Agora o seu amigo, com a autorização dele.',
    ru: 'Теперь ваш друг — с его согласия.', ur: 'اب آپ کا دوست، اس کی اجازت سے۔',
  },
  'capture.step.solo.title': {
    en: 'Your Evil Twin', zh: '你的邪恶双胞胎', hi: 'आपका दुष्ट जुड़वाँ', es: 'Tu gemelo malvado', fr: 'Votre jumeau maléfique',
    ar: 'توأمك الشرير', bn: 'আপনার দুষ্ট যমজ', pt: 'O seu gémeo malvado', ru: 'Ваш злой двойник', ur: 'آپ کا شریر ہمزاد',
  },
  'capture.step.solo.prompt': {
    en: 'Give us your best villain smirk 😏', zh: '给我们一个最坏的反派坏笑 😏', hi: 'अपनी सबसे बढ़िया खलनायक मुस्कान दिखाएँ 😏',
    es: 'Danos tu mejor sonrisa de villano 😏', fr: 'Votre plus beau sourire de méchant 😏', ar: 'أرِنا أفضل ابتسامة شريرة 😏',
    bn: 'আপনার সেরা খলনায়কের হাসি দিন 😏', pt: 'Mostre o seu melhor sorriso de vilão 😏', ru: 'Ваша лучшая злодейская ухмылка 😏',
    ur: 'اپنی بہترین ولن والی مسکراہٹ دکھائیں 😏',
  },
  'analyze.title': {
    en: 'Create', zh: '创建', hi: 'बनाएँ', es: 'Crear', fr: 'Créer', ar: 'إنشاء', bn: 'তৈরি', pt: 'Criar', ru: 'Создать',
    ur: 'بنائیں',
  },
  'analyze.subtitle': {
    en: 'Choose what to forge from your photos.', zh: '选择要用你的照片打造什么。', hi: 'चुनें कि अपनी फ़ोटो से क्या गढ़ना है।',
    es: 'Elige qué forjar con tus fotos.', fr: 'Choisissez ce que vous forgez à partir de vos photos.',
    ar: 'اختر ما تريد صنعه من صورك.', bn: 'আপনার ছবি থেকে কী বানাবেন বেছে নিন।', pt: 'Escolha o que forjar com as suas fotos.',
    ru: 'Выберите, что создать из ваших фото.', ur: 'منتخب کریں کہ اپنی تصاویر سے کیا بنانا ہے۔',
  },
  'analyze.comingSoonBadge': {
    en: 'COMING SOON', zh: '即将推出', hi: 'जल्द आ रहा है', es: 'PRÓXIMAMENTE', fr: 'BIENTÔT DISPONIBLE',
    ar: 'قريبًا', bn: 'শীঘ্রই আসছে', pt: 'EM BREVE', ru: 'СКОРО', ur: 'جلد آ رہا ہے',
  },
  'analyze.comingSoon': {
    en: 'More creation modes are on the way ✦', zh: '更多创建模式即将上线 ✦', hi: 'और भी क्रिएशन मोड जल्द आ रहे हैं ✦',
    es: 'Llegan más modos de creación ✦', fr: 'D’autres modes de création arrivent ✦', ar: 'المزيد من أوضاع الإنشاء قادمة ✦',
    bn: 'আরও তৈরির মোড আসছে ✦', pt: 'Mais modos de criação a caminho ✦', ru: 'Скоро новые режимы создания ✦',
    ur: 'مزید تخلیقی موڈ جلد آ رہے ہیں ✦',
  },
  'results.title': {
    en: 'Your Heroes', zh: '你的英雄', hi: 'आपके हीरो', es: 'Tus héroes', fr: 'Vos héros', ar: 'أبطالك', bn: 'আপনার হিরো',
    pt: 'Os seus heróis', ru: 'Ваши герои', ur: 'آپ کے ہیرو',
  },
  'results.emptyTitle': {
    en: 'No Characters Yet', zh: '还没有角色', hi: 'अभी कोई किरदार नहीं', es: 'Aún no hay personajes',
    fr: 'Pas encore de personnages', ar: 'لا توجد شخصيات بعد', bn: 'এখনো কোনো চরিত্র নেই', pt: 'Ainda sem personagens',
    ru: 'Пока нет персонажей', ur: 'ابھی کوئی کردار نہیں',
  },
  'results.emptyBody': {
    en: 'Characters you create this session will show up here.', zh: '你本次创建的角色会显示在这里。',
    hi: 'इस सत्र में बनाए गए किरदार यहाँ दिखेंगे।', es: 'Los personajes que crees en esta sesión aparecerán aquí.',
    fr: 'Les personnages créés pendant cette session apparaîtront ici.', ar: 'ستظهر هنا الشخصيات التي تنشئها في هذه الجلسة.',
    bn: 'এই সেশনে তৈরি চরিত্রগুলো এখানে দেখা যাবে।', pt: 'As personagens que criar nesta sessão aparecem aqui.',
    ru: 'Персонажи, созданные в этом сеансе, появятся здесь.', ur: 'اس سیشن میں بنائے گئے کردار یہاں نظر آئیں گے۔',
  },
  'common.startAnalysis': {
    en: 'Create a Character', zh: '创建角色', hi: 'किरदार बनाएँ', es: 'Crear un personaje', fr: 'Créer un personnage',
    ar: 'أنشئ شخصية', bn: 'চরিত্র তৈরি করুন', pt: 'Criar uma personagem', ru: 'Создать персонажа', ur: 'کردار بنائیں',
  },
  'review.headerTitle': {
    en: 'Rate Experience', zh: '评价体验', hi: 'अनुभव को रेट करें', es: 'Calificar experiencia', fr: "Évaluer l'expérience",
    ar: 'تقييم التجربة', bn: 'অভিজ্ঞতা রেট করুন', pt: 'Avaliar experiência', ru: 'Оценить опыт', ur: 'تجربے کی درجہ بندی کریں',
  },
  'review.headline': {
    en: 'Enjoying your heroes on Questborn?', zh: '喜欢你在Questborn的英雄吗？', hi: 'Questborn पर अपने हीरो पसंद आ रहे हैं?',
    es: '¿Te gustan tus héroes de Questborn?', fr: 'Vous aimez vos héros Questborn ?', ar: 'هل تستمتع بأبطالك على Questborn؟',
    bn: 'Questborn-এ আপনার হিরোদের উপভোগ করছেন?', pt: 'Está a gostar dos seus heróis no Questborn?',
    ru: 'Нравятся ваши герои в Questborn?', ur: 'کیا Questborn پر اپنے ہیرو پسند آ رہے ہیں؟',
  },
  'review.body': {
    en: 'Your rating helps other adventurers find us.', zh: '你的评分能帮助其他冒险者找到我们。',
    hi: 'आपकी रेटिंग दूसरे साहसियों को हमें खोजने में मदद करती है।',
    es: 'Tu valoración ayuda a otros aventureros a encontrarnos.', fr: 'Votre note aide d’autres aventuriers à nous trouver.',
    ar: 'تقييمك يساعد مغامرين آخرين في العثور علينا.', bn: 'আপনার রেটিং অন্য অভিযাত্রীদের আমাদের খুঁজে পেতে সাহায্য করে।',
    pt: 'A sua avaliação ajuda outros aventureiros a encontrar-nos.',
    ru: 'Ваша оценка помогает другим искателям приключений найти нас.',
    ur: 'آپ کی ریٹنگ دوسرے مہم جوؤں کو ہمیں ڈھونڈنے میں مدد دیتی ہے۔',
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
    en: 'Unlock Unlimited Heroes', zh: '解锁无限英雄', hi: 'असीमित हीरो अनलॉक करें', es: 'Desbloquea héroes ilimitados',
    fr: 'Débloquez des héros illimités', ar: 'افتح أبطالًا بلا حدود', bn: 'সীমাহীন হিরো আনলক করুন',
    pt: 'Desbloqueie heróis ilimitados', ru: 'Откройте безлимитных героев', ur: 'لامحدود ہیرو ان لاک کریں',
  },
  'paywall.subtitle': {
    en: 'Forge as many heroes, parties and nemeses as you like, unlocked instantly.', zh: '随心打造英雄、小队和宿敌，即刻解锁。',
    hi: 'जितने चाहें हीरो, दल और दुश्मन गढ़ें, तुरंत अनलॉक।',
    es: 'Forja tantos héroes, grupos y némesis como quieras, al instante.',
    fr: 'Forgez autant de héros, de groupes et de némésis que vous voulez, débloqués instantanément.',
    ar: 'اصنع ما تشاء من الأبطال والفرق والأعداء، فورًا.', bn: 'যত খুশি হিরো, দল আর শত্রু গড়ুন, তাৎক্ষণিক আনলক।',
    pt: 'Forje quantos heróis, grupos e némesis quiser, desbloqueado na hora.',
    ru: 'Создавайте сколько угодно героев, отрядов и врагов — сразу.',
    ur: 'جتنے چاہیں ہیرو، ٹیمیں اور دشمن بنائیں، فوراً ان لاک۔',
  },
  'paywall.featuresHeading': {
    en: 'Everything you unlock', zh: '解锁全部权益', hi: 'आपको जो कुछ मिलेगा', es: 'Todo lo que desbloqueas',
    fr: 'Tout ce que vous débloquez', ar: 'كل ما ستحصل عليه', bn: 'আপনি যা যা আনলক করবেন', pt: 'Tudo o que desbloqueia',
    ru: 'Всё, что вы получите', ur: 'وہ سب کچھ جو آپ کو ملے گا',
  },
  'paywall.feature1': {
    en: 'Unlimited Heroes, Parties & Nemeses', zh: '无限英雄、小队与宿敌', hi: 'असीमित हीरो, दल और दुश्मन',
    es: 'Héroes, grupos y némesis ilimitados', fr: 'Héros, groupes et némésis illimités', ar: 'أبطال وفرق وأعداء بلا حدود',
    bn: 'সীমাহীন হিরো, দল ও শত্রু', pt: 'Heróis, grupos e némesis ilimitados', ru: 'Безлимитные герои, отряды и враги',
    ur: 'لامحدود ہیرو، ٹیمیں اور دشمن',
  },
  'paywall.feature2': {
    en: 'Full Character Sheets, Backstories & Quests', zh: '完整角色卡、背景故事与任务', hi: 'पूरी कैरेक्टर शीट, बैकस्टोरी और मिशन',
    es: 'Hojas completas, trasfondos y misiones', fr: 'Fiches complètes, histoires et quêtes', ar: 'بطاقات كاملة وقصص ومهام',
    bn: 'পূর্ণ ক্যারেক্টার শিট, ব্যাকস্টোরি ও অভিযান', pt: 'Fichas completas, histórias e missões',
    ru: 'Полные листы, предыстории и квесты', ur: 'مکمل کریکٹر شیٹس، پس منظر اور مہمات',
  },
  'paywall.feature3': {
    en: 'Instant High-Res, Story-Ready Share Cards', zh: '即时生成高清故事分享卡',
    hi: 'तुरंत हाई-रेस, स्टोरी-रेडी शेयर कार्ड्स', es: 'Tarjetas para compartir en alta resolución, listas al instante',
    fr: "Cartes de partage haute résolution, prêtes instantanément", ar: 'بطاقات مشاركة عالية الدقة وجاهزة للستوري فورًا',
    bn: 'তাৎক্ষণিক হাই-রেজোলিউশন, স্টোরি-রেডি শেয়ার কার্ড', pt: 'Cartões de partilha em alta resolução, prontos na hora',
    ru: 'Карточки для сторис в высоком разрешении — мгновенно готовы', ur: 'فوری ہائی ریزولوشن، اسٹوری کے لیے تیار شیئر کارڈز',
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
  'paywall.reassurance': {
    en: 'Cancel anytime · Secure payment', zh: '随时取消 · 安全支付', hi: 'कभी भी रद्द करें · सुरक्षित भुगतान',
    es: 'Cancela cuando quieras · Pago seguro', fr: 'Annulez à tout moment · Paiement sécurisé',
    ar: 'ألغِ في أي وقت · دفع آمن', bn: 'যেকোনো সময় বাতিল করুন · নিরাপদ পেমেন্ট', pt: 'Cancele quando quiser · Pagamento seguro',
    ru: 'Отмена в любой момент · Безопасная оплата', ur: 'کسی بھی وقت منسوخ کریں · محفوظ ادائیگی',
  },
  // Apple App Store Review Guideline §3.1.2's auto-renewal disclosure —
  // deliberately separate from paywall.reassurance above (that one stays a
  // short marketing line; this one carries the exact required elements:
  // auto-renews, the 24-hour cancellation window, and where to manage it).
  // No price embedded here since both plan cards already show their own
  // real price directly above this text.
  'paywall.renewalDisclosure': {
    en: "Auto-renews unless cancelled at least 24 hours before the end of the current period. Manage or cancel anytime in your device's account settings.",
    zh: '除非在当前订阅周期结束前至少24小时取消，否则将自动续订。你可以随时在设备的账户设置中管理或取消。',
    hi: 'मौजूदा अवधि समाप्त होने से कम से कम 24 घंटे पहले रद्द न करने पर यह स्वतः नवीनीकृत हो जाएगा। आप इसे कभी भी अपने डिवाइस की खाता सेटिंग्स में प्रबंधित या रद्द कर सकते हैं।',
    es: 'Se renueva automáticamente a menos que se cancele al menos 24 horas antes de que finalice el período actual. Puedes gestionarlo o cancelarlo en cualquier momento desde la configuración de tu cuenta.',
    fr: "Se renouvelle automatiquement sauf annulation au moins 24 heures avant la fin de la période en cours. Vous pouvez le gérer ou l'annuler à tout moment dans les paramètres de votre compte.",
    ar: 'يتجدد تلقائيًا ما لم يتم الإلغاء قبل 24 ساعة على الأقل من انتهاء الفترة الحالية. يمكنك إدارته أو إلغاءه في أي وقت من إعدادات حساب جهازك.',
    bn: 'বর্তমান মেয়াদ শেষ হওয়ার অন্তত ২৪ ঘণ্টা আগে বাতিল না করলে এটি স্বয়ংক্রিয়ভাবে নবায়ন হবে। আপনি যেকোনো সময় আপনার ডিভাইসের অ্যাকাউন্ট সেটিংসে এটি পরিচালনা বা বাতিল করতে পারেন।',
    pt: 'Renova-se automaticamente, a menos que seja cancelado pelo menos 24 horas antes do final do período atual. Pode gerir ou cancelar a qualquer momento nas definições da conta do seu dispositivo.',
    ru: 'Автоматически продлевается, если не отменить как минимум за 24 часа до окончания текущего периода. Вы можете управлять подпиской или отменить её в любое время в настройках учётной записи устройства.',
    ur: 'موجودہ مدت ختم ہونے سے کم از کم 24 گھنٹے پہلے منسوخ نہ کرنے پر یہ خودکار طور پر تجدید ہو جائے گا۔ آپ اسے کسی بھی وقت اپنے ڈیوائس کی اکاؤنٹ سیٹنگز میں منظم یا منسوخ کر سکتے ہیں۔',
  },
  'paywall.monthlyName': {
    en: 'Monthly Pass', zh: '月度订阅', hi: 'मासिक पास', es: 'Pase mensual', fr: 'Pass mensuel', ar: 'اشتراك شهري',
    bn: 'মাসিক পাস', pt: 'Passe mensal', ru: 'Месячный абонемент', ur: 'ماہانہ پاس',
  },
  'paywall.saveBadge': {
    en: 'SAVE 50%', zh: '节省50%', hi: '50% बचाएं', es: 'AHORRA 50%', fr: 'ÉCONOMISEZ 50%', ar: 'وفّر 50٪',
    bn: '৫০% সাশ্রয়', pt: 'POUPE 50%', ru: 'ЭКОНОМИЯ 50%', ur: '50% کی بچت',
  },
  'paywall.monthlyDescription': {
    en: 'Best value for regulars', zh: '常客的最佳选择', hi: 'नियमित उपयोगकर्ताओं के लिए सबसे अच्छा मूल्य', es: 'La mejor relación calidad-precio',
    fr: 'Le meilleur rapport qualité-prix', ar: 'أفضل قيمة للمستخدمين المنتظمين', bn: 'নিয়মিত ব্যবহারকারীদের জন্য সেরা মূল্য', pt: 'Melhor valor para uso regular',
    ru: 'Лучшая цена для постоянных пользователей', ur: 'باقاعدہ صارفین کے لیے بہترین قیمت',
  },
  'paywall.monthlyCadence': {
    en: '/MONTH', zh: '/月', hi: '/माह', es: '/MES', fr: '/MOIS', ar: '/شهريًا',
    bn: '/মাস', pt: '/MÊS', ru: '/МЕС', ur: '/ماہ',
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
  'paywall.purchaseError.title': {
    en: 'Purchase Failed', zh: '购买失败', hi: 'खरीदारी विफल', es: 'Compra fallida', fr: "Échec de l'achat",
    ar: 'فشل الشراء', bn: 'ক্রয় ব্যর্থ হয়েছে', pt: 'Compra falhou', ru: 'Покупка не удалась', ur: 'خریداری ناکام',
  },
  'paywall.purchaseError.body': {
    en: 'Something went wrong with your purchase. Please try again.', zh: '购买时出现问题，请重试。',
    hi: 'आपकी खरीदारी में कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।', es: 'Algo salió mal con tu compra. Inténtalo de nuevo.',
    fr: 'Un problème est survenu avec votre achat. Veuillez réessayer.', ar: 'حدث خطأ أثناء الشراء. يرجى المحاولة مرة أخرى.',
    bn: 'আপনার ক্রয়ে কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', pt: 'Algo correu mal com a sua compra. Por favor, tente novamente.',
    ru: 'Что-то пошло не так с вашей покупкой. Пожалуйста, попробуйте снова.', ur: 'آپ کی خریداری میں کچھ گڑبڑ ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  'paywall.restoreSuccess.body': {
    en: 'Your subscription has been restored.', zh: '您的订阅已恢复。', hi: 'आपकी सदस्यता पुनर्स्थापित कर दी गई है।',
    es: 'Tu suscripción ha sido restaurada.', fr: 'Votre abonnement a été restauré.', ar: 'تمت استعادة اشتراكك.',
    bn: 'আপনার সাবস্ক্রিপশন পুনরুদ্ধার করা হয়েছে।', pt: 'A sua subscrição foi restaurada.', ru: 'Ваша подписка восстановлена.',
    ur: 'آپ کی سبسکرپشن بحال کر دی گئی ہے۔',
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
  'settings.row.soundEffects': {
    en: 'Sound Effects', zh: '音效', hi: 'साउंड इफ़ेक्ट्स', es: 'Efectos de sonido', fr: 'Effets sonores',
    ar: 'المؤثرات الصوتية', bn: 'সাউন্ড ইফেক্ট', pt: 'Efeitos sonoros', ru: 'Звуковые эффекты', ur: 'ساؤنڈ ایفیکٹس',
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
  'settings.section.about': {
    en: 'About', zh: '关于', hi: 'के बारे में', es: 'Acerca de', fr: 'À propos', ar: 'حول', bn: 'সম্পর্কে',
    pt: 'Sobre', ru: 'О приложении', ur: 'کے بارے میں',
  },
  'settings.row.appVersion': {
    en: 'App Version', zh: '应用版本', hi: 'ऐप संस्करण', es: 'Versión de la app', fr: "Version de l'application",
    ar: 'إصدار التطبيق', bn: 'অ্যাপ সংস্করণ', pt: 'Versão da app', ru: 'Версия приложения', ur: 'ایپ ورژن',
  },
  'settings.row.device': {
    en: 'Device', zh: '设备', hi: 'डिवाइस', es: 'Dispositivo', fr: 'Appareil', ar: 'الجهاز', bn: 'ডিভাইস',
    pt: 'Dispositivo', ru: 'Устройство', ur: 'ڈیوائس',
  },
  'analyzing.headline': {
    en: 'Forging Your Character', zh: '正在打造你的角色', hi: 'आपका किरदार गढ़ा जा रहा है', es: 'Forjando tu personaje',
    fr: 'Forge de votre personnage', ar: 'جارٍ صنع شخصيتك', bn: 'আপনার চরিত্র গড়া হচ্ছে', pt: 'A forjar a sua personagem',
    ru: 'Создаём вашего персонажа', ur: 'آپ کا کردار تیار ہو رہا ہے',
  },
  'analyzing.subtitle': {
    en: 'Rolling stats and writing your legend...', zh: '正在掷骰属性、书写你的传奇……',
    hi: 'स्टैट्स रोल हो रहे हैं, आपकी गाथा लिखी जा रही है...', es: 'Tirando estadísticas y escribiendo tu leyenda...',
    fr: 'Lancer des caractéristiques et écriture de votre légende...', ar: 'جارٍ رمي الإحصائيات وكتابة أسطورتك...',
    bn: 'স্ট্যাটস রোল হচ্ছে, আপনার কিংবদন্তি লেখা হচ্ছে...', pt: 'A lançar atributos e a escrever a sua lenda...',
    ru: 'Бросаем кубики и пишем вашу легенду...', ur: 'اسٹیٹس رول ہو رہے ہیں اور آپ کی داستان لکھی جا رہی ہے...',
  },
  'analyzing.error.title': {
    en: 'Something Went Wrong', zh: '出错了', hi: 'कुछ गलत हो गया', es: 'Algo salió mal', fr: "Une erreur s'est produite",
    ar: 'حدث خطأ ما', bn: 'কিছু ভুল হয়েছে', pt: 'Algo correu mal', ru: 'Что-то пошло не так', ur: 'کچھ غلط ہو گیا',
  },
  'analyzing.error.body': {
    en: 'We couldn\'t forge your character. Please check your connection and try again.', zh: '无法打造你的角色，请检查网络后重试。',
    hi: 'आपका किरदार नहीं बन सका। कृपया कनेक्शन जाँचें और फिर कोशिश करें।',
    es: 'No pudimos forjar tu personaje. Revisa tu conexión e inténtalo de nuevo.',
    fr: 'Impossible de forger votre personnage. Vérifiez votre connexion et réessayez.',
    ar: 'تعذر صنع شخصيتك. تحقق من اتصالك وحاول مجددًا.', bn: 'আপনার চরিত্র তৈরি করা যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
    pt: 'Não foi possível forjar a sua personagem. Verifique a ligação e tente novamente.',
    ru: 'Не удалось создать персонажа. Проверьте соединение и попробуйте снова.',
    ur: 'آپ کا کردار نہیں بن سکا۔ کنکشن چیک کر کے دوبارہ کوشش کریں۔',
  },
  'analyzing.error.retry': {
    en: 'Try Again', zh: '重试', hi: 'फिर से कोशिश करें', es: 'Intentar de nuevo', fr: 'Réessayer', ar: 'إعادة المحاولة',
    bn: 'আবার চেষ্টা করুন', pt: 'Tentar novamente', ru: 'Повторить', ur: 'دوبارہ کوشش کریں',
  },
  'analyzing.error.backHome': {
    en: 'Back to Create', zh: '返回创建', hi: 'बनाएँ पर वापस', es: 'Volver a Crear', fr: 'Retour à Créer', ar: 'العودة إلى الإنشاء',
    bn: 'তৈরিতে ফিরুন', pt: 'Voltar a Criar', ru: 'Назад к созданию', ur: 'واپس بنائیں پر',
  },
  'noFaceDetected.headline': {
    en: 'We Couldn\'t See You', zh: '没有看到你', hi: 'हम आपको देख नहीं सके', es: 'No pudimos verte', fr: 'Nous ne vous voyons pas',
    ar: 'لم نتمكن من رؤيتك', bn: 'আমরা আপনাকে দেখতে পাইনি', pt: 'Não conseguimos vê-lo', ru: 'Мы вас не видим',
    ur: 'ہم آپ کو نہیں دیکھ سکے',
  },
  'noFaceDetected.body': {
    en: 'Make sure you are clearly in frame in good lighting, then strike the pose again.', zh: '请确保你在光线充足处清晰入镜，然后再摆一次姿势。',
    hi: 'अच्छी रोशनी में फ़्रेम में साफ़ दिखें, फिर दोबारा पोज़ दें।',
    es: 'Asegúrate de salir bien encuadrado y con buena luz, y vuelve a posar.',
    fr: 'Placez-vous bien dans le cadre, avec un bon éclairage, puis reprenez la pose.',
    ar: 'تأكد من ظهورك بوضوح في الإطار بإضاءة جيدة ثم كرر الوضعية.',
    bn: 'ভালো আলোয় ফ্রেমে স্পষ্টভাবে থাকুন, তারপর আবার পোজ দিন।',
    pt: 'Certifique-se de que está bem enquadrado e com boa luz, e repita a pose.',
    ru: 'Встаньте чётко в кадр при хорошем освещении и повторите позу.',
    ur: 'اچھی روشنی میں فریم میں واضح رہیں، پھر دوبارہ پوز دیں۔',
  },
  'noFaceDetected.retry': {
    en: 'Retake Photos', zh: '重新拍照', hi: 'फिर से फ़ोटो लें', es: 'Repetir fotos', fr: 'Reprendre les photos',
    ar: 'إعادة التقاط الصور', bn: 'আবার ছবি তুলুন', pt: 'Tirar fotos novamente', ru: 'Переснять фото', ur: 'دوبارہ تصاویر لیں',
  },
  'noFaceDetected.backHome': {
    en: 'Back to Create', zh: '返回创建', hi: 'बनाएँ पर वापस', es: 'Volver a Crear', fr: 'Retour à Créer', ar: 'العودة إلى الإنشاء',
    bn: 'তৈরিতে ফিরুন', pt: 'Voltar a Criar', ru: 'Назад к созданию', ur: 'واپس بنائیں پر',
  },
  'reveal.title': {
    en: 'Your Character', zh: '你的角色', hi: 'आपका किरदार', es: 'Tu personaje', fr: 'Votre personnage', ar: 'شخصيتك',
    bn: 'আপনার চরিত্র', pt: 'A sua personagem', ru: 'Ваш персонаж', ur: 'آپ کا کردار',
  },
  'reveal.doneButton': {
    en: 'Done', zh: '完成', hi: 'पूर्ण', es: 'Listo', fr: 'Terminé', ar: 'تم', bn: 'সম্পন্ন', pt: 'Concluído', ru: 'Готово', ur: 'مکمل',
  },
  'reveal.shareButton': {
    en: 'Share Character', zh: '分享角色', hi: 'किरदार शेयर करें', es: 'Compartir personaje', fr: 'Partager le personnage',
    ar: 'شارك الشخصية', bn: 'চরিত্র শেয়ার করুন', pt: 'Partilhar personagem', ru: 'Поделиться персонажем', ur: 'کردار شیئر کریں',
  },
  'reveal.previousCard': {
    en: 'Previous card', zh: '上一张', hi: 'पिछला कार्ड', es: 'Tarjeta anterior', fr: 'Carte précédente',
    ar: 'البطاقة السابقة', bn: 'আগের কার্ড', pt: 'Cartão anterior', ru: 'Предыдущая карточка', ur: 'پچھلا کارڈ',
  },
  'reveal.nextCard': {
    en: 'Next card', zh: '下一张', hi: 'अगला कार्ड', es: 'Tarjeta siguiente', fr: 'Carte suivante',
    ar: 'البطاقة التالية', bn: 'পরবর্তী কার্ড', pt: 'Cartão seguinte', ru: 'Следующая карточка', ur: 'اگلا کارڈ',
  },
  'share.modalTitle': {
    en: 'Share Your Character', zh: '分享你的角色', hi: 'अपना किरदार शेयर करें', es: 'Comparte tu personaje',
    fr: 'Partagez votre personnage', ar: 'شارك شخصيتك', bn: 'আপনার চরিত্র শেয়ার করুন', pt: 'Partilhe a sua personagem',
    ru: 'Поделитесь персонажем', ur: 'اپنا کردار شیئر کریں',
  },
  'share.includePhoto': {
    en: 'Include my photo', zh: '包含我的照片', hi: 'मेरी फ़ोटो शामिल करें', es: 'Incluir mi foto',
    fr: 'Inclure ma photo', ar: 'تضمين صورتي', bn: 'আমার ছবি অন্তর্ভুক্ত করুন', pt: 'Incluir a minha foto',
    ru: 'Добавить моё фото', ur: 'میری تصویر شامل کریں',
  },
  'share.storyFormat': {
    en: 'Story format (9:16)', zh: '故事格式 (9:16)', hi: 'स्टोरी फ़ॉर्मैट (9:16)', es: 'Formato historia (9:16)',
    fr: 'Format story (9:16)', ar: 'تنسيق القصة (9:16)', bn: 'স্টোরি ফরম্যাট (৯:১৬)', pt: 'Formato story (9:16)',
    ru: 'Формат истории (9:16)', ur: 'اسٹوری فارمیٹ (9:16)',
  },
  'share.optionImage.title': {
    en: 'Story Card', zh: '故事卡片', hi: 'स्टोरी कार्ड', es: 'Tarjeta para historias', fr: 'Carte pour story',
    ar: 'بطاقة القصة', bn: 'স্টোরি কার্ড', pt: 'Cartão para stories', ru: 'Карточка для сторис', ur: 'اسٹوری کارڈ',
  },
  'share.optionImage.subtitle': {
    en: 'A ready-to-post image card', zh: '一张可直接发布的图片卡片', hi: 'पोस्ट करने के लिए तैयार इमेज कार्ड',
    es: 'Una tarjeta lista para publicar', fr: 'Une carte prête à publier', ar: 'بطاقة جاهزة للنشر',
    bn: 'পোস্ট করার জন্য প্রস্তুত ইমেজ কার্ড', pt: 'Um cartão pronto a publicar', ru: 'Готовая к публикации карточка',
    ur: 'پوسٹ کرنے کے لیے تیار امیج کارڈ',
  },
  'share.optionText.title': {
    en: 'Quick Message', zh: '快速消息', hi: 'क्विक मैसेज', es: 'Mensaje rápido', fr: 'Message rapide',
    ar: 'رسالة سريعة', bn: 'দ্রুত বার্তা', pt: 'Mensagem rápida', ru: 'Короткое сообщение', ur: 'فوری پیغام',
  },
  'share.optionText.subtitle': {
    en: 'Send the highlights as text', zh: '以文字形式发送要点', hi: 'मुख्य बातें टेक्स्ट के रूप में भेजें',
    es: 'Envía lo más destacado como texto', fr: "Envoyez l'essentiel en texte", ar: 'أرسل الأبرز كنص',
    bn: 'মূল বিষয়গুলো টেক্সট আকারে পাঠান', pt: 'Envie os destaques como texto', ru: 'Отправьте главное текстом',
    ur: 'اہم باتیں متن کے طور پر بھیجیں',
  },
  'share.optionCopy.title': {
    en: 'Copy Text', zh: '复制文字', hi: 'टेक्स्ट कॉपी करें', es: 'Copiar texto', fr: 'Copier le texte',
    ar: 'نسخ النص', bn: 'টেক্সট কপি করুন', pt: 'Copiar texto', ru: 'Копировать текст', ur: 'متن کاپی کریں',
  },
  'share.optionCopy.subtitle': {
    en: 'Paste it in anywhere yourself', zh: '自行粘贴到任何地方', hi: 'इसे कहीं भी स्वयं पेस्ट करें',
    es: 'Pégalo tú mismo donde quieras', fr: "Collez-le où vous voulez", ar: 'الصقه في أي مكان بنفسك',
    bn: 'নিজে যেকোনো জায়গায় পেস্ট করুন', pt: 'Cole onde quiser', ru: 'Вставьте куда угодно сами',
    ur: 'اسے کہیں بھی خود پیسٹ کریں',
  },
  'share.copiedTitle': {
    en: 'Copied!', zh: '已复制！', hi: 'कॉपी हो गया!', es: '¡Copiado!', fr: 'Copié !', ar: 'تم النسخ!',
    bn: 'কপি হয়েছে!', pt: 'Copiado!', ru: 'Скопировано!', ur: 'کاپی ہوگیا!',
  },
  'share.copiedBody': {
    en: 'Your character is ready to paste anywhere.', zh: '你的角色已可粘贴到任何地方。',
    hi: 'आपका किरदार कहीं भी पेस्ट करने के लिए तैयार है।', es: 'Tu personaje está listo para pegar donde quieras.',
    fr: 'Votre personnage est prêt à être collé partout.', ar: 'شخصيتك جاهزة للصق في أي مكان.',
    bn: 'আপনার চরিত্র যেকোনো জায়গায় পেস্ট করার জন্য প্রস্তুত।',
    pt: 'A sua personagem está pronta para colar em qualquer lado.', ru: 'Персонаж готов к вставке куда угодно.',
    ur: 'آپ کا کردار کہیں بھی پیسٹ کرنے کے لیے تیار ہے۔',
  },
  'share.builder.title': {
    en: 'Build Your Card', zh: '制作你的卡片', hi: 'अपना कार्ड बनाएं', es: 'Crea tu tarjeta', fr: 'Créez votre carte',
    ar: 'أنشئ بطاقتك', bn: 'আপনার কার্ড তৈরি করুন', pt: 'Crie o seu cartão', ru: 'Создайте свою карточку',
    ur: 'اپنا کارڈ بنائیں',
  },
  'share.builder.subtitle': {
    en: 'Pick what shows up on your card', zh: '选择卡片上显示的内容', hi: 'अपने कार्ड पर क्या दिखे, चुनें',
    es: 'Elige qué aparece en tu tarjeta', fr: 'Choisissez ce qui apparaît sur votre carte',
    ar: 'اختر ما يظهر على بطاقتك', bn: 'আপনার কার্ডে কী দেখাবে তা বেছে নিন', pt: 'Escolha o que aparece no seu cartão',
    ru: 'Выберите, что показать на карточке', ur: 'منتخب کریں کہ آپ کے کارڈ پر کیا دکھایا جائے',
  },
  'share.builder.colorLabel': {
    en: 'Card color', zh: '卡片颜色', hi: 'कार्ड का रंग', es: 'Color de la tarjeta', fr: 'Couleur de la carte',
    ar: 'لون البطاقة', bn: 'কার্ডের রঙ', pt: 'Cor do cartão', ru: 'Цвет карточки', ur: 'کارڈ کا رنگ',
  },
  'share.builder.sectionsLabel': {
    en: 'Sections', zh: '内容板块', hi: 'सेक्शन', es: 'Secciones', fr: 'Sections',
    ar: 'الأقسام', bn: 'বিভাগ', pt: 'Secções', ru: 'Разделы', ur: 'حصے',
  },
  'share.builder.createButton': {
    en: 'Create & Share', zh: '创建并分享', hi: 'बनाएं और शेयर करें', es: 'Crear y compartir', fr: 'Créer et partager',
    ar: 'إنشاء ومشاركة', bn: 'তৈরি করুন ও শেয়ার করুন', pt: 'Criar e partilhar', ru: 'Создать и поделиться',
    ur: 'بنائیں اور شیئر کریں',
  },
  'share.builder.back': {
    en: 'Back', zh: '返回', hi: 'वापस', es: 'Atrás', fr: 'Retour', ar: 'رجوع', bn: 'পিছনে', pt: 'Voltar',
    ru: 'Назад', ur: 'واپس',
  },
  'share.shareTextTemplate': {
    en: 'Meet {badge}, forged on Questborn ⚔️\n\n{summary}\n\n{details}Forge your own hero!{link}',
    zh: '来认识 {badge}，诞生于Questborn ⚔️\n\n{summary}\n\n{details}打造你自己的英雄！{link}',
    hi: 'मिलिए {badge} से, Questborn पर गढ़ा गया ⚔️\n\n{summary}\n\n{details}अपना हीरो गढ़ें!{link}',
    es: 'Te presento a {badge}, forjado en Questborn ⚔️\n\n{summary}\n\n{details}¡Forja tu propio héroe!{link}',
    fr: 'Voici {badge}, forgé sur Questborn ⚔️\n\n{summary}\n\n{details}Forgez votre propre héros !{link}',
    ar: 'تعرّف على {badge}، صُنع على Questborn ⚔️\n\n{summary}\n\n{details}اصنع بطلك!{link}',
    bn: 'পরিচিত হন {badge}-এর সঙ্গে, Questborn-এ গড়া ⚔️\n\n{summary}\n\n{details}নিজের হিরো গড়ুন!{link}',
    pt: 'Conheça {badge}, forjado no Questborn ⚔️\n\n{summary}\n\n{details}Forje o seu próprio herói!{link}',
    ru: 'Знакомьтесь: {badge}, созданный в Questborn ⚔️\n\n{summary}\n\n{details}Создайте своего героя!{link}',
    ur: 'ملیے {badge} سے، جو Questborn پر بنا ⚔️\n\n{summary}\n\n{details}اپنا ہیرو بنائیں!{link}',
  },
  'welcome.headline': {
    en: "You're All Set", zh: '一切准备就绪', hi: 'आप तैयार हैं', es: 'Todo listo', fr: 'Vous êtes prêt',
    ar: 'أنت جاهز الآن', bn: 'আপনি প্রস্তুত', pt: 'Está tudo pronto', ru: 'Всё готово', ur: 'آپ تیار ہیں',
  },
  'welcome.subtitle': {
    en: 'Your adventure starts now. Strike your first pose whenever you\'re ready.', zh: '你的冒险现在开始。准备好就摆出第一个姿势吧。',
    hi: 'आपका रोमांच अभी शुरू होता है। जब तैयार हों, पहला पोज़ दें।',
    es: 'Tu aventura empieza ahora. Haz tu primera pose cuando quieras.',
    fr: 'Votre aventure commence maintenant. Prenez votre première pose quand vous êtes prêt·e.',
    ar: 'مغامرتك تبدأ الآن. اتخذ وضعيتك الأولى متى شئت.', bn: 'আপনার অভিযান এখনই শুরু। প্রস্তুত হলে প্রথম পোজ দিন।',
    pt: 'A sua aventura começa agora. Faça a primeira pose quando quiser.',
    ru: 'Ваше приключение начинается. Примите первую позу, когда будете готовы.',
    ur: 'آپ کی مہم ابھی شروع ہوتی ہے۔ جب تیار ہوں پہلا پوز دیں۔',
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
  'reveal.tapToUnveil': {
    en: 'Tap to Reveal ⚔️', zh: '点击揭晓 ⚔️', hi: 'प्रकट करने के लिए टैप करें ⚔️', es: 'Toca para revelar ⚔️',
    fr: 'Touchez pour révéler ⚔️', ar: 'اضغط للكشف ⚔️', bn: 'প্রকাশ করতে ট্যাপ করুন ⚔️', pt: 'Toque para revelar ⚔️',
    ru: 'Нажмите, чтобы открыть ⚔️', ur: 'ظاہر کرنے کے لیے ٹیپ کریں ⚔️',
  },
  'capture.step.calm.title': {
    en: 'Calm', zh: '平静', hi: 'शांत', es: 'Calma', fr: 'Calme', ar: 'هدوء', bn: 'শান্ত', pt: 'Calma', ru: 'Спокойствие',
    ur: 'پرسکون',
  },
  'capture.step.calm.prompt': {
    en: 'Your hero at ease, before the adventure 😌', zh: '冒险之前，悠然自得的英雄 😌', hi: 'रोमांच से पहले, सुकून में आपका हीरो 😌',
    es: 'Tu héroe en calma, antes de la aventura 😌', fr: 'Votre héros au repos, avant l’aventure 😌',
    ar: 'بطلك مرتاحًا قبل المغامرة 😌', bn: 'অভিযানের আগে, নিশ্চিন্ত আপনার হিরো 😌',
    pt: 'O seu herói tranquilo, antes da aventura 😌', ru: 'Ваш герой в покое перед приключением 😌',
    ur: 'مہم سے پہلے، پرسکون آپ کا ہیرو 😌',
  },
  'capture.step.battleCry.title': {
    en: 'Battle Cry', zh: '战吼', hi: 'युद्धघोष', es: 'Grito de guerra', fr: 'Cri de guerre', ar: 'صيحة الحرب',
    bn: 'যুদ্ধের হুংকার', pt: 'Grito de guerra', ru: 'Боевой клич', ur: 'جنگی نعرہ',
  },
  'capture.step.battleCry.prompt': {
    en: 'Now your fiercest battle cry! ⚔️', zh: '现在来一声最猛烈的战吼！⚔️', hi: 'अब अपना सबसे ज़ोरदार युद्धघोष! ⚔️',
    es: '¡Ahora tu grito de guerra más feroz! ⚔️', fr: 'Maintenant, votre cri de guerre le plus féroce ! ⚔️',
    ar: 'الآن أشرس صيحة حرب لديك! ⚔️', bn: 'এবার আপনার সবচেয়ে প্রচণ্ড যুদ্ধের হুংকার! ⚔️',
    pt: 'Agora o seu grito de guerra mais feroz! ⚔️', ru: 'А теперь самый яростный боевой клич! ⚔️',
    ur: 'اب اپنا سب سے زوردار جنگی نعرہ! ⚔️',
  },
  'capture.step.brooding.title': {
    en: 'Brooding', zh: '沉思', hi: 'गहन चिंतन', es: 'Taciturno', fr: 'Ténébreux', ar: 'متأمل', bn: 'গভীর চিন্তা', pt: 'Pensativo',
    ru: 'Задумчивость', ur: 'گہری سوچ',
  },
  'capture.step.brooding.prompt': {
    en: 'Your most mysterious, brooding look 🌘', zh: '你最神秘、最深沉的表情 🌘', hi: 'अपना सबसे रहस्यमयी, गहरा अंदाज़ 🌘',
    es: 'Tu mirada más misteriosa y taciturna 🌘', fr: 'Votre regard le plus mystérieux et ténébreux 🌘',
    ar: 'أكثر نظراتك غموضًا وتأملًا 🌘', bn: 'আপনার সবচেয়ে রহস্যময়, গভীর চাহনি 🌘',
    pt: 'O seu olhar mais misterioso e pensativo 🌘', ru: 'Ваш самый загадочный, задумчивый взгляд 🌘',
    ur: 'اپنا سب سے پراسرار، گہرا انداز 🌘',
  },
  'analyze.module.hero.title': {
    en: 'Forge a Hero', zh: '打造英雄', hi: 'हीरो गढ़ें', es: 'Forja un héroe', fr: 'Forger un héros', ar: 'اصنع بطلًا',
    bn: 'হিরো গড়ুন', pt: 'Forjar um herói', ru: 'Создать героя', ur: 'ہیرو بنائیں',
  },
  'analyze.module.hero.description': {
    en: 'Three poses become a full character sheet and your first quest.', zh: '三个姿势变成完整的角色卡和你的第一个任务。',
    hi: 'तीन पोज़ से पूरी कैरेक्टर शीट और आपका पहला मिशन।',
    es: 'Tres poses se convierten en una hoja de personaje completa y tu primera misión.',
    fr: 'Trois poses deviennent une fiche de personnage complète et votre première quête.',
    ar: 'ثلاث وضعيات تصبح بطاقة شخصية كاملة ومهمتك الأولى.', bn: 'তিনটি পোজ থেকে পূর্ণ ক্যারেক্টার শিট আর আপনার প্রথম অভিযান।',
    pt: 'Três poses tornam-se uma ficha de personagem completa e a sua primeira missão.',
    ru: 'Три позы — полный лист персонажа и ваш первый квест.', ur: 'تین پوز سے مکمل کریکٹر شیٹ اور آپ کی پہلی مہم۔',
  },
  'analyze.module.party.title': {
    en: 'Assemble a Party', zh: '组建小队', hi: 'दल बनाएँ', es: 'Reúne un grupo', fr: 'Former un groupe', ar: 'كوّن فريقًا',
    bn: 'দল গঠন করুন', pt: 'Formar um grupo', ru: 'Собрать отряд', ur: 'ٹیم بنائیں',
  },
  'analyze.module.party.description': {
    en: 'You and a friend become a two-hero party with a combo move.', zh: '你和朋友组成拥有合体技的双人英雄小队。',
    hi: 'आप और एक दोस्त कॉम्बो मूव वाला दो-हीरो दल बनते हैं।',
    es: 'Tú y un amigo os convertís en un grupo de dos héroes con un movimiento combinado.',
    fr: 'Vous et un·e ami·e devenez un duo de héros avec une attaque combinée.',
    ar: 'أنت وصديقك تصبحان فريقًا من بطلين بحركة مشتركة.', bn: 'আপনি আর এক বন্ধু হয়ে উঠবেন কম্বো মুভসহ দুই-হিরোর দল।',
    pt: 'Você e um amigo tornam-se um grupo de dois heróis com um golpe combinado.',
    ru: 'Вы и друг — отряд из двух героев с комбо-приёмом.', ur: 'آپ اور ایک دوست کومبو موو والی دو ہیرو کی ٹیم بنتے ہیں۔',
  },
  'analyze.module.nemesis.title': {
    en: 'Summon Your Nemesis', zh: '召唤你的宿敌', hi: 'अपना कट्टर दुश्मन बुलाएँ', es: 'Invoca a tu némesis',
    fr: 'Invoquer votre némésis', ar: 'استدعِ عدوك اللدود', bn: 'আপনার চিরশত্রুকে ডাকুন', pt: 'Invocar o seu némesis',
    ru: 'Призвать заклятого врага', ur: 'اپنا ازلی دشمن بلائیں',
  },
  'analyze.module.nemesis.description': {
    en: 'One photo, one gloriously over-the-top villain twin.', zh: '一张照片，一个夸张至极的反派双胞胎。',
    hi: 'एक फ़ोटो, एक शानदार ओवर-द-टॉप खलनायक जुड़वाँ।', es: 'Una foto, un gemelo villano gloriosamente exagerado.',
    fr: 'Une photo, un jumeau maléfique glorieusement excessif.', ar: 'صورة واحدة، توأم شرير مبالغ فيه بشكل رائع.',
    bn: 'একটি ছবি, এক জমকালো অতিরঞ্জিত খলনায়ক যমজ।', pt: 'Uma foto, um gémeo vilão gloriosamente exagerado.',
    ru: 'Одно фото — один великолепно театральный злой двойник.', ur: 'ایک تصویر، ایک شاندار حد سے بڑھا ہوا ولن ہمزاد۔',
  },
  'analyze.photoCount': {
    en: '{n} photo(s)', zh: '{n} 张照片', hi: '{n} फ़ोटो', es: '{n} foto(s)', fr: '{n} photo(s)', ar: '{n} صورة', bn: '{n}টি ছবি',
    pt: '{n} foto(s)', ru: 'Фото: {n}', ur: '{n} تصویر',
  },
  'sheet.hitPoints': {
    en: 'Hit Points', zh: '生命值', hi: 'हिट पॉइंट्स', es: 'Puntos de golpe', fr: 'Points de vie', ar: 'نقاط الحياة',
    bn: 'হিট পয়েন্ট', pt: 'Pontos de vida', ru: 'Хиты', ur: 'ہٹ پوائنٹس',
  },
  'sheet.armorClass': {
    en: 'Armor Class', zh: '护甲等级', hi: 'आर्मर क्लास', es: 'Clase de armadura', fr: 'Classe d’armure', ar: 'فئة الدرع',
    bn: 'আর্মার ক্লাস', pt: 'Classe de armadura', ru: 'Класс брони', ur: 'آرمر کلاس',
  },
  'sheet.level': {
    en: 'Level', zh: '等级', hi: 'लेवल', es: 'Nivel', fr: 'Niveau', ar: 'المستوى', bn: 'লেভেল', pt: 'Nível', ru: 'Уровень',
    ur: 'لیول',
  },
  'sheet.forgedFrom': {
    en: 'Forged From Your Photo', zh: '源自你的照片', hi: 'आपकी फ़ोटो से गढ़ा गया', es: 'Forjado con tu foto',
    fr: 'Forgé à partir de votre photo', ar: 'مصنوع من صورتك', bn: 'আপনার ছবি থেকে গড়া', pt: 'Forjado a partir da sua foto',
    ru: 'Создано по вашему фото', ur: 'آپ کی تصویر سے بنا',
  },
  'sheet.abilityScores': {
    en: 'Ability Scores', zh: '属性值', hi: 'एबिलिटी स्कोर', es: 'Puntuaciones de característica', fr: 'Caractéristiques',
    ar: 'درجات القدرات', bn: 'অ্যাবিলিটি স্কোর', pt: 'Valores de atributo', ru: 'Характеристики', ur: 'ایبلٹی اسکورز',
  },
  'sheet.signatureAbilities': {
    en: 'Signature Abilities', zh: '招牌技能', hi: 'ख़ास क्षमताएँ', es: 'Habilidades distintivas', fr: 'Capacités emblématiques',
    ar: 'القدرات المميزة', bn: 'বিশেষ ক্ষমতা', pt: 'Habilidades exclusivas', ru: 'Фирменные способности', ur: 'خاص صلاحیتیں',
  },
  'sheet.startingGear': {
    en: 'Starting Gear', zh: '初始装备', hi: 'शुरुआती सामान', es: 'Equipo inicial', fr: 'Équipement de départ', ar: 'العتاد الأولي',
    bn: 'শুরুর সরঞ্জাম', pt: 'Equipamento inicial', ru: 'Стартовое снаряжение', ur: 'ابتدائی سامان',
  },
  'sheet.companion': {
    en: 'Companion', zh: '伙伴', hi: 'साथी', es: 'Compañero', fr: 'Compagnon', ar: 'الرفيق', bn: 'সঙ্গী', pt: 'Companheiro',
    ru: 'Спутник', ur: 'ساتھی',
  },
  'sheet.backstory': {
    en: 'Backstory', zh: '背景故事', hi: 'बैकस्टोरी', es: 'Trasfondo', fr: 'Histoire', ar: 'القصة الخلفية', bn: 'ব্যাকস্টোরি',
    pt: 'História de origem', ru: 'Предыстория', ur: 'پس منظر',
  },
  'sheet.roleplay': {
    en: 'Roleplay Notes', zh: '角色扮演笔记', hi: 'रोलप्ले नोट्स', es: 'Notas de interpretación', fr: 'Notes de roleplay',
    ar: 'ملاحظات تقمص الدور', bn: 'রোলপ্লে নোট', pt: 'Notas de interpretação', ru: 'Заметки для отыгрыша', ur: 'رول پلے نوٹس',
  },
  'sheet.trait': {
    en: 'Trait', zh: '特质', hi: 'गुण', es: 'Rasgo', fr: 'Trait', ar: 'سمة', bn: 'বৈশিষ্ট্য', pt: 'Traço', ru: 'Черта', ur: 'خصلت',
  },
  'sheet.ideal': {
    en: 'Ideal', zh: '理想', hi: 'आदर्श', es: 'Ideal', fr: 'Idéal', ar: 'مبدأ', bn: 'আদর্শ', pt: 'Ideal', ru: 'Идеал', ur: 'نظریہ',
  },
  'sheet.bond': {
    en: 'Bond', zh: '羁绊', hi: 'बंधन', es: 'Vínculo', fr: 'Lien', ar: 'رابطة', bn: 'বন্ধন', pt: 'Vínculo', ru: 'Привязанность',
    ur: 'رشتہ',
  },
  'sheet.quirk': {
    en: 'Quirk', zh: '怪癖', hi: 'आदत', es: 'Manía', fr: 'Manie', ar: 'عادة غريبة', bn: 'খেয়াল', pt: 'Mania', ru: 'Причуда',
    ur: 'عادت',
  },
  'sheet.partyDynamic': {
    en: 'Party Dynamic', zh: '小队默契', hi: 'दल की केमिस्ट्री', es: 'Dinámica del grupo', fr: 'Dynamique du groupe',
    ar: 'ديناميكية الفريق', bn: 'দলের রসায়ন', pt: 'Dinâmica do grupo', ru: 'Динамика отряда', ur: 'ٹیم کی کیمسٹری',
  },
  'sheet.evilScheme': {
    en: 'The Evil Scheme', zh: '邪恶计划', hi: 'दुष्ट योजना', es: 'El plan malvado', fr: 'Le plan maléfique', ar: 'المخطط الشرير',
    bn: 'দুষ্ট পরিকল্পনা', pt: 'O plano maléfico', ru: 'Злодейский план', ur: 'شیطانی منصوبہ',
  },
  'sheet.lair': {
    en: 'Lair', zh: '巢穴', hi: 'अड्डा', es: 'Guarida', fr: 'Repaire', ar: 'المخبأ', bn: 'আস্তানা', pt: 'Covil', ru: 'Логово',
    ur: 'ٹھکانہ',
  },
  'sheet.weakness': {
    en: 'Fatal Weakness', zh: '致命弱点', hi: 'घातक कमज़ोरी', es: 'Debilidad fatal', fr: 'Faiblesse fatale',
    ar: 'نقطة الضعف القاتلة', bn: 'মারাত্মক দুর্বলতা', pt: 'Fraqueza fatal', ru: 'Роковая слабость', ur: 'مہلک کمزوری',
  },
  'portrait.paint': {
    en: 'Paint My Portrait', zh: '绘制我的肖像', hi: 'मेरा पोर्ट्रेट बनाएँ', es: 'Pintar mi retrato', fr: 'Peindre mon portrait',
    ar: 'ارسم صورتي', bn: 'আমার প্রতিকৃতি আঁকুন', pt: 'Pintar o meu retrato', ru: 'Нарисовать мой портрет',
    ur: 'میری تصویر بنائیں',
  },
  'portrait.painting': {
    en: 'Painting your portrait...', zh: '正在绘制你的肖像……', hi: 'आपका पोर्ट्रेट बन रहा है...', es: 'Pintando tu retrato...',
    fr: 'Votre portrait est en cours...', ar: 'جارٍ رسم صورتك...', bn: 'আপনার প্রতিকৃতি আঁকা হচ্ছে...',
    pt: 'A pintar o seu retrato...', ru: 'Рисуем ваш портрет...', ur: 'آپ کی تصویر بن رہی ہے...',
  },
  'portrait.retry': {
    en: 'Try Painting Again', zh: '重新绘制', hi: 'फिर से बनाएँ', es: 'Volver a pintar', fr: 'Réessayer', ar: 'أعد المحاولة',
    bn: 'আবার আঁকুন', pt: 'Tentar de novo', ru: 'Попробовать снова', ur: 'دوبارہ کوشش کریں',
  },
  'portrait.failed': {
    en: 'The painter couldn\'t finish this one.', zh: '画师没能完成这幅画。', hi: 'चित्रकार इसे पूरा नहीं कर सका।',
    es: 'El pintor no pudo terminar este.', fr: 'Le peintre n’a pas pu terminer celui-ci.',
    ar: 'لم يتمكن الرسام من إنهاء هذه الصورة.', bn: 'চিত্রকর এটি শেষ করতে পারেননি।', pt: 'O pintor não conseguiu terminar este.',
    ru: 'Художник не смог закончить портрет.', ur: 'مصور یہ تصویر مکمل نہیں کر سکا۔',
  },
} satisfies Record<string, Record<LanguageCode, string>>;

export function translate(key: TranslationKey, languageCode: string, vars?: Record<string, string | number>): string {
  const entry = translations[key];
  const raw = entry[languageCode as LanguageCode] ?? entry.en;
  if (!vars) return raw;
  return Object.entries(vars).reduce((acc, [name, value]) => acc.replace(`{${name}}`, String(value)), raw);
}

export type { TranslationKey };
