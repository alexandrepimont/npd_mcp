import type { FactpagesSectionMetadata } from '../definitions.ts';
import { FACTPAGES_WELLBORE_TABLES } from './tables.ts';

export { FACTPAGES_TABLES, FACTPAGES_WELLBORE_TABLES } from './tables.ts';

export const WELLBORE_FACTPAGES_SECTION: FactpagesSectionMetadata = {
  slug: 'wellbore',
  label: 'Wellbore',
  description: 'Wellbore exploration tables and drilling summaries.',
  aiPurpose:
    'Use for drilling activity, operator, status, main area, and timing questions across the public wellbore exploration dataset.',
  status: 'implemented',
  groups: [
    {
      slug: 'attributes',
      label: 'Attributes',
      description: 'Core wellbore metadata fields such as well name, status, operator, and area.',
      aiPurpose:
        'Use this group to inspect the essential identifiers and descriptive metadata of each wellbore record.',
      tables: [
        {
          key: 'attributes',
          label: 'Attributes',
          route: 'wellbore_exploration_attributes',
          category: 'all_tables',
          explanation: 'A metadata-focused view listing the main descriptive attributes of wellbores.',
          aiSummary:
            'Use this view to inspect well identity, operator, area, and status metadata before deeper analysis.',
          relatedTerms: ['attributes', 'metadata', 'well data', 'wellbore identifiers'],
          useCases: ['Inspect the main metadata fields for each wellbore.', 'Understand the schema used in the exploration dataset.'],
          queryHints: ['attributes', 'metadata', 'well name', 'status'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages wellbore public export endpoint.',
        },
      ],
    },
    {
      slug: 'table_view',
      label: 'Table view',
      description: 'Tabular exploration views with year-based and all-record summaries.',
      aiPurpose:
        'Use this group for table-oriented queries across current year, last year, recent decades, and the full long list.',
      tables: [
        {
          key: 'current_year',
          label: 'Current year',
          route: 'wellbore_exploration_current_year',
          category: 'time_window',
          explanation: 'Returns the most recent wellbore exploration records for the current reporting year.',
          aiSummary: 'Use this table for current-year drilling trends and recent development activity.',
          relatedTerms: ['current year', 'latest year', 'this year', 'recent drilling'],
          useCases: ['Latest drilling snapshots.', 'Current-year drilling status analyses.'],
          queryHints: ['current year', 'latest drilling', 'this year'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages wellbore public export endpoint.',
        },
        {
          key: 'last_year',
          label: 'Last year',
          route: 'wellbore_exploration_last_year',
          category: 'time_window',
          explanation: 'Returns the wellbore exploration records published for the previous calendar year.',
          aiSummary: 'Use this table to review prior-year drilling and annual trend changes.',
          relatedTerms: ['previous year', 'last year', 'annual comparison'],
          useCases: ['Previous-year comparisons.', 'Annual licensing or status summaries.'],
          queryHints: ['last year', 'previous year', 'annual comparison'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages wellbore public export endpoint.',
        },
        {
          key: 'last_10_years',
          label: 'Last 10 years',
          route: 'wellbore_exploration_last_10_years',
          category: 'time_window',
          explanation: 'Returns wellbore exploration records across the last ten years for multi-year analysis.',
          aiSummary: 'Use this table to study multi-year drilling trends and historical patterns.',
          relatedTerms: ['last 10 years', 'recent decade', 'historical trend', 'multi-year'],
          useCases: ['Long-term activity trend detection.', 'Multi-year operator and basin comparisons.'],
          queryHints: ['last 10 years', 'decade trend', 'historical comparison'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages wellbore public export endpoint.',
        },
        {
          key: 'all_short',
          label: 'All – short list',
          route: 'wellbore_exploration_all_short',
          category: 'all_tables',
          explanation: 'Returns a shorter subset of the wellbore exploration dataset for quick overview work.',
          aiSummary: 'Use this table for quick scans and first-pass summaries before drilling into the full list.',
          relatedTerms: ['short list', 'overview', 'summary view'],
          useCases: ['Quick overview of wells.', 'Fast summaries before full analysis.'],
          queryHints: ['short list', 'overview', 'quick scan'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages wellbore public export endpoint.',
        },
        {
          key: 'all',
          label: 'All – long list',
          route: 'wellbore_exploration_all',
          category: 'all_tables',
          explanation: 'Returns the complete wellbore exploration dataset used for detailed analysis.',
          aiSummary: 'Use this as the default table for broad analysis of operators, status, area, and drilling history.',
          relatedTerms: ['all wells', 'long list', 'full dataset', 'complete list'],
          useCases: ['Full dataset analysis.', 'Operator, area, and status distributions.'],
          queryHints: ['all wells', 'full list', 'complete dataset'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages wellbore public export endpoint.',
        },
      ],
    },
  ],
  tables: FACTPAGES_WELLBORE_TABLES,
};
