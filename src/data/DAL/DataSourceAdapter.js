/**
 * DataSourceAdapter.js
 *
 * This is an adapter that generates a Wijmo CollectionView which groups elements hierarchically
 * based on their 'type' property. The CollectionView can be passed to the Sunburst chart directly
 * as an acceptable data source.
 *
 */

/* Define JSDoc callback types */

/**
 * Called when the chart data source is finished loading
 *
 * @callback dataSourceLoadedCallback
 * @param {array} dataArray an array of Group objects containing SubGroups which contain
 * Elements that can be directly loaded into the Sunburst chart
 */

// Pull in JSON data loader dependency
const JsonDataLoader = require('../../util/JsonDataLoader');

const DataSourceAdapter = function _DataSourceAdapter() {};

// The file path for the element JSON data
const ELEMENT_DATA_FILE_PATH = 'data/elements.json';

// Arrays named by "Group" containing all of the possible "Subgroup" types
const METAL_TYPES = 'Alkali Metal|Alkaline Earth Metal|Transition Metal|Lanthanide|Actinide|Metal'.split('|');
const NON_METAL_TYPES = 'Noble Gas|Halogen|Nonmetal'.split('|');

// Separate out the titles that will be on the chart as constants so that they can be
// easily changed as options later
const METALS_TITLE = 'Metals';
const NON_METALS_TITLE = 'Nonmetals';
const OTHERS_TITLE = 'Others';

/**
 * Loads the data to display in the Sunburst chart and formats it for delivery
 *
 * @param {dataSourceLoadedCallback} callback
 */
DataSourceAdapter.prototype.getChartDataSource = function _getChartDataSource(callback) {
  JsonDataLoader.getObjectFromJson(ELEMENT_DATA_FILE_PATH, (rawElementData) => {
    // Flatten the resulting raw element data array by removing the ID and "un-nesting" the
    // properties object
    const elementData = rawElementData['periodic-table-elements'].map((item) => {
      const newItem = item;
      newItem.properties.value = 1;
      return newItem.properties;
    });

    // initialize a new object from the Wijmo CollectionView function using our "cleansed" array
    const elementCv = new wijmo.collections.CollectionView(elementData);

    // Do the first tier of grouping
    // We'll take advantage of the wijmo.collections.PropertyGroupDescription object to sort
    // elements in the collection view based on which constant array contains their type
    elementCv.groupDescriptions.push(new wijmo.collections.PropertyGroupDescription('type', (item, prop) => {
      if (METAL_TYPES.includes(item[prop])) {
        return METALS_TITLE;
      } else if (NON_METAL_TYPES.includes(item[prop])) {
        return NON_METALS_TITLE;
      }
      return OTHERS_TITLE;
    }));

    // Do the second tier of grouping
    // The only consideration we have to make here is that we don't want to duplicate group names.
    // So if we find another "Metal" or "Nonmetal", we need to prefix it with "Other." Finally, we
    // just want to go ahead and add the appropriate plural ending to make things sound more natural
    elementCv.groupDescriptions.push(new wijmo.collections.PropertyGroupDescription('type',
    (item, prop) => {
      if (item[prop] === METAL_TYPES[METAL_TYPES.length - 1]
        || item[prop] === NON_METAL_TYPES[NON_METAL_TYPES.length - 1]) {
        return `Other ${item[prop]}${item[prop].endsWith('s') ? 'es' : 's'}`;
      }
      return item[prop] + (item[prop].endsWith('s') ? 'es' : 's');
    }));

    // Descriptions of the different subcategories ordered by the type lists above
    // The metal and nonmetal descriptions have one extra item for the "Others" category
    const METAL_DESCRIPTIONS = 'Shiny,Soft,Highly Reactive,Low Melting Point|Ductile,Malleable,Low Density,High Melting Point|Brittle,Poor Metals,Low Melting Point|High Melting Point,High Density|Soluble,Highly Reactive|Radioactive,Paramagnetic'.split('|');
    const NON_METAL_DESCRIPTIONS = 'Volatile,Low Elasticity,Good Insulators|Colorless,Odorless,Low Chemical Reactivity|Toxic,Highly Reactive,Poor Conductors'.split('|');
    const OTHER_DESCRIPTIONS = 'Metallic looking solids,Semiconductors|Radioactive,Synthetic Elements'.split('|');
    // create an array containing all of the element description arrays
    const DESCRIPTION_COLLECTION = [NON_METAL_DESCRIPTIONS, METAL_DESCRIPTIONS, OTHER_DESCRIPTIONS];

    // Assign a new object property to each "subgroup" Object in the CollectionView based on the
    // arrays above. This property will be stored in the CollectionView items and can be recalled
    // later for display on the chart.
    for (let i = 0; i < elementCv.groups.length; i += 1) {
      for (let j = 0; j < elementCv.groups[i].groups.length; j += 1) {
        elementCv.groups[i].groups[j].elementProperties = DESCRIPTION_COLLECTION[i][j];
      }
    }

    callback(elementCv);
  });
};

module.exports = new DataSourceAdapter();
