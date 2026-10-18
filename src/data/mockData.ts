import type { ModuleItem, ExamQuestion, ExamResultSummary } from '../types/index.ts';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsYAuVzKxI7WhdXCsWeZgpBdU0oS8fzikqCwDKMVfCINcoTNqDNMhFNn_MJ_TRZoQKdTBFy-7f4Wufar4OxmO_DxeKBxh2BHRF9ysQPoNqpat-xo2ELzUzb6m3SGqB_9X-S9E08pu4qSVXYKIrBuDn-szoIzVyw02M6NmjQQpuBVPRpJDQqoicfVr3X1utXVV3TZE_UDKLsc-R5TEoHW9fOXplajjppna6uh99sSkemyrbRSZRCPFp',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxpel9QDo5laB_Hujf24YJ8m0cfPNF-voGUyNEcU6-ywS58q8WT14fOuHWoyL6FTzfU5DR0XsgDRA1oUdCT4muLJDTE3a9ZTu9bUorO70g7YZ0rp3zQd_lShrJS_SdjtpIv-utMpQJytBouwdmdYtcQwY6XNgocc9s9etOAdvI6u1u1Ollc4rSGdZfAoiOWpYpXsUFEPm67pNbDK09zd3Ggb61Zr5Lyz03symMzh081Qno-W5Wohrr',
  videoModule16: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoq69Znozb_EUgT6OxsAZAotkvJivEz-xPJnoxgz6r8negoLRfc6nxyIsmOlkRrnSEiikIVkGUTEnD5YbFm90B3s64g71b1U6elZ7VwL7NW_5MkZTozNWE_rsgOEOOOxvDIXYFxtI8yyFyzd7F-uj5gjl829kUhZuFfOt76PnCANj2UsEL3nmJe4YOL1U4EbV2HpiOLWI0U-l1O6SSd0qorM0ke70240jFT1OhBt5sNIOWeqHcGra1',
  activeExamTrench: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCARrxE4K11n9wNT-x1uRcFm2iyk8nvcE04qxUmcHszDwT9ewo5I3EOcsxU2Q3M-sEi2ywiaGURdl4jb1HSu6HpSAq9zBQjqqvu79m167hQgz-Lqf3CLnwaHiGSpkd-RgLzrVG6cDmZbcJbXynOtSg6NU6-gC9_S_ZiNW312lku05j21nvtlciGAWSgRESr4blfEb3c7lTRTjlU7rgeyhUbxMtCKbuOVeLp9h9agQl_3igASzvMcTIh',
  resultsReviewHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyGaAP_dxZF3-nT0SiwwNyqLYNhjvtLTT52fzF2H901vbJiKljzg3y3sYu7tKvNJroCmcJ-c1Bjo8Y5Su3Fsc_DTQrzMyehfkftsU_tfCtKBhJrtmDyan4tXExrU2SRHzaH7-uH7z7Qr4L0j4hveyIvqBGnpLot3ZNZ5kinhUhuoJXU5gFQXKY63zeUkSYpCLhSGqmlR606Kn5Js2gVlheJtJBI1UMFi4jM2LrHTBI2Zt90yQb4zxA',
  videoModalSnapshot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmNbdiHUik7rbzJxy7z3DVQsLvW8KzOXjkIBueBpjZWhtXF81pw03KjylQsLOHeXc_3eLRWrj2vmhR6MqCphef5GKWoYf3Zyl671tgarHxkFOV57FicvdBDsmuyyaBhKfw_UZ3v3rBb-djNdsoRSangbPT1YwQFHEPYHDNvW-_bxx0p9tG_0y-6D017lMKUFWdNz4iMB4oEZho629B3k6XUqbotDZdebbr4_B-1CS9XzSTplHXUbx6',
};

