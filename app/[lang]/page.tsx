// import { useDictionary } from '@/dictionary-provider';
import Image from 'next/image';
import './globals.scss';
import Heading from './components/Heading';
import FirstSlider from './components/sections/Home/FirstSlider';
import Products from './components/sections/Home/Products';

export default function Home() {
  return (
    <div>
     <Heading/>
     <FirstSlider/>
     <Products/>
    </div>
  );
}
