import article from './articleBySubjectAndSectionAndSlug';
import home2 from './home2';
// В этом файл формируем объект routes содержащий все кастомные роуты
// Объект routes обязательно ДОЛЖЕН
// 1) содержать роут ПО УМОЛЧАНИЮ названием которого
// соответствует ПЕРВОМУ элементу массива thingNames - из appConfig
// в НИЖНЕМ регистре,
// например, если thingNames = ['Article', 'Serivece']
// должен присутствовать роут: 'article'
// 2) содержать роут 'home' - для отображения домашней страницы приложения

const routes = {
  article,
  home2,
};

export default routes;
