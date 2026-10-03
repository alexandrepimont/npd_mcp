export type FactpagesTableMetadata = {
  key: string;
  label: string;
  route: string;
  category: 'time_window' | 'all_tables';
  explanation: string;
  aiSummary: string;
  relatedTerms: readonly string[];
  useCases: readonly string[];
  queryHints: readonly string[];
  urlTemplate: string;
  source: string;
};

export type FactpagesGroupMetadata = {
  slug: string;
  label: string;
  description: string;
  aiPurpose: string;
  tables: readonly FactpagesTableMetadata[];
};

export type FactpagesSectionMetadata = {
  slug: string;
  label: string;
  description: string;
  aiPurpose: string;
  status: 'implemented' | 'planned';
  groups: readonly FactpagesGroupMetadata[];
  tables: readonly FactpagesTableMetadata[];
};

export function flattenFactpagesSectionTables(section: FactpagesSectionMetadata): FactpagesTableMetadata[] {
  return [...section.tables, ...section.groups.flatMap((group) => group.tables)];
}

export const FACTPAGES_SECTIONS: FactpagesSectionMetadata[] = [
  {
    slug: 'wellbore',
    label: 'Wellbore',
    description: 'Wellbore exploration tables and current drilling summaries.',
    aiPurpose:
      'Use for drilling activity, operator, status, main area, and timing questions across the public wellbore exploration dataset.',
    status: 'implemented',
    groups: [],
    tables: [],
  },
  {
    slug: 'co2_storage',
    label: 'CO2 storage',
    description: 'Carbon storage-related Factpages tables.',
    aiPurpose: 'Use for carbon storage facilities and site-specific storage analysis when those tables are added.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'license',
    label: 'Licence',
    description: 'Licensing and permit-related Factpages tables.',
    aiPurpose: 'Use for licensing questions and permit status analysis when those datasets are mapped.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'baa',
    label: 'BAA',
    description: 'Block award area and related administrative datasets.',
    aiPurpose: 'Use for award and bidding context when BAA tables are added to the knowledge graph.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'field',
    label: 'Field',
    description: 'Field-level tables and summaries.',
    aiPurpose: 'Use for field-level analysis and field development context.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'discovery',
    label: 'Discovery',
    description: 'Discovery-related tables and results.',
    aiPurpose: 'Use for discovered resources and discoveries context.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'company',
    label: 'Company',
    description: 'Company and operator tables.',
    aiPurpose: 'Use for company and operator analysis when company tables are mapped.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'survey',
    label: 'Survey',
    description: 'Survey and geological activity tables.',
    aiPurpose: 'Use for seismic or survey-related analysis when mapped.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'facility',
    label: 'Facility',
    description: 'Facilities and infrastructure tables.',
    aiPurpose: 'Use for facility context and infrastructure-related analysis.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'tuf',
    label: 'TUF',
    description: 'TUF-related Factpages tables.',
    aiPurpose: 'Use for TUF-specific data analysis as tables are added.',
    status: 'planned',
    groups: [],
    tables: [],
  },
  {
    slug: 'stratigraphy',
    label: 'Stratigraphy',
    description: 'Stratigraphic and geological layer tables.',
    aiPurpose: 'Use for stratigraphic analysis and geological interpretation.',
    status: 'planned',
    groups: [],
    tables: [],
  },
];
