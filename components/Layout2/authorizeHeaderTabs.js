import rbac from '../../core/rbac';

// функция отфильтровывает секции в зависимость от пользователя
const authorizeHeaderTabs = (sideNavSections, user) =>
  sideNavSections.filter(
    sectionName => !sectionName[2] || rbac.can(sectionName[1], { user }),
  );

export default authorizeHeaderTabs;
