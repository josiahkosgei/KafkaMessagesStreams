var avro = require('avsc');
const reviewsSchema = avro.Type.forSchema({
  type: 'record',
  fields: [
    {name: 'business_id',type: 'string'},
    {name: 'msg',type: 'string'},
    {name: 'rating',type: 'double'},
    {name: 'reviewsources',type: {type: 'enum',symbols: [  'Facebook', 'Amazon', 'Kudobuzz']}},
    {name: 'reviewtype',type: {type: 'enum',symbols: ['Product', 'Site']}}
  ]
});

// 
module.exports  =reviewsSchema