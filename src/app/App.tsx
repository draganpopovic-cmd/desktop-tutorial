import { useState } from 'react';
import { BrowserWindow } from './components/BrowserWindow';

export default function App() {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
      <BrowserWindow />
    </div>
  );
}
