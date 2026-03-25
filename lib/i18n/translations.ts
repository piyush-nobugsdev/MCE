export type Language = 'en' | 'hi' | 'kn'

export const translations = {
  en: {
    // Shared
    welcome: 'WELCOME',
    home: 'HOME',
    tasks: 'TASKS',
    profile: 'PROFILE',
    logout: 'LOG OUT',
    back: 'BACK',
    save: 'SAVE CHANGES',
    cancel: 'CANCEL',
    loading: 'LOADING...',
    add_new: 'ADD NEW',
    samman_kendra: 'SAMMAN KENDRA',
    sahyog_kendra: 'SAHYOG KENDRA',
    
    // Role Selection
    select_role: 'CHOOSE YOUR ROLE TO GET STARTED',
    i_am_farmer: "I'M A FARMER",
    find_workers: 'POST JOBS, HIRE WORKERS, AND MANAGE YOUR FARM',
    farmer_login: 'FARMER LOGIN',
    i_am_worker: "I'M A WORKER",
    find_work: 'FIND JOBS, APPLY TO OPPORTUNITIES, AND EARN',
    worker_login: 'WORKER LOGIN',

    // Auth
    mobile_number: 'MOBILE NUMBER',
    enter_otp: 'ENTER 6-DIGIT OTP',
    send_otp: 'SEND OTP',
    login_now: 'LOG IN NOW',
    create_account: "DON'T HAVE AN ACCOUNT",
    register: 'REGISTER HERE',
    first_name: 'FIRST NAME',
    last_name: 'LAST NAME',
    state: 'STATE',
    district: 'DISTRICT',
    village: 'VILLAGE / TOWN',
    age: 'AGE',
    experience: 'YEARS OF EXPERIENCE',
    join_now: 'JOIN THE COMMUNITY',
    
    // Dashboard (Farmer)
    active_jobs: 'ACTIVE JOBS',
    completed_jobs: 'COMPLETED',
    post_job: 'POST NEW JOB',
    applications: 'APPLICATIONS',
    recent_jobs: 'RECENT JOB POSTINGS',
    review_apps: 'REVIEW APPLICATIONS',

    // Dashboard (Worker)
    earnings: 'TOTAL EARNINGS',
    find_job: 'FIND NEW WORK',
    applied_jobs: 'APPLIED JOBS',
    available_work: 'AVAILABLE WORK',

    // Actions
    accept: 'ACCEPT',
    reject: 'REJECT',
    apply: 'APPLY NOW',
    view_details: 'VIEW DETAILS',
    
    // Settings
    language: 'LANGUAGE',
    change_language: 'CHANGE LANGUAGE',
    kannada_prompt: 'Do you want to change to Kannada?',
    yes: 'YES',
    no: 'NO',
    sign_out: 'SIGN OUT',

    // Homepage
    farmwork: 'FarmWork',
    sign_in: 'SIGN IN',
    home_title: 'Fair work, fair pay',
    home_subtitle: 'A marketplace connecting farmers and workers directly. Post jobs, find work, earn fairly.',
    get_started: 'GET STARTED',
    learn_more: 'LEARN MORE',
    
    // Features
    feature_1_title: 'Farmer & Worker Community',
    feature_1_desc: 'Direct connections between farmers and workers. Build lasting relationships and grow together without intermediaries.',
    feature_2_title: 'Fair Wages, Full Transparency',
    feature_2_desc: 'See wages upfront, no hidden fees. Workers know exactly what they\'ll earn. Farmers post honest rates.',
    feature_3_title: 'Speak Your Language',
    feature_3_desc: 'Support for English, Hindi, and Kannada. Connect and communicate in the language you\'re most comfortable with.',
    feature_4_title: 'Preview Before You Commit',
    feature_4_desc: 'Farmers preview applications. Workers preview jobs. Make informed decisions with full transparency.',
    
    // How it works
    how_it_works: 'How it works',
    for_farmers: 'For Farmers',
    for_workers: 'For Workers',
    farmer_step_1: 'Create your profile',
    farmer_step_2: 'Post a job',
    farmer_step_3: 'Review applications',
    farmer_step_4: 'Hire and manage',
    farmer_step_5: 'Process payments',
    
    worker_step_1: 'Create your profile',
    worker_step_2: 'Browse nearby jobs',
    worker_step_3: 'Apply to work',
    worker_step_4: 'Get hired',
    worker_step_5: 'Get paid',

    ready_to_start: "Ready to get started?",
    signup_cta: "Join thousands of farmers and workers who are building better opportunities.",
  },
  hi: {
    // Shared
    welcome: 'नमस्ते',
    home: 'होम',
    tasks: 'कार्य',
    profile: 'प्रोफाइल',
    logout: 'लॉग आउट',
    back: 'पीछे',
    save: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    loading: 'लोड हो रहा है...',
    add_new: 'नया जोड़ें',
    samman_kendra: 'सम्मान केंद्र',
    sahyog_kendra: 'सहयोग केंद्र',

    // Role Selection
    select_role: 'शुरू करने के लिए अपनी भूमिका चुनें',
    i_am_farmer: 'मैं एक किसान हूं',
    find_workers: 'काम पोस्ट करें, श्रमिकों को काम पर रखें',
    farmer_login: 'किसान लॉगिन',
    i_am_worker: 'मैं एक श्रमिक हूं',
    find_work: 'काम खोजें, आवेदन करें और कमाएं',
    worker_login: 'श्रमिक लॉगिन',

    // Auth
    mobile_number: 'मोबाइल नंबर',
    enter_otp: '6-अंकों का ओटीपी दर्ज करें',
    send_otp: 'ओटीपी भेजें',
    login_now: 'अभी लॉगिन करें',
    create_account: 'खाता नहीं है',
    register: 'यहाँ पंजीकरण करें',
    first_name: 'पहला नाम',
    last_name: 'अंतिम नाम',
    state: 'राज्य',
    district: 'जिला',
    village: 'गांव / शहर',
    age: 'आयु',
    experience: 'अनुभव (वर्ष)',
    join_now: 'समुदाय में शामिल हों',

    // Dashboard (Farmer)
    active_jobs: 'सक्रिय कार्य',
    completed_jobs: 'पूरा हुआ',
    post_job: 'नया कार्य पोस्ट करें',
    applications: 'आवेदन',
    recent_jobs: 'हाल के कार्य पोस्ट',
    review_apps: 'आवेदनों की समीक्षा करें',

    // Dashboard (Worker)
    earnings: 'कुल कमाई',
    find_job: 'नया काम खोजें',
    applied_jobs: 'लागू कार्य',
    available_work: 'उपलब्ध कार्य',

    // Actions
    accept: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    apply: 'अभी आवेदन करें',
    view_details: 'विवरण देखें',

    // Settings
    language: 'भाषा',
    change_language: 'भाषा बदलें',
    kannada_prompt: 'क्या आप कन्नड़ में बदलना चाहते हैं?',
    yes: 'हाँ',
    no: 'नहीं',
    sign_out: 'लॉग आउट',

    // Homepage
    farmwork: 'FarmWork',
    sign_in: 'लॉग इन करें',
    home_title: 'निष्पक्ष काम, निष्पक्ष वेतन',
    home_subtitle: 'किसान और श्रमिकों को सीधे जोड़ने वाला एक बाज़ार। काम पोस्ट करें, काम खोजें, निष्पक्ष रूप से कमाएं।',
    get_started: 'शुरुआत करें',
    learn_more: 'और जानें',
    
    // Features
    feature_1_title: 'किसान और श्रमिक समुदाय',
    feature_1_desc: 'किसान और श्रमिकों के बीच सीधा संपर्क। बिना बिचौलियों के संबंध बनाएं और साथ बढ़ें।',
    feature_2_title: 'निष्पक्ष मजदूरी, पूरी पारदर्शिता',
    feature_2_desc: 'मजदूरी पहले से देखें, कोई छिपी फीस नहीं। श्रमिकों को पता है कि उन्हें क्या मिलेगा। किसान ईमानदार दरें पोस्ट करते हैं।',
    feature_3_title: 'अपनी भाषा में बात करें',
    feature_3_desc: 'अंग्रेजी, हिंदी और कन्नड़ के लिए समर्थन। उस भाषा में जुड़ें जिसमें आप सबसे ज्यादा सहज हैं।',
    feature_4_title: 'प्रतिबद्ध होने से पहले देखें',
    feature_4_desc: 'किसान आवेदन देख सकते हैं। श्रमिक नौकरियां देख सकते हैं। पूरी पारदर्शिता के साथ सूचित निर्णय लें।',
    
    // How it works
    how_it_works: 'यह कैसे काम करता है',
    for_farmers: 'किसानों के लिए',
    for_workers: 'श्रमिकों के लिए',
    farmer_step_1: 'अपनी प्रोफाइल बनाएं',
    farmer_step_2: 'एक काम पोस्ट करें',
    farmer_step_3: 'आवेदनों की समीक्षा करें',
    farmer_step_4: 'काम पर रखें और प्रबंधित करें',
    farmer_step_5: 'भुगतान प्रक्रिया करें',
    
    worker_step_1: 'अपनी प्रोफाइल बनाएं',
    worker_step_2: 'पास के काम ब्राउज़ करें',
    worker_step_3: 'काम के लिए आवेदन करें',
    worker_step_4: 'काम पर लगाया जाएं',
    worker_step_5: 'भुगतान प्राप्त करें',

    ready_to_start: "शुरुआत करने के लिए तैयार हैं?",
    signup_cta: "हजारों किसानों और श्रमिकों में शामिल हों जो बेहतर अवसर बना रहे हैं।",
  },
  kn: {
    // Shared
    welcome: 'ಸುಸ್ವಾಗತ',
    home: 'ಮುಖಪುಟ',
    tasks: 'ಕೆಲಸಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    logout: 'ಲಾಗ್ ಔಟ್',
    back: 'ಹಿಂದೆ',
    save: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    add_new: 'ಹೊಸ ಸೇರಿಸಿ',
    samman_kendra: 'ಸಮ್ಮಾನ್ ಕೇಂದ್ರ',
    sahyog_kendra: 'ಸಹಯೋಗ ಕೇಂದ್ರ',

    // Role Selection
    select_role: 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    i_am_farmer: 'ನಾನು ಒಬ್ಬ ರೈತ',
    find_workers: 'ಕೆಲಸಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ, ಕಾರ್ಮಿಕರನ್ನು ನೇಮಿಸಿ',
    farmer_login: 'ರೈತ ಲಾಗಿನ್',
    i_am_worker: 'ನಾನು ಒಬ್ಬ ಕಾರ್ಮಿಕ',
    find_work: 'ಕೆಲಸಗಳನ್ನು ಹುಡುಕಿ, ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಮತ್ತು ಗಳಿಸಿ',
    worker_login: 'ಕಾರ್ಮಿಕ ಲಾಗಿನ್',

    // Auth
    mobile_number: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    enter_otp: '6-ಅಂಕಿಯ ಒಟಿಪಿ ನಮೂದಿಸಿ',
    send_otp: 'ಒಟಿಪಿ ಕಳುಹಿಸಿ',
    login_now: 'ಈಗ ಲಾಗಿನ್ ಮಾಡಿ',
    create_account: 'ಖಾತೆ ಹೊಂದಿಲ್ಲವೇ',
    register: 'ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ',
    first_name: 'ಮೊದಲ ಹೆಸರು',
    last_name: 'ಕೊನೆಯ ಹೆಸರು',
    state: 'ರಾಜ್ಯ',
    district: 'ಜಿಲ್ಲೆ',
    village: 'ಗ್ರಾಮ / ಪಟ್ಟಣ',
    age: 'ವಯಸ್ಸು',
    experience: 'ಅನುಭವ (ವರ್ಷಗಳು)',
    join_now: 'ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ',

    // Dashboard (Farmer)
    active_jobs: 'ಸಕ್ರಿಯ ಕೆಲಸಗಳು',
    completed_jobs: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    post_job: 'ಹೊಸ ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',
    applications: 'ಅರ್ಜಿಗಳು',
    recent_jobs: 'ಇತ್ತೀಚಿನ ಕೆಲಸದ ಪೋಸ್ಟ್ಗಳು',
    review_apps: 'ಅರ್ಜಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',

    // Dashboard (Worker)
    earnings: 'ಒಟ್ಟು ಗಳಿಕೆ',
    find_job: 'ಹೊಸ ಕೆಲಸ ಹುಡುಕಿ',
    applied_jobs: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ ಕೆಲಸಗಳು',
    available_work: 'ಲಭ್ಯವಿರುವ ಕೆಲಸಗಳು',

    // Actions
    accept: 'ಒಪ್ಪಿಕೊಳ್ಳಿ',
    reject: 'ತಿರಸ್ಕರಿಸಿ',
    apply: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    view_details: 'ವಿವರಗಳನ್ನು ನೋಡಿ',

    // Settings
    language: 'ಭಾಷೆ',
    change_language: 'ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ',
    kannada_prompt: 'ನೀವು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲು ಬಯಸುವಿರಾ?',
    yes: 'ಹೌದು',
    no: 'ಇಲ್ಲ',
    sign_out: 'ಲಾಗ್ ಔಟ್',

    // Homepage
    farmwork: 'FarmWork',
    sign_in: 'ಲಾಗಿನ್ ಮಾಡಿ',
    home_title: 'ನ್ಯಾಯಸಮ್ಮತ ಕೆಲಸ, ನ್ಯಾಯಸಮ್ಮತ ವೇತನ',
    home_subtitle: 'ರೈತ ಮತ್ತು ಕಾರ್ಮಿಕರನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸುವ ಮಾರುಕಟ್ಟೆ. ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ, ಕೆಲಸ ಹುಡುಕಿ, ನ್ಯಾಯಸಮ್ಮತವಾಗಿ ಗಳಿಸಿ.',
    get_started: 'ಪ್ರಾರಂಭಿಸಿ',
    learn_more: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ',
    
    // Features
    feature_1_title: 'ರೈತ ಮತ್ತು ಕಾರ್ಮಿಕ ಸಮುದಾಯ',
    feature_1_desc: 'ರೈತ ಮತ್ತು ಕಾರ್ಮಿಕರ ನಡುವಿನ ನೇರ ಸಂಪರ್ಕ. ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ಸಂಬಂಧ ನಿರ್ಮಿಸಿ ಮತ್ತು ಒಟ್ಟಿಗೆ ಬೆಳೆದುಕೊಳ್ಳಿ.',
    feature_2_title: 'ನ್ಯಾಯೋಚಿತ ವೇತನ, ಸಂಪೂರ್ಣ ಪಾರದರ್ಶಕತೆ',
    feature_2_desc: 'ವೇತನವನ್ನು ಮುಂಚಿತವಾಗಿ ನೋಡಿ, ಯಾವುದೇ ಲುಕ್ಕಾ ಶುಲ್ಕ ಇಲ್ಲ. ಕಾರ್ಮಿಕರಿಗೆ ತಿಳಿದಿದೆ ಅವರು ಏನು ಅರ್ಜಿ ಮಾಡಿದ್ದಾರೆ. ರೈತರು ಸಾಧುವಾದ ದರಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡುತ್ತಾರೆ.',
    feature_3_title: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ',
    feature_3_desc: 'ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಮತ್ತು ಕನ್ನಡ ಬೆಂಬಲ. ನೀವು ಸುಖದಿಂದ ಭಾಷೆಯಲ್ಲಿ ಸಂಪರ್ಕ ಸಾಧಿಸಿ ಮತ್ತು ಸಂವಹನ ಮಾಡಿ.',
    feature_4_title: 'ಪ್ರತಿಶ್ರುತಿ ಮುಂಚೆ ನೋಡಿ',
    feature_4_desc: 'ರೈತರು ಅರ್ಜಿ ನೋಡಿಕೊಳ್ಳಬಹುದು. ಕಾರ್ಮಿಕರು ಕೆಲಸ ನೋಡಿಕೊಳ್ಳಬಹುದು. ಸಂಪೂರ್ಣ ಪಾರದರ್ಶಕತೆ ಹೊಂದಿ ತಿಳಿತ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳಿ.',
    
    // How it works
    how_it_works: 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    for_farmers: 'ರೈತರಿಗೆ',
    for_workers: 'ಕಾರ್ಮಿಕರಿಗೆ',
    farmer_step_1: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ',
    farmer_step_2: 'ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',
    farmer_step_3: 'ಅರ್ಜಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    farmer_step_4: 'ನೇಮಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ',
    farmer_step_5: 'ಭುಗತನ ಪ್ರಕ್ರಿಯೆ ಮಾಡಿ',
    
    worker_step_1: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ',
    worker_step_2: 'ಹತ್ತಿರದ ಕೆಲಸಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
    worker_step_3: 'ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    worker_step_4: 'ನೇಮಿಸಲಾ',
    worker_step_5: 'ಭುಗತನ ಪಡೆಯಿರಿ',

    ready_to_start: "ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಾ?",
    signup_cta: "ಸಾವಿರಾರು ರೈತ ಮತ್ತು ಕಾರ್ಮಿಕರಲ್ಲಿ ಸೇರಿ ಬೇಹುದು ಅವಕಾಶ ನಿರ್ಮಾಣ ಮಾಡುತ್ತಾರೆ.",
  },
}