export const MODULES_DATA: ModuleItem[] = [
  // Domain 1: Legal & Management
  {
    id: 'mod-01',
    number: 1,
    videoTag: 'Video 01',
    series: 'CITB Core',
    domainKey: 'legal',
    domainName: 'Legal & Management',
    title: 'CDM Regulations 2015 & Principal Dutyholders',
    subtitle: 'Client duties, principal designer responsibilities & statutory roles',
    duration: '18m',
    mastery: 96,
    questionsAnswered: 24,
    totalQuestions: 24,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfzKL0ItirSanT0OCavn3JlRaTTcpFUES8f3TAlN4o387AeBA7C2n_SZGG4yfWLYUX2962ED_WAM4Tke9b4OFhsBB0X5sT99KY6I4AXLVJ2ydCfrLqR5A73tClbUPM3WXDjFmVYeXKd3vyb3n-mnfuWCYWCYxmveAi2qeVllMjeVWF16RHMDZzEMXxoX6VGQfT5RsosRjxoIz8zHHig7G6xJ1xUq-pltP9s-iRORhzbTRUBfU0cT8-',
    regCode: 'CDM 2015 Part 2',
    isHighWeighting: true,
  },
  {
    id: 'mod-02',
    number: 2,
    videoTag: 'Video 02',
    series: 'HSE Framework',
    domainKey: 'legal',
    domainName: 'Legal & Management',
    title: 'Risk Assessment & RAMS Execution',
    subtitle: 'Hierarchy of hazard controls, method statements & point-of-work risks',
    duration: '22m',
    mastery: 88,
    questionsAnswered: 18,
    totalQuestions: 20,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJYXOiKRZyhA2-3_Am6e3IWZQPwuNGxTk0r_TG5KBHfClr3cR34yOG9LHsaGZpAM6LZXOtJTW4IlK_bfvStMpX_vv4djAFOyr_5nKMElAPnWUEdeTvdjhqZt7LV6xBJJAueiY5sUIaYXV2j0rTYvBVZxsD2GnEWr_GyJ5iNdvgmFAFA2j-UnLmDSr-qBZbwOdIgO6cyNyzkHWy2CcSFW4j3wMnyHoJ29bZi4KJSpz_5NWts-eQwiiv',
    regCode: 'MHSWR 1999 Reg 3',
  },
  {
    id: 'mod-03',
    number: 3,
    videoTag: 'Video 03',
    series: 'Statutory Reporting',
    domainKey: 'legal',
    domainName: 'Legal & Management',
    title: 'RIDDOR 2013 & Accident Investigations',
    subtitle: 'Specified injuries, 7-day incapacitation & dangerous occurrences',
    duration: '15m',
    mastery: 78,
    questionsAnswered: 14,
    totalQuestions: 18,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd9VCh8dUd_aBk7CgjX1DdMwZpfS5U-WGlA4qLOQDa38wyvRECDLQXmohLBnJm7Gs7WLBsaM3CpVUe5aYBSPvz2JumLA2wU5gjg0ePbQFYh5q8pUp1nC_YdnLWo6BCyGOZa7-hIlmQ_xDj4hKeocgObMpkvkylbOXJDlaxrmgSs1JmlsPvzOUOtM_zmCY3ws4T48WMlpRQE3yeF5z7Mxe1R2kEoQDSLzHR3IQ89hbJhjLy-oiIq2v1',
    regCode: 'RIDDOR 2013',
  },

  // Domain 2: Health & Welfare
  {
    id: 'mod-06',
    number: 6,
    videoTag: 'Video 06',
    series: 'Hazardous Materials',
    domainKey: 'health',
    domainName: 'Health & Welfare',
    title: 'Asbestos Awareness & Duty to Manage',
    subtitle: 'ACM register verification, sampling protocols, and licensing thresholds',
    duration: '20m',
    mastery: 90,
    questionsAnswered: 22,
    totalQuestions: 22,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASQwBggl3--GkjbSGUhJmbd8t0VSQ08SC8wdEZ8AS4Y4xZ3DgBzRQW5EkxoxJGj_D8pGLAtFzM205R28TRxaqvWjSkQ1GUTdFlaJP5bXaQW1uxse9FPJzqW_WAq0Iw3ZYmuR74lvwn-5dH7TBR5E5KvyvGbwQ1xPRUIY1oApItOQmXm9d5o7WRNueAk7vH7GslwD9q86IuzDHdeLig2zAJ-BfJtTKDH_YeuzLKXo9IgKimfGjmT2s3',
    regCode: 'CAR 2012 Reg 4',
  },
  {
    id: 'mod-07',
    number: 7,
    videoTag: 'Video 07',
    series: 'Respiratory Health',
    domainKey: 'health',
    domainName: 'Health & Welfare',
    title: 'COSHH & Silica Dust (RCS) Controls',
    subtitle: 'Workplace Exposure Limits (WEL), LEV systems & health surveillance',
    duration: '16m',
    mastery: 81,
    questionsAnswered: 16,
    totalQuestions: 20,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxrr5XhofeZU4RMiU4HKew1Ixv09AaajKpl_jIq8fwAxGnGEK1mI24_mASq66bNtgZkkCe0iXwN6-CZ7QD57GDLA8wNfwTCvnPW5ljmEgXJlggwl-f4G6xVTRY2JLDrw-ZIapkOV0sqXUCcBzN5md97LxVpyD3xsbOPNCnz6ZbCLKqHigLqr6AE5Hk1HZR2sHi57k_DPUVHKVr7Femu4P-QHT8sMfTmNJYDvptkqGZswwkHiPCMnLc',
    regCode: 'COSHH 2002',
  },

  // Domain 3: General Safety
  {
    id: 'mod-11',
    number: 11,
    videoTag: 'Video 11',
    series: 'Critical Prevention',
    domainKey: 'general',
    domainName: 'General Safety',
    title: 'Work at Height Regulations 2005',
    subtitle: 'Collective protection, MEWPs, scaffolding handovers and inspection tags',
    duration: '24m',
    mastery: 76,
    questionsAnswered: 19,
    totalQuestions: 25,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd8jQ5QznfjtQ_muHHYCb9MdXzzX61PW24yz0yZmomaYhSjqfiTHls5nOpQ5oYkh4f1YVOzBHZqJEqiRNrqYk1uBBusYFUcEpJNqrALqDgajndiHGv8QKLMaJe9LvuWjEzG_mr-fGB1SjljEzbbtPVKt3UXdYSlBQU9-3TzGU1bKV_L7R277bMTGVIvpD2eFM_Keg2OvzhjnvfRUIw1RM5mahFkbjUGG20WFQ9qN20Tx3j8AY5TVIF',
    regCode: 'WAHR 2005',
  },
  {
    id: 'mod-13',
    number: 13,
    videoTag: 'Video 13',
    series: 'Emergency Ops',
    domainKey: 'general',
    domainName: 'General Safety',
    title: 'Fire Prevention on Construction Sites',
    subtitle: 'Hot work permits, flammable storage limits & joint code of practice',
    duration: '19m',
    mastery: 89,
    questionsAnswered: 18,
    totalQuestions: 20,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQZzsIaefrXS6H-PwkNlMWOJIj3NSb8TWRoqW2GYkCyQKqYfgu-UhFWidL8V_2HExw5z_A3Fl9S_9tFazT1MMqxJ5NuuUFKf_iyEXQ0RXn_JtPBz30l9se-XsgENxzH0DMDKl3hmSwtr7dtttmeQqlbw_hX3R_5RCSc8uCC94mOnBE9WLT8KfFmQEndH6U3LoKwYE0bBoFcj4Lc0Go_uRtUUAuuyVxrqGfC_rIrHTIOBWLdYfdZtBX',
    regCode: 'FSO 2005',
  },

  // Domain 4: High Risk & Environment
  {
    id: 'mod-16',
    number: 16,
    videoTag: 'Video 16',
    series: 'Groundworks',
    domainKey: 'highrisk',
    domainName: 'High Risk & Environment',
    title: 'Excavations, Shoring & Buried Services',
    subtitle: 'CAT & Genny scans, weekly statutory inspections and trench box safety',
    duration: '21m',
    mastery: 85,
    questionsAnswered: 17,
    totalQuestions: 20,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMID40SFx_y2wsRkKUnYuDLgdTd4eLWH4XYzvAlJewknGddY4oiZfUfQMW4buvP4MDztXa_8yzXajAMmkEI0cRjU3kO9uvCWRPSHp5wQryJK37w3s6GVO0ziRXj5T5IRWk3LkbbQurenUob8P4pUxMSCCsQDBd2rOPE5cBkhpYQvsvQzSw_BK2Wse8gjYtsYtctx59uhRs7AGqiIl3vIMEO5TISVENO8pqYqcoe_5DTH0mGrTCJ3lP',
    fullVideoBanner: ASSETS.videoModule16,
    regCode: 'CDM 2015 / Reg 22',
    isHighWeighting: true,
    examTrap: {
      variant: 'Question 42 Variant',
      description:
        'Excavation inspections are mandatory at the start of every shift, but examiners regularly test the secondary triggers: you must re-inspect immediately after accidental fall of rock/earth, surcharge stress, or severe weather (heavy rainfall or frost).',
    },
    legalDuties: [
      {
        id: 'duty-1',
        title: 'Written Report within 24 Hours',
        description:
          'The appointed competent person must complete and hand over the formal safety inspection report within 24 hours of examination.',
      },
      {
        id: 'duty-2',
        title: 'Retention Period: 3 Months',
        description:
          'Inspection reports must be kept on site until the project finishes, and subsequently archived for a minimum of 3 months.',
      },
      {
        id: 'duty-3',
        title: 'HSG47 3-Stage Pre-Dig Protocol',
        description:
          '1. Utility plans review → 2. Cable Avoidance Tool (CAT & Genny sweep) → 3. Safe hand digging with blunt tools.',
      },
    ],
    flashcards: [
      {
        id: 'fc-1',
        icon: 'landscape',
        tag: 'Soil Angles',
        title: 'Battering & Stepping',
        description:
          'Granular sand/gravel requires safe slope of 1:1 (45°), while stiff cohesive clay may allow steeper profiles after geotechnical sign-off.',
        meta: 'Angle of repose standard',
      },
      {
        id: 'fc-2',
        icon: 'sensors',
        tag: 'HSG47 Signal',
        title: 'Genny Signal Induction',
        description:
          'Passive P & R modes miss inert or dead metallic cables. A Signal Generator (Genny) must be applied to energize buried conductors.',
        meta: 'Dual-frequency sweeping',
      },
      {
        id: 'fc-3',
        icon: 'assignment_turned_in',
        tag: 'PTW System',
        title: 'Permit to Dig Mandate',
        description:
          'Time-bound excavation permit issued strictly by the appointed excavation coordinator before any mechanical tooth breaks ground.',
        meta: 'Valid shift duration only',
      },
    ],
    chapters: [
      {
        id: 'ch-1',
        timestamp: '00:00',
        seconds: 0,
        title: '00:00 Trench Collapse Hazards & Soil Pressures',
        status: 'completed',
      },
      {
        id: 'ch-2',
        timestamp: '04:30',
        seconds: 270,
        title: '04:30 Shoring Solutions & Trench Boxes',
        status: 'completed',
      },
      {
        id: 'ch-3',
        timestamp: '11:15',
        seconds: 675,
        title: '11:15 Underground Utilities & CAT Scanners',
        status: 'playing',
      },
      {
        id: 'ch-4',
        timestamp: '17:40',
        seconds: 1060,
        title: '17:40 Daily Inspections & Competent Person',
        status: 'upcoming',
      },
    ],
    knowledgeReadiness: {
      overall: 82,
      subtopics: [
        { name: 'Trench Shields', score: 95 },
        { name: 'Service Tracing', score: 70 },
        { name: 'CDM Duties', score: 88 },
      ],
    },
  },
  {
    id: 'mod-18',
    number: 18,
    videoTag: 'Video 18',
    series: 'Permit-to-Work',
    domainKey: 'highrisk',
    domainName: 'High Risk & Environment',
    title: 'Confined Spaces & Atmosphere Testing',
    subtitle: 'Gas detection calibration, rescue plans, top-man duties and ventilation',
    duration: '25m',
    mastery: 72,
    questionsAnswered: 12,
    totalQuestions: 18,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1WluoPlvU9pxLVXJlhNwvRtX9gH3p6sMDMiCtGcQa7qEb_WzPrvCjg0pGLg2lCyHoX3K1M8lS4v6L2oRLA6J-Oy6d5rKupxPTZhR3iMdAIB1TZFT4cyl2TblCj9mtVfz4pu7vTIcWUA9XtS5Gwn8o8SpNGknNHF03r9NKozhWNwzzQEi9QX2ZfEengEcbLZUU3SAZ7e9OzEWZjrRgH_tMBTSlPO44qL1aEz0WGbOemG0MhKrj7xUM',
    regCode: 'CSR 1997',
  },
  {
    id: 'mod-20',
    number: 20,
    videoTag: 'Video 20',
    series: 'Plant & Lifting',
    domainKey: 'highrisk',
    domainName: 'High Risk & Environment',
    title: 'LOLER 1998 & Crane Lifting Plans',
    subtitle: 'Appointed person duties, thorough examination certificates & sling angles',
    duration: '23m',
    mastery: 88,
    questionsAnswered: 21,
    totalQuestions: 24,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoKJHbrGkXVVbnsqrmvR4sauAXNvU2LyHzHeWaUzvycksySsPcOKVOz_X1ZqP6YrysM0hOZR4yt46vk4MJUCCJ6cuzH-GjvFEveaYmVq2DTK7ZY93Cn0u3DUDw9sG4eq4xGwaCm9B73AMUuEJ5VIvwCp2Llejw2Evj42gTU6V_BUL3NX56ECZxZfQz4PiW_KNztfUTggcuZLhOYkYy3I0kfgC9t5-eKt1TTw2P_2M-4LkXal2EMO4I',
    regCode: 'LOLER 1998',
  },
];

