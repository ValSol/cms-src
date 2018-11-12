import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

class ButtonWithCircularProgress extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    label: PropTypes.string.isRequired,
    style: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ).isRequired,
    submitting: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    disabled: false,
    fullWidth: false,
  };
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const { submitting, ...rest } = this.props;

    const style = {
      Button: this.props.style,
      // циклический прогресс позиционируем посредине кнопки
      // которая делается невидимой и недоступной
      // когда прогресс должен отображается (submitting=true)
      Progress: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: '-8px',
      },
    };
    // вотрой вариант цвета для CircularProgress
    // это this.context.muiTheme.palette.primary1Color
    return (
      <span style={{ position: 'relative' }}>
        {submitting && (
          <CircularProgress
            color={this.context.muiTheme.palette.accent1Color}
            style={style.Progress}
          />
        )}
        {submitting ? (
          <RaisedButton
            {...rest}
            style={{ ...style.Button, visibility: 'hidden' }}
            key="hiddenButton"
          />
        ) : (
          <RaisedButton
            {...rest}
            type="submit"
            style={style.Button}
            secondary
            key="Button"
          />
        )}
      </span>
    );
  }
}

export default ButtonWithCircularProgress;
