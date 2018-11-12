/* HOC High Order Component - обеспечивающий null вместое компоненты ...
   ... если компонента не аутентифицирована,
   реагирует на смену пользователя в localStorage
   то есть прячет компоненту для всех открытых вкладок в браузере
 */

// НЕ используется !!!
// если использовать то operation НУЖНО заменить на operationPrefix

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import rbac from '../../core/rbac';
import { setUser as setUserAction } from '../../actions/auth';
import { loadState } from '../../core/utils';

export default function(ComposedComponent, operation) {
  class AuthorizeOrNull extends Component {
    static propTypes = {
      setUser: PropTypes.func.isRequired,
      user: PropTypes.objectOf(PropTypes.string),
    };

    static defaultProps = {
      user: null,
    };

    constructor(props) {
      super(props);
      this.handleLocaStorage = this.handleLocaStorage.bind(this);
    }

    componentDidMount() {
      if (process.env.BROWSER) {
        window.addEventListener('storage', this.handleLocaStorage);
      }
    }

    componentWillUnmount() {
      if (process.env.BROWSER) {
        window.removeEventListener('storage', this.handleLocaStorage);
      }
    }

    handleLocaStorage() {
      const persistUser = loadState('user');
      const { user, setUser } = this.props;

      if (
        (user && persistUser && user._id !== persistUser._id) || // eslint-disable-line no-underscore-dangle
        (!user && persistUser) ||
        (user && !persistUser)
      ) {
        setUser({ user: persistUser });
      }
    }

    render() {
      // убираем user из props
      // передаваемых в нижележащую компоненту
      const { user, ...rest } = this.props;
      // авторизируем пользователя
      const authorized = rbac.can(operation, { user });
      // если пользователь не авторизован просто
      // НЕ отображаем компоненту
      if (!authorized) return null;
      // в противном случае - отображаем компоненту
      return <ComposedComponent {...rest} />;
    }
  }
  const mapStateToProps = ({ auth: { user } }) => ({ user });
  const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setUserAction(user)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(AuthorizeOrNull);
}