export const MOCK_EXAM_QUESTIONS: ExamQuestion[] = [
  // Question 19 (Hero Question from Screen 3)
  {
    id: 'q19',
    number: 19,
    totalQuestions: 50,
    domainKey: 'highrisk',
    domainName: 'High Risk & Environment',
    regCode: 'CDM 2015 Reg 22',
    topicTag: 'HSG47 Protocol',
    scenarioTitle: 'Mandatory Statutory Procedure',
    scenarioText:
      'During deep trench excavation works adjacent to a public roadway, ground workers encounter unmapped yellow gas conduits. Under HSG47 and the Construction (Design and Management) Regulations 2015, what is the immediate mandatory protocol for the Site Manager?',
    image: ASSETS.activeExamTrench,
    alertBadge: 'Unidentified Live Service Alert',
    options: [
      {
        id: 'A',
        text: 'Instruct hand-digging tools only within 0.5 metres and proceed carefully to map and expose the pipe circumference for site record surveys.',
      },
      {
        id: 'B',
        text: 'Immediately halt excavation, evacuate the trench perimeter, extinguish ignition sources, and contact the Gas Distribution Network (GDN) operator to verify utility status.',
      },
      {
        id: 'C',
        text: 'Deploy a calibrated CAT & Genny scanner over the trench while plant operators carefully backfill loose earth to stabilize pipe bedding.',
      },
      {
        id: 'D',
        text: 'Notify the Principal Designer to revise Pre-Construction Information before issuing a revised Permit to Work at the end of the shift.',
      },
    ],
    correctOptionId: 'B',
    rationale:
      'Regulation 22 and HSG47 require all unidentified buried services to be treated as live until proven otherwise. Works must cease immediately, the danger area evacuated, ignition sources eliminated, and the asset owner (GDN) contacted directly.',
    tip: 'Always treat unverified utility pipelines as live until isolated and confirmed in writing by network authorities.',
    recommendedVideo: {
      moduleTitle: 'Module 16: Excavation Safety & Underground Services',
      videoNumber: 16,
      timestamp: '11:15',
      tutorNote:
        'Pay special attention to the HSG47 emergency stop triggers and yellow polyethylene gas pipeline protocols.',
    },
  },

  // Question 28 (Featured Missed Question from Screen 4)
  {
    id: 'q28',
    number: 28,
    totalQuestions: 50,
    domainKey: 'health',
    domainName: 'Health & Welfare',
    regCode: 'Asbestos Regs 2012',
    topicTag: 'Hazardous Materials',
    scenarioTitle: 'Pre-Demolition Statutory Survey Requirement',
    scenarioText:
      'Under the Control of Asbestos Regulations 2012, what is the mandatory requirement before commencing structural demolition work on any pre-2000 commercial building?',
    options: [
      {
        id: 'A',
        text: 'Conduct visual inspection and proceed if no loose insulation boards are observed by site manager.',
      },
      {
        id: 'B',
        text: 'Take ambient air samples at the boundary line and proceed if particulate counts remain below 0.01 f/ml.',
      },
      {
        id: 'C',
        text: 'Commission a UKAS-accredited Demolition & Refurbishment Asbestos Survey before intrusive disturbance.',
      },
      {
        id: 'D',
        text: 'Obtain a non-licensed work notification exemption signed by the HSE inspector within 14 days.',
      },
    ],
    correctOptionId: 'C',
    rationale:
      'Regulation 4 and 5 place an explicit duty on dutyholders and contractors to carry out an intrusive Refurbishment/Demolition Survey prior to works. A general visual walk-around is legally insufficient and constitutes a Category 1 breach.',
    tip: 'Visual inspections are never legally defensible prior to structural demolition on pre-2000 premises.',
    recommendedVideo: {
      moduleTitle: 'Module 7: Asbestos Safety',
      videoNumber: 7,
      timestamp: '12:40',
      tutorNote:
        'Pay close attention to Section 4.3: non-licensed vs licensed work. Demolition requires an explicit R&D survey by accredited laboratories.',
    },
  },

  // Question 14 (Featured Missed Question from Screen 4)
  {
    id: 'q14',
    number: 14,
    totalQuestions: 50,
    domainKey: 'general',
    domainName: 'General Safety',
    regCode: 'PUWER 1998',
    topicTag: 'Plant & Lifting Safety',
    scenarioTitle: 'Lifting Accessory Inspection Frequency',
    scenarioText:
      'Who holds the statutory duty under PUWER to inspect mobile crane lifting accessories weekly?',
    options: [
      {
        id: 'A',
        text: 'Any site operative who has completed standard CITB Health & Safety touch-screen test.',
      },
      {
        id: 'B',
        text: 'An appointed competent person who holds certified lifting apparatus inspection qualifications.',
      },
      {
        id: 'C',
        text: 'The principal client representative during weekly site commercial progress meetings.',
      },
      {
        id: 'D',
        text: 'The local municipal building control officer during structural frame inspections.',
      },
    ],
    correctOptionId: 'B',
    rationale:
      'Under LOLER 1998 Regulation 9 and PUWER 1998 Regulation 6, lifting accessories require thorough examination every 6 months and in-service visual inspection by an appointed, qualified competent person.',
    tip: 'Lifting accessory checks can only be signed off by designated competent persons with verifiable accreditation.',
    recommendedVideo: {
      moduleTitle: 'Module 4: Plant & Lifting Safety',
      videoNumber: 4,
      timestamp: '04:15',
      tutorNote:
        'Remember that lifting accessories have a 6-month statutory thorough examination period, whereas lifting equipment is 12 months (or 6 if carrying persons).',
    },
  },

  // Question 3 (Featured Correct Question from Screen 4)
  {
    id: 'q3',
    number: 3,
    totalQuestions: 50,
    domainKey: 'legal',
    domainName: 'Legal & Management',
    regCode: 'CDM 2015 Roles',
    topicTag: 'Dutyholders',
    scenarioTitle: 'Principal Designer Pre-Construction Duty',
    scenarioText:
      'What is the Principal Designer’s primary responsibility in the pre-construction phase?',
    options: [
      {
        id: 'A',
        text: 'Prepare weekly wages, tax compliance, and payroll for sub-contracted plant operatives.',
      },
      {
        id: 'B',
        text: 'Eliminate foreseeable health & safety risks to construction and maintenance workers through design choices.',
      },
      {
        id: 'C',
        text: 'Directly manage day-to-day site logistics, welfare facilities, and traffic marshals on site.',
      },
      {
        id: 'D',
        text: 'Order personal protective equipment and enforce high-visibility clothing at site turnstiles.',
      },
    ],
    correctOptionId: 'B',
    rationale:
      'Under CDM 2015 Regulation 11, the Principal Designer must plan, manage, and monitor the pre-construction phase, coordinating health and safety matters to eliminate foreseeable risks through design.',
    tip: 'The Principal Designer controls the design phase; the Principal Contractor manages site execution.',
    recommendedVideo: {
      moduleTitle: 'Module 1: CDM 2015 Dutyholder Duties',
      videoNumber: 1,
      timestamp: '08:30',
      tutorNote:
        'Focus on the distinction between the Principal Designer and Principal Contractor responsibilities.',
    },
  },
];

