import { getThingConfig, thingNames } from '../index';
import ContentSideNavSection from './ContentSideNavSection';

const getSection = async sectionName => {
  // функция для получения компоненты соответствующей sectionName
  // с АСИНХРОННОЙ подгрузкой чанков

  // для начала проверяем не является ли секция автоматически создаваемой для
  // любого из thingNames
  // служебные секции именуются также как и сответствующие thing,
  // тнапример, если thing = 'Article' то и Section = 'Article'
  if (thingNames.includes(sectionName)) {
    const conposeSection = await require.ensure(
      [],
      require =>
        require('../../components/SideNav/composeThingSideNavSection').default,
      'admin',
    );
    const thingConfig = getThingConfig(sectionName);
    return conposeSection(thingConfig);
  }

  let Section;
  switch (sectionName) {
    case 'ContentSideNavSection':
      Section = ContentSideNavSection;
      return Section;
    case 'AllContentSideNavSection':
      Section = await require.ensure(
        [],
        require => require('./AllContentSideNavSection').default,
        'admin',
      );
      return Section;
    default:
      throw new TypeError(`Uknown name "${sectionName}" of sideNav section!`);
  }
};

export default getSection;
