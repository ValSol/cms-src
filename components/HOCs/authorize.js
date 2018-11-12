/* HOC High Order Component - обеспечивающий редирект в корень ...
   ... если компонента не аутентифицирована,
   реагирует на смену пользователя в localStorage
   то есть делает logout для всех открытых вкладок в браузере
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { goToAbsolutePath } from '../../core/utils';
import history from '../../history';
import rbac from '../../core/rbac';
import { signout as signoutAction } from '../../actions/auth';

export default function(ComposedComponent, operationSufix) {
  // вспомогательная утилита для редиректа
  // если пользователь неавторизован
  const redirectIfNotAuthorized = props => {
    const { signout, thingName, user } = props;

    if (!rbac.can(`${thingName}:${operationSufix}`, { user })) {
      const { pathname } = history.location;
      signout({ nextPath: pathname });
      goToAbsolutePath('', true);
    }
  };

  class Authorize extends Component {
    static propTypes = {
      nextPath: PropTypes.string, // eslint-disable-line react/require-default-props
      signout: PropTypes.func.isRequired,
      // eslint-disable-next-line react/require-default-props
      user: PropTypes.objectOf(PropTypes.string),
    };

    constructor(props) {
      super(props);
      redirectIfNotAuthorized(props);
    }

    // eslint-disable-next-line camelcase, class-methods-use-this
    UNSAFE_componentWillUpdate(nextProps) {
      redirectIfNotAuthorized(nextProps);
    }

    render() {
      // убираем user и signout из props
      // передаваемых в нижележащую компоненту
      // eslint-disable-next-line no-unused-vars
      const { user, signout, ...rest } = this.props;
      return <ComposedComponent {...rest} />;
    }
  }
  function mapStateToProps({
    auth: { user, nextPath },
    runtime: { thingName },
  }) {
    return { user, nextPath, thingName };
  }
  const mapDispatchToProps = dispatch => ({
    signout: nextPath => dispatch(signoutAction(nextPath)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Authorize);
}
