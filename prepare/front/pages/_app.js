import PropTypes from 'prop-types';
import Head from 'next/head';
import { Provider } from 'react-redux';

import wrapper from '../store/configureStore';

const NodeBird = ({ Component, pageProps }) => {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default NodeBird;
