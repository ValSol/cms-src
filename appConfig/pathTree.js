// именованные параметры такие как (:subject, :section)
// могут принимать только следующие значения: ([A-Za-z0-9_]

// каждому роуту форм из следующих 3:
// articleUpdateRoute, articleDeleteRoute, articleRecoverRoute
// должен соотвтетствавать роут articlePreviewRoute
// роут articleRichTextRoute - дополнятеся тем же articlePreviewRoute что и articleUpdateRoute

export default `search(articleSearchRoute)
admin
  articles(articleListRoute, articleUpdateRoute, articleRichTextRoute)
    preview(articlePreviewRoute)
    backlinks(articleBackLinksRoute)
    deleted(articleRecoverRoute)
      preview(articlePreviewRoute)
    new(articleAddRoute)
    delete(articleDeleteRoute)
      preview(articlePreviewRoute)
    search(articleSearchFormsRoute)
    export(articleExportRoute)
    import(articleImportRoute)
    status(articleDBStatusRoute)
  services(serviceListRoute, serviceUpdateRoute, serviceRichTextRoute)
    preview(servicePreviewRoute)
    backlinks(serviceBackLinksRoute)
    deleted(serviceRecoverRoute)
      preview(servicePreviewRoute)
    new(serviceAddRoute)
    delete(serviceDeleteRoute)
      preview(servicePreviewRoute)
    search(serviceSearchFormsRoute)
    export(serviceExportRoute)
    import(serviceImportRoute)
    status(serviceDBStatusRoute)
signin(signIn)
signup(signUp)
signout(signOut)
nojs(noJs) // на эту страницу происходит редирект если не включен js в браузере
// ниже пути контента
:subject
  :section
  price
`;
