import PropTypes from 'prop-types';
import Head from 'next/head';
import { Provider } from 'react-redux';

import wrapper from '../store/configureStore';

const NodeBird = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component {...props.pageProps} />
    </Provider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default NodeBird;
