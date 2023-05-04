import React from 'react';
import './index.scss';

const themeDic = {
  light: {
    typography: {
      fontFamily: 'system-ui'
    },
    palette: {
      mode: 'light'
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableFocusRipple: true
        }
      }
    }
  },
  dark: {
    typography: {
      fontFamily: 'system-ui'
    },
    palette: {
      mode: 'dark'
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableFocusRipple: true
        }
      }
    }
  }
};

export default class App extends React.Component {
  state = {
    code: 'passwords',
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  };

  componentDidMount() {
    /* // 进入插件
    window.utools.onPluginEnter(({ code, type, payload }) => {
      this.setState({ code })
    })
    // 退出插件
    window.utools.onPluginOut(() => {
      this.setState({ code: '' })
    }) */
    // 主题切换事件
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        this.setState({ theme: e.matches ? 'dark' : 'light' });
      });
  }

  render() {
    const { code, theme } = this.state;
    if (code === 'passwords')
      return (
        <div theme={themeDic[theme]}>
          <h1>Passwords</h1>
          <h3>测试</h3>
        </div>
      );
    if (code === 'random')
      return (
        <div theme={themeDic[theme]}>
          <h1>Random</h1>
        </div>
      );
    return false;
  }
}
