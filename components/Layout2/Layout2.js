import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Paper from 'material-ui/Paper';
import { spacing } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';

import s from './Layout2.css';
import { loadState } from '../../core/utils';
import history from '../../history';
import Header2 from '../Header2';
import SideNav from '../SideNav';
import Footer2 from '../Footer2';
import { paperPadding, sideNavWidth } from '../../appConfig';
import authorizeSideNavSections from '../../appConfig/SideNavSections/authorizeSideNavSections';
import { setUser as setUserAction } from '../../actions/auth';
import { setRuntimeVariable } from '../../actions/runtime';
import authorizeHeaderTabs from './authorizeHeaderTabs';
import coreMessages from '../../core/coreMessages';

export class preLayout2 extends React.Component {
  static propTypes = {
    alertDialogHref: PropTypes.string,
    alertDialogOpen: PropTypes.bool,
    headerTabs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    children: PropTypes.node,
    intl: intlShape.isRequired,
    mediaType: PropTypes.string.isRequired,
    setUser: PropTypes.func.isRequired,
    sideNavSections: PropTypes.arrayOf(PropTypes.string),
    thingName: PropTypes.string.isRequired,
    user: PropTypes.objectOf(PropTypes.string),
    // используется если children НЕ должны размещаться внутри Paper
    withoutPaper: PropTypes.bool,
  };

  static defaultProps = {
    alertDialogHref: '',
    alertDialogOpen: false,
    children: null,
    headerTabs: [],
    sideNavSections: [],
    user: null,
    withoutPaper: false,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (process.env.BROWSER) {
      window.addEventListener('storage', this.handleLocalStorage);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('storage', this.handleLocalStorage);
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  handleLocalStorage = () => {
    const persistUser = loadState('user');
    const { user, setUser } = this.props;

    if (
      (user && persistUser && user._id !== persistUser._id) || // eslint-disable-line no-underscore-dangle
      (!user && persistUser) ||
      (user && !persistUser)
    ) {
      setUser({ user: persistUser });
    }
  };

  closeAlertDialog = () => {
    this.context.store.dispatch(
      setRuntimeVariable({
        name: 'alertDialogOpen',
        value: false,
      }),
    );
  };

  goToHref = () => {
    const { alertDialogHref } = this.props;
    this.closeAlertDialog();
    history.push(alertDialogHref);
  };

  render() {
    const {
      alertDialogOpen,
      intl,
      intl: { formatMessage },
      children,
      headerTabs,
      mediaType,
      sideNavSections,
      thingName,
      user,
      withoutPaper,
    } = this.props;

    const authorizedHeaderTabs = headerTabs
      ? authorizeHeaderTabs(headerTabs, user)
      : [];

    const authorizedSideNavSections = sideNavSections
      ? authorizeSideNavSections(sideNavSections, user)
      : [];

    const docked = mediaType === 'infinity' || mediaType === 'large';
    const thereIsSideNavSections = authorizedSideNavSections.length > 0;
    const paddingLeft = docked && thereIsSideNavSections ? sideNavWidth : 0;
    const withoutMargin = mediaType === 'small' || mediaType === 'extraSmall';

    const paddingTop =
      authorizedHeaderTabs.length > 1
        ? `${spacing.desktopKeylineIncrement +
            spacing.desktopSubheaderHeight}px`
        : `${spacing.desktopKeylineIncrement}px`;

    const styles = {
      container: {
        paddingLeft: `${paddingLeft}px`,
        paddingTop,
      },
      Paper1: {
        margin: 0,
        padding: `${paperPadding}px`,
      },
      Paper2: {
        margin: `${paperPadding}px`,
        padding: `${paperPadding}px`,
      },
    };

    const childrenWithProps = React.Children
      // устанавливаем проп intl для всех дочрених компонент...
      // но НЕ дочерних элементов (тогда intl не передается, например, в h1)
      .map(
        children,
        child =>
          typeof child.type === 'string' || child.type instanceof String
            ? child
            : React.cloneElement(child, { intl }),
      );

    const actions = [
      <FlatButton
        label={formatMessage(coreMessages.StayOnThePage)}
        keyboardFocused
        onClick={this.closeAlertDialog}
        primary
      />,
      <FlatButton
        label={formatMessage(coreMessages.LeavePage)}
        onClick={this.goToHref}
        primary
      />,
    ];

    return (
      <div>
        <Header2
          authorizedHeaderTabs={authorizedHeaderTabs}
          authorizedSideNavSections={authorizedSideNavSections}
          intl={intl}
          mediaType={mediaType}
          thingName={thingName}
          user={user}
        />
        <SideNav
          intl={intl}
          mediaType={mediaType}
          authorizedHeaderTabs={authorizedHeaderTabs}
          authorizedSideNavSections={authorizedSideNavSections}
        />
        <main style={styles.container}>
          {withoutPaper ? (
            <div>{childrenWithProps}</div>
          ) : (
            <Paper
              style={withoutMargin ? styles.Paper1 : styles.Paper2}
              zDepth={2}
            >
              {childrenWithProps}
            </Paper>
          )}
        </main>
        <Footer2 paddingLeft={paddingLeft} withMargin={withoutMargin} />
        <Dialog
          actions={actions}
          modal={false}
          open={alertDialogOpen}
          onRequestClose={this.closeAlertDialog}
          title={`${formatMessage(coreMessages.LeavePage)}?`}
        >
          {formatMessage(coreMessages.DoYouWantToLeaveTheForm)}
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({
  auth: { user },
  browser: { mediaType },
  runtime: { alertDialogHref, alertDialogOpen },
}) => ({
  mediaType,
  user,
  alertDialogHref,
  alertDialogOpen,
});
const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUserAction(user)),
});

const styledLayout = withStyles(normalizeCss, s)(preLayout2);
export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(styledLayout),
);
