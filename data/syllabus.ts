import { Course, Paper } from '@/types';

export const syllabusData: Record<Course, Record<string, Record<string, Paper[]>>> = {
  CS: {
    Professional: {
      'Group 1': [
        {
          id: 'cs_prof_g1_p1',
          name: 'Environmental, Social and Governance (ESG) - Principles & Practice',
          chapters: [
            { id: 'esg_ch1', name: 'Chapter 1: Governance and Sustainability' },
            { id: 'esg_ch2', name: 'Chapter 2: Risk Management' },
            { id: 'esg_ch3', name: 'Chapter 3: ESG Framework and Standards' },
            { id: 'esg_ch4', name: 'Chapter 4: Environmental Principles' },
            { id: 'esg_ch5', name: 'Chapter 5: Social Responsibility' },
            { id: 'esg_ch6', name: 'Chapter 6: ESG Reporting and Disclosures' },
          ],
        },
        {
          id: 'cs_prof_g1_p2',
          name: 'Drafting, Pleadings and Appearances',
          chapters: [
            { id: 'dpa_ch1', name: 'Chapter 1: Introduction to Drafting' },
            { id: 'dpa_ch2', name: 'Chapter 2: Commercial Contracts' },
            { id: 'dpa_ch3', name: 'Chapter 3: Corporate Documentation' },
            { id: 'dpa_ch4', name: 'Chapter 4: Pleadings Before Courts' },
            { id: 'dpa_ch5', name: 'Chapter 5: Appearances Before Tribunals' },
            { id: 'dpa_ch6', name: 'Chapter 6: Legal Opinion Writing' },
          ],
        },
        {
          id: 'cs_prof_g1_p3',
          name: 'Secretarial Audit, Compliance Management and Due Diligence',
          chapters: [
            { id: 'sa_ch1', name: 'Chapter 1: Secretarial Audit Concepts' },
            { id: 'sa_ch2', name: 'Chapter 2: Audit Planning and Execution' },
            { id: 'sa_ch3', name: 'Chapter 3: Compliance Management System' },
            { id: 'sa_ch4', name: 'Chapter 4: Due Diligence Process' },
            { id: 'sa_ch5', name: 'Chapter 5: Secretarial Audit Report' },
            { id: 'sa_ch6', name: 'Chapter 6: Annual Compliance Certificate' },
          ],
        },
      ],
      'Group 2': [
        {
          id: 'cs_prof_g2_p1',
          name: 'Corporate Restructuring and Insolvency',
          chapters: [
            { id: 'cri_ch1', name: 'Chapter 1: Corporate Restructuring Fundamentals' },
            { id: 'cri_ch2', name: 'Chapter 2: Mergers and Acquisitions' },
            { id: 'cri_ch3', name: 'Chapter 3: Demergers and Spin-offs' },
            { id: 'cri_ch4', name: 'Chapter 4: Insolvency and Bankruptcy Code' },
            { id: 'cri_ch5', name: 'Chapter 5: Corporate Insolvency Resolution' },
            { id: 'cri_ch6', name: 'Chapter 6: Liquidation Process' },
          ],
        },
        {
          id: 'cs_prof_g2_p2',
          name: 'Resolution of Corporate Disputes, Non-Compliances & Remedies',
          chapters: [
            { id: 'rcd_ch1', name: 'Chapter 1: Corporate Dispute Resolution Mechanisms' },
            { id: 'rcd_ch2', name: 'Chapter 2: Arbitration and Mediation' },
            { id: 'rcd_ch3', name: 'Chapter 3: Non-Compliance and Penalties' },
            { id: 'rcd_ch4', name: 'Chapter 4: Enforcement Remedies' },
            { id: 'rcd_ch5', name: 'Chapter 5: Investor Grievance Redressal' },
            { id: 'rcd_ch6', name: 'Chapter 6: NCLT and NCLAT Procedures' },
          ],
        },
        {
          id: 'cs_prof_g2_p3',
          name: 'Multidisciplinary Case Studies',
          chapters: [
            { id: 'mcs_ch1', name: 'Chapter 1: Integrated Case Analysis' },
            { id: 'mcs_ch2', name: 'Chapter 2: Corporate Governance Cases' },
            { id: 'mcs_ch3', name: 'Chapter 3: Compliance Framework Cases' },
            { id: 'mcs_ch4', name: 'Chapter 4: M&A Transaction Cases' },
            { id: 'mcs_ch5', name: 'Chapter 5: Insolvency Resolution Cases' },
            { id: 'mcs_ch6', name: 'Chapter 6: Ethical Dilemma Cases' },
          ],
        },
      ],
    },
    Executive: {
      'Group 1': [
        {
          id: 'cs_exec_g1_p1',
          name: 'Company Law',
          chapters: [
            { id: 'cl_ch1', name: 'Chapter 1: Introduction to Companies Act, 2013' },
            { id: 'cl_ch2', name: 'Chapter 2: Incorporation of Company' },
            { id: 'cl_ch3', name: 'Chapter 3: Share Capital and Debentures' },
            { id: 'cl_ch4', name: 'Chapter 4: Board Meetings and Procedures' },
          ],
        },
        {
          id: 'cs_exec_g1_p2',
          name: 'Cost and Management Accounting',
          chapters: [
            { id: 'cma_ch1', name: 'Chapter 1: Cost Accounting Fundamentals' },
            { id: 'cma_ch2', name: 'Chapter 2: Cost Classification' },
            { id: 'cma_ch3', name: 'Chapter 3: Budgeting and Control' },
          ],
        },
      ],
      'Group 2': [
        {
          id: 'cs_exec_g2_p1',
          name: 'Economic and Commercial Laws',
          chapters: [
            { id: 'ecl_ch1', name: 'Chapter 1: Indian Contract Act' },
            { id: 'ecl_ch2', name: 'Chapter 2: Sale of Goods Act' },
            { id: 'ecl_ch3', name: 'Chapter 3: Negotiable Instruments Act' },
          ],
        },
        {
          id: 'cs_exec_g2_p2',
          name: 'Securities Laws and Capital Markets',
          chapters: [
            { id: 'slcm_ch1', name: 'Chapter 1: SEBI Act and Regulations' },
            { id: 'slcm_ch2', name: 'Chapter 2: Primary Market Operations' },
            { id: 'slcm_ch3', name: 'Chapter 3: Secondary Market Regulations' },
          ],
        },
      ],
    },
  },
  CA: {
    Foundation: {
      'Group 1': [
        {
          id: 'ca_found_g1_p1',
          name: 'Principles and Practice of Accounting',
          chapters: [
            { id: 'ppa_ch1', name: 'Chapter 1: Theoretical Framework' },
            { id: 'ppa_ch2', name: 'Chapter 2: Accounting Process' },
            { id: 'ppa_ch3', name: 'Chapter 3: Bank Reconciliation Statement' },
            { id: 'ppa_ch4', name: 'Chapter 4: Inventories' },
          ],
        },
        {
          id: 'ca_found_g1_p2',
          name: 'Business Laws',
          chapters: [
            { id: 'bl_ch1', name: 'Chapter 1: Indian Contract Act, 1872' },
            { id: 'bl_ch2', name: 'Chapter 2: Sale of Goods Act, 1930' },
            { id: 'bl_ch3', name: 'Chapter 3: Indian Partnership Act, 1932' },
          ],
        },
      ],
      'Group 2': [
        {
          id: 'ca_found_g2_p1',
          name: 'Business Mathematics and Statistics',
          chapters: [
            { id: 'bms_ch1', name: 'Chapter 1: Ratio and Proportion' },
            { id: 'bms_ch2', name: 'Chapter 2: Statistical Description of Data' },
            { id: 'bms_ch3', name: 'Chapter 3: Measures of Central Tendency' },
          ],
        },
        {
          id: 'ca_found_g2_p2',
          name: 'Business Economics',
          chapters: [
            { id: 'be_ch1', name: 'Chapter 1: Introduction to Microeconomics' },
            { id: 'be_ch2', name: 'Chapter 2: Theory of Demand and Supply' },
            { id: 'be_ch3', name: 'Chapter 3: Production and Cost' },
          ],
        },
      ],
    },
    Intermediate: {
      'Group 1': [
        {
          id: 'ca_inter_g1_p1',
          name: 'Advanced Accounting',
          chapters: [
            { id: 'aa_ch1', name: 'Chapter 1: Framework for Preparation of Financial Statements' },
            { id: 'aa_ch2', name: 'Chapter 2: Company Accounts' },
          ],
        },
      ],
      'Group 2': [
        {
          id: 'ca_inter_g2_p1',
          name: 'Cost and Management Accounting',
          chapters: [
            { id: 'cma2_ch1', name: 'Chapter 1: Introduction to Cost Accounting' },
            { id: 'cma2_ch2', name: 'Chapter 2: Material Costs' },
          ],
        },
      ],
    },
    Final: {
      'Group 1': [
        {
          id: 'ca_final_g1_p1',
          name: 'Financial Reporting',
          chapters: [
            { id: 'fr_ch1', name: 'Chapter 1: Framework for Preparation of Financial Statements' },
            { id: 'fr_ch2', name: 'Chapter 2: Accounting Standards' },
          ],
        },
      ],
      'Group 2': [
        {
          id: 'ca_final_g2_p1',
          name: 'Strategic Financial Management',
          chapters: [
            { id: 'sfm_ch1', name: 'Chapter 1: Financial Policy and Corporate Strategy' },
            { id: 'sfm_ch2', name: 'Chapter 2: Risk Management' },
          ],
        },
      ],
    },
  },
  CMA: {
    Foundation: {
      'Group 1': [
        {
          id: 'cma_found_g1_p1',
          name: 'Fundamentals of Economics and Management',
          chapters: [
            { id: 'fem_ch1', name: 'Chapter 1: Introduction to Economics' },
            { id: 'fem_ch2', name: 'Chapter 2: Basic Concepts of Management' },
          ],
        },
      ],
      'Group 2': [
        {
          id: 'cma_found_g2_p1',
          name: 'Fundamentals of Accounting',
          chapters: [
            { id: 'fa_ch1', name: 'Chapter 1: Introduction to Accounting' },
            { id: 'fa_ch2', name: 'Chapter 2: Accounting Cycle' },
          ],
        },
      ],
    },
    Intermediate: {
      'Group 1': [
        {
          id: 'cma_inter_g1_p1',
          name: 'Financial Accounting',
          chapters: [
            { id: 'fa2_ch1', name: 'Chapter 1: Accounting Standards' },
            { id: 'fa2_ch2', name: 'Chapter 2: Financial Statements' },
          ],
        },
      ],
      'Group 2': [
        {
          id: 'cma_inter_g2_p1',
          name: 'Cost Accounting',
          chapters: [
            { id: 'ca_ch1', name: 'Chapter 1: Cost Concepts' },
            { id: 'ca_ch2', name: 'Chapter 2: Material Costing' },
          ],
        },
      ],
    },
    Final: {
      'Group 1': [
        {
          id: 'cma_final_g1_p1',
          name: 'Corporate Laws and Compliance',
          chapters: [
            { id: 'clc_ch1', name: 'Chapter 1: Company Law' },
            { id: 'clc_ch2', name: 'Chapter 2: Corporate Governance' },
          ],
        },
      ],
      'Group 2': [
        {
          id: 'cma_final_g2_p1',
          name: 'Strategic Performance Management',
          chapters: [
            { id: 'spm_ch1', name: 'Chapter 1: Strategic Planning' },
            { id: 'spm_ch2', name: 'Chapter 2: Performance Measurement' },
          ],
        },
      ],
    },
  },
  Other: {
    'Not Applicable': {}, // No predefined papers for custom courses
  },
};

export const getPapers = (course: Course, level: string, groups: string[]): Paper[] => {
  const courseData = syllabusData[course];
  if (!courseData || !courseData[level]) return [];

  let papers: Paper[] = [];
  
  if (groups.includes('Both Groups')) {
    papers = [
      ...(courseData[level]['Group 1'] || []),
      ...(courseData[level]['Group 2'] || []),
    ];
  } else {
    groups.forEach(group => {
      papers = [...papers, ...(courseData[level][group] || [])];
    });
  }

  return papers;
};
