// import { useDictionary } from '@/dictionary-provider';
import './globals.scss';
import FirstSlider from './components/sections/Home/FirstSlider';
import Products from './components/sections/Home/Products';
import LearnMore from './components/sections/Home/LearnMore';
import ArtCocktails from './components/sections/Home/ArtCocktails';
import Subscribe from './components/sections/Home/Subscribe';

export default function Home() {
  return (
    <div>
      <FirstSlider />
      <Products />
      <LearnMore />
      <ArtCocktails />
      <Subscribe />
    </div>
  );
}