// Seeded user answers that produce the exact state shown in Screenshot 4:
// Score 47 / 50 (94%), Incorrect: Q28 (answered A, expected C), Q14 (answered A, expected B), Q41 (answered C, expected B)
// Flagged questions: Q4, Q12, Q25, Q28, Q3
export const INITIAL_USER_ANSWERS: Record<number, 'A' | 'B' | 'C' | 'D'> = {
  1: 'B',
  2: 'A',
  3: 'B', // Correct
  4: 'B',
  5: 'C',
  6: 'A',
  7: 'D',
  8: 'B',
  9: 'C',
  10: 'A',
  11: 'B',
  12: 'C',
  13: 'A',
  14: 'A', // Incorrect (PUWER - chosen A, correct is B)
  15: 'D',
  16: 'B',
  17: 'C',
  18: 'A',
  19: 'B', // Active exam question (Selected Option B)
  20: 'B',
  21: 'C',
  22: 'A',
  23: 'B',
  24: 'D',
  25: 'B',
  26: 'A',
  27: 'C',
  28: 'A', // Incorrect (Asbestos - chosen A, correct is C)
  29: 'B',
  30: 'C',
  31: 'A',
  32: 'B',
  33: 'D',
  34: 'B',
  35: 'C',
  36: 'A',
  37: 'B',
  38: 'C',
  39: 'D',
  40: 'A',
  41: 'C', // Incorrect (General safety question)
  42: 'B',
  43: 'A',
  44: 'B',
  45: 'C',
  46: 'D',
  47: 'A',
  48: 'B',
  49: 'C',
  50: 'B',
};

