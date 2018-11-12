import { defineMessages } from 'react-intl';
// используются как messages полученные из getThingConfig(thingName)
// для thingName = 'Feature'

export default defineMessages({
  NewFeature: {
    id: 'Feature.NewFeature',
    defaultMessage: 'Новое свойство',
  },
  AddNewFeature: {
    id: 'Feature.AddNewFeature',
    defaultMessage: 'Добавить новое свойство',
  },
  RemoveFeature: {
    id: 'Feature.RemoveFeature',
    defaultMessage: 'Удалить свойство',
  },
});
