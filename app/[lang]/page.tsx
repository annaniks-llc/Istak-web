// import { useDictionary } from '@/dictionary-provider';
import Image from 'next/image';
import './globals.scss';
import Heading from './components/Heading';
import FirstSlider from './components/sections/Home/FirstSlider';
import Products from './components/sections/Home/Products';
import LearnMore from './components/sections/Home/LearnMore';
import ArtCocktails from './components/sections/Home/ArtCocktails';
import Subscribe from './components/sections/Home/Subscribe';

export default function Home() {
  return (
    <div>
     <FirstSlider/>
     <Products/>
     <LearnMore/>
     <ArtCocktails/>
     <Subscribe/>
    </div>
  );
}
