import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import getSection from '../../appConfig/SideNavSections/getSection';

// В этой компоненте могут АССИНХРОННО подгружаться
// компоненты задающие отдельные секции
// (для вынесения отдельных секций в свои дополнительные чанки,
// сама асинхронная подрузка релизована в утилите getSection)
class SideNavSections extends Component {
  static propTypes = {
    authorizedSideNavSections: PropTypes.arrayOf(PropTypes.string).isRequired,
    intl: intlShape.isRequired,
    pathname: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    // this.state используется исключительно для асинхронной
    // подгрузки компонент соответствующих секциям навигации
    this.state = {};
    props.authorizedSideNavSections.forEach(sectionName => {
      this.state[sectionName] = null;
    });
  }

  componentDidMount() {
    // запускаем процесс асинхронного получения Компонент
    // предоставлюяющих отдельные нужные секции
    this.composeSections();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.authorizedSideNavSections !==
      this.props.authorizedSideNavSections
    ) {
      this.composeSections();
    }
  }

  // вспомогательная утилита для пополнения списка отображаемых секций
  composeSections() {
    // предполагается что в state хранятся только компоненты используемых секций
    const { authorizedSideNavSections } = this.props;
    // определеяем секции которые еще не подгружены
    const sectionsForAdd = authorizedSideNavSections.filter(
      sectionName => !this.state[sectionName],
    );
    sectionsForAdd.forEach(sectionName => {
      getSection(sectionName).then(Section =>
        this.setState({ [sectionName]: Section }),
      );
    });
  }

  render() {
    const {
      intl: { locale },
      pathname,
      authorizedSideNavSections,
    } = this.props;

    const onlyOneSection = authorizedSideNavSections.length === 1;
    return authorizedSideNavSections.map((sectionName, i) => {
      // Если компонента Section еще не подгружена
      // возвращает null
      const Section = this.state[sectionName];
      return (
        Section && (
          <Section
            firstSection={i === 0}
            key={sectionName}
            locale={locale}
            onlyOneSection={onlyOneSection}
            pathname={pathname}
          />
        )
      );
    });
  }
}

export default SideNavSections;
