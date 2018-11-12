import gql from 'graphql-tag';

// используем чтобы обновлять в кеше backLinks для things
// на которые поставлены / убраны ссылки
// ВНИМАНИЕ! в качестве аргумента используем thingName, a не thingConfig!
/*
fragment myArticle on ArticleType {
    _id
}
*/

const composeFragmentOnThingType = thingName =>
  gql`fragment myArticle on ${thingName}Type {
  _id
  backLinks {
    item
    itemThingName
  }
}`;

export default composeFragmentOnThingType;
