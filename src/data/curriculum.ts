import { CurriculumWeek, WorkstationTelemetry, StudentProfile } from '../types';

export const CURRICULUM_DATA: CurriculumWeek[] = [
  {
    weekNumber: 1,
    title: 'Computer Confidence',
    category: 'hardware',
    mcqCount: 20,
    description: 'Turning a machine on properly, safe shutdown procedures, identifying monitors, CPUs, ports, and workstation ergonomics.',
    workstationTask: 'Safe Cable & Port Check',
    badgeName: 'First Boot Explorer',
    badgeIcon: '⚡',
    colorTheme: 'emerald',
    slides: [
      {
        title: 'Meeting the Computer Workstation',
        bigConcept: 'Every computer has three vital parts: The Screen (Display), The Brain (System Unit/CPU), and Your Hands (Mouse & Keyboard).',
        keyTakeaway: 'Always power ON the monitor first, then gently press the System Unit button.',
        teacherNotes: 'Demonstrate the physical location of the power buttons on lab desktop towers. Remind students never to tug power cords.',
        actionPrompt: 'Workstation Check: Locate your power button and identify the HDMI/VGA display cable.'
      },
      {
        title: 'Safe Shutdown Protocols',
        bigConcept: 'Never turn off a computer by unplugging the wall socket! The operating system needs time to pack away open files.',
        keyTakeaway: 'Click Start Menu → Power Icon → Select "Shut Down".',
        teacherNotes: 'Explain analogy: Imagine closing your school bag before leaving school, rather than dumping your books on the floor.',
        actionPrompt: 'Practice: Click Start, locate the Power menu icon without clicking shut down yet.'
      },
      {
        title: 'Workstation Posture & Eye Comfort',
        bigConcept: 'Sit with back straight, feet flat on the floor, and monitor at arm’s length to protect your neck.',
        keyTakeaway: 'Take a 20-second break every 20 minutes to look at something far across the lab.',
        teacherNotes: 'Lead the 20-20-20 stretch in the lab before students begin computer exercises.',
        actionPrompt: 'Pupil stretch: Adjust your chair height so elbows rest naturally on desk.'
      }
    ],
    questions: [
      {
        id: 'w1-q1',
        question: 'Which of the following is the safe way to shut down your desktop computer?',
        options: [
          'Pull out the electric wall plug directly',
          'Click Start Menu, select Power, then click "Shut Down"',
          'Press and hold the monitor power button for 10 seconds',
          'Switch off the classroom circuit breaker'
        ],
        correctIndex: 1,
        explanation: 'Clicking Start → Power → Shut Down lets the computer safely close system processes and save temporary files.',
        hint: 'Always use the software power menu in Windows or Linux.'
      },
      {
        id: 'w1-q2',
        question: 'What is the main function of the Computer Monitor (Display)?',
        options: [
          'To calculate mathematical equations',
          'To store all your saved documents forever',
          'To show pictures, text, and videos so you can see your work',
          'To cool down the central processor with air'
        ],
        correctIndex: 2,
        explanation: 'The monitor is an output device that converts digital signals into visual images on the screen.',
        hint: 'Think about what you look at when using the computer.'
      },
      {
        id: 'w1-q3',
        question: 'Why should you never eat or drink near your computer workstation?',
        options: [
          'Computers only like eating electricity',
          'Spilled liquids can cause electric shocks and ruin sensitive keyboard circuits',
          'The mouse will run away to look for cheese',
          'Liquid will make the monitor screen too shiny'
        ],
        correctIndex: 1,
        explanation: 'Water or sugary drinks can short-circuit the keyboard or tower, causing permanent hardware damage and shock hazards.',
        hint: 'Think about electrical lab safety rules.'
      }
    ]
  },
  {
    weekNumber: 2,
    title: 'Mouse & Keyboard Skills',
    category: 'basics',
    mcqCount: 20,
    description: 'Mastering left click, right click context menu, double clicking speed, drag & drop, and spacebar rhythm.',
    workstationTask: 'Drag-and-Drop Puzzle Race',
    badgeName: 'Precision Pilot',
    badgeIcon: '🖱️',
    colorTheme: 'blue',
    slides: [
      {
        title: 'The Anatomy of the Mouse',
        bigConcept: 'Your index finger rests on the LEFT button. Your middle finger rests on the RIGHT button. The SCROLL WHEEL rolls smoothly in the middle.',
        keyTakeaway: 'Left click selects things. Right click opens secret option menus. Double click opens apps!',
        teacherNotes: 'Show the physical grip: palm resting gently like an egg, wrist resting flat on table pad.',
        actionPrompt: 'Workstation Drill: Practice clicking once, then double-clicking the practice folder.'
      },
      {
        title: 'Mastering Drag and Drop',
        bigConcept: 'Press and HOLD the left button while sliding the mouse across the pad, then RELEASE over your target.',
        keyTakeaway: 'Drag and Drop is used to organize files, move game pieces, and arrange pictures.',
        teacherNotes: 'Common mistake: pupils lift their finger too early before reaching the folder. Emphasize continuous hold.',
        actionPrompt: 'Practice: Move the desktop icon into the practice trash can.'
      }
    ],
    questions: [
      {
        id: 'w2-q1',
        question: 'Which mouse button opens the shortcut action menu (context menu)?',
        options: [
          'Left Click Button',
          'Right Click Button',
          'Scroll Wheel Only',
          'Bottom Sensor'
        ],
        correctIndex: 1,
        explanation: 'The Right Click button opens contextual shortcut menus, giving you actions like Copy, Paste, Rename, or Properties.',
        hint: 'Your middle finger is used for this special shortcut button.'
      },
      {
        id: 'w2-q2',
        question: 'What mouse action is used to open an application icon on your desktop?',
        options: [
          'Double left click in rapid succession',
          'Right click and wait 30 seconds',
          'Holding the mouse upside down',
          'Rolling the scroll wheel backwards once'
        ],
        correctIndex: 0,
        explanation: 'A quick double left-click tells the operating system to launch or open the selected program.',
        hint: 'Click-click twice quickly with your index finger!'
      },
      {
        id: 'w2-q3',
        question: 'How do you perform a "Drag and Drop" action?',
        options: [
          'Shake the mouse left and right rapidly',
          'Click and hold the left mouse button, move to the destination, then let go',
          'Disconnect the mouse cable and plug it back in',
          'Press the spacebar three times while typing'
        ],
        correctIndex: 1,
        explanation: 'Click-and-hold picks up an object, moving relocates it, and releasing drops it at the new location.',
        hint: 'Hold down the button until you reach the target!'
      }
    ]
  },
  {
    weekNumber: 3,
    title: 'Typing Foundations',
    category: 'basics',
    mcqCount: 20,
    description: 'Home row discipline (ASDF - JKL;), thumbs on the spacebar, Shift key combinations, punctuation, and typing speed benchmarks.',
    workstationTask: '15 WPM Home-Row Challenge',
    badgeName: 'Swift Typist',
    badgeIcon: '⌨️',
    colorTheme: 'amber',
    slides: [
      {
        title: 'The Home Row Secret',
        bigConcept: 'Look closely at keys F and J. Notice the tiny raised bumps! They guide your index fingers without looking down.',
        keyTakeaway: 'Left hand sits on A-S-D-F. Right hand sits on J-K-L-;. Both thumbs hover over Spacebar.',
        teacherNotes: 'Have all pupils close their eyes and feel for the F and J bumps with their index finger pads.',
        actionPrompt: 'Blind Touch Drill: Find F and J without looking at your keyboard.'
      }
    ],
    questions: [
      {
        id: 'w3-q1',
        question: 'Which two keyboard keys have tactile raised bumps to help you find the Home Row?',
        options: ['Keys A and L', 'Keys F and J', 'Keys G and H', 'Keys Q and P'],
        correctIndex: 1,
        explanation: 'F and J have raised bumps so touch typists can find home position without glancing away from the screen.',
        hint: 'Feel with your two index fingers.'
      },
      {
        id: 'w3-q2',
        question: 'Which finger should press the Spacebar on the keyboard?',
        options: ['Pinky finger', 'Your thumbs', 'Middle finger', 'Index finger'],
        correctIndex: 1,
        explanation: 'Either thumb is positioned directly above the spacebar to give quick rhythmic spacing between words.',
        hint: 'The shortest and strongest fingers at the bottom.'
      }
    ]
  },
  {
    weekNumber: 4,
    title: 'Files & Folders',
    category: 'basics',
    mcqCount: 20,
    description: 'Understanding file extensions (.txt, .docx, .png), creating named subject folders, saving work to USB drives, and file recovery.',
    workstationTask: 'School Desk Folder Organizer',
    badgeName: 'Archive Master',
    badgeIcon: '📁',
    colorTheme: 'emerald',
    slides: [
      {
        title: 'Digital Filing Cabinets',
        bigConcept: 'Files are like individual exam sheets. Folders are the yellow envelopes that hold them neatly together.',
        keyTakeaway: 'Organize files into folders named by subject: Math, ICT, English, and Science.',
        teacherNotes: 'Demonstrate creating a new folder by right-clicking empty space → New → Folder.',
        actionPrompt: 'Create a folder named "[YourName]_Grade5_ICT".'
      }
    ],
    questions: [
      {
        id: 'w4-q1',
        question: 'Which file extension indicates a picture image file?',
        options: ['.png', '.docx', '.mp3', '.exe'],
        correctIndex: 0,
        explanation: '.png and .jpg are image formats used for digital pictures and graphics.',
        hint: 'PNG stands for Portable Network Graphics.'
      }
    ]
  },
  {
    weekNumber: 5,
    title: 'Microsoft Word Basics',
    category: 'software',
    mcqCount: 20,
    description: 'Document creation, fonts, heading hierarchies, bold, italics, alignment, bulleted lists, and basic spell check.',
    workstationTask: 'Write "All About My Community"',
    badgeName: 'Junior Author',
    badgeIcon: '📝',
    colorTheme: 'blue',
    slides: [
      {
        title: 'Formatting Your Story',
        bigConcept: 'Headings should be bold and larger (16-18pt). Body text should be clear and readable (12pt).',
        keyTakeaway: 'Use Bold (Ctrl+B) for key words and Italic (Ctrl+I) for book titles or emphasis.',
        teacherNotes: 'Guide students on highlighting text before applying formatting tools.',
        actionPrompt: 'Format a title and 3 bullet points describing your school.'
      }
    ],
    questions: [
      {
        id: 'w5-q1',
        question: 'What keyboard shortcut is used to make selected text BOLD in word processing?',
        options: ['Ctrl + B', 'Ctrl + U', 'Ctrl + Z', 'Ctrl + P'],
        correctIndex: 0,
        explanation: 'Ctrl + B toggles Bold formatting on the selected text.',
        hint: 'B stands for Bold!'
      }
    ]
  },
  {
    weekNumber: 6,
    title: 'Word Projects & Tables',
    category: 'software',
    mcqCount: 20,
    description: 'Inserting images, wrapping text, creating a clean school timetable with multi-column tables and page borders.',
    workstationTask: 'Classroom Timetable Designer',
    badgeName: 'Layout Specialist',
    badgeIcon: '📊',
    colorTheme: 'teal',
    slides: [
      {
        title: 'Building Grids & Schedules',
        bigConcept: 'Tables organize information into Rows (horizontal) and Columns (vertical).',
        keyTakeaway: 'A timetable table helps students see their Monday to Friday classes at a glance.',
        teacherNotes: 'Demonstrate Insert → Table → 6 columns by 8 rows.',
        actionPrompt: 'Create a 5-day school timetable table.'
      }
    ],
    questions: [
      {
        id: 'w6-q1',
        question: 'In a table, what is the horizontal line of cells called?',
        options: ['A Row', 'A Column', 'A Border', 'A Diagonal'],
        correctIndex: 0,
        explanation: 'Rows run horizontally from left to right, while columns run vertically up and down.',
        hint: 'Think of rows of desks in your classroom.'
      }
    ]
  },
  {
    weekNumber: 7,
    title: 'Internet & Online Safety',
    category: 'safety',
    mcqCount: 20,
    description: 'How the web functions, identifying secure URLs (HTTPS padlock), password shielding, recognizing suspicious links and cyberbullying reporting.',
    workstationTask: 'The Password Vault Challenge',
    badgeName: 'Cyber Shield',
    badgeIcon: '🛡️',
    colorTheme: 'amber',
    slides: [
      {
        title: 'The Golden Rules of Cyber Safety',
        bigConcept: 'Your password is like your toothbrush: do not share it with friends, and change it when needed!',
        keyTakeaway: 'Look for the HTTPS padlock in the address bar before entering any information.',
        teacherNotes: 'Explain why telling strangers personal school locations or phone numbers online is unsafe.',
        actionPrompt: 'Create a strong passphrase using 3 random words and numbers.'
      }
    ],
    questions: [
      {
        id: 'w7-q1',
        question: 'What does the padlock icon next to a website address (URL) indicate?',
        options: [
          'The website is encrypted and secure with HTTPS',
          'The website is locked and cannot be opened',
          'The computer has run out of battery',
          'The teacher is currently typing'
        ],
        correctIndex: 0,
        explanation: 'The padlock indicates that your connection to the site is encrypted, safeguarding your data against eavesdropping.',
        hint: 'S in HTTPS stands for Secure.'
      }
    ]
  },
  {
    weekNumber: 8,
    title: 'Email & Communication',
    category: 'software',
    mcqCount: 20,
    description: 'Polite digital correspondence etiquette, writing subject lines, attaching lab assignments, and recognizing phishing attempts.',
    workstationTask: 'Send a Formal Teacher Note',
    badgeName: 'Diplomat Communicator',
    badgeIcon: '✉️',
    colorTheme: 'blue',
    slides: [
      {
        title: 'Polite Electronic Mail',
        bigConcept: 'Always include a polite greeting ("Dear Teacher"), a clear subject line, and your full name at the end.',
        keyTakeaway: 'Never click on attachments from unknown email addresses.',
        teacherNotes: 'Demonstrate the difference between TO, CC, and Subject line.',
        actionPrompt: 'Compose a draft email asking for permission to borrow a lab book.'
      }
    ],
    questions: [
      {
        id: 'w8-q1',
        question: 'What is the purpose of the "Subject" field in an email?',
        options: [
          'A short summary of what the email is about',
          'Where you write your teacher’s home address',
          'A place to paste 50 emoji icons',
          'The secret password of your account'
        ],
        correctIndex: 0,
        explanation: 'The Subject line tells the recipient the topic of your message before they open it.',
        hint: 'It summarizes the email in a few words.'
      }
    ]
  },
  {
    weekNumber: 9,
    title: 'PowerPoint Presentations',
    category: 'software',
    mcqCount: 20,
    description: 'Slide transitions, animations, title cards, presenting to classmates with the projector, and visual clarity without text clutter.',
    workstationTask: '3-Slide Science Pitch',
    badgeName: 'Keynote Presenter',
    badgeIcon: '📽️',
    colorTheme: 'emerald',
    slides: [
      {
        title: 'The 6x6 Presentation Rule',
        bigConcept: 'Never fill a slide with tiny paragraphs. Use big headlines, bullet points, and high-impact photographs.',
        keyTakeaway: 'Aim for no more than 6 bullet points per slide, with 6 words per bullet.',
        teacherNotes: 'Project two slides: one cluttered with text, one clean with an image. Ask students which is easier to read.',
        actionPrompt: 'Create a 3-slide pitch on renewable solar energy in Ghana.'
      }
    ],
    questions: [
      {
        id: 'w9-q1',
        question: 'Why should presentation slides avoid huge blocks of small text?',
        options: [
          'Audience members at the back of the classroom cannot read tiny text',
          'The projector bulb will overheat and turn off',
          'Computers only allow 10 words per file',
          'Slides can only contain sound effects'
        ],
        correctIndex: 0,
        explanation: 'Slides are visual aids; big text and clean images ensure everyone in the room can follow easily.',
        hint: 'Think about how far away students sit from the wall projector.'
      }
    ]
  },
  {
    weekNumber: 10,
    title: 'Canva & Creative Design',
    category: 'creative',
    mcqCount: 20,
    description: 'Visual balance, color harmonies, photo framing, creating school sports posters, and exporting printable image formats.',
    workstationTask: 'Ghana Independence Flyer',
    badgeName: 'Creative Creator',
    badgeIcon: '🎨',
    colorTheme: 'blue',
    slides: [
      {
        title: 'Visual Hierarchy & Colors',
        bigConcept: 'Colors communicate feelings! Use high contrast between text and background so words pop cleanly.',
        keyTakeaway: 'Dark text on light backgrounds is easiest to read in bright daylight.',
        teacherNotes: 'Demonstrate alignment grids and margins to keep design elements balanced.',
        actionPrompt: 'Design a digital poster celebrating Ghana’s cultural heritage.'
      }
    ],
    questions: [
      {
        id: 'w10-q1',
        question: 'Which color combination provides the highest contrast and readability?',
        options: [
          'Dark navy text on a crisp white background',
          'Yellow text on a white background',
          'Light grey text on a white background',
          'Red text on a bright orange background'
        ],
        correctIndex: 0,
        explanation: 'Dark text on a clean light background provides maximum contrast, making it easy to read on any screen.',
        hint: 'Look for opposite lightness levels.'
      }
    ]
  },
  {
    weekNumber: 11,
    title: 'AI Explorer (Child-Safe)',
    category: 'creative',
    mcqCount: 20,
    description: 'What is machine intelligence? How computers recognize drawings and patterns, child-friendly prompt crafting, and ethics of computer truth.',
    workstationTask: 'Prompting an Educational AI',
    badgeName: 'Future Pioneer',
    badgeIcon: '🤖',
    colorTheme: 'amber',
    slides: [
      {
        title: 'How Computers Learn from Examples',
        bigConcept: 'AI does not have a human brain or feelings. It is trained on millions of examples to find patterns.',
        keyTakeaway: 'Always verify facts with trusted teachers and books because AI can make mistakes ("hallucinations").',
        teacherNotes: 'Show the QuickDraw drawing experiment: how the computer guesses a drawing from stroke patterns.',
        actionPrompt: 'Ask an educational model to explain why the Kakum canopy walkway was built.'
      }
    ],
    questions: [
      {
        id: 'w11-q1',
        question: 'What is the most important rule when using AI tools for school homework?',
        options: [
          'Always check facts with books and teachers, because AI can generate inaccurate answers',
          'Assume the AI is always 100% correct about everything',
          'Tell the AI your secret home passwords',
          'Copy and paste answers without reading or understanding them'
        ],
        correctIndex: 0,
        explanation: 'AI tools predict words based on patterns and can make factual mistakes. Human critical thinking is always essential.',
        hint: 'Never trust any single computer answer blindly.'
      }
    ]
  },
  {
    weekNumber: 12,
    title: 'Digital Superhero Capstone',
    category: 'creative',
    mcqCount: 20,
    description: 'The grand demonstration: pupils create a multi-format digital portfolio combining Word reports, presentation slides, and graphics.',
    workstationTask: 'Live Peer Showcase Exhibition',
    badgeName: 'Owrafix Junior Graduate',
    badgeIcon: '🎓',
    colorTheme: 'emerald',
    slides: [
      {
        title: 'Your Digital Journey Complete',
        bigConcept: 'Over 12 weeks you went from learning to hold a mouse to building multi-media projects and understanding the digital world.',
        keyTakeaway: 'You are now an empowered, responsible digital creator ready for junior high school computing!',
        teacherNotes: 'Celebrate each student as they present their portfolio to parents and classmates.',
        actionPrompt: 'Export your final digital portfolio and print your Official Owrafix Certificate.'
      }
    ],
    questions: [
      {
        id: 'w12-q1',
        question: 'What is a "Digital Portfolio"?',
        options: [
          'A curated collection of your best computer projects showcasing what you learned',
          'A physical leather bag with heavy paper books',
          'A virus that erases all your computer games',
          'A battery that powers the school clock'
        ],
        correctIndex: 0,
        explanation: 'A digital portfolio proves your hands-on mastery with real documents, presentations, and design files.',
        hint: 'It showcases your work to parents and future teachers.'
      }
    ]
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Bertha Kwakyewah',
  schoolName: 'OWRAFIX Ventures Training Hub',
  grade: 'Digital Foundations & AI Mastery',
  xp: 340,
  level: 3,
  badges: ['First Boot Explorer', 'Precision Pilot', 'Swift Typist'],
  streakDays: 4,
  completedWeeks: [1, 2]
};

export const SIMULATED_WORKSTATIONS: WorkstationTelemetry[] = [
  { id: 1, studentName: 'Bertha Kwakyewah (OWR-0003)', seatNumber: 'Desk 01', currentTask: 'Week 2: Digital Foundations', status: 'active', score: 95, lastActive: '2s ago' },
  { id: 2, studentName: 'Florence Owora (OWR-0002)', seatNumber: 'Desk 02', currentTask: 'Week 2: Digital Skills Admin', status: 'active', score: 90, lastActive: '5s ago' },
  { id: 3, studentName: 'Test Applicant (OWR-0001)', seatNumber: 'Desk 03', currentTask: 'Week 2: AI for Professionals', status: 'completed', score: 100, lastActive: '1s ago' },
  { id: 4, studentName: 'Ama B.', seatNumber: 'Desk 04', currentTask: 'Week 2: Quick Check', status: 'completed', score: 100, lastActive: '1s ago' },
  { id: 5, studentName: 'Yaw D.', seatNumber: 'Desk 05', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 90, lastActive: '3s ago' },
  { id: 6, studentName: 'Akosua K.', seatNumber: 'Desk 06', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 80, lastActive: '7s ago' },
  { id: 7, studentName: 'Emmanuel T.', seatNumber: 'Desk 07', currentTask: 'Week 1: Review', status: 'active', score: 85, lastActive: '4s ago' },
  { id: 8, studentName: 'Efua S.', seatNumber: 'Desk 08', currentTask: 'Week 2: Drag & Drop', status: 'completed', score: 100, lastActive: '10s ago' },
  { id: 9, studentName: 'Kojo N.', seatNumber: 'Desk 09', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 75, lastActive: '6s ago' },
  { id: 10, studentName: 'Grace A.', seatNumber: 'Desk 10', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 95, lastActive: '2s ago' },
  { id: 11, studentName: 'Samuel F.', seatNumber: 'Desk 11', currentTask: 'Week 2: Drag & Drop', status: 'active', score: 90, lastActive: '8s ago' },
  { id: 12, studentName: 'Adjoa E.', seatNumber: 'Desk 12', currentTask: 'Week 2: Quick Check', status: 'completed', score: 100, lastActive: '3s ago' },
  { id: 13, studentName: 'Justice B.', seatNumber: 'Desk 13', currentTask: 'Week 2: Mouse Mastery', status: 'needs-help', score: 60, lastActive: '20s ago' },
  { id: 14, studentName: 'Mercy Q.', seatNumber: 'Desk 14', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 85, lastActive: '4s ago' },
  { id: 15, studentName: 'Blessing O.', seatNumber: 'Desk 15', currentTask: 'Week 2: Drag & Drop', status: 'active', score: 80, lastActive: '9s ago' },
  { id: 16, studentName: 'Prince W.', seatNumber: 'Desk 16', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 90, lastActive: '1s ago' },
  { id: 17, studentName: 'Eunice C.', seatNumber: 'Desk 17', currentTask: 'Week 2: Quick Check', status: 'completed', score: 100, lastActive: '2s ago' },
  { id: 18, studentName: 'Francis V.', seatNumber: 'Desk 18', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 85, lastActive: '5s ago' },
  { id: 19, studentName: 'Esther Z.', seatNumber: 'Desk 19', currentTask: 'Week 2: Drag & Drop', status: 'active', score: 90, lastActive: '6s ago' },
  { id: 20, studentName: 'Richmond P.', seatNumber: 'Desk 20', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 80, lastActive: '11s ago' },
  { id: 21, studentName: 'Doris M.', seatNumber: 'Desk 21', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 95, lastActive: '3s ago' },
  { id: 22, studentName: 'Bright L.', seatNumber: 'Desk 22', currentTask: 'Week 2: Drag & Drop', status: 'active', score: 85, lastActive: '8s ago' },
  { id: 23, studentName: 'Gifty H.', seatNumber: 'Desk 23', currentTask: 'Week 2: Quick Check', status: 'completed', score: 100, lastActive: '1s ago' },
  { id: 24, studentName: 'Daniel J.', seatNumber: 'Desk 24', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 75, lastActive: '14s ago' },
  { id: 25, studentName: 'Sarah Y.', seatNumber: 'Desk 25', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 90, lastActive: '4s ago' },
  { id: 26, studentName: 'Godwin R.', seatNumber: 'Desk 26', currentTask: 'Week 2: Drag & Drop', status: 'active', score: 85, lastActive: '7s ago' },
  { id: 27, studentName: 'Matilda T.', seatNumber: 'Desk 27', currentTask: 'Week 2: Mouse Mastery', status: 'active', score: 95, lastActive: '2s ago' },
  { id: 28, studentName: 'Stephen G.', seatNumber: 'Desk 28', currentTask: 'Week 2: Quick Check', status: 'completed', score: 100, lastActive: '3s ago' },
];

export const HARDWARE_PARTS = [
  {
    id: 'cpu',
    name: 'Central Processing Unit (CPU)',
    subtitle: 'The Brain of the Computer',
    description: 'Executes mathematical instructions, manages input from your mouse and keyboard, and tells other parts what to do.',
    funFact: 'A modern CPU calculates billions of instructions every second inside a silicon square smaller than a postage stamp!',
    safetyTip: 'Never touch a CPU while the computer is plugged in; it gets warm during use.'
  },
  {
    id: 'ram',
    name: 'Random Access Memory (RAM)',
    subtitle: 'The Quick Working Desk',
    description: 'Holds your open applications and unsaved files while you are working. When you shut down, RAM clears its memory.',
    funFact: 'Think of RAM as your classroom desktop: it holds the notebooks you are reading right now!',
    safetyTip: 'RAM sticks click firmly into place with side locking clips.'
  },
  {
    id: 'motherboard',
    name: 'Main Motherboard',
    subtitle: 'The Highway System',
    description: 'The large green circuit board that connects the CPU, memory, storage, and external ports together so they can communicate.',
    funFact: 'Printed copper lines called "buses" carry electrical pulses across the board at light speeds.',
    safetyTip: 'Keep all liquid and metal clips away from the motherboard circuits.'
  },
  {
    id: 'usb',
    name: 'USB-A & USB-C Ports',
    subtitle: 'Universal Connection Sockets',
    description: 'Plug in mice, keyboards, flash pendrives, and webcams to send and receive data.',
    funFact: 'USB stands for "Universal Serial Bus". USB-C can even plug in upside-down!',
    safetyTip: 'Never force a USB cable if it feels stuck. Check if you have the plug right-side up.'
  },
  {
    id: 'mouse',
    name: 'Optical Mouse',
    subtitle: 'Your Hand On Screen',
    description: 'Uses an LED light sensor on the bottom to track movement across your desk and translate it into screen pointer coordinates.',
    funFact: 'The first computer mouse in 1964 was carved out of a block of wood with two metal wheels!',
    safetyTip: 'Rest your palm flat and use your fingers to gently guide the mouse.'
  }
];
