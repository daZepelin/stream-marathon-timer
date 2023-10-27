import { useEffect } from 'react';
import WebFont from 'webfontloader';

const useFontImports = () => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Droid Sans', 'Chilanka', 'Roboto'],
      },
    });
  }, []);
};

export default useFontImports;
