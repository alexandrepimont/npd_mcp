import type { FactpagesTableMetadata } from '../definitions.ts';

export const FACTPAGES_WELLBORE_TABLES: readonly FactpagesTableMetadata[] = [
  {
    key: 'current_year',
    label: 'Current year',
    route: 'wellbore_exploration_current_year',
    category: 'time_window',
    explanation:
      'Returns the most recent wellbore exploration records for the current reporting year.',
    aiSummary:
      'Use this table when a question is about the current year only, such as latest drilling activity, newly reported wells, or the newest available operational status.',
    relatedTerms: ['current year', 'latest year', 'this year', 'recent drilling'],
    useCases: [
      'Find the newest wells reported in the current year.',
      'Compare current-year drilling with previous reporting periods.',
      'Check recent operator and status patterns for active drilling.',
    ],
    queryHints: ['current year', 'latest drilling', 'this year', 'most recent'],
    urlTemplate:
      'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
    source: 'Factpages public export endpoint for wellbore exploration data.',
  },
  {
    key: 'last_year',
    label: 'Last year',
    route: 'wellbore_exploration_last_year',
    category: 'time_window',
    explanation:
      'Returns the wellbore exploration records published for the previous calendar year.',
    aiSummary:
      'Use this table when the user asks about the previous year, annual totals, or year-over-year changes in drilling results.',
    relatedTerms: ['previous year', 'last year', 'year over year', 'annual history'],
    useCases: [
      'Measure annual drilling activity compared with the current year.',
      'Review operator performance in the previous reporting year.',
      'Estimate status and basin trends for the last full year.',
    ],
    queryHints: ['last year', 'previous year', 'annual comparison', 'year-over-year'],
    urlTemplate:
      'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
    source: 'Factpages public export endpoint for wellbore exploration data.',
  },
  {
    key: 'last_10_years',
    label: 'Last 10 years',
    route: 'wellbore_exploration_last_10_years',
    category: 'time_window',
    explanation:
      'Returns wellbore exploration records across the last ten years for multi-year trend analysis.',
    aiSummary:
      'Use this table for longer trend analysis, decade-scale activity changes, and broad historical comparisons across multiple years.',
    relatedTerms: ['10 years', 'recent decade', 'trend', 'historical trend'],
    useCases: [
      'Identify long-term drilling cycles and basin activity.',
      'Compare the recent decade to earlier periods.',
      'Study operator concentration and exploration success over time.',
    ],
    queryHints: ['last 10 years', 'decade trend', 'historical comparison', 'multi-year trend'],
    urlTemplate:
      'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
    source: 'Factpages public export endpoint for wellbore exploration data.',
  },
  {
    key: 'all_short',
    label: 'All – short list',
    route: 'wellbore_exploration_all_short',
    category: 'all_tables',
    explanation:
      'Returns a shorter subset of all wellbore exploration rows, useful for quick lookup and summary views.',
    aiSummary:
      'Use this table for broad but lightweight coverage when the user wants a quick scan of exploration data without the full long-list volume.',
    relatedTerms: ['all short list', 'short list', 'summary table', 'broad overview'],
    useCases: [
      'Quickly inspect a general overview of exploration records.',
      'Summarize the most relevant wells at a glance.',
      'Use as a lightweight first-pass dataset before fetching a larger table.',
    ],
    queryHints: ['short list', 'overview', 'quick scan', 'general list'],
    urlTemplate:
      'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
    source: 'Factpages public export endpoint for wellbore exploration data.',
  },
  {
    key: 'all',
    label: 'All – long list',
    route: 'wellbore_exploration_all',
    category: 'all_tables',
    explanation:
      'Returns the complete wellbore exploration dataset for the primary “all records” view used in detailed analysis.',
    aiSummary:
      'Use this table as the default dataset for broad analysis questions, drilling summaries, operator comparisons, area distributions, and full-list exports.',
    relatedTerms: ['all wells', 'long list', 'full table', 'all records', 'complete dataset'],
    useCases: [
      'Answer broad wellbore questions across the full exploration dataset.',
      'Analyze operators, status, area, or year distribution.',
      'Export comprehensive data for dashboards or detailed business analysis.',
    ],
    queryHints: ['all wells', 'full list', 'complete dataset', 'all records'],
    urlTemplate:
      'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
    source: 'Factpages public export endpoint for wellbore exploration data.',
  },
] as const;

export const FACTPAGES_TABLES = FACTPAGES_WELLBORE_TABLES;
