import { useLocalStorage } from '@mantine/hooks';
import { useEffect } from 'react';
import WebFont from 'webfontloader';

const useFontImports = () => {
  const [fonts, setFonts] = useLocalStorage<string[]>({ key: 'fonts', defaultValue: [] });
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Droid Sans', 'Chilanka', 'Roboto', 'Hanalei Fill'],
      },
    });
  }, []);

  const addFont = (font: string) => {
    WebFont.load({
      google: {
        families: [font],
      },
    });

    if (fonts) {
      let newFonts = fonts.filter((f) => f !== font);
      newFonts.push(font);
      setFonts(newFonts);
    } else {
      setFonts([font]);
    }
  };

  useEffect(() => {
    if (fonts) {
      fonts.forEach((font) => {
        WebFont.load({
          google: {
            families: [font],
          },
        });
      });
    }
  }, [fonts]);

  return { addFont, fonts };
};

export default useFontImports;
