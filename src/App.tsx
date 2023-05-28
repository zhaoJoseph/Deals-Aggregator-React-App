import { Routes, Route } from 'react-router-dom';
import { PAGES } from './constants/routes';

import Home from './components/pages/home/Home';

function App() {
  return (
      <Routes>
        <Route path={PAGES.home.path} element={<Home/>}/>
      </Routes>
  );
}

export default App;
