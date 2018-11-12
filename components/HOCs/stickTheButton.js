/* HOC High Order Component - 1) приклеивает внизу списка плавающую кнопку
которая не наезжает на футер, 2) обеспечивает анимацию при нажатии этой кнопки */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { typography } from 'material-ui/styles';

import { goToAbsolutePath } from '../../core/utils';
import { paperPadding, buttonBottomShift } from '../../appConfig';
import { getPathForRoute } from '../../routes/routesUtils';

const styleFromDomElement = (element, padding) => {
  // утилитка для упрощения определения и установки CSS пораметров
  // для анимирования кнопки,
  // берет местрорасположение и размеры dom-элемента element
  // и возвращается словарь соответствующих css параметров,
  // расширив элемент во все строны на величину padding, если padding установлен
  const delta = padding ? paperPadding : 0;
  const { top, left, width, height } = element.getBoundingClientRect();
  return {
    top: `${top - delta}px`,
    left: `${left - delta}px`,
    width: `${width + 2 * delta}px`,
    height: `${height + 2 * delta}px`,
  };
};

export default function(
  ComposedComponent,
  StickedComponent,
  { actionRouteNamePrefix, Icon, idPrefix, onPressButton, secondaryColor },
) {
  class Container extends Component {
    static propTypes = {
      thingConfig: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.array,
          PropTypes.func,
          PropTypes.object,
          PropTypes.string,
        ]),
      ).isRequired,
      mediaType: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    };

    constructor(props) {
      super(props);
      // перенес styles из тела модуля внутрь функции, чтобы не выдавало ошибку:
      // TypeError: Cannot assign to read only property 'right' of object '#<Object>'
      // задается только часть значений стилей, остальное
      // в методе component DidMount, когда получим радиус кнопки
      this.style = {
        invisible: {
          visibility: 'hidden',
        },
        fixed: {
          bottom: `${buttonBottomShift}px`,
          position: 'fixed',
        },
        absoluteSmall: {
          position: 'absolute',
        },
        absolute: {
          position: 'absolute',
        },
      };
      this.state = {
        buttonStyle: this.style.invisible,
      };
      this.scrollHandler = this.scrollHandler.bind(this);
      this.onPressButton = this.onPressButton.bind(this);
    }

    componentDidMount() {
      // устанавливаем обработчики глобальных событий
      if (process.env.BROWSER) {
        window.addEventListener('scroll', this.scrollHandler);
        window.addEventListener('resize', this.scrollHandler);
      }
      // устанавливаем первоначальные значения для размещения кнопки
      const containerBottom = this.containerDiv.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      const isSmall =
        this.props.mediaType === 'small' ||
        this.props.mediaType === 'extraSmall';
      // узнаем размеры (диаметр) кнопки (кнопка ведь круглая)
      // (закомментировал т.к. когда кнопка скрыта радиус не определялся)
      // this.buttonRadius = this.stickedDiv.getBoundingClientRect().height / 2;
      this.buttonRadius = 28;
      // задаем значения стилей соотвтетсвующие положению кнопки
      this.style.fixed.right = `${paperPadding - this.buttonRadius}px`;
      this.style.absoluteSmall.right = `-${this.buttonRadius}px`;
      this.style.absoluteSmall.bottom = `-${this.buttonRadius}px`;
      this.style.absolute.right = `-${this.buttonRadius + paperPadding}px`;
      this.style.absolute.bottom = `-${this.buttonRadius + paperPadding}px`;
      // определяем порог при которм переходим от абсолютного к фиксированному...
      // ...позициронированию и наоборот
      const threshold = isSmall
        ? buttonBottomShift + this.buttonRadius
        : buttonBottomShift + this.buttonRadius + paperPadding;
      if (windowHeight - containerBottom > threshold) {
        if (isSmall) {
          this.currentStyle = 'absoluteSmall';
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({ buttonStyle: this.style.absoluteSmall });
        } else {
          this.currentStyle = 'absolute';
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({ buttonStyle: this.style.absolute });
        }
      } else {
        this.currentStyle = 'fixed';
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ buttonStyle: this.style.fixed });
      }
    }

    componentWillUnmount() {
      if (process.env.BROWSER) {
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('resize', this.scrollHandler);
      }
    }

    onPressButton() {
      if (onPressButton) {
        // если передается функция onPressButton анимация для смены экрана
        // не применяется все необходимые действия должны быть реализованы
        // внути onPressButton
        onPressButton(this.props);
        return;
      }

      // вызывается для отработки нажатия кнопки и обеспечивает анимацию
      const startButtonStyle = {
        ...styleFromDomElement(this.stickedDiv),
        position: 'fixed',
        border: '3px solid grey',
        backgroundColor: typography.textFullWhite,
        zIndex: 10,
      };
      const endButtonStyle = {
        ...styleFromDomElement(this.containerDiv, paperPadding),
        position: 'fixed',
        border: '1px solid lightGrey',
        backgroundColor: typography.textFullWhite,
        zIndex: 10,
        transition: 'all 0.45s ease-in-out',
      };
      const { thingConfig: { thingName }, pathname, query } = this.props;
      // опеределяем ближайший absolutePath
      // который использует роут, например, с именем: actionRouteNamePrefix
      const absolutePath = getPathForRoute(
        pathname,
        `${thingName.toLowerCase()}${actionRouteNamePrefix}`,
      );

      // to do: для случая когда предполагается переход по адресу в котом ...
      // требуется запрос дополнительных данный, можно инициировать этот
      // запрос здесь, перед началом анимации и по окончанию анимации
      // сразу же / или с задержкой воспользоваться результатом запроса !!!!!
      this.setState({ buttonStyle: startButtonStyle }, () =>
        this.setState({ buttonStyle: endButtonStyle }, () =>
          setTimeout(() => {
            goToAbsolutePath(absolutePath, false, query);
          }, 500),
        ),
      );
    }

    scrollHandler() {
      const containerBottom = this.containerDiv.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      const isSmall =
        this.props.mediaType === 'small' ||
        this.props.mediaType === 'extraSmall';

      const threshold = isSmall
        ? buttonBottomShift + this.buttonRadius
        : buttonBottomShift + this.buttonRadius + paperPadding;
      if (windowHeight - containerBottom > threshold) {
        if (isSmall && this.currentStyle !== 'absoluteSmall') {
          this.currentStyle = 'absoluteSmall';
          this.setState({ buttonStyle: this.style.absoluteSmall });
        } else if (!isSmall && this.currentStyle !== 'absolute') {
          this.currentStyle = 'absolute';
          this.setState({ buttonStyle: this.style.absolute });
        }
      } else if (this.currentStyle !== 'fixed') {
        this.currentStyle = 'fixed';
        this.setState({ buttonStyle: this.style.fixed });
      }
    }

    render() {
      const { thingConfig: { thingName } } = this.props;
      const actionRouteName = `${thingName.toLowerCase()}${actionRouteNamePrefix}`;

      return (
        <div
          ref={div => {
            this.containerDiv = div;
          }}
          style={{ position: 'relative' }}
        >
          <ComposedComponent {...this.props} />
          <div
            ref={div => {
              this.stickedDiv = div;
            }}
            style={this.state.buttonStyle}
          >
            <StickedComponent
              id={`${thingName}${idPrefix}`}
              Icon={Icon}
              actionRouteName={actionRouteName}
              onPressHideButton={!onPressButton}
              onPressButton={this.onPressButton}
              secondaryColor={secondaryColor}
            />
          </div>
        </div>
      );
    }
  }

  const mapStateToProps = ({
    browser: { mediaType },
    runtime: { query, pathname },
  }) => ({
    mediaType,
    pathname,
    query,
  });

  return connect(mapStateToProps)(Container);
}
