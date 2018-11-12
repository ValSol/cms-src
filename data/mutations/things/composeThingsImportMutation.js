import Promise from 'bluebird';

import { GraphQLList } from 'graphql/type';

import { getThingConfig, locales } from '../../../appConfig';
import rbac from '../../../core/rbac';

import ExcerptInputType from '../../types/ExcerptInputType';
import { composeThingType } from '../../types';
import {
  getThingModel,
  getExcerptModel,
  getTextIndex,
} from '../../mongooseModels';
import { composeBulkWriteArgs, resolveThingsStatus } from '../../utils';

// мутация обеспечивает импорт набора things, а также соответствующих excerpts
// при этом (при необходимости) вносятся изменения во все вспомогательные
// коллекции: выборок и текстовых индексов, применительно к ним В ЦЕЛОМ
// а не только содержимого импорта
// т.е. после выполнения импорта данный things, excerpts и textIndexes ...
// будут НЕ противоречивыми, причем будут исправлены любые имеющиеся ошибки
// поэтому данною мутацию используем не только для импорта но и корректировки
// базы данных в этом случае аргументы импорта: things и excerpts НЕ указываются

const composeThingsImportMutation = thingName => {
  const input = true;
  const consideringRequired = false;
  const ThingInputType = composeThingType(
    thingName,
    input,
    consideringRequired,
  );
  const input2 = false;
  const consideringRequired2 = true;
  const ThingType = composeThingType(thingName, input2, consideringRequired2);
  const thingConfig = getThingConfig(thingName);

  // задаем возможные аргументы
  const thingArgs = {
    things: { type: new GraphQLList(ThingInputType) },
    excerpts: { type: new GraphQLList(ExcerptInputType) },
  };

  const importThings = {
    type: new GraphQLList(ThingType),
    description: 'Import one or more new Things',
    args: thingArgs,

    async resolve(parentValue, args) {
      const { request: { user, serverSideRendering } } = parentValue;
      // если у пользователя нет прав на импорт thing - выходим
      // если user.role = 'root' и 'user-agent' начинается с 'node-fetch/' ...
      // ... то в любом случае НЕ выходим, т.к. в этом случае ...
      // ... запрос осуществляется сугубо на сервере при помощи node-fetch
      if (!serverSideRendering && !rbac.can(`${thingName}:import`, { user })) {
        return null;
      }

      const { excerpts, things } = args;

      const {
        things: argsForThings,
        excerpts: argsForExcerpts,
        textIndexes: argsForTextIndexes,
        backLinks: argsForBackLinks,
        newAndUpdatedThings,
      } = await resolveThingsStatus(thingConfig, things, excerpts);

      // производим пакетную загрузку всех things
      const promises3 = [];

      const bulkArgsForThings = composeBulkWriteArgs(argsForThings);
      if (bulkArgsForThings.length) {
        const Thing = await getThingModel(thingName);
        await Thing.bulkWrite(bulkArgsForThings);
      }

      // пополняем  вспомогательные коллекции:
      // 1) коллекцию выборок; 2) коллекции текстовых индексов для каждой локали
      const bulkArgsForExcerpts = composeBulkWriteArgs(argsForExcerpts);
      if (bulkArgsForExcerpts.length) {
        const Excerpt = await getExcerptModel(thingName);
        promises3.push(Excerpt.bulkWrite(bulkArgsForExcerpts));
      }

      // подготавливаем создание документов во вспомогательных коллекциях
      // которые содержат индексы по каждому из языков
      const promises = locales.map(locale => getTextIndex(thingName, locale));
      const TextIndexes = await Promise.all(promises);
      locales.forEach((locale, i) => {
        // формируем массив с документами содержащими индексы в коллекции
        const bulkArgsForTextIndex = composeBulkWriteArgs(
          argsForTextIndexes[locale],
        );
        if (bulkArgsForTextIndex.length) {
          // получаем очередную коллекцию
          const TextIndex = TextIndexes[i];
          promises3.push(TextIndex.bulkWrite(bulkArgsForTextIndex));
        }
      });

      // подготавливаем обновление backLinks
      if (argsForBackLinks) {
        // будем работать только к теми коллекциям в которых надо изменить backLinks
        const thingNames = Object.keys(argsForBackLinks).filter(
          key => argsForBackLinks[key].length,
        );
        const promises2 = thingNames.map(name => getThingModel(name));
        const Things = await Promise.all(promises2);

        thingNames.forEach((name, i) => {
          const bulkArgsForBackLinks = composeBulkWriteArgs({
            insert: [],
            update: argsForBackLinks[name],
            remove: [],
          });
          promises3.push(Things[i].bulkWrite(bulkArgsForBackLinks));
        });
      }

      // запускаем одновременно запросы по всем вспомогательным коллекциям
      await Promise.all(promises3);
      return newAndUpdatedThings;
    },
  };
  return importThings;
};

export default composeThingsImportMutation;
