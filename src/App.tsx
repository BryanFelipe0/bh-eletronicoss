import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Cada pÃ¡gina Ã© carregada sob demanda (lazy loading)
const Home = lazy(() => import('./pages/Home'));
const Produtos = lazy(() => import('./pages/Produtos'));
const Assistencia = lazy(() => import('./pages/Assistencia'));
const Sobre = lazy(() => import('./pages/Sobre'));
const Contato = lazy(() => import('./pages/Contato'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="assistencia" element={<Assistencia />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="contato" element={<Contato />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
