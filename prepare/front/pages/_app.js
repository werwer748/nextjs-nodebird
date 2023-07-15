import PropTypes from 'prop-types';
import Head from 'next/head';
import { Provider } from 'react-redux';

import wrapper from '../store/configureStore';

const NodeBird = ({ Component, pageProps }) => {
  // const { store } = wrapper.useWrappedStore(rest);
  return (
    // <Provider store={store}>
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component {...pageProps} />
      {/* </Provider> */}
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(NodeBird);
