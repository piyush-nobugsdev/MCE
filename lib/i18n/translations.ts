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
  }
}
