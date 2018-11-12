import rbac from '../../core/rbac';

// -----------------------------------------------------
// ВАЖНЫЙ обект указывающий "операции" аутентификации для всех
// секций требующих аутентификации
const sectionsRbacOperations = {
  Article: 'Article:update',
};
// -----------------------------------------------------

// функция отфильтровывает секции в зависимость от пользователя
const authorizeSideNavSections = (sideNavSections, user) =>
  sideNavSections.filter(
    sectionName =>
      !sectionsRbacOperations[sectionName] ||
      rbac.can(sectionsRbacOperations[sectionName], { user }),
  );

export default authorizeSideNavSections;