export const INITIAL_FLAGGED_QUESTIONS = [4, 12, 19, 25, 28, 3];

export const INITIAL_EXAM_RESULT: ExamResultSummary = {
  score: 47,
  total: 50,
  percentage: 94.0,
  passed: true,
  passBenchmark: 45,
  timeTakenSeconds: 34 * 60 + 12,
  timeLimitSeconds: 45 * 60,
  accuracy: 94.0,
  dominantArea: 'High Risk',
  diagnostics: [
    {
      domainKey: 'legal',
      title: 'Legal & Management (CDM 2015)',
      score: 12,
      total: 12,
      percentage: 100,
      isPerfect: true,
    },
    {
      domainKey: 'health',
      title: 'Health & Welfare (Hazardous Substances)',
      score: 11,
      total: 13,
      percentage: 85,
      isPerfect: false,
    },
    {
      domainKey: 'general',
      title: 'General Safety & Site Plant Operations',
      score: 14,
      total: 15,
      percentage: 93,
      isPerfect: false,
    },
    {
      domainKey: 'highrisk',
      title: 'High Risk Activities (Work at Height, Demolition)',
      score: 10,
      total: 10,
      percentage: 100,
      isPerfect: true,
    },
  ],
  userAnswers: INITIAL_USER_ANSWERS,
  flaggedQuestions: INITIAL_FLAGGED_QUESTIONS,
};
