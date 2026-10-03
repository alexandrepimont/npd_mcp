import type { FactpagesSectionMetadata } from '../definitions.ts';

export const BAA_FACTPAGES_SECTION: FactpagesSectionMetadata = {
  slug: 'baa',
  label: 'BAA',
  description: 'Block award area datasets and their table views.',
  aiPurpose:
    'Use this section for award-area context, licensing relationships, and overview-style BAA analysis across the Factpages site.',
  status: 'planned',
  groups: [
    {
      slug: 'attributes',
      label: 'Attributes',
      description: 'Core properties and metadata for each BAA record.',
      aiPurpose: 'Use this group to understand the main identifiers, metadata, and award attributes for each BAA record.',
      tables: [
        {
          key: 'attributes',
          label: 'Attributes',
          route: 'baa_attributes',
          category: 'all_tables',
          explanation: 'The core attribute view for BAA records, showing the main metadata fields for each block award area.',
          aiSummary:
            'Use this table to inspect the fundamental metadata behind each BAA record before drilling into award or license detail.',
          relatedTerms: ['attributes', 'award area metadata', 'BAA attributes', 'basic fields'],
          useCases: ['Inspect core BAA metadata.', 'Understand the key fields attached to each award area.'],
          queryHints: ['attributes', 'metadata', 'award details', 'BAA fields'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages BAA public export endpoint.',
        },
      ],
    },
    {
      slug: 'table_view',
      label: 'Table view',
      description: 'List-style BAA views including overview, licensees, and related results.',
      aiPurpose:
        'Use this group for overview and comparison-style BAA questions, especially around participants, licenses, and award areas.',
      tables: [
        {
          key: 'overview',
          label: 'Overview',
          route: 'baa_overview',
          category: 'all_tables',
          explanation: 'The high-level overview table for BAA records, summarizing the main award-area information.',
          aiSummary:
            'Use this table to get a first-pass overview of BAA records before exploring licensees and related agreements.',
          relatedTerms: ['overview', 'BAA summary', 'award overview', 'high level'],
          useCases: ['Get a quick overview of BAA records.', 'Review high-level award-area summaries.'],
          queryHints: ['overview', 'summary', 'BAA list', 'high level'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages BAA public export endpoint.',
        },
        {
          key: 'licensees',
          label: 'Licensees',
          route: 'baa_licensees',
          category: 'all_tables',
          explanation: 'A BAA table focusing on the companies or entities participating in the award area or related license portfolio.',
          aiSummary:
            'Use this view when the user needs to know which companies, partners, or licensees are associated with a BAA.',
          relatedTerms: ['licensees', 'participants', 'companies', 'awarded parties'],
          useCases: ['Who is involved in a BAA?', 'Map the participants associated with a specific award area.'],
          queryHints: ['licensees', 'participants', 'companies', 'awarded parties'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages BAA public export endpoint.',
        },
        {
          key: 'licenses',
          label: 'Licenses',
          route: 'baa_licenses',
          category: 'all_tables',
          explanation: 'Shows the related licensing context and award-related license records behind the BAA.',
          aiSummary:
            'Use this view when the user asks about the specific licenses tied to an award area or block award context.',
          relatedTerms: ['licenses', 'licensing context', 'award licenses', 'related license records'],
          useCases: ['Trace the licenses connected to a BAA.', 'Understand the legal or operating framework behind a BAA.'],
          queryHints: ['licenses', 'licensing context', 'award license', 'related licenses'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages BAA public export endpoint.',
        },
        {
          key: 'areas',
          label: 'Areas',
          route: 'baa_areas',
          category: 'all_tables',
          explanation: 'Lists the geographical or area definitions associated with each BAA record.',
          aiSummary:
            'Use this table when the question is about geographic scope, mapped areas, or the spatial extent of a BAA.',
          relatedTerms: ['areas', 'geography', 'award area boundaries', 'region'],
          useCases: ['Understand area coverage.', 'Map BAA locations to geographic regions.'],
          queryHints: ['areas', 'geography', 'spatial extent', 'award area'],
          urlTemplate:
            'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
          source: 'Factpages BAA public export endpoint.',
        },
      ],
    },
  ],
  tables: [
    {
      key: 'baa_overview',
      label: 'Overview',
      route: 'baa_overview',
      category: 'all_tables',
      explanation: 'The default BAA overview dataset used for a high-level view of award areas.',
      aiSummary: 'Use this as the default BAA record list when the user asks for general award-area information.',
      relatedTerms: ['overview', 'BAA', 'award area'],
      useCases: ['Quick overview of BAAs.', 'High-level BAA analysis.'],
      queryHints: ['overview', 'summary', 'BAA list'],
      urlTemplate:
        'https://factpages.sodir.no/public?/Factpages/external/tableview/{route}&rs:Command=Render&rc:Toolbar=false&rc:Parameters=f&IpAddress=not_used&CultureCode={culture}&rs:Format=CSV&Top100=false',
      source: 'Factpages BAA public export endpoint.',
    },
  ],
};
