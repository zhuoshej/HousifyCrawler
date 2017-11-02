const ZILLOW_ATTR_MAP = {
  'region-state': 'state',
  'region-city': 'city',
  'region-zipcode': 'zipcode',
  'region-neighborhood': 'neighborhood',
  'days on zillow': 'zillowdays',
  'year built': 'built',
  'last remodel year': 'remodel',
  bed: 'beds',
  bath: 'baths'
};

const numberAttributeKeyArray = ['price', 'hoa', 'beds', 'baths', 'sqft', 'remodel', 'built', 'zillowdays', 'stories', 'saves'];
const stringAttributeKeyArray = ['state', 'city', 'zipcode', 'neighborhood', 'address', 'type', 'parking', 'view'];

exports.processData = (state, action) => {
  if (action.key === undefined || action.value === undefined) return state;
  const rawKey = action.key.trim().toLowerCase().replace(/:/g, '');
  const rawValue = action.value.trim();
  const key = ZILLOW_ATTR_MAP[rawKey] === undefined ? rawKey : ZILLOW_ATTR_MAP[rawKey];
  // if (state[key] !== undefined) return;

  if (!numberAttributeKeyArray.includes(key) && !stringAttributeKeyArray.includes(key)) { return state; }
  let value = rawValue;
  if (numberAttributeKeyArray.includes(key)) {
    value = value.replace('1 half', '.5').replace(/[^.0-9]*/g, '');
    value = parseFloat(value);
    value = Number.isNaN(value) ? 0 : value;
  }

  switch (key) {
    default:
      return Object.assign({}, state, {
        [key]: value
      });
  }
};
