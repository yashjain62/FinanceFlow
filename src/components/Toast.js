import React from 'react';
import { useApp } from '../context/AppContext';
import './Toast.css';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="toast show" key={toast.id}>
      <span className="toast-icon">{toast.icon}</span>
      <span>{toast.msg}</span>
    </div>
  );
}
