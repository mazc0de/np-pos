import { useState, useEffect } from 'react';

export function usePin() {
  const [pin, setPinState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPin = localStorage.getItem('pos_master_pin');
    setPinState(storedPin);
    setLoading(false);
  }, []);

  const setPin = (newPin: string) => {
    localStorage.setItem('pos_master_pin', newPin);
    setPinState(newPin);
  };

  const verifyPin = (inputPin: string) => {
    return inputPin === pin;
  };

  return { pin, setPin, verifyPin, loading };
}
