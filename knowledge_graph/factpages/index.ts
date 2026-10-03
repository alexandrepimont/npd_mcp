import { FACTPAGES_WELLBORE_TABLES } from './wellbore/tables.ts';

export { FACTPAGES_WELLBORE_TABLES } from './wellbore/index.ts';
export { FACTPAGES_SECTIONS } from './definitions.ts';
export type { FactpagesTableMetadata, FactpagesSectionMetadata } from './definitions.ts';

export const FACTPAGES_TABLES = FACTPAGES_WELLBORE_TABLES;

export const FACTPAGES_TABLE_GRAPH = {
  wellbore: [...FACTPAGES_WELLBORE_TABLES],
  co2_storage: [],
  license: [],
  baa: [],
  field: [],
  discovery: [],
  company: [],
  survey: [],
  facility: [],
  tuf: [],
  stratigraphy: [],
};

export const FACTPAGES_CATEGORY_INDEX = {
  wellbore: 'knowledge_graph/factpages/wellbore',
  co2_storage: 'knowledge_graph/factpages/co2_storage',
  license: 'knowledge_graph/factpages/license',
  baa: 'knowledge_graph/factpages/baa',
  field: 'knowledge_graph/factpages/field',
  discovery: 'knowledge_graph/factpages/discovery',
  company: 'knowledge_graph/factpages/company',
  survey: 'knowledge_graph/factpages/survey',
  facility: 'knowledge_graph/factpages/facility',
  tuf: 'knowledge_graph/factpages/tuf',
  stratigraphy: 'knowledge_graph/factpages/stratigraphy',
};
